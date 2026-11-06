"""Merge staging/*.json fragments into the master graph and derive PoE1 / PoE2 / Master views.
Usage: .venv/bin/python -I scripts/merge.py [project_root]
Inputs : staging/*.json, docs/id_aliases.json (optional {"old_id": "canonical_id"})
Outputs: build/{master,poe1,poe2}/{nodes.json,edges.json,sources.json,nodes.csv,edges.csv,graph.graphml,graph.json}
         build/merge_report.json
"""
import csv, glob, json, os, sys, re
from collections import defaultdict, deque
import networkx as nx

ROOT = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts"))
from validate_fragment import validate, ERAS  # noqa: E402

ROLE_PRI = ["main_plot", "endgame_plot", "branch", "background", "meta"]
CONF_PRI = ["high", "medium", "low"]
CANON_PRI = ["canon", "dev_statement", "inferred", "community_theory"]
PRE_GAME_ERAS = set(ERAS[:ERAS.index("post_cataclysm") + 1])
EXILES = ["char_exile_poe1", "char_exile_poe2"]

aliases_path = os.path.join(ROOT, "dataset", "curation", "id_aliases.json")
ALIAS = json.load(open(aliases_path)) if os.path.exists(aliases_path) else {}


def canon(i):
    seen = set()
    while i in ALIAS and i not in seen:
        seen.add(i); i = ALIAS[i]
    return i


def uniq(seq):
    out, seen = [], set()
    for x in seq:
        k = json.dumps(x, sort_keys=True)
        if k not in seen:
            seen.add(k); out.append(x)
    return out


def norm(s):
    return re.sub(r"[^a-z0-9]", "", (s or "").lower().replace("the ", ""))


