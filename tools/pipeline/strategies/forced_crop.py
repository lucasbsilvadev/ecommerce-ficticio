"""Forced crop strategy (no AI): applies bbox and bypasses alpha."""
from PIL import Image

from .base import BaseStrategy
from ..segmentation import apply_crop_hint, bypass_ai_mask, clean_mask
from ..compositor import standardize


def _context(context):
    if isinstance(context, dict):
        return context
    out = {}
    for key in ("kind", "bbox", "bbox_hint", "skip_ai", "raw_path", "out_path"):
        if hasattr(context, key):
            out[key] = getattr(context, key)
    return out


class ForcedCropStrategy(BaseStrategy):
    def process(self, image, context) -> Image.Image:
        ctx = _context(context)
        kind = ctx.get("kind", "can")
        bbox_hint = ctx.get("bbox", ctx.get("bbox_hint"))

        if bbox_hint:
            image = apply_crop_hint(image, bbox_hint)

        image = bypass_ai_mask(image)
        image = clean_mask(image, kind)
        image = standardize(image, kind)
        return image
