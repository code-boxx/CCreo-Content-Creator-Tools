# (PART A) INIT
# (A1) IMPORTS
import os, json, subprocess, webbrowser
import A_path as tpath
from flask import Flask, request, render_template
from werkzeug.utils import secure_filename

# (A2) MODULES
mods = {
  "B" : {
    "suffix" : "resize",
    "name" : "Resize Images",
    "desc" : "Resize images and convert image file format."
  },
  "C" : {
    "suffix" : "cover",
    "name" : "Cover Templates",
    "desc" : "Create covers for your blog post, video, podcast, etc..."
  },
  "D" : {
    "suffix" : "screenshot",
    "name" : "Website Screenshot",
    "desc" : "Take screenshots of websites."
  },
  "E1" : {
    "suffix" : "collage",
    "name" : "Collage Creator",
    "desc" : "Stich many pictures together into a grid."
  },
  "E2" : {
    "suffix" : "collage",
    "hide" : 1
  },
  "F1" : {
    "suffix" : "info",
    "name" : "Infographic Templates",
    "desc" : "Create your own infographic templates with HTML."
  },
  "G" : {
    "suffix" : "transcribe",
    "name" : "Speech to Text.",
    "desc" : "@TODO Auto transcribe audio to text."
  },
  "ZZ" : {
    "suffix" : "about",
    "name" : "About & Links",
    "desc" : "A couple of links and \"good stuff\"."
  }
}

# (PART B) FLASK SERVER
# (B1) INIT FLASK
app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = tpath.output

# (B2) HOME PAGE
@app.route("/")
def home():
  return render_template("A_home.html", mods=mods)

# (B3) FUNKY LANDING PAGES FOR MODULES
for i, mod in mods.items():
  exec("""@app.route("/{i}")
def mod{i}():
  return render_template("{i}_{s}.html", mod="{i}")""".format(i=i, s=mod["suffix"]))

# (B4) INFOGRAPHIC - LOAD USER DEFINED HTML TEMPLATE
@app.route("/F2")
def modF2():
  # (B4-1) TEMPLATE TO LOAD
  template = "F_" + request.args.get("suffix") + ".html"
  if not os.path.isfile(os.path.join(tpath.templates, template)):
    return "Template not found - " + template

  # (B4-2) SERVE TEMPLATE
  return render_template(template)

# (B5) FUNKY PROCESSING
@app.route("/process", methods=["POST"])
def process():
  # (B5-1) DATA YOGA
  data = {}
  for k, v in request.form.items():
    data[k] = v

  # (B5-2) HANDLING SCRIPT
  handler = os.path.join(tpath.proc, data["mod"] + "_" + mods[data["mod"]]["suffix"] + ".py")
  if not os.path.isfile(handler):
    return "Invalid handler - " + data["mod"]

  # (B5-3) SAVE FILE UPLOAD, IF ANY
  if "file" in request.files:
    file = request.files["file"]
    filename = secure_filename(file.filename)
    file.save(os.path.join(tpath.output, filename))
    data["file"] = filename

  # (B5-4) CALL RESPECTIVE PROCESSING SCRIPT
  data = json.dumps(data)
  res = subprocess.run(["python", handler, data], shell=True, capture_output=True, text=True)
  # print(data, res)
  return res.stdout.strip()

# (PART C) START
webbrowser.open_new_tab("http://localhost:8080")
if __name__ == "__main__":
  app.run(host="0.0.0.0", port=8080, debug=False)