sources, nodes, edges = {}, {}, {}
report = defaultdict(list)
frags = sorted(glob.glob(os.path.join(ROOT, "dataset", "fragments", "*.json")))
for f in frags:
    dom = os.path.splitext(os.path.basename(f))[0]
    try:
        d = json.load(open(f))
    except Exception as ex:
        report["unreadable_fragments"].append(f"{dom}: {ex}"); continue
    errs, _ = validate(d)
    if errs:
        report["fragment_errors"].append({"domain": dom, "count": len(errs), "sample": errs[:10]})
    for s in d.get("sources", []):
        if s["id"] in sources:
            old = sources[s["id"]]
            for k, v in s.items():
                if not old.get(k) and v: old[k] = v
        else:
            sources[s["id"]] = dict(s)
    for n in d.get("nodes", []):
        n = dict(n); n["id"] = canon(n["id"])
        n.setdefault("aliases", []); n.setdefault("branches", []); n.setdefault("games", []); n.setdefault("acts", [])
        n["domains"] = [dom]
        n["eras"] = [n.get("era")]; n["plot_roles"] = [n.get("plot_role")]
        if n["id"] not in nodes:
            nodes[n["id"]] = n; continue
        o = nodes[n["id"]]
        # pick the richer record as base for scalar fields
        richer = n if (len(n.get("sources", [])), len(n.get("summary", ""))) > (len(o.get("sources", [])), len(o.get("summary", ""))) else o
        merged = dict(richer)
        merged["aliases"] = sorted(set(o["aliases"]) | set(n["aliases"]) | ({o["name"], n["name"]} - {richer["name"]}))
        for k in ("games", "branches", "acts", "domains"):
            merged[k] = sorted(set(o.get(k, [])) | set(n.get(k, [])))
        merged["sources"] = uniq(o.get("sources", []) + n.get("sources", []))
        merged["plot_role"] = min(o["plot_role"], n["plot_role"], key=ROLE_PRI.index)
        if o["plot_role"] != n["plot_role"]:
            report["plot_role_conflicts"].append(f"{n['id']}: {o['plot_role']} vs {n['plot_role']} -> {merged['plot_role']}")
        eras = sorted(set(o.get("eras", [o.get("era")])) | set(n.get("eras", [n.get("era")])) - {None}, key=ERAS.index)
        merged["eras"] = eras
        known = [x for x in eras if x != "unknown"]
        merged["era"] = known[0] if known else "unknown"
        merged["plot_roles"] = sorted(set(o.get("plot_roles", [o["plot_role"]])) | set(n.get("plot_roles", [n["plot_role"]])), key=ROLE_PRI.index)
        if o.get("era") != n.get("era"):
            report["era_conflicts"].append(f"{n['id']}: {o.get('era')} ({o['domains']}) vs {n.get('era')} ({dom}) -> {merged['era']}")
        if o.get("type") != n.get("type"):
            report["type_conflicts"].append(f"{n['id']}: {o.get('type')} vs {n.get('type')}")
        if o.get("summary") and n.get("summary") and norm(o["summary"]) != norm(n["summary"]):
            merged.setdefault("alt_summaries", [])
            other = n if richer is o else o
            merged["alt_summaries"] = uniq(o.get("alt_summaries", []) + n.get("alt_summaries", []) + [{"domain": other["domains"][0], "summary": other["summary"]}])
        so, sn = (o.get("chronology") or {}).get("story_order"), (n.get("chronology") or {}).get("story_order")
        if so is not None and sn is not None and so != sn:
            report["story_order_conflicts"].append(f"{n['id']}: {so} vs {sn}")
        merged["confidence"] = max(o["confidence"], n["confidence"], key=CONF_PRI.index)  # keep the more cautious
        merged["canon_status"] = max(o["canon_status"], n["canon_status"], key=CANON_PRI.index)
        nodes[n["id"]] = merged
    for e in d.get("edges", []):
        e = dict(e); e["source"] = canon(e["source"]); e["target"] = canon(e["target"])
        e.setdefault("branches", []); e.setdefault("games", [])
        key = (e["source"], e["relation"], e["target"])
        e["domains"] = [dom]
        if key not in edges:
            edges[key] = e; continue
        o = edges[key]
        for k in ("games", "branches", "domains"):
            o[k] = sorted(set(o.get(k, [])) | set(e.get(k, [])))
        o["sources"] = uniq(o.get("sources", []) + e.get("sources", []))
        if len(e.get("description", "")) > len(o.get("description", "")): o["description"] = e["description"]
        o["plot_role"] = min(o["plot_role"], e["plot_role"], key=ROLE_PRI.index)
        o["confidence"] = max(o["confidence"], e["confidence"], key=CONF_PRI.index)
        if o.get("sequence") is None: o["sequence"] = e.get("sequence")

# ---------------- curation patches (docs/patches.json) ----------------
patches_path = os.path.join(ROOT, "dataset", "curation", "patches.json")
PATCH = json.load(open(patches_path)) if os.path.exists(patches_path) else {}
DATAMINE_SOURCES = {"src_web_poe2db_act5", "src_web_poe2db_act6"}


def setf(obj, k, v):
    if "." in k:
        a, b = k.split(".", 1); obj.setdefault(a, {}) ; obj[a] = obj[a] or {}; obj[a][b] = v
    else:
        obj[k] = v


for op in PATCH.get("set_node", []):
    n = nodes.get(canon(op["id"]))
    if not n: report["patch_misses"].append(f"set_node {op['id']}"); continue
    for k, v in op["fields"].items(): setf(n, k, v)
    n.setdefault("curation", []).append(op["reason"])
for op in PATCH.get("remove_edge", []):
    k = (canon(op["source"]), op["relation"], canon(op["target"]))
    if edges.pop(k, None) is None: report["patch_misses"].append(f"remove_edge {k}")
for op in PATCH.get("set_edge", []):
    k = (canon(op["source"]), op["relation"], canon(op["target"]))
    e = edges.pop(k, None)
    if e is None: report["patch_misses"].append(f"set_edge {k}"); continue
    e.update(op["fields"]); e.setdefault("curation", []).append(op["reason"])
    e["id"] = f"e_{e['source']}__{e['relation']}__{e['target']}"
    edges[(e["source"], e["relation"], e["target"])] = e
