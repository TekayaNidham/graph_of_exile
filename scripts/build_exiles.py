"""Extract "Choose your Exile" profiles (class, sentence, own words, lore) from the class wiki pages.
Output: dataset/extras/exile_profiles.json (+ copied to explorer/data/exiles.json)
Requires the raw corpus: data/raw/poewiki_extra, data/raw/poe2wiki_extra (scripts/wiki_dump.py, Category:Character_classes).
Usage: python3 -I scripts/build_exiles.py
"""
import json, os, re, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P1 = os.path.join(ROOT, "data", "raw", "poewiki_extra")
P2 = os.path.join(ROOT, "data", "raw", "poe2wiki_extra")
nodes = {n["id"]: n for n in json.load(open(os.path.join(ROOT, "dataset", "master", "nodes.json")))}


def clean(t):
    t = re.sub(r"<!--.*?-->", "", t, flags=re.S)
    t = re.sub(r"</?blockquote>", "", t)
    t = re.sub(r"\{\{efn\|.*?\}\}", "", t)
    t = re.sub(r"\{\{[^{}]*\}\}", "", t)
    t = re.sub(r"\[\[(?:[^|\]]*\|)?([^\]]+)\]\]", r"\1", t)
    t = re.sub(r"\[https?://\S+ ([^\]]+)\]", r"\1", t)
    t = re.sub(r"'''?", "", t)
    t = re.sub(r"<[^>]+>", "", t)
    return re.sub(r"\n{3,}", "\n\n", t).strip()


def section(text, title, level=3):
    m = re.search(rf"^{'=' * level}\s*{re.escape(title)}\s*{'=' * level}\s*$(.*?)(?=^={{2,{level}}}[^=])", text, flags=re.M | re.S)
    return clean(m.group(1)) if m else None


def strip_attrib(t):
    # "... -- [[High Templar Dominus]]" -> text, speaker
    m = re.search(r"--\s*(.+)$", t.strip())
    speaker = m.group(1).strip() if m else None
    body = t[: m.start()].strip() if m else t.strip()
    return body.strip('"“” \n'), speaker


profiles = []
POE1 = ["Marauder", "Duelist", "Ranger", "Shadow", "Witch", "Templar", "Scion"]
for c in POE1:
    f = os.path.join(P1, f"{c}.wiki")
    if not os.path.exists(f):
        continue
    t = open(f).read()
    sent = section(t, "Character creation")
    own = section(t, "Legacy intro")
    body, who = strip_attrib(sent) if sent else (None, None)
    own_body, _ = strip_attrib(own) if own else (None, None)
    nid = f"char_class_{c.lower()}"
    profiles.append({
        "id": f"poe1_{c.lower()}", "game": "poe1", "class": c, "node": nid if nid in nodes else None,
        "sentence": {"text": body, "by": who or "High Templar Dominus"} if body else None,
        "own_words": own_body, "lore": nodes.get(nid, {}).get("summary"),
        "source": {"title": f"{c} - PoE Wiki", "url": f"https://www.poewiki.net/wiki/{c}",
                   "locator": "Dialogue › Character creation (sentence); Legacy intro (own words)"},
    })

POE2 = ["Warrior", "Ranger", "Huntress", "Witch", "Sorceress", "Mercenary", "Monk", "Druid"]
for c in POE2:
    f = os.path.join(P2, f"{c}.wiki")
    if not os.path.exists(f):
        continue
    t = open(f).read()
    q = re.search(r"<blockquote>(.*?)</blockquote>", t, flags=re.S)
    lore = section(t, "Lore", level=2)
    nid = f"char_class_{c.lower()}_poe2"
    profiles.append({
        "id": f"poe2_{c.lower()}", "game": "poe2", "class": c, "node": nid if nid in nodes else None,
        "sentence": {"text": nodes.get("event_poe2_exile_death_sentence", {}).get("summary"),
                     "by": "Count Geonor (shared PoE2 prologue)", "node": "event_poe2_exile_death_sentence"},
        "own_words": clean(q.group(1)) if q else None, "lore": lore or nodes.get(nid, {}).get("summary"),
        "source": {"title": f"{c} - PoE2 Wiki", "url": f"https://www.poe2wiki.net/wiki/{c}",
                   "locator": "intro quote; Lore section. Sentence: PoE2 prologue (event_poe2_exile_death_sentence)"},
    })

out = os.path.join(ROOT, "dataset", "extras"); os.makedirs(out, exist_ok=True)
json.dump(profiles, open(os.path.join(out, "exile_profiles.json"), "w"), indent=1, ensure_ascii=False)
shutil.copy(os.path.join(out, "exile_profiles.json"), os.path.join(ROOT, "explorer", "data", "exiles.json"))
for p in profiles:
    print(p["id"], "| sentence:", bool(p["sentence"] and p["sentence"]["text"]), "| own:", bool(p["own_words"]), "| node:", p["node"])
