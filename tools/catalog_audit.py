# tools/catalog_audit.py
"""
Auditoria do catálogo da Gelada.

- Lê products.jsx (regex, sem executar JS)
- Confere existência dos arquivos referenciados
- Detecta órfãos em public/images/
- Mede dimensões, formato, tamanho
- Gera relatório .md e .json em tools/reports/
Uso:
    python tools/catalog_audit.py
    python tools/catalog_audit.py --no-hash   # pula pHash (mais rápido)
"""
from __future__ import annotations
import argparse
import json
import re
from datetime import datetime
from pathlib import Path
from typing import Any

from rules import PUBLIC_IMAGES, PRODUCTS_JSX, REPORTS_DIR

try:
    from PIL import Image
    _HAS_PIL = True
except ImportError:
    _HAS_PIL = False

try:
    import imagehash
    _HAS_HASH = True
except ImportError:
    _HAS_HASH = False


# --- Parser do products.jsx (sem executar JS) ---
_PROD_RE = re.compile(
    r'\{\s*nome:\s*"(?P<nome>[^"]+)"\s*,\s*'
    r'preco:\s*"(?P<preco>[^"]+)"\s*,\s*'
    r'imagem:\s*"(?P<imagem>[^"]+)"\s*,\s*'
    r'categoria:\s*"(?P<categoria>[^"]+)"',
    re.DOTALL,
)


def parse_products(path: Path) -> list[dict[str, str]]:
    text = path.read_text(encoding="utf-8")
    out = []
    for m in _PROD_RE.finditer(text):
        out.append(m.groupdict())
    return out


def image_info(path: Path, want_hash: bool) -> dict[str, Any]:
    info: dict[str, Any] = {
        "exists": path.exists(),
        "size_bytes": path.stat().st_size if path.exists() else None,
        "format": None, "width": None, "height": None, "phash": None,
    }
    if not path.exists() or not _HAS_PIL:
        return info
    try:
        with Image.open(path) as im:
            info["format"] = im.format
            info["width"], info["height"] = im.size
            if want_hash and _HAS_HASH:
                info["phash"] = str(imagehash.phash(im))
    except Exception as exc:  # noqa: BLE001
        info["error"] = str(exc)
    return info


def audit(want_hash: bool = True) -> dict[str, Any]:
    products = parse_products(PRODUCTS_JSX)
    referenced: dict[str, dict[str, Any]] = {}
    missing: list[dict[str, str]] = []

    for p in products:
        # /images/x.png -> public/images/x.png
        rel = p["imagem"].lstrip("/")
        if rel.startswith("images/"):
            rel = rel[len("images/"):]
        fpath = PUBLIC_IMAGES / rel
        info = image_info(fpath, want_hash)
        p["file"] = str(fpath)
        p["file_info"] = info
        referenced[rel] = p
        if not info["exists"]:
            missing.append({"nome": p["nome"], "esperado": str(fpath)})

    existing = {f.name for f in PUBLIC_IMAGES.iterdir() if f.is_file()}
    orphans = sorted(existing - set(referenced.keys()))

    # duplicatas prováveis por pHash
    duplicates: list[list[str]] = []
    if want_hash and _HAS_HASH:
        by_hash: dict[str, list[str]] = {}
        for name, p in referenced.items():
            h = p["file_info"].get("phash")
            if h:
                by_hash.setdefault(h, []).append(name)
        duplicates = [v for v in by_hash.values() if len(v) > 1]

    return {
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "products_jsx": str(PRODUCTS_JSX),
        "public_images": str(PUBLIC_IMAGES),
        "total_products": len(products),
        "total_files": len(existing),
        "missing": missing,
        "orphans": orphans,
        "duplicates_phash": duplicates,
        "products": products,
    }


def write_reports(report: dict[str, Any]) -> tuple[Path, Path]:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    jpath = REPORTS_DIR / f"audit_{ts}.json"
    mpath = REPORTS_DIR / f"audit_{ts}.md"

    jpath.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")

    lines = [
        f"# Auditoria do catálogo — {report['generated_at']}",
        "",
        f"- Produtos cadastrados: **{report['total_products']}**",
        f"- Arquivos em `public/images/`: **{report['total_files']}**",
        f"- Ausentes: **{len(report['missing'])}**",
        f"- Órfãos (não referenciados): **{len(report['orphans'])}**",
        f"- Duplicatas (pHash): **{len(report['duplicates_phash'])}**",
        "",
    ]
    if report["missing"]:
        lines.append("## Ausentes")
        for m in report["missing"]:
            lines.append(f"- `{m['nome']}` → `{m['esperado']}`")
        lines.append("")
    if report["orphans"]:
        lines.append("## Órfãos em public/images/")
        for o in report["orphans"]:
            lines.append(f"- `{o}`")
        lines.append("")
    if report["duplicates_phash"]:
        lines.append("## Duplicatas prováveis (pHash)")
        for group in report["duplicates_phash"]:
            lines.append(f"- {', '.join('`'+n+'`' for n in group)}")
        lines.append("")
    lines.append("## Produtos")
    for p in report["products"]:
        info = p["file_info"]
        dims = f"{info['width']}×{info['height']}" if info["width"] else "—"
        kb = f"{info['size_bytes']/1024:.1f} KB" if info["size_bytes"] else "—"
        lines.append(f"- **{p['nome']}** — `{p['imagem']}` ({dims}, {kb})")

    mpath.write_text("\n".join(lines), encoding="utf-8")
    return jpath, mpath


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--no-hash", action="store_true", help="pula pHash")
    args = ap.parse_args()

    report = audit(want_hash=not args.no_hash)
    jpath, mpath = write_reports(report)
    print(f"JSON: {jpath}")
    print(f"MD:   {mpath}")
    print(f"Produtos: {report['total_products']} | Ausentes: {len(report['missing'])} | "
          f"Órfãos: {len(report['orphans'])} | Duplicatas: {len(report['duplicates_phash'])}")


if __name__ == "__main__":
    main()