side = {canon(x) for x in PATCH.get("side_quests", [])}
for i in side:
    n = nodes.get(i)
    if not n: report["patch_misses"].append(f"side_quest {i}"); continue
    n["plot_role"] = "branch"; n["branches"] = sorted(set(n.get("branches", [])) | {"campaign_side_quest"})
    (n.setdefault("chronology", {}) or {})["story_order"] = None
    n.setdefault("curation", []).append("optional campaign side quest (codex audit)")
for e in edges.values():
    if e["source"] in side or e["target"] in side:
        if e["plot_role"] == "main_plot": e["plot_role"] = "branch"
        e["branches"] = sorted(set(e.get("branches", [])) | {"campaign_side_quest"})

# rules: only events carry story_order; act containers are meta
for i, n in nodes.items():
    ch = n.get("chronology") or {}
    if ch.get("story_order") is not None and n.get("type") != "event":
        ch["story_order"] = None; n["chronology"] = ch
    if n.get("type") == "act":
        n["plot_role"] = "meta"
    # release status
    srcs = {x.get("source_id") for x in n.get("sources", [])}
    ov = PATCH.get("release_overrides", {})
    if i in ov.get("released", []):
        n["release_status"] = "released"
    elif (srcs & DATAMINE_SOURCES) or i in ov.get("datamined", []):
        n["release_status"] = "datamined_pre_1.0"; n["canon_status"] = "inferred"; n["confidence"] = "low"
    else:
        n.setdefault("release_status", "released")
    if i.startswith("concept_ascendancy_"):
        n["plot_role"] = "meta"; n["subtype"] = "ascendancy_class"

# continuity: PoE2 continues PoE1. Entities that are the same thing share their game labels.
for (s_, r_, t_), e_ in edges.items():
    if r_ == "same_entity_as" and s_ in nodes and t_ in nodes:
        g = sorted(set(nodes[s_].get("games", [])) | set(nodes[t_].get("games", [])))
        for x in (s_, t_):
            if nodes[x].get("games") != g:
                nodes[x]["games"] = g; nodes[x].setdefault("curation", []).append("games unified via same_entity_as (continuity)")

# rebuild the exile spine: next_beat edges regenerated from story_order
for k in [k for k in edges if k[1] == "next_beat"]:
    del edges[k]
SEGMENTS = [("poe1", 1000, 4000), ("poe2", 5000, 7000)]
for game, lo, hi in SEGMENTS:
    beats = sorted((n["chronology"]["story_order"], i) for i, n in nodes.items()
                   if n.get("type") == "event" and n.get("plot_role") in ("main_plot", "endgame_plot")
                   and (n.get("chronology") or {}).get("story_order") is not None and lo <= n["chronology"]["story_order"] < hi)
    for seq, ((oa, a), (ob, b)) in enumerate(zip(beats, beats[1:]), 1):
        na, nb = nodes[a], nodes[b]
        role = "endgame_plot" if "endgame_plot" in (na["plot_role"], nb["plot_role"]) else "main_plot"
        conf = "high" if na["confidence"] == nb["confidence"] == "high" else ("low" if "low" in (na["confidence"], nb["confidence"]) else "medium")
        edges[(a, "next_beat", b)] = {
            "id": f"e_spine_{game}_{seq:03d}", "source": a, "target": b, "relation": "next_beat",
            "description": f"Exile journey ({game}): beat {oa} -> {ob}", "games": [game], "plot_role": role,
            "branches": [], "era": nb.get("era"), "sequence": seq, "canon_status": "canon" if conf != "low" else "inferred",
            "confidence": conf, "sources": uniq(na.get("sources", [])[:1] + nb.get("sources", [])[:1]), "domains": ["spine_builder"]}
        ga, gb = (na.get("chronology") or {}).get("parallel_group"), (nb.get("chronology") or {}).get("parallel_group")
        ed = edges[(a, "next_beat", b)]
        if nb.get("release_status") != "released" or na.get("release_status") != "released":
            ed["release_status"] = "datamined_pre_1.0"; ed["ordering"] = "provisional"
        elif ga and ga == gb:
            ed["ordering"] = "any_order"; ed["description"] += f" (parallel group '{ga}': these beats can be done in any order)"
        else:
            ed["ordering"] = "required"

