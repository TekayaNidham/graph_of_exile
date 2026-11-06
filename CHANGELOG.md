# Changelog

## v1.0.0 — 2026-11-06 — first public release
* Dataset: Master (1,433 nodes / 4,268 edges / 665 sources), PoE1 (1,035 / 3,031) and PoE2 (604 / 1,657) variants in JSON, CSV, GraphML + JSON Schema.
* Exile journey spine: 66 PoE1 beats, 61 PoE2 beats (`next_beat`, with `ordering` required / any_order / provisional).
* 34 provenance fragments (15 research domains, 7 gap-fill, 6 journey enrichment, 4 faction membership, curation); all 695 wiki source URLs checked against the wiki API (25 repaired).
* PoE2 treated as the continuation of PoE1: era `league_storylines` (was `poe1_leagues`), shared game labels for same entities, game views are strict (the other game is masked); master keeps the continuity.
* `dataset/extras/exile_profiles.json`: each class's sentence and own words, quoted from the class pages.; per-domain verification reports; two independent Codex audits (72 + 48 issues) applied via `dataset/curation/`.
* 17 PoE2 Act 5–6 nodes marked `datamined_pre_1.0` — to be revised after PoE2 1.0 (2026-12-11).
* Every journey beat linked to its characters and location (123/127 and 125/127; the gaps are datamined Act 5 beats).
* Web explorer (GitHub Pages): Saga layout (the story in order), follow any faction/god/character as its own playable plot, choose your Exile and read your sentence, recenter, improved path tracing; entity-first view (events as shared-event links, toggleable), place-to-place story trail, 5 layouts, story playback with story cards, PageRank/betweenness/community encodings, path tracing, minimap, deep links.
