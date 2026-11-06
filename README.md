<p align="center">
  <img src="logo/goe_emblem.png" alt="Graph of Exile" width="620">
</p>

<p align="center">
  A sourced knowledge graph of Path of Exile lore, centred on the Exile.<br>
  <a href="https://tekayanidham.github.io/graph_of_exile/"><b>Explorer</b></a> ·
  <a href="dataset/"><b>Dataset</b></a> ·
  <a href="dataset/schema/SCHEMA.md">Schema</a> ·
  <a href="https://github.com/TekayaNidham/graph_of_exile/releases">Downloads</a> ·
  <a href="CONTRIBUTING.md">Contribute</a>
</p>

---

> **Alpha release (v0.1.0-alpha).** Path of Exile 2 is still before its 1.0 release, which is planned for 11 December 2026. The 17 entries tagged `datamined_pre_1.0` come from game-file datamines of the unreleased Acts 5–6. They will be replaced with the released lore once 1.0 is out. The graph was compiled with AI assistance from community wikis, in-game text and lore videos, then cross-checked several times, but it will still contain gaps and mistakes. [Corrections are very welcome.](#contributing)

<p align="center">
  <img src="docs/img/explorer_story.jpg" alt="Story mode: who and where for each beat of the Exile's journey" width="49%">
  <img src="docs/img/explorer_prologue.jpg" alt="Choose your Exile: the Witch's sentence" width="49%">
  <img src="docs/img/explorer_follow_faction.jpg" alt="Following the Vaal as their own plot" width="49%">
  <img src="docs/img/explorer_timeline.jpg" alt="Timeline: eras left to right, swimlanes by kind" width="49%">
</p>

## What it is

Graph of Exile maps the lore of Path of Exile 1 and 2 as a graph. It covers the primordial gods and the Precursors, the Vaal, the Eternal Empire, both campaigns, the Atlas wars, the PoE2 endgame and every league storyline, including Breach, Ritual, Delve, Kingsmarch, and the Twilight Order and its Edicts. Every node and every edge cites its sources.

It comes in two parts:

- **[The dataset](dataset/)** is open data for the community to analyse, visualise and build on.
- **[The explorer](https://tekayanidham.github.io/graph_of_exile/)** is an interactive map of the dataset. You can play the story through it.

## The dataset

| Version | Nodes | Edges | Sources | Contents |
|---|---:|---:|---:|---|
| [Master](dataset/master/) | 1,433 | 4,268 | 665 | The whole saga, including the PoE1 → PoE2 continuity |
| [PoE1](dataset/poe1/) | 1,035 | 3,031 | 549 | Only what appears in Path of Exile 1 |
| [PoE2](dataset/poe2/) | 604 | 1,657 | 319 | Only what appears in Path of Exile 2 |

**Formats:** JSON, CSV and GraphML (for Gephi, networkx, Cytoscape and Neo4j), plus a JSON Schema.

**Each node carries:**
- `type`: character, deity, faction, location, event, artifact, concept and more
- `plot_role`: `main_plot`, `endgame_plot`, `branch`, `background` or `meta`
- `branches`: 70 league and side-story tags, such as `breach`, `ritual`, `kingsmarch` and `twilight_order`
- `era`: one chronological axis, from the primordial age to the PoE2 endgame
- `games`, `canon_status`, `confidence` and `release_status`
- **sources:** each with a locator (wiki section, quoted dialogue or video timestamp) and a reliability grade

**The Exile's journey:** a `next_beat` chain runs through 66 PoE1 beats and 61 PoE2 beats. Every beat is linked to who was involved and where it happened.

**Provenance:** the graph is merged from 34 research fragments, each checked by an independent pass. Two further audits by a second model followed. Every correction is reproducible from [`dataset/curation/`](dataset/curation/), with the reason recorded.

```python
import json
g = json.load(open("dataset/master/graph.json"))
kitava = next(n for n in g["nodes"] if n["id"] == "deity_kitava")
print(kitava["summary"], [s["source_id"] for s in kitava["sources"]])
```

The [dataset card](dataset/README.md) covers the full data model, quickstarts (Python, networkx, pandas, JavaScript, Gephi), methodology and known limitations.

## The explorer

<https://tekayanidham.github.io/graph_of_exile/> is a static site with no installation. To run it locally: `python3 -m http.server -d explorer 8000`.

- **Saga:** the story in order, from before the Exile, through PoE1, twenty years later, to PoE2, with the people and places of each beat beside it.
- **Play:** step through the Exile's journey. Story cards show who is involved and where, with sources, and a trail follows the Exile from place to place.
- **Choose your Exile:** pick a class to read its sentence (Dominus in PoE1, Count Geonor in PoE2) and its own words, quoted from the class pages.
- **Follow any plot:** any faction, god or character, such as the Vaal, the Karui, the Eternal Empire or the Twilight Order, becomes its own playable timeline.
- **How are they connected?** Traces the shortest path between two entities, optionally avoiding the Exile.
- **Six layouts:** Saga, Web, Timeline (eras by swimlane), Radial, Clusters, and a live re-flow of what is visible.
- **Encodings and filters:** colour by role, era, type, community, confidence or game; size by PageRank, betweenness or degree; filter by role, era, type, league, relation and trust.
- **Navigation:** shareable deep links, keyboard shortcuts (press `?`), a minimap and recentering (`C`).

## Contributing

This is a first alpha and I am sure I have missed things: lore, characters, whole storylines, or details I got wrong. If you know Path of Exile lore, your help is genuinely welcome, whether it is one wrong name or a whole league.

- **Found a mistake or something missing?** [Open an issue](https://github.com/TekayaNidham/graph_of_exile/issues/new/choose). Name the node or edge `id`, say what is wrong or missing, and add a source (wiki page, quest dialogue or video timestamp).
- **Want to fix it yourself?** Read [CONTRIBUTING.md](CONTRIBUTING.md). In short: never edit `dataset/master|poe1|poe2` directly. Add or change a fragment in `dataset/fragments/` or a patch in `dataset/curation/`, give every claim a source, run the validator, and keep one topic per pull request.
- **No coding needed:** reporting gaps, checking existing entries against the game, and suggesting sources all help just as much.

## Repository layout

```
dataset/        the dataset: master/ poe1/ poe2/, schema/, extras/, fragments/ (provenance), curation/ (patches)
explorer/       the web explorer (GitHub Pages)
scripts/        pipeline: corpus download, validation, merge, stats, site build
verification/   fact-check reports, model audits, merge report
docs/           build plan, canonical id list, screenshots
```

To rebuild from the fragments:

```bash
python3 -m venv .venv && .venv/bin/pip install networkx numpy scipy jsonschema
.venv/bin/python scripts/merge.py && .venv/bin/python scripts/stats.py && .venv/bin/python scripts/build_site.py
for v in master poe1 poe2; do python3 scripts/validate_fragment.py dataset/$v/graph.json --strict-refs; done
```

## Credits

- **[Grinding Gear Games](https://www.grindinggear.com)** created Path of Exile and Path of Exile 2: the world of Wraeclast, its characters, its history, and every line of lore this project maps. All of that is theirs. This project only organises it. The in-game dialogue, item flavour text and official announcements quoted in the sources are their work.
- **The community wikis:** the editors of [poewiki.net](https://www.poewiki.net) and [poe2wiki.net](https://www.poe2wiki.net). Their pages are the backbone of the dataset.
- **Game-data databases:** [poedb.tw](https://poedb.tw) and [poe2db.tw](https://poe2db.tw), for dialogue and datamined content.
- **Lore creators** whose videos are cited as sources: Kitten Cat Noodle, Gavryn, Lore Of Exile, Talkative Tri, Whispers From Wraeclast and PhoenixDash. The `sources.json` files link each video.
- **Open-source tools:** [Cytoscape.js](https://js.cytoscape.org), [NetworkX](https://networkx.org), and the fonts [Cinzel](https://fonts.google.com/specimen/Cinzel) and [Crimson Pro](https://fonts.google.com/specimen/Crimson+Pro).

## License

- **Dataset:** [CC BY-NC-SA 3.0](dataset/LICENSE), because it adapts text from the community wikis. Attribution, non-commercial use and share-alike apply.
- **Code:** [MIT](LICENSE).
- **Logo:** not covered by either licence.
- **Trademark and affiliation:** *Path of Exile* and *Path of Exile 2* are trademarks of Grinding Gear Games. Graph of Exile is an unofficial fan project, not affiliated with or endorsed by Grinding Gear Games. Game content belongs to its owners and is referenced here for non-commercial, educational and community purposes.
- **Citation:** see [CITATION.cff](CITATION.cff).

Created by Nidham Tekaya.
