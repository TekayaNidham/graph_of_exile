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

OUT = os.path.join(ROOT, "explorer", "data")
os.makedirs(OUT, exist_ok=True)
NODE_KEYS = ["id", "name", "type", "subtype", "plot_role", "branches", "era", "eras", "games", "acts", "aliases", "summary",
             "chronology", "canon_status", "confidence", "release_status", "exile_distance", "degree", "sources", "alt_summaries"]
EDGE_KEYS = ["id", "source", "target", "relation", "description", "plot_role", "branches", "era", "games", "sequence",
             "canon_status", "confidence", "sources", "release_status"]


def layout(nodes, edges):
    G = nx.Graph()
    G.add_nodes_from(n["id"] for n in nodes)
    for e in edges:
        if e["relation"] != "next_beat":
            G.add_edge(e["source"], e["target"])
    pos = nx.spring_layout(G, k=1.6 / math.sqrt(max(len(nodes), 1)), iterations=300, seed=42)
    S = 9 * math.sqrt(len(nodes)) * 10
    web = {i: (round(x * S, 1), round(y * S, 1)) for i, (x, y) in pos.items()}
    # timeline: each era is a compact force-laid cluster, placed left->right in chronological order;
    # the Exile's story beats run along a "journey line" above their era's cluster
    tl = {}
    spine_ids = {n["id"] for n in nodes if (n.get("chronology") or {}).get("story_order") is not None}
    by_era = {}
    for n in nodes:
        by_era.setdefault(n.get("era", "unknown"), []).append(n)
    # build one block per era (local coords, origin = block top-left), then flow blocks into rows like text
    BEAT_W, BEAT_H = 110, 120
    blocks = []
    for era in ERAS:
        ns = by_era.get(era)
        if not ns:
            continue
        rest = [n["id"] for n in ns if n["id"] not in spine_ids]
        R = 160 + 70 * math.sqrt(len(rest) or 1)
        beats = sorted([n for n in ns if n["id"] in spine_ids], key=lambda n: n["chronology"]["story_order"])
        width = 2 * R
        per_line = max(1, int(width // BEAT_W))
        lines = math.ceil(len(beats) / per_line) if beats else 0
        top = lines * BEAT_H + (60 if beats else 0)
        local = {}
        for k, n in enumerate(beats):  # journey lines, left->right, top->down
            r, c = divmod(k, per_line)
            local[n["id"]] = (BEAT_W / 2 + c * BEAT_W, BEAT_H / 2 + r * BEAT_H)
        if rest:
            sub = nx.spring_layout(G.subgraph(rest), seed=42, iterations=120) if len(rest) > 1 else {rest[0]: (0.0, 0.0)}
            for i, (x, y) in sub.items():
                local[i] = (R + x * R * 0.95, top + R + y * R * 0.95)
        blocks.append((width, top + 2 * R, local, era))
    area = sum(b[0] * b[1] for b in blocks)
    row_w = max(max(b[0] for b in blocks), math.sqrt(area * 16 / 9) * 1.15)
    bands = []
    x0 = y0 = row_h = 0.0
    GAP = 380
    for w, h, local, era in blocks:
        if x0 > 0 and x0 + w > row_w:
            x0, y0, row_h = 0.0, y0 + row_h + GAP + 300, 0.0
        for i, (x, y) in local.items():
            tl[i] = (round(x0 + x, 1), round(y0 + y, 1))
        bands.append({"era": era, "x": round(x0 + w / 2, 1), "y": round(y0 - 130, 1)})
        x0 += w + GAP
        row_h = max(row_h, h)
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


meta = {"variants": {}}
for variant in ("master", "poe1", "poe2"):
    g = json.load(open(os.path.join(ROOT, "dataset", variant, "graph.json")))
    nodes, edges = g["nodes"], g["edges"]
    web, tl, rad, clu, pr, bt, comm, dist, groups, bands = layout(nodes, edges)
    prmax = max(pr.values()) or 1; btmax = max(bt.values()) or 1
    cn = []
    for n in nodes:
        d = {k: n[k] for k in NODE_KEYS if n.get(k) not in (None, [], "")}
        d["sources"] = [[s["source_id"], s.get("locator", "")] for s in n.get("sources", [])]
        i = n["id"]
        d["p"] = web[i]; d["t"] = tl[i]; d["r"] = rad[i]; d["c"] = clu[i]
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
    json.dump({"variant": variant, "nodes": cn, "edges": ce, "sources": srcs, "communities": cnames, "bands": bands},
              open(os.path.join(OUT, f"{variant}.json"), "w"), ensure_ascii=False, separators=(",", ":"))
    meta["variants"][variant] = {"nodes": len(cn), "edges": len(ce), "sources": len(srcs)}
    print(variant, meta["variants"][variant])
meta["eras"] = ERAS
json.dump(meta, open(os.path.join(OUT, "meta.json"), "w"), indent=1)
