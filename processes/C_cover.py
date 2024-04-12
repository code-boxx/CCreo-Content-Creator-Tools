# (PART A) INIT
# (A1) IMPORT
import os, sys, json
from PIL import Image, ImageFont, ImageDraw 

# (A2) PATH
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
import A_path as tpath

# (A3) PARAMS
param = json.loads(sys.argv[1])

# (PART B) PROCESS IMAGE
# (B1) ORIGINAL IMAGE
img_path = os.path.join(tpath.static, param["img"])
img_save = os.path.join(tpath.output, "cover.webp")
img = Image.open(img_path)

# (B2) ADD TEXT
draw = ImageDraw.Draw(img)
font = ImageFont.truetype(os.path.join(tpath.static, param["font"]), int(param["size"]))
draw.text(
  (int(param["x"]), int(param["y"])), param["txt"].replace("\r", ""),
  fill=param["color"], font=font, spacing=int(param["spacing"]),
  align=param["align"], stroke_width=int(param["swidth"]), stroke_fill=param["scolor"]
)

# (B3) SAVE IMAGE
img.save(img_save, quality=int(param["quality"]))

# (PART C) RESPONSE
print("OK")