# type follows the canonical id prefix (aliases may merge records of different types)
PFX = {"char_": "character", "deity_": "deity", "faction_": "faction", "loc_": "location", "event_": "event",
       "artifact_": "artifact", "concept_": "concept", "era_": "era", "league_": "league", "act_": "act",
       "text_": "text", "creature_": "creature"}
for i, n in nodes.items():
    for p_, t_ in PFX.items():
        if i.startswith(p_) and n.get("type") != t_:
            report["type_fixed_by_prefix"].append(f"{i}: {n.get('type')} -> {t_}"); n["type"] = t_

# verified source-URL corrections (scripts/check_source_urls.py)
fx_path = os.path.join(ROOT, "dataset", "curation", "source_url_fixes.json")
for sid, fx in (json.load(open(fx_path)) if os.path.exists(fx_path) else {}).items():
    if fx.get("status") == "fixed" and sid in sources:
        sources[sid]["url"] = fx["new"]

# drop self loops, dangling refs
final_edges = []
for (s, r, t), e in edges.items():
    if s == t:
        report["self_loops"].append(e.get("id")); continue
    if s not in nodes or t not in nodes:
        report["dangling_edges"].append(f"{e.get('id')}: {s if s not in nodes else ''} {t if t not in nodes else ''}".strip())
        continue
    final_edges.append(e)
# unique edge ids
seen = defaultdict(int)
for e in final_edges:
    base = e.get("id") or f"e_{e['source']}__{e['relation']}__{e['target']}"
    seen[base] += 1
    e["id"] = base if seen[base] == 1 else f"{base}_{seen[base]}"

# missing sources referenced
for obj in list(nodes.values()) + final_edges:
    for s in obj.get("sources", []):
        if s.get("source_id") not in sources:
            report["unknown_source_refs"].append(f"{obj['id']} -> {s.get('source_id')}")

# probable duplicates by normalized name/alias within same type
byname = defaultdict(set)
for n in nodes.values():
    for nm in [n["name"]] + n.get("aliases", []):
        if norm(nm): byname[(n["type"], norm(nm))].add(n["id"])
report["probable_duplicates"] = sorted({" | ".join(sorted(v)) for v in byname.values() if len(v) > 1})
# same name across types (e.g. deity_kitava vs char_kitava)
byname2 = defaultdict(set)
for n in nodes.values():
    byname2[norm(n["name"])].add(n["id"])
report["same_name_cross_type"] = sorted({" | ".join(sorted(v)) for v in byname2.values() if len(v) > 1})

# computed: degree, exile distance
G = nx.MultiDiGraph()
for i, n in nodes.items(): G.add_node(i)
for e in final_edges: G.add_edge(e["source"], e["target"])
U = G.to_undirected(as_view=True)
for i, n in nodes.items():
    n["degree"] = G.degree(i)
for ex in EXILES:
    dist = nx.single_source_shortest_path_length(U, ex) if ex in nodes else {}
    for i, n in nodes.items():
        n[f"distance_from_{ex}"] = dist.get(i)
for i, n in nodes.items():
    ds = [n.get(f"distance_from_{x}") for x in EXILES if n.get(f"distance_from_{x}") is not None]
    n["exile_distance"] = min(ds) if ds else None
    n["is_spine"] = (n.get("chronology") or {}).get("story_order") is not None
report["unreachable_from_exile"] = sorted(i for i, n in nodes.items() if n["exile_distance"] is None)
report["isolated_nodes"] = sorted(i for i in nodes if G.degree(i) == 0)


