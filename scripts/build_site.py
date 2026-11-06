"""Build compact data files for the web explorer (explorer/data/*.json) from build/<variant>/.
Precomputes two layouts per variant:
  - web:      force-directed (networkx spring layout, seeded => reproducible)
  - timeline: x = era band (chronological), y = force layout y; Exile spine beats are laid on a centre line by story_order
Usage: .venv/bin/python -I scripts/build_site.py
"""
import json, os, sys, math, zlib
import networkx as nx

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "scripts"))
from validate_fragment import ERAS  # noqa: E402
ERAS_LABEL = {"primordial": "Primordial age", "precursor": "Precursors", "azmeri_ezomyte_ancient": "Azmeri & Ezomyte antiquity", "vaal": "Vaal civilisation", "post_vaal_dark_age": "Dark age after the Vaal", "eternal_empire_rise": "Rise of the Eternal Empire", "eternal_empire_fall": "Fall of the Empire", "post_cataclysm": "Theocracy of Oriath", "poe1_campaign": "PoE1 campaign", "poe1_atlas": "PoE1 Atlas", "league_storylines": "League storylines (PoE1 → PoE2)", "interlude_between_games": "Between the games", "poe2_campaign": "PoE2 campaign", "poe2_endgame": "PoE2 endgame", "unknown": "Unplaced"}

OUT = os.path.join(ROOT, "explorer", "data")
os.makedirs(OUT, exist_ok=True)
NODE_KEYS = ["id", "name", "type", "subtype", "plot_role", "branches", "era", "eras", "games", "acts", "aliases", "summary",
             "chronology", "canon_status", "confidence", "release_status", "exile_distance", "degree", "sources", "alt_summaries"]
EDGE_KEYS = ["id", "source", "target", "relation", "description", "plot_role", "branches", "era", "games", "sequence",
             "canon_status", "confidence", "sources", "release_status"]


def era_label(er, variant):
    """In a single-game view, eras of the other game hold only shared entities that carry over; label them so."""
    if variant == "poe2" and er in ("poe1_campaign", "poe1_atlas"):
        return "Returning from the first Exile's time" + (" (Atlas)" if er == "poe1_atlas" else "")
    if variant == "poe1" and er in ("poe2_campaign", "poe2_endgame"):
        return "Also in PoE2"
    if variant != "master" and er == "league_storylines":
        return "League storylines"
    return ERAS_LABEL.get(er, er)


