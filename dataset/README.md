# Graph of Exile — Dataset Card

A sourced, labelled **knowledge graph of Path of Exile lore** (PoE1 + PoE2), centred on the Exile. It covers the primordial gods and the Precursors, the Vaal, the Eternal Empire, both campaigns, the Atlas wars, PoE2's endgame and the storylines of every league (Breach, Ritual, Delve, Kingsmarch, Heist and the rest). The Twilight Order and its Edicts are included too. Every node and edge cites its sources.

| Variant | Folder | Nodes | Edges | Sources | What it is |
|---|---|---:|---:|---:|---|
| **Master** | [`master/`](master/) | 1,413 | 3,622 | 658 | Everything, incl. PoE1 → PoE2 continuity (`continues_in`) |
| **PoE1 plot** | [`poe1/`](poe1/) | 1,042 | 2,616 | 547 | Entities appearing in Path of Exile 1, plus the deep history that explains them |
| **PoE2 plot** | [`poe2/`](poe2/) | 806 | 1,778 | 385 | Entities appearing in Path of Exile 2, plus the deep history that explains them |

Full breakdowns are in [`STATS.md`](STATS.md) and [`stats.json`](stats.json). Version: **v1.0.0**, built 2026-11-06.

> **⚠ PoE2 is in Early Access.** 17 nodes carry `release_status: "datamined_pre_1.0"`. They come from game-file datamines of the unreleased Acts 5–6, may change, and will be revised after PoE2 1.0 (11 December 2026). Filter them out with `release_status == "released"`.

---

## Files

Each variant folder contains the same files:

| File | Format | Use it for |
|---|---|---|
| `graph.json` | JSON `{variant, nodes, edges, sources}` | One-file load (Python, JS, anything) |
| `nodes.json` / `edges.json` / `sources.json` | JSON arrays | Separate tables |
| `nodes.csv` / `edges.csv` | CSV (list fields JSON-encoded) | pandas, R, spreadsheets, Neo4j `LOAD CSV` |
| `graph.graphml` | GraphML (directed multigraph) | Gephi, Cytoscape desktop, yEd, networkx, igraph |

Everything else:

| Path | What |
|---|---|
| [`schema/SCHEMA.md`](schema/SCHEMA.md) | Field-by-field documentation, controlled vocabularies, id rules |
| [`schema/graph.schema.json`](schema/graph.schema.json) | JSON Schema (draft 2020-12); all three `graph.json` files validate against it |
| [`fragments/`](fragments/) | The 24 per-domain research fragments the graph is merged from (provenance) |
| [`curation/`](curation/) | `id_aliases.json` (duplicate → canonical id) and `patches.json` (audited corrections, each with a reason) |

---

## Data model in one minute

**Node:** `id`, `name`, `aliases`, `type`, `summary`, `plot_role`, `branches`, `era`, `games`, `chronology`, `canon_status`, `confidence`, `release_status`, `sources[]`.
**Edge:** `source` → `target` with a `relation` (51 types: `defeats`, `kills`, `imprisons`, `betrays`, `worships`, `member_of`, `causes`, `continues_in`, `next_beat`, …), plus a `description`, the same labels as nodes, and `sources[]`.
**Source:** `id`, `title`, `url`, `type` (wiki / in_game_text / youtube / forum_post / book / …), `reliability` (primary / secondary / tertiary).

Every node and edge points to its sources with a **locator**: a wiki section, a quoted line of dialogue or a video timestamp.

### Labels

| `plot_role` | Meaning | Nodes |
|---|---|---:|
| `main_plot` | The Exile's critical path through the campaigns | 472 |
| `endgame_plot` | The Atlas storylines (Shaper/Elder → Sirus → Maven → Exarch & Eater; PoE2 Arbiters) | 125 |
| `branch` | League / side-mechanic / optional side-quest lore; `branches` names which (70 tags, e.g. `breach`, `ritual`, `kingsmarch`, `delve`, `twilight_order`, `campaign_side_quest`) | 440 |
| `background` | Deep history the Exile doesn't live through (Precursors, Vaal, Eternal Empire…) | 264 |
| `meta` | Containers: acts, leagues, ascendancy classes | 112 |

* **`era`** puts each entity on a single chronological axis: `primordial → precursor → azmeri_ezomyte_ancient → vaal → post_vaal_dark_age → eternal_empire_rise → eternal_empire_fall → post_cataclysm → poe1_campaign → poe1_atlas → poe1_leagues → interlude_between_games → poe2_campaign → poe2_endgame`. `era` is where an entity originates; `eras` lists everywhere it appears.
* **`games`** lists where an entity appears or is mentioned: `["poe1"]`, `["poe2"]` or both.
* **`canon_status`** is one of `canon`, `dev_statement`, `inferred` or `community_theory`; **`confidence`** is `high`, `medium` or `low`.

### The Exile's journey (the spine)
`char_exile_poe1` and `char_exile_poe2` are two different protagonists, both linked to `concept_exile`. Story beats are `event` nodes with `chronology.story_order`, chained by `next_beat` edges:

