You are an independent auditor of a Path of Exile (PoE1 + PoE2) lore knowledge graph built by other AI agents. Project root: current directory.
Files: build/master/nodes.json, build/master/edges.json, build/master/sources.json (schema: docs/SCHEMA.md). Local evidence corpus: data/raw/poewiki/*.wiki, data/raw/poe2wiki/*.wiki, data/raw/poewiki_extra, data/raw/poe2wiki_extra (wikitext), data/raw/youtube/transcripts/*.txt.

Audit for:
1. FACTUAL ERRORS in node summaries and edge claims (wrong person did X, wrong act, wrong relation, reversed direction source->target, invented facts). Check against the corpus with grep; only flag when you have evidence or strong certainty.
2. CHRONOLOGY: era labels (see ERAS order in scripts/validate_fragment.py) that are clearly wrong; story_order on spine beats (chronology.story_order) out of order vs the real campaign sequence; next_beat chains that skip or loop.
3. LABELS: plot_role wrong (e.g. league content labelled main_plot, campaign boss labelled branch), games wrong (entity marked poe2 that never appears in PoE2 or vice versa), branches wrong.
4. DUPLICATES: two node ids that are the same entity (give canonical id to keep).
5. MAJOR MISSING LORE: important characters/events/relations absent (list them, no need to write them).

Write your findings as JSON to verify/codex_audit.json:
{"issues":[{"target":"<node or edge id>","kind":"node|edge|duplicate|missing|chronology","severity":"high|medium|low","problem":"...","fix":"concrete correction (field: new value) or ids to merge","evidence":"file:line or quote"}]}
Be thorough: go through ALL main_plot and endgame_plot nodes and edges, and sample heavily from branch/background. Do NOT modify any other file.