def layout(nodes, edges, variant="master"):
    G = nx.Graph()
    G.add_nodes_from(n["id"] for n in nodes)
    for e in edges:
        if e["relation"] != "next_beat":
            G.add_edge(e["source"], e["target"])
    pos = nx.spring_layout(G, k=1.6 / math.sqrt(max(len(nodes), 1)), iterations=300, seed=42)
    S = 9 * math.sqrt(len(nodes)) * 10
    web = {i: (round(x * S, 1), round(y * S, 1)) for i, (x, y) in pos.items()}
    # timeline: a real time axis. Columns = eras (left -> right, chronological), rows = swimlanes by kind.
    # Inside each era x lane cell, entries are ordered by in-world year / story order, then importance.
    LANES = [("Gods & powers", {"deity"}), ("Factions & peoples", {"faction", "creature"}), ("Characters", {"character"}),
             ("Places", {"location"}), ("Events & story beats", {"event"}), ("Lore objects & texts", {"artifact", "concept", "text"}),
             ("Leagues, acts & eras", {"league", "act", "era"})]
    lane_of = {t: k for k, (_, ts) in enumerate(LANES) for t in ts}
    SP = 62  # node spacing inside a cell
    tl, bands = {}, []
    cells = {}
    for n in nodes:
        cells.setdefault((n.get("era", "unknown"), lane_of.get(n["type"], len(LANES) - 1)), []).append(n)
    pr0 = nx.pagerank(G, alpha=0.85)
    def key(n):
        ch = n.get("chronology") or {}
        y = ch.get("in_world_year"); so = ch.get("story_order")
        return (0 if so is not None else 1, so if so is not None else 0, y if isinstance(y, (int, float)) else 1e9, -pr0.get(n["id"], 0))
    eras_present = [e for e in ERAS if any((e, k) in cells for k in range(len(LANES)))]
    # each era gets a width; each lane a height, so cells line up into a grid
    rows_in = {}
    width = {}
    for e in eras_present:
        cnt = max(len(cells.get((e, k), [])) for k in range(len(LANES)))
        cols = max(2, min(14, math.ceil(math.sqrt(cnt * 2.2))))
        width[e] = cols * SP
        for k in range(len(LANES)):
            c = len(cells.get((e, k), []))
            rows_in[(e, k)] = math.ceil(c / cols) if c else 0
    lane_h = [max(1, max(rows_in[(e, k)] for e in eras_present)) * SP for k in range(len(LANES))]
    GAPX, GAPY = 160, 140
    x0 = 0.0
    era_x = {}
    for e in eras_present:
        era_x[e] = x0; x0 += width[e] + GAPX
    lane_y, y0 = [], 0.0
    for k in range(len(LANES)):
        lane_y.append(y0); y0 += lane_h[k] + GAPY
    for e in eras_present:
        cols = width[e] // SP
        for k in range(len(LANES)):
            ns = sorted(cells.get((e, k), []), key=key)
            for idx, n in enumerate(ns):
                r, c = divmod(idx, cols)
                tl[n["id"]] = (round(era_x[e] + c * SP + SP / 2, 1), round(lane_y[k] + r * SP + SP / 2, 1))
        bands.append({"era": e, "label": era_label(e, variant), "x": round(era_x[e] + width[e] / 2, 1), "y": -180.0, "w": width[e] + GAPX * 0.6})
    for k, (lab, _) in enumerate(LANES):
        bands.append({"lane": k, "label": lab, "x": -330.0, "y": round(lane_y[k] + lane_h[k] / 2, 1)})
    # radial: rings by distance from the Exile(s), angle from the force layout
    rad = {}
    exiles = [i for i in ("char_exile_poe1", "char_exile_poe2") if i in G]
    dist = {}
    for x in exiles:
        for k, v in nx.single_source_shortest_path_length(G, x).items():
            dist[k] = min(v, dist.get(k, 99))
    ring = 420
    for n in nodes:
        i = n["id"]
        d = dist.get(i, 7)
        if i in exiles:
            rad[i] = (-140.0 if i.endswith("poe1") else 140.0, 0.0); continue
        x, y = pos[i]
        a = math.atan2(y, x)
        r = d * ring + (zlib.crc32(i.encode()) % 97) / 97 * ring * 0.6
        rad[i] = (round(r * math.cos(a), 1), round(r * math.sin(a), 1))
    # analytics
    pr = nx.pagerank(G, alpha=0.85)
    bt = nx.betweenness_centrality(G, k=min(400, len(G)), seed=42)
    comms = nx.community.louvain_communities(G, seed=42, resolution=1.0)
    comm = {}
    for ci, c in enumerate(sorted(comms, key=len, reverse=True)):
        for i in c: comm[i] = ci
    # cluster layout: communities packed on a grid, members keep force-layout shape scaled down
    clu = {}
    groups = sorted(comms, key=len, reverse=True)
    cols = max(1, int(math.ceil(math.sqrt(len(groups)))))
    cell = 1500
    for ci, c in enumerate(groups):
        cx, cy = (ci % cols) * cell, (ci // cols) * cell
        sub = nx.spring_layout(G.subgraph(c), seed=42, iterations=80) if len(c) > 1 else {next(iter(c)): (0, 0)}
        sc = 160 + 30 * math.sqrt(len(c))
        for i, (x, y) in sub.items():
            clu[i] = (round(cx + x * sc, 1), round(cy + y * sc, 1))
    return web, tl, rad, clu, pr, bt, comm, dist, groups, bands


def flow_blocks(G, groups, x0, y0, row_w, gap=380):
    """Lay out {label: [ids]} groups as force-laid blocks flowing left->right, wrapping rows. Returns pos, labels, bottom."""
    pos, labels = {}, []
    x, y, row_h = x0, y0, 0.0
    for label, ids in groups:
        if not ids:
            continue
        R = 140 + 60 * math.sqrt(len(ids))
        if x > x0 and x + 2 * R > x0 + row_w:
            x, y, row_h = x0, y + row_h + gap + 200, 0.0
        sub = nx.spring_layout(G.subgraph(ids), seed=42, iterations=100) if len(ids) > 1 else {ids[0]: (0.0, 0.0)}
        for i, (a, b) in sub.items():
            pos[i] = (round(x + R + a * R * 0.95, 1), round(y + 160 + R + b * R * 0.95, 1))
        labels.append({"label": label, "x": round(x + R, 1), "y": round(y + 40, 1)})
        x += 2 * R + gap
        row_h = max(row_h, 2 * R + 160)
    return pos, labels, y + row_h


def saga_layout(nodes, edges, G, variant="master"):
    """Sequential 'saga' layout, read left -> right as a triptych:
    [Before the Exile] | [PoE1 journey ... twenty years later ... PoE2 journey] | [Leagues, Atlas & side lore].
    Story beats run along a serpentine (boustrophedon) line; people and places sit beside the beats they take part in."""
    byid = {n["id"]: n for n in nodes}
    so = lambda n: (n.get("chronology") or {}).get("story_order")
    beats = [n for n in nodes if n.get("type") == "event" and so(n) is not None and n.get("plot_role") in ("main_plot", "endgame_plot")]
    sections = [("Path of Exile 1 — the Exile's journey", sorted([b for b in beats if so(b) < 4000], key=so)),
                ("Twenty years later — Path of Exile 2" if variant == "master" else "Path of Exile 2 — the Exile's journey",
                 sorted([b for b in beats if so(b) >= 5000], key=so))]
    K, DX, DY = 14, 420, 1500
    jw = (K - 1) * DX
    pos, labels = {}, []
    PRE = set(ERAS[:ERAS.index("post_cataclysm") + 1])
    beat_ids = {b["id"] for b in beats}
    attached = {}
    for e in edges:
        if e["relation"] == "next_beat":
            continue
        for a_, b_ in ((e["source"], e["target"]), (e["target"], e["source"])):
            if a_ in beat_ids and b_ in byid and b_ not in beat_ids and not b_.startswith("char_exile_"):
                attached.setdefault(b_, set()).add(a_)
    # column 1: before the Exile
    pre = [(ERAS_LABEL.get(er, er), [n["id"] for n in nodes if n.get("era") == er and n["id"] not in attached and n["id"] not in beat_ids])
           for er in ERAS if er in PRE]
    pw = 5200
    ppos, plabels, pbottom = flow_blocks(G, pre, 0, 0, pw)
    pos.update(ppos); labels += plabels
    labels.append({"label": "Before the Exile", "x": pw / 2, "y": -420, "big": True})
    # column 2: the journeys
    jx = pw + 2200
    y = 0.0
    for title, bs in sections:
        if not bs:
            continue
        labels.append({"label": title, "x": jx + jw / 2, "y": y - 420, "big": True})
        for k, b_ in enumerate(bs):
            r, c = divmod(k, K)
            x = c * DX if r % 2 == 0 else (K - 1 - c) * DX
            pos[b_["id"]] = (round(jx + x, 1), round(y + r * DY, 1))
        y = y + ((len(bs) - 1) // K) * DY + DY + 900
    jbottom = y
    for ex, sec in (("char_exile_poe1", 0), ("char_exile_poe2", 1)):
        if ex in byid:
            bs = sections[sec][1]
            pos[ex] = (pos[bs[0]["id"]][0] - 650, pos[bs[0]["id"]][1]) if bs else (jx - 650.0, 0.0)
    for i, bset in attached.items():
        pts = sorted((so(byid[b_]), pos[b_]) for b_ in bset if b_ in pos)
        if not pts:
            continue
        mx, my = pts[0][1]  # beside the beat where they first appear
        h = zlib.crc32(i.encode())
        ang = (h % 360) / 180 * math.pi
        rad = 160 + (h // 360) % 320
        pos[i] = (round(mx + rad * math.cos(ang), 1), round(my + rad * math.sin(ang) * 1.4, 1))
    # column 3: leagues, Atlas & side lore
    sx = jx + jw + 2400
    rest = [(era_label(er, variant), [n["id"] for n in nodes if n.get("era") == er and n["id"] not in pos]) for er in ERAS if er not in PRE]
    rpos, rlabels, _ = flow_blocks(G, rest, sx, 0, max(5200, jbottom * 0.55))
    pos.update(rpos); labels += rlabels
    labels.append({"label": "Leagues, Atlas & side lore", "x": sx + 2600, "y": -420, "big": True})
    for n in nodes:
        pos.setdefault(n["id"], (0.0, 0.0))
    return pos, labels

meta = {"variants": {}}
for variant in ("master", "poe1", "poe2"):
    g = json.load(open(os.path.join(ROOT, "dataset", variant, "graph.json")))
    nodes, edges = g["nodes"], g["edges"]
    web, tl, rad, clu, pr, bt, comm, dist, groups, bands = layout(nodes, edges, variant)
    Gs = nx.Graph(); Gs.add_nodes_from(n['id'] for n in nodes); Gs.add_edges_from((e['source'], e['target']) for e in edges if e['relation'] != 'next_beat')
    saga, saga_labels = saga_layout(nodes, edges, Gs, variant)
    prmax = max(pr.values()) or 1; btmax = max(bt.values()) or 1
    cn = []
    for n in nodes:
        d = {k: n[k] for k in NODE_KEYS if n.get(k) not in (None, [], "")}
        d["sources"] = [[s["source_id"], s.get("locator", "")] for s in n.get("sources", [])]
        i = n["id"]
        d["p"] = web[i]; d["t"] = tl[i]; d["r"] = rad[i]; d["c"] = clu[i]; d["s"] = saga[i]
        d["pr"] = round(pr.get(i, 0) / prmax, 4); d["bt"] = round(bt.get(i, 0) / btmax, 4); d["cm"] = comm.get(i, -1)
        cn.append(d)
    ce = []
    for e in edges:
        d = {k: e[k] for k in EDGE_KEYS if e.get(k) not in (None, [], "")}
        d["sources"] = [[s["source_id"], s.get("locator", "")] for s in e.get("sources", [])]
        ce.append(d)
    srcs = {s["id"]: {k: s.get(k) for k in ("title", "url", "type", "author_or_channel", "reliability")} for s in g["sources"]}
    # name each community after its highest-PageRank member
    cnames = []
    for c in groups:
        top = max(c, key=lambda i: pr.get(i, 0))
        nm = next(n["name"] for n in nodes if n["id"] == top)
        cnames.append({"label": nm, "size": len(c)})
    json.dump({"variant": variant, "nodes": cn, "edges": ce, "sources": srcs, "communities": cnames, "bands": bands, "saga_labels": saga_labels},
              open(os.path.join(OUT, f"{variant}.json"), "w"), ensure_ascii=False, separators=(",", ":"))
    meta["variants"][variant] = {"nodes": len(cn), "edges": len(ce), "sources": len(srcs)}
    print(variant, meta["variants"][variant])
meta["eras"] = ERAS
json.dump(meta, open(os.path.join(OUT, "meta.json"), "w"), indent=1)
