"""Orchestrator: reads manifest.json and routes to strategies."""
import argparse
import json
import logging
from pathlib import Path

from PIL import Image

try:
    from rules import WORKSPACE, PUBLIC_IMAGES, CATALOG_ROOT as RULES_CATALOG_ROOT
except ModuleNotFoundError:
    from ..rules import WORKSPACE, PUBLIC_IMAGES, CATALOG_ROOT as RULES_CATALOG_ROOT
from .strategies import AISegmenterStrategy, ForcedCropStrategy, BaseStrategy

MANIFEST_PATH = Path(__file__).resolve().parent.parent / "manifest.json"
CATALOG_ROOT = RULES_CATALOG_ROOT

_STRATEGY_ALIASES = {
    "ai": "ai",
    "ai_segmenter": "ai",
    "aisegmenter": "ai",
    "segment": "ai",
    "segmenter": "ai",
    "rembg": "ai",
    "forced": "forced",
    "forced_crop": "forced",
    "forcedcrop": "forced",
    "crop": "forced",
    "bypass": "forced",
    "skip_ai": "forced",
}


def _normalize_strategy(value):
    if value is None:
        return None
    key = str(value).strip().lower().replace("-", "_")
    return _STRATEGY_ALIASES.get(key, key)


class Orchestrator:
    def __init__(self, manifest_path=None, manifest=None, workspace=None, catalog_root=None):
        self.manifest_path = Path(manifest_path or manifest) if (manifest_path or manifest) else MANIFEST_PATH
        self.workspace = Path(workspace) if workspace else WORKSPACE
        self.catalog_root = Path(catalog_root) if catalog_root else CATALOG_ROOT
        self.manifest = json.loads(self.manifest_path.read_text(encoding="utf-8"))
        self.strategies = {
            "ai": AISegmenterStrategy(),
            "forced": ForcedCropStrategy(),
        }

    def get_strategy_name(self, prod):
        strategy = prod.get("strategy")
        if strategy is None and prod.get("skip_ai"):
            strategy = "forced"
        s = str(strategy).lower() if strategy is not None else ""
        if "forced" in s or "crop" in s or "bypass" in s:
            return "forced"
        if "ai" in s or "segment" in s or "rembg" in s:
            return "ai"
        norm = _normalize_strategy(strategy)
        if norm in ("forced", "forced_crop"):
            return "forced"
        return "ai"

    def get_strategy(self, prod) -> BaseStrategy:
        name = self.get_strategy_name(prod)
        return self.strategies[name]

    def process_product(self, prod):
        log = logging.getLogger(__name__)
        target_path = Path(prod["target"])
        raw_full = self.workspace / "bruto" / prod["raw"]
        out_full = self.catalog_root / target_path

        if not raw_full.exists():
            log.warning(f"Arquivo não encontrado: {raw_full}")
            return None

        kind = prod.get("kind", "can")
        bbox_hint = prod.get("bbox", None)
        skip_ai = prod.get("skip_ai", False)

        strategy = self.get_strategy(prod)
        log.info(f"Processando: {prod['name']} (Kind: {kind}, Strategy: {strategy.__class__.__name__})")

        try:
            img = Image.open(raw_full).convert("RGBA")
            context = {
                "kind": kind,
                "bbox": bbox_hint,
                "bbox_hint": bbox_hint,
                "skip_ai": skip_ai,
                "raw_path": raw_full,
                "out_path": out_full,
            }
            result = strategy.process(img, context)
            out_full.parent.mkdir(parents=True, exist_ok=True)
            result.save(out_full, "PNG", optimize=True)
            log.info("      -> Salvo com sucesso!")
            return out_full
        except Exception as e:
            log.exception(f"Erro em {prod['name']}: {e}")
            return None

    def run(self, batch=None, only=None):
        log = logging.getLogger(__name__)
        logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
        for batch_id, batch_data in self.manifest.get("batches", {}).items():
            if batch and batch_id != batch:
                continue
            log.info(f"\n--- LOTE: {batch_id} ---")
            for prod in batch_data.get("products", []):
                if only and prod.get("name") != only:
                    continue
                self.process_product(prod)

    process = process_product
    run_all = run


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--batch", help="Processa só um lote")
    parser.add_argument("--only", help="Processa só um produto")
    parser.add_argument("--manifest", help="Caminho do manifest.json")
    args = parser.parse_args()

    orch = Orchestrator(manifest_path=args.manifest) if args.manifest else Orchestrator()
    orch.run(batch=args.batch, only=args.only)


if __name__ == "__main__":
    main()
