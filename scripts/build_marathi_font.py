"""Builds the hero's Marathi word font: Gotu (Ek Type, OFL) cut down to the
letters of "स्वयत्ता", keeping its Devanagari shaping rules so the conjuncts
(स्व, त्ता) still form.

Usage (needs: pip install fonttools):
  python scripts/build_marathi_font.py \
    "C:/Soham/Fonts/Gotu/Gotu-Regular.ttf" \
    app/fonts/Gotu-Svayatta.ttf
"""
import sys

from fontTools.ttLib import TTFont
from fontTools import subset

src, out = sys.argv[1], sys.argv[2]
TEXT = "स्वयत्ता"

font = TTFont(src)
opts = subset.Options()
opts.layout_features = ["*"]  # every shaping feature, so conjuncts and matras still form
opts.name_IDs = ["*"]
opts.notdef_outline = True
sub = subset.Subsetter(opts)
sub.populate(text=TEXT)
sub.subset(font)
font.save(out)

check = TTFont(out)
print("glyphs kept:", len(check.getGlyphOrder()))
