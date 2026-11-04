"""Builds the footer watermark font: Fraunces at the look the footer uses
(wght 500, opsz 144, SOFT 0, WONK 1: the defaults it renders with) as a static font with overlapping
contours merged, so an outline stroke draws one continuous line per letter.
Subset to the letters D, Z, E, N.

Usage (needs: pip install fonttools skia-pathops):
  python scripts/build_watermark_font.py \
    "C:/Soham/Fonts/Fraunces/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf" \
    app/fonts/Fraunces-DZEN-Watermark.ttf
"""
import sys

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import OverlapMode, instantiateVariableFont
from fontTools import subset

src, out = sys.argv[1], sys.argv[2]

font = TTFont(src)
print("axes:", [(a.axisTag, a.minValue, a.defaultValue, a.maxValue) for a in font["fvar"].axes])
inst = instantiateVariableFont(
    font,
    {"wght": 500, "opsz": 144, "SOFT": 0, "WONK": 1},
    overlap=OverlapMode.REMOVE,
)

# Keep only what the watermark shows.
opts = subset.Options()
opts.layout_features = ["kern"]
opts.name_IDs = ["*"]
opts.notdef_outline = True
sub = subset.Subsetter(opts)
sub.populate(text="DZEN ")
sub.subset(inst)

# A distinct family name, so it's never mistaken for the stock Fraunces.
name = inst["name"]
for rec in name.names:
    if rec.nameID in (1, 16):
        rec.string = "Fraunces DZEN Watermark"
    elif rec.nameID in (4,):
        rec.string = "Fraunces DZEN Watermark Medium"
    elif rec.nameID == 6:
        rec.string = "FrauncesDZENWatermark-Medium"

inst.save(out)

# Report: contour counts per letter (fewer = merged).
check = TTFont(out)
glyf = check["glyf"]
cmap = check.getBestCmap()
for ch in "DZEN":
    g = glyf[cmap[ord(ch)]]
    print(ch, "contours:", g.numberOfContours)
