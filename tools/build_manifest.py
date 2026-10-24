# tools/build_manifest.py
import json
import re
import unicodedata
from pathlib import Path
from rules import RAW_DIR

MANIFEST_PATH = Path(__file__).parent / "manifest.json"
IMG_EXTS = {".jpeg", ".jpg", ".png", ".webp"}

def slugify(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")

def get_kind(rel_path: Path, filename: str) -> str:
    """Define a estratégia do produto baseada na pasta ou no nome."""
    parts = [p.lower() for p in rel_path.parts]
    name = filename.lower()
    
    if "combo" in parts or "combo" in name: return "combo"
    if "seda" in parts or "zomo" in name or "seda" in name: return "flat" # Zomo/Seda
    if "shot" in parts or "long-neck" in parts or "long neck" in name: return "bottle"
    if "lata" in parts or "lata" in name: return "can"
    if "latão" in parts or "latao" in parts: return "pack" # Fardos de lata
    if "pack" in name or "fardo" in name: return "pack"
    
    return "can" # Default seguro

def main():
    manifest = {"_meta": {"version": 1}, "batches": {}}
    
    for raw_file in RAW_DIR.rglob("*"):
        if not raw_file.is_file() or raw_file.suffix.lower() not in IMG_EXTS:
            continue
            
        rel_path = raw_file.relative_to(RAW_DIR)
        parts = rel_path.parts
        if len(parts) < 2: continue
            
        cat_slug = parts[0].lower()
        file_id = slugify(raw_file.stem)
        target_rel = f"{cat_slug}/{file_id}.png"
        batch_id = f"{cat_slug}-lote-01"
        
        if batch_id not in manifest["batches"]:
            manifest["batches"][batch_id] = {
                "label": f"Lote de {cat_slug.capitalize()}",
                "source_dir": f"bruto/{cat_slug}",
                "products": []
            }
            
        manifest["batches"][batch_id]["products"].append({
            "id": file_id,
            "name": raw_file.stem.replace("-", " ").title(),
            "category": cat_slug,
            "kind": get_kind(rel_path, raw_file.stem), # NOVIDADE AQUI
            "strategy": "ai",
            "raw": str(rel_path.as_posix()),
            "target": target_rel,
            "needs_review": True
        })

    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Manifesto gerado com {len(manifest['batches'])} lotes.")

if __name__ == "__main__":
    main()