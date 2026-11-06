Second-round independent audit of a Path of Exile lore knowledge graph (PoE1+PoE2). Root: current dir. Graph: build/master/{nodes,edges,sources}.json (schema docs/SCHEMA.md). Curation already applied: docs/patches.json and docs/id_aliases.json (read them; do NOT re-report items already fixed there, and note the rejected item). First-round audit: verify/codex_audit.json.
Evidence corpus: data/raw/poewiki, poe2wiki, poewiki_extra, poe2wiki_extra (*.wiki), data/raw/youtube/transcripts.
Focus this round on:
1. The exile spine: edges with relation next_beat (ordered by sequence) for poe1 and poe2. Is every beat on the critical path (not optional)? Are main-story quests missing between beats (especially PoE1 Acts 7, 8, 9 which look thin, and PoE2 Acts 1-4)? Is the order right?
2. Nodes added in gap-fill fragments (field domains contains a value starting with "gap_"): check their facts against the corpus.
3. The Twilight Order / Edicts nodes (grep edict, twilight) and Kingsmarch, Breach, Ritual nodes: factual check.
4. Any remaining duplicates or wrong games/plot_role labels.
Nodes with release_status "datamined_pre_1.0" are intentionally kept (PoE2 1.0 releases 2026-12-11); only check they are labelled consistently.
Write verify/codex_audit2.json in the same format as round 1: {"issues":[{"target","kind","severity","problem","fix","evidence"}]}. Include for missing spine beats the exact quest name, act, and corpus file:line. Do not modify other files.
