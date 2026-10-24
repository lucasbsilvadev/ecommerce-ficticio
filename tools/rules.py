# tools/rules.py
"""Regras centralizadas da esteira de imagens da Gelada."""
from pathlib import Path

# --- Caminhos ---
PROJECT_ROOT   = Path(r"C:\Users\usuario\projetos\ecommerce-ficticio")
PUBLIC_IMAGES  = PROJECT_ROOT / "public" / "images"
PRODUCTS_JSX   = PROJECT_ROOT / "src" / "data" / "products.jsx"
REPORTS_DIR    = PROJECT_ROOT / "tools" / "reports"

# Workspace externo (imagens brutas/otimizadas) — ajuste se mudar
WORKSPACE      = Path(r"C:\Users\usuario\Downloads\produtos-gelada")
RAW_DIR        = WORKSPACE / "bruto"
OPTIMIZED_DIR  = WORKSPACE / "otimizado"

# --- Pipeline ---
CANVAS_SIZE       = 1000       # canvas quadrado final (px)
TARGET_HEIGHT_PCT = 0.82       # produto ocupa 82% da altura do canvas
MARGIN_PCT        = 0.04       # margem mínima ao redor do bbox
UNSHARP_RADIUS     = 1.2
UNSHARP_AMOUNT     = 0.8
CLAHE_CLIP         = 2.0
CLAHE_TILE         = 8

# --- Segmentação ---
REMBG_MODEL       = "u2net"    # ou "isnet-general-use" se tiver GPU
ALPHA_THRESHOLD   = 8          # pixels abaixo disso viram 0
MIN_COMPONENT_AREA = 500       # limpa componentes pequenos

# --- Validação ---
EXPECTED_FORMATS = {".png"}

# Novas pastas de destino (Frontend)
CATALOG_ROOT = PUBLIC_IMAGES / "catalog"
LEGACY_ROOT  = PUBLIC_IMAGES / "legacy"
BRAND_ROOT   = PUBLIC_IMAGES / "brand"

# Pasta de Inbox (para o usuário jogar arquivos e o script processar)
INBOX_DIR    = WORKSPACE / "inbox"

# Mapeamento de categorias (Label do React -> Pasta do Storage)
CATEGORY_SLUG = {
    "Cervejas":    "cervejas",
    "Vodkas":      "vodkas",
    "Energéticos": "energeticos",
    "Sem Álcool":  "sem-alcool",
    "Vinhos":      "vinhos",
    "Gin":         "gin",
    "Combos":      "combos",
    "Tabacaria":   "tabacaria",
}