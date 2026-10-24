"""Segmentation helpers using rembg and OpenCV."""
import json
import logging
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageOps
from rembg import remove, new_session

try:
    from rules import WORKSPACE, PUBLIC_IMAGES, CANVAS_SIZE
except ModuleNotFoundError:
    from ..rules import WORKSPACE, PUBLIC_IMAGES, CANVAS_SIZE

MANIFEST_PATH = Path(__file__).resolve().parent.parent / "manifest.json" if False else None
# manifest path is defined in orchestrator / image_pipeline; keep module focused on segmentation

_SESSION = None


def get_session():
    global _SESSION
    if _SESSION is None:
        _SESSION = new_session("isnet-general-use")
    return _SESSION


def apply_crop_hint(img: Image.Image, bbox_rel: list) -> Image.Image:
    """Crop image before AI (e.g. [0.1, 0.2, 0.8, 0.7] = x, y, w, h in %)."""
    if not bbox_rel or len(bbox_rel) != 4:
        return img
    w, h = img.size
    x = int(bbox_rel[0] * w)
    y = int(bbox_rel[1] * h)
    bw = int(bbox_rel[2] * w)
    bh = int(bbox_rel[3] * h)
    logging.getLogger(__name__).info("      Aplicando crop hint...")
    return img.crop((x, y, x + bw, y + bh))


def bypass_ai_mask(img: Image.Image) -> Image.Image:
    """Make the whole image opaque, without removing background."""
    img_rgba = img.convert("RGBA")
    arr = np.array(img_rgba)
    arr[:, :, 3] = 255
    return Image.fromarray(arr, "RGBA")


def segment_ai(img: Image.Image) -> Image.Image:
    log = logging.getLogger(__name__)
    log.info("      Removendo fundo (U2Net)...")
    img = ImageOps.exif_transpose(img)

    MAX_DIM = 1024
    if max(img.size) > MAX_DIM:
        img.thumbnail((MAX_DIM, MAX_DIM), Image.LANCZOS)

    out = remove(
        img,
        session=get_session(),
        post_process_mask=True,
    ).convert("RGBA")
    return out


def clean_mask(img_rgba: Image.Image, kind: str) -> Image.Image:
    arr = np.array(img_rgba)
    alpha = arr[:, :, 3]

    # Binarize
    _, alpha = cv2.threshold(alpha, 10, 255, cv2.THRESH_BINARY)

    # Fill holes (Flood Fill)
    h, w = alpha.shape
    mask_flood = alpha.copy()
    cv2.floodFill(mask_flood, np.zeros((h + 2, w + 2), np.uint8), (0, 0), 255)
    alpha_filled = alpha | cv2.bitwise_not(mask_flood)

    # Choose central component (ignore the rest - kills noise)
    n, labels, stats, centroids = cv2.connectedComponentsWithStats(alpha_filled)
    if n > 1:
        cx, cy = w // 2, h // 2
        best_label = -1
        min_dist = float("inf")
        for i in range(1, n):
            if stats[i, cv2.CC_STAT_AREA] > (w * h * 0.010):
                dist = (centroids[i][0] - cx) ** 2 + (centroids[i][1] - cy) ** 2
                if dist < min_dist:
                    min_dist = dist
                    best_label = i
        if best_label != -1:
            alpha_clean = np.zeros_like(alpha)
            alpha_clean[labels == best_label] = 255
        else:
            alpha_clean = alpha_filled
    else:
        alpha_clean = alpha_filled

    # Per-product-type treatment
    if kind in ["can", "pack"]:
        contours, _ = cv2.findContours(alpha_clean, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if contours:
            c = max(contours, key=cv2.contourArea)
            hull = cv2.convexHull(c)
            alpha_clean = np.zeros_like(alpha)
            cv2.drawContours(alpha_clean, [hull], -1, 255, -1)
    elif kind == "box":
        kernel = np.ones((15, 15), np.uint8)
        alpha_clean = cv2.morphologyEx(alpha_clean, cv2.MORPH_CLOSE, kernel)
        alpha_clean = cv2.morphologyEx(alpha_clean, cv2.MORPH_OPEN, kernel)

    arr[:, :, 3] = alpha_clean
    return Image.fromarray(arr, "RGBA")


def get_object_bbox(img_rgba: Image.Image):
    """Find the real bounding box of the object, ignoring stray pixels."""
    arr = np.array(img_rgba)
    alpha = arr[:, :, 3]
    contours, _ = cv2.findContours(alpha, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return None
    c = max(contours, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(c)
    return (x, y, w, h)
