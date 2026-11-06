"""Check every poewiki/poe2wiki source URL against the MediaWiki API and propose fixes.
Writes dataset/curation/source_url_fixes.json  {"source_id": {"old": url, "new": url | null, "status": "fixed|missing"}}
merge.py applies the "fixed" entries. Uses the corpus title index (data/raw/*/_index.json) to recover real titles
from file-safe slugs (e.g. The_Trail_of_Corruption_Act_2_ -> The Trail of Corruption (Act 2)).
Usage: .venv/bin/python -I scripts/check_source_urls.py
"""
import json, os, re, time, urllib.parse, requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = requests.Session(); S.headers["User-Agent"] = "graph-of-exile-lore-research/0.1"
WIKIS = {"www.poewiki.net": ("https://www.poewiki.net/w/api.php", ["poewiki", "poewiki_extra"]),
         "www.poe2wiki.net": ("https://www.poe2wiki.net/w/api.php", ["poe2wiki", "poe2wiki_extra"])}


def slug(t):
    return re.sub(r"[^A-Za-z0-9]+", "", t).lower()


# all sources across fragments
srcs = {}
for f in sorted(os.listdir(os.path.join(ROOT, "dataset", "fragments"))):
    for s in json.load(open(os.path.join(ROOT, "dataset", "fragments", f))).get("sources", []):
        if s.get("url"):
            srcs.setdefault(s["id"], set()).add(s["url"])

fixes = {}
for host, (api, dirs) in WIKIS.items():
    idx = {}
    for d in dirs:
        p = os.path.join(ROOT, "data", "raw", d, "_index.json")
        if os.path.exists(p):
            for title in json.load(open(p)):
                idx.setdefault(slug(title), title)
    todo = {}
    for sid, urls in srcs.items():
        for u in urls:
            pu = urllib.parse.urlparse(u)
            if pu.netloc == host and pu.path.startswith("/wiki/"):
                title = urllib.parse.unquote(pu.path[len("/wiki/"):]).replace("_", " ")
                todo.setdefault(title, []).append((sid, u))
    titles = list(todo)
    exists = {}
    for i in range(0, len(titles), 50):
        batch = titles[i:i + 50]
        r = S.get(api, params={"action": "query", "titles": "|".join(batch), "redirects": 1, "format": "json"}, timeout=60).json()
        norm = {x["from"]: x["to"] for x in r["query"].get("normalized", [])}
        redir = {x["from"]: x["to"] for x in r["query"].get("redirects", [])}
        present = {p["title"] for p in r["query"]["pages"].values() if "missing" not in p and "invalid" not in p}
        for t in batch:
            t2 = norm.get(t, t); t3 = redir.get(t2, t2)
            exists[t] = t3 in present
        time.sleep(0.3)
    for t, refs in todo.items():
        if exists.get(t):
            continue
        guess = idx.get(slug(t))
        for sid, u in refs:
            if guess:
                new = f"https://{host}/wiki/" + urllib.parse.quote(guess.replace(" ", "_"), safe="()'_,:-!")
                fixes[sid] = {"old": u, "new": new, "status": "fixed"}
            else:
                fixes[sid] = {"old": u, "new": None, "status": "missing"}
json.dump(fixes, open(os.path.join(ROOT, "dataset", "curation", "source_url_fixes.json"), "w"), indent=1, ensure_ascii=False)
print("checked", sum(len(v) for v in srcs.values()), "urls;", sum(1 for v in fixes.values() if v["status"] == "fixed"), "fixed;",
      sum(1 for v in fixes.values() if v["status"] == "missing"), "unresolved")
for k, v in list(fixes.items())[:12]:
    print(k, v["status"], v["old"], "->", v["new"])
