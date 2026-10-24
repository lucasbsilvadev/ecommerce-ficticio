"""AI-based segmentation strategy (rembg + OpenCV)."""
from PIL import Image

from .base import BaseStrategy
from ..segmentation import apply_crop_hint, segment_ai, clean_mask
from ..compositor import standardize


class AISegmenterStrategy(BaseStrategy):
    def process(self, image, context) -> Image.Image:
        ctx = _context(context)
        kind = ctx.get("kind", "can")
        bbox_hint = ctx.get("bbox", ctx.get("bbox_hint"))

        if bbox_hint:
            image = apply_crop_hint(image, bbox_hint)

        image = segment_ai(image)
        image = clean_mask(image, kind)
        image = standardize(image, kind)
        return image


def _context(context):
    if isinstance(context, dict):
        return context
    # support attribute-style context
    out = {}
    for key in ("kind", "bbox", "bbox_hint", "skip_ai", "raw_path", "out_path"):
        if hasattr(context, key):
            out[key] = getattr(context, key)
    return out
