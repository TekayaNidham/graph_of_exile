# Graph of Exile — Build Plan

Goal: a sourced, labelled lore knowledge graph of Path of Exile, centred on the Exile, in three views (PoE1, PoE2, Master).

## Phase 0 — Corpus (done inline)
- `data/raw/poewiki/` — wikitext of ~460 PoE1 wiki pages (Category: Lore, NPCs, Quests, Leagues, Acts, Bosses, Gods, Factions, Encounters)
- `data/raw/poe2wiki/` — ~160 PoE2 wiki pages (Lore, NPCs, Quests, Leagues, Acts, Bosses, Landmarks)
- `data/raw/youtube/` — candidate lore videos (`priority.tsv`, 161 videos from Kitten Cat Noodle, Gavryn, Lore Of Exile, Talkative Tri, Doctorates of the Absurd, …) + transcripts (fetched slowly, YouTube rate-limits)
- Live web (WebSearch/WebFetch): poewiki.net, poe2wiki.net, pathofexile.com announcements/patch notes, forum, Reddit lore threads, dev interviews

## Phase 1 — Research fan-out (15 domain agents, parallel)
Each writes `dataset/fragments/<domain>.json` per `dataset/schema/SCHEMA.md`, using `docs/CANONICAL_IDS.md`, and self-validates with `scripts/validate_fragment.py`.

## Phase 2 — Independent verification + readjust (per domain, pipelined)
A fresh agent re-checks every node/edge of a fragment against sources (wiki text, web), fixes errors in place, lowers confidence / re-labels speculation, logs changes to `verification/<domain>_report.md`.

## Phase 3 — Merge (deterministic script)
`scripts/merge.py`: union fragments, resolve duplicate ids / aliases, merge sources, check dangling references, build spine, emit 3 views (JSON, CSV, GraphML) into `dataset/`.

## Phase 4 — Cross-check (Codex + completeness critic)
- Codex independent audit of the merged graph (chronology, contradictions, mislabelled plot_role/games).
- Completeness critic: what major lore is missing? → targeted gap-fill agents.

## Phase 5 — Re-verify & finalize
Second verification of gap-fill + Codex corrections, re-merge, final stats & validation report (`dataset/STATS.md`).