* **PoE1** (66 beats): sentenced → Twilight Strand → Acts 1–10 → Epilogue → Atlas (Shaper, Elder, Sirus, Maven, Exarch, Eater, the Originator)
* **PoE2** (61 beats): Ogham → Acts 1–4 → Interludes → *(datamined Act 5, `provisional`)* → endgame (Legacy of the Precursors → Arbiter of Ash → Arbiter of Divinity)

Each spine edge carries `ordering`: `required`, `any_order` (parallel quests such as the Sun and Moon Orbs) or `provisional` (datamined). Optional side quests are deliberately off the spine and tagged `campaign_side_quest`.

---

## Quickstart

**Python (plain JSON)**
```python
import json
g = json.load(open("dataset/master/graph.json"))
nodes = {n["id"]: n for n in g["nodes"]}
spine = sorted((e for e in g["edges"] if e["relation"] == "next_beat" and "poe1" in e["games"]),
               key=lambda e: e["sequence"])
print(" → ".join(nodes[e["target"]]["name"] for e in spine[:8]))
```

**networkx**
```python
import networkx as nx, json
G = nx.read_graphml("dataset/master/graph.graphml")          # MultiDiGraph; list fields are JSON strings
breach = [n for n, d in G.nodes(data=True) if "breach" in json.loads(d.get("branches", "[]"))]
print(nx.shortest_path(G.to_undirected(), "char_atziri", "deity_sin"))
```

**pandas**
```python
import pandas as pd
nodes = pd.read_csv("dataset/poe2/nodes.csv")
nodes[nodes.plot_role == "main_plot"].groupby("type").size()
```

**JavaScript**
```js
const g = await (await fetch("dataset/poe1/graph.json")).json();
const gods = g.nodes.filter(n => n.type === "deity");
```

**Gephi / Cytoscape desktop / yEd:** open `graph.graphml` directly.

---

## How it was built (provenance)

1. **Corpus.** We collected 687 lore, NPC, quest, league, act, boss and class pages from [poewiki.net](https://www.poewiki.net) and [poe2wiki.net](https://www.poe2wiki.net) through the MediaWiki API, together with YouTube lore-video transcripts and official GGG announcements, patch notes and forum posts.
2. **Research.** 15 domain researchers (AI agents) each wrote a schema-validated fragment for one area: deep history, the Vaal, the Eternal Empire, the PoE1 acts, the Atlas, the leagues in three eras, the gods, the PoE2 acts, the Twilight Order & Edicts, the PoE2 endgame, and the Exile & sources.
3. **Independent verification.** A separate agent re-checked every claim in each fragment against the cited source. It fixed, downgraded or removed claims and wrote a changelog for each domain; see [`../verification/`](../verification/).
4. **Gap-fill.** A completeness critic compared the graph with every corpus page, and 7 gap-fill fragments followed, each verified again.
5. **Two external audits.** An independent model (OpenAI Codex) audited facts, chronology, labels and duplicates twice, finding 72 and then 48 issues. Accepted fixes are applied by the reproducible curation layer, and one item was rejected with counter-evidence ([`curation/patches.json`](curation/patches.json)).
6. **Deterministic build.** `scripts/merge.py` produces the three variants; `scripts/validate_fragment.py --strict-refs` and the JSON Schema both pass with 0 errors.

### Source mix (master)
574 wiki pages · 42 in-game texts (quoted dialogue and lore) · 10 YouTube lore videos · 6 official forum posts · 2 patch notes · 2 official sites · 3 books/comics · 19 other (news and guides).

### Known limitations
* AI-assisted compilation. Two independent verification passes and two external audits ran over the graph, but errors can remain. **Please report them** (see below).
* YouTube rate-limited transcript access, so only about 25 lore videos were mined. The graph rests mainly on wiki pages that quote in-game text.
* Summaries paraphrase their sources. Exact in-game wording appears only in the `locator` quotes.
* `era` buckets and `story_order` numbers are modelling conventions, not in-world dates. `chronology.in_world_year` is filled only where a source gives a year.
* Thin leagues (Ambush, Nemesis, Archnemesis, Sentinel …) carry little narrative in any source, so they appear only as release containers.

## Update policy
Updates are planned for **PoE2 1.0 (11 Dec 2026)**, when the datamined Act 5–6 nodes will be replaced with released content, and after major league launches. Versions follow semver: a minor version adds or corrects content, and a major version breaks the schema.

## Licence
The dataset is derived in part from community-wiki text licensed **CC BY-NC-SA 3.0**, so it is released under **[CC BY-NC-SA 3.0](LICENSE)**: attribution, non-commercial, share-alike. Code is MIT (see the repository root).
*Path of Exile* is a trademark of Grinding Gear Games. This is a fan project, not affiliated with or endorsed by Grinding Gear Games.

## Citation
See [`../CITATION.cff`](../CITATION.cff). Suggested: *Tekaya, N. (2026). Graph of Exile: a sourced knowledge graph of Path of Exile lore (v1.0.0).*

## Corrections & contributions
Open an issue with the node or edge `id`, what is wrong and a source. Fixes go into `curation/patches.json`, or into a new fragment under `fragments/`, so that every change stays reviewable and reproducible.
