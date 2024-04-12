# (PART A) INIT
# (A1) IMPORT
import os, sys, json
from subprocess import Popen

# (A2) PATH - CHANGE CHROME PATH TO YOUR OWN!
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
import A_path as tpath
chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"

# (A3) PARAMS
param = json.loads(sys.argv[1])

# (PART B) TAKE SCREENSHOT
cmd = """\"{}\" --headless --screenshot=\"{}\" --windowsize={} \"{}\"""".format(
  chrome, os.path.join(tpath.output, "screenshot." + param["format"]), param["size"], param["site"]
)
Popen(cmd, shell=False, stdin=None, stdout=None, stderr=None, close_fds=True)
print("OK")