# (PART A) INIT
# (A1) IMPORT
import os, sys, json, requests, urllib.parse

# (A2) PATH
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
import A_path as tpath

# (A3) PARAMS
param = json.loads(sys.argv[1])
url = {
  "goo" : "https://www.google.com/complete/search?client=chrome&hl=en&cp=15&dpr=1&q=", # 15 suggestion
  "yan" : "https://yandex.com/suggest/suggest-ya.cgi?srv=morda_com_desktop&uil=en&fact=1&v=4&icon=1&hl=1&bemjson=0&history=1&html=1&platform=desktop&rich_nav=1&show_experiment=224&verified_nav=1&rich_phone=1&use_favicon=1&nav_favicon=1&nav_text=1&mt_wizard=1&suggest_entity_desktop=1&entity_enrichment=1&entity_alignment_mode=bottom&sn=6&maybe_ads=1&entity_max_count=1&svg=1&pos=12&hs=0&part=",
  "duck" : "https://duckduckgo.com/ac/?kl=wt-wt&q="
}
output = os.path.join(tpath.output, param["engine"] + "_soup.txt")

# (PART B) PROCESS SEARCH
file = open(output, "w")
for i in range(97, 123):
  # (B1) CURRENT ALPHABET
  alphabet = param["keyword"] + " " + chr(i)
  file.write(alphabet.upper() + "\n")

  # (B2) API CALL
  try:
    match param["engine"]:
      case "goo":
        results = requests.get(url[param["engine"]] + urllib.parse.quote(alphabet)).json()[1]
      case "yan":
        results = requests.get(url[param["engine"]] + urllib.parse.quote(alphabet)).json()[1]
      case "duck":
        results = []
        req = requests.get(url[param["engine"]] + urllib.parse.quote(alphabet)).json()
        for r in req:
          results.append(r["phrase"])
    for r in results:
      file.write(r + "\n")
  except Exception as err:
    print(err)
    file.write(str(err) + "\n")

# (PART C) CLEAN UP
file.close()
print("OK")