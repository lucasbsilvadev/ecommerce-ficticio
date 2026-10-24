# tools/image_pipeline.py
"""Facade/back-compat module. Delegates to the new pipeline package."""
import argparse
import json
import logging
from pathlib import Path

from PIL import Image

try:
    from rules import WORKSPACE, PUBLIC_IMAGES, CANVAS_SIZE, CATALOG_ROOT
except ModuleNotFoundError:
    from .rules import WORKSPACE, PUBLIC_IMAGES, CANVAS_SIZE, CATALOG_ROOT

try:
    from pipeline.segmentation import (
        get_session,
        apply_crop_hint,
        bypass_ai_mask,
        segment_ai,
        clean_mask,
        get_object_bbox,
    )
    from pipeline.compositor import add_contact_shadow, fit_to_canvas
    from pipeline.compositor import standardize as _standardize
    from pipeline.orchestrator import Orchestrator
except ModuleNotFoundError:
    from .pipeline.segmentation import (
        get_session,
        apply_crop_hint,
        bypass_ai_mask,
        segment_ai,
        clean_mask,
        get_object_bbox,
    )
    from .pipeline.compositor import add_contact_shadow, fit_to_canvas
    from .pipeline.compositor import standardize as _standardize
    from .pipeline.orchestrator import Orchestrator

MANIFEST_PATH = Path(__file__).parent / "manifest.json"


def standardize(img_rgba, kind):
    return _standardize(img_rgba, kind)


def process_image(raw_path, out_path, kind, bbox_hint=None, skip_ai=False):
    log = logging.getLogger(__name__)
    log.info("      Carregando imagem bruta...")
    img = Image.open(raw_path).convert("RGBA")

    if bbox_hint:
        img = apply_crop_hint(img, bbox_hint)

    if skip_ai:
        log.info("      [BYPASS] Pulando IA e usando recorte retangular forçado...")
        img = bypass_ai_mask(img)
    else:
        img = segment_ai(img)

    img = clean_mask(img, kind)
    img, obj_bbox = fit_to_canvas(img, kind)
    img = add_contact_shadow(img, kind, obj_bbox)

    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, "PNG", optimize=True)
    log.info("      -> Salvo com sucesso!")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--batch", help="Processa só um lote")
    parser.add_argument("--only", help="Processa só um produto")
    args = parser.parse_args()

    orch = Orchestrator()
    orch.run(batch=args.batch, only=args.only)


if __name__ == "__main__":
    main()