def view(game):
    """Master keeps everything. A game view is strict: the other game is masked.
    Nodes: only entities that appear in this game (games contains it); out-of-game metadata (games == [])
    only when it attaches to a kept node. Edges: both ends kept and the relation holds in this game
    (edge games contains it, or the edge has no game tag)."""
    if game is None:
        return set(nodes), final_edges
    keep = {i for i, n in nodes.items() if game in n.get("games", [])}
    for e in final_edges:
        for a, b in ((e["source"], e["target"]), (e["target"], e["source"])):
            if a in keep and b not in keep and not nodes[b].get("games"):
                keep.add(b)
    # a relation between two entities that both exist in this game is a standing fact of the shared world and is kept,
    # unless it belongs to the OTHER game's own story (its era is the other game's campaign/endgame and it is not tagged for this game)
    other_story = {"poe1": {"poe2_campaign", "poe2_endgame"}, "poe2": {"poe1_campaign", "poe1_atlas"}}[game]
    es = [e for e in final_edges if e["source"] in keep and e["target"] in keep and
          (not e.get("games") or game in e["games"] or e.get("era") not in other_story)]
    return keep, es


def flat(v):
    if isinstance(v, (list, dict)): return json.dumps(v, ensure_ascii=False)
    return "" if v is None else v


def emit(name, keep, es):
    out = os.path.join(ROOT, "dataset", name); os.makedirs(out, exist_ok=True)
    ns = [nodes[i] for i in sorted(keep)]
    used_src = {s["source_id"] for o in ns + es for s in o.get("sources", [])}
    ss = [sources[s] for s in sorted(used_src) if s in sources]
    for fn, data in (("nodes.json", ns), ("edges.json", es), ("sources.json", ss)):
        json.dump(data, open(os.path.join(out, fn), "w"), indent=1, ensure_ascii=False)
    json.dump({"variant": name, "nodes": ns, "edges": es, "sources": ss},
              open(os.path.join(out, "graph.json"), "w"), ensure_ascii=False)
    nkeys = ["id", "name", "type", "subtype", "plot_role", "plot_roles", "branches", "era", "eras", "games", "acts", "chronology", "canon_status",
             "confidence", "release_status", "exile_distance", "is_spine", "degree", "aliases", "summary", "curation", "domains", "sources"]
    ekeys = ["id", "source", "target", "relation", "description", "plot_role", "branches", "era", "games", "sequence",
             "canon_status", "confidence", "domains", "sources"]
    for fn, rows, keys in (("nodes.csv", ns, nkeys), ("edges.csv", es, ekeys)):
        with open(os.path.join(out, fn), "w", newline="") as fh:
            w = csv.writer(fh); w.writerow(keys)
            for r in rows: w.writerow([flat(r.get(k)) for k in keys])
    g = nx.MultiDiGraph(variant=name)
    for n in ns: g.add_node(n["id"], **{k: flat(v) for k, v in n.items() if k != "id"})
    for e in es: g.add_edge(e["source"], e["target"], key=e["id"], **{k: flat(v) for k, v in e.items() if k not in ("source", "target")})
    nx.write_graphml(g, os.path.join(out, "graph.graphml"))
    return {"nodes": len(ns), "edges": len(es), "sources": len(ss)}


stats = {}
for name, game in (("master", None), ("poe1", "poe1"), ("poe2", "poe2")):
    stats[name] = emit(name, *view(game))
report = dict(report)
report["stats"] = stats
report["fragments"] = [os.path.basename(f) for f in frags]
from collections import Counter
report["by_plot_role"] = Counter(n["plot_role"] for n in nodes.values())
report["by_type"] = Counter(n["type"] for n in nodes.values())
report["by_branch"] = Counter(b for n in nodes.values() for b in n.get("branches", []))
os.makedirs(os.path.join(ROOT, "verification"), exist_ok=True)
json.dump(report, open(os.path.join(ROOT, "verification", "merge_report.json"), "w"), indent=1, ensure_ascii=False)
print(json.dumps(stats))
for k, v in report.items():
    if isinstance(v, list): print(f"{k}: {len(v)}")
