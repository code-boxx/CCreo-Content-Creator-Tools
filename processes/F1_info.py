# (PART A) PARSE PARAMS
import sys, json
param = json.loads(sys.argv[1])

# (PART B) CREATE THUMBNAIL
if "thumb" in param:
  # (B1) SYSTEM & FILE PATHS
  import os, math
  from PIL import Image
  sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
  import A_path as tpath
  img_path = os.path.join(tpath.output, param["file"])
  img_name, img_ext = os.path.splitext(param["file"])
  img_save = os.path.join(tpath.output, img_name + "_SM" + img_ext)

  # (B2) OPEN IMAGE
  img = Image.open(img_path)
  img_width, img_height = img.size

  # (B3) STRIP EXIF
  img_data = list(img.getdata())
  img = Image.new(img.mode, img.size)
  img.putdata(img_data)

  # (B4) RESIZE
  new_height = int(param["thumb"])
  ratio = new_height / img_height
  new_width = math.ceil(img_width * ratio)
  img = img.resize((new_width, new_height))

  # (B5) SAVE
  img.save(img_save, quality=75)

# (PART C) ACKNOWLEDGE "COMPLETED"
print("OK")