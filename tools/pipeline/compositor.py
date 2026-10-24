"""Compositor: canvas 1000x1000 standardization, alignment and shadow."""
from PIL import Image, ImageDraw, ImageFilter

try:
    from rules import CANVAS_SIZE
except ModuleNotFoundError:
    from ..rules import CANVAS_SIZE


def add_contact_shadow(img_rgba: Image.Image, kind: str, obj_bbox: tuple) -> Image.Image:
    if not obj_bbox:
        return img_rgba
    x, y, w, h = obj_bbox

    shadow_layer = Image.new("RGBA", img_rgba.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(shadow_layer)

    base_y = y + h

    if kind == "box":
        shadow_w = int(w * 0.95)
        shadow_h = int(h * 0.05)
        ex1 = x + (w - shadow_w) // 2
        ey1 = base_y - shadow_h // 2
        ex2 = ex1 + shadow_w
        ey2 = ey1 + shadow_h
        draw.rectangle([ex1, ey1, ex2, ey2], fill=(0, 0, 0, 80))
        blur = 15
    elif kind == "flat":
        return img_rgba
    else:
        ellipse_w = int(w * 0.8)
        ellipse_h = int(h * 0.04)
        ex1 = x + (w - ellipse_w) // 2
        ey1 = base_y - ellipse_h // 2
        ex2 = ex1 + ellipse_w
        ey2 = ey1 + ellipse_h
        draw.ellipse([ex1, ey1, ex2, ey2], fill=(0, 0, 0, 100))
        blur = 10

    shadow = shadow_layer.filter(ImageFilter.GaussianBlur(radius=blur))

    final = Image.new("RGBA", img_rgba.size, (0, 0, 0, 0))
    final.paste(shadow, (0, 0), shadow)
    final.paste(img_rgba, (0, 0), img_rgba)
    return final


def fit_to_canvas(img_rgba: Image.Image, kind: str):
    from .segmentation import get_object_bbox
    from rules import TARGET_HEIGHT_PCT # adicione esse import no topo se não tiver

    obj_bbox = get_object_bbox(img_rgba)
    if not obj_bbox:
        w0, h0 = img_rgba.size
        obj_bbox = (0, 0, w0, h0)

    x, y, w, h = obj_bbox
    cropped = img_rgba.crop((x, y, x + w, y + h))

    if kind in ["pack", "combo", "box"]:
        max_dim = CANVAS_SIZE * 0.85
        scale = min(max_dim / w, max_dim / h)
        new_w, new_h = int(w * scale), int(h * scale)
    elif kind == "flat":
        target_w = int(CANVAS_SIZE * 0.9)
        scale = target_w / w
        new_w, new_h = target_w, int(h * scale)
    else: # can, bottle, etc.
        target_h = int(CANVAS_SIZE * 0.82) # <-- AUMENTADO DE 0.75 PARA 0.82
        scale = target_h / h
        new_w, new_h = max(1, int(w * scale)), target_h

    resized = cropped.resize((new_w, new_h), Image.LANCZOS)
    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))

    x_pos = (CANVAS_SIZE - new_w) // 2

    if kind == "flat":
        y_pos = (CANVAS_SIZE - new_h) // 2
    else:
        y_pos = CANVAS_SIZE - new_h - int(CANVAS_SIZE * 0.05)

    if y_pos < 0:
        y_pos = 0

    canvas.paste(resized, (x_pos, y_pos), resized)

    new_bbox = (x_pos, y_pos, new_w, new_h)
    return canvas, new_bbox


def standardize(img_rgba: Image.Image, kind: str) -> Image.Image:
    """Fit to canvas and add contact shadow. Returns final image."""
    canvas, bbox = fit_to_canvas(img_rgba, kind)
    return add_contact_shadow(canvas, kind, bbox)
