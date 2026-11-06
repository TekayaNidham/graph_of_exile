"""Dump wikitext of pages in given categories (+1 level subcats) from a MediaWiki API.
Usage: python -I wiki_dump.py <api_url> <out_dir> <Category:A> [Category:B ...]"""
import sys, os, json, re, time, requests
api, out = sys.argv[1], sys.argv[2]
cats = sys.argv[3:]
S = requests.Session(); S.headers["User-Agent"] = "graph-of-exile-lore-research/0.1 (personal research)"
os.makedirs(out, exist_ok=True)
def members(cat, depth=1):
    pages, sub = [], []
    params = dict(action="query", list="categorymembers", cmtitle=cat, cmlimit=500, format="json")
    while True:
        r = S.get(api, params=params, timeout=60).json()
        for m in r["query"]["categorymembers"]:
            (sub if m["ns"] == 14 else pages).append(m["title"]) if m["ns"] in (0, 14) else None
        if "continue" not in r: break
        params.update(r["continue"])
    if depth > 0:
        for s in sub: pages += members(s, depth - 1)
    return pages
titles = sorted(set(t for c in cats for t in members(c)))
print(len(titles), "pages")
index = {}
for i in range(0, len(titles), 40):
    batch = titles[i:i+40]
    r = S.get(api, params=dict(action="query", prop="revisions", rvprop="content", rvslots="main",
              titles="|".join(batch), format="json", redirects=1), timeout=120).json()
    for p in r["query"]["pages"].values():
        if "revisions" not in p: continue
        txt = p["revisions"][0]["slots"]["main"]["*"]
        fn = re.sub(r"[^A-Za-z0-9_.-]+", "_", p["title"])[:120] + ".wiki"
        open(os.path.join(out, fn), "w").write(txt)
        index[p["title"]] = fn
    time.sleep(0.5)
json.dump(index, open(os.path.join(out, "_index.json"), "w"), indent=1)
print("saved", len(index))
