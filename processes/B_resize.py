# (PART A) INIT
# (A1) IMPORT
import os, sys, json, math
from PIL import Image

# (A2) PATH
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
import A_path as tpath

# (A3) PARAMS
param = json.loads(sys.argv[1])

# (PART B) IMAGE
# (B1) ORIGINAL IMAGE
img_path = os.path.join(tpath.output, param["file"])
img_name = os.path.splitext(param["file"])[0]
img_save = os.path.join(tpath.output, img_name + "." + param["format"])
img = Image.open(img_path)
img_width, img_height = img.size

# (B2) STRIP EXIF
img_data = list(img.getdata())
img = Image.new(img.mode, img.size)
img.putdata(img_data)

# (PART C) RESIZE, IF ANY
if "width" in param or "height" in param:
  if "width" in param and "height" not in param:
    new_width = int(param["width"])
    ratio = new_width / img_width
    new_height = math.ceil(img_height * ratio)
  elif "width" not in param and "height" in param:
    new_height = int(param["height"])
    ratio = new_height / img_height
    new_width = math.ceil(img_width * ratio)
  else:
    new_width = int(param["width"])
    new_height = int(param["height"])
  img = img.resize((new_width, new_height))

# (PART D) SAVE & DELETE ORIGINAL IMAGE
img.save(img_save, quality=int(param["quality"]))
if (img_path != img_save):
  os.remove(img_path)

# (PART E) RESPONSE
print("OK")