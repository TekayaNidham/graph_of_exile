# Graph of Exile — Dataset Schema (v1)

One canonical **master graph** (`dataset/master/`) is the single source of truth.
The three requested variants are *derived views*:

| Variant | File prefix | Contents |
|---|---|---|
| PoE1 plot | `dataset/poe1/` | nodes/edges with `"poe1"` in `games` (+ deep-history background needed to explain them) |
| PoE2 plot | `dataset/poe2/` | nodes/edges with `"poe2"` in `games` (+ deep-history background) |
| Master plot | `dataset/master/` | everything, incl. continuity edges linking PoE1 → PoE2 |

Every variant folder contains `nodes.json`, `edges.json`, `sources.json`, `graph.json` (all three in one file), `graph.graphml`, `nodes.csv`, `edges.csv`. In CSV and GraphML, list/object fields are JSON-encoded strings.

## Fragment format (provenance)

`dataset/fragments/<domain>.json` — one per research domain, merged by `scripts/merge.py`:
```json
{ "domain": "<domain key>", "sources": [Source...], "nodes": [Node...], "edges": [Edge...] }
```

## Node
```json
{
  "id": "char_kitava",                 // REQUIRED. prefix_snake_case, see ID rules
  "name": "Kitava",                     // REQUIRED display name
  "aliases": ["The Cannibal King", "Kitava, the Insatiable"],
  "type": "character",                  // REQUIRED, see Node types
  "subtype": "primordial_god",          // optional free text
  "summary": "1-3 sentence factual summary.",           // REQUIRED
  "games": ["poe1", "poe2"],            // REQUIRED. where it APPEARS or is MENTIONED in-game. [] allowed only for out-of-game lore (books, dev interviews)
  "plot_role": "main_plot",             // REQUIRED, see Plot roles
  "branches": ["breach"],               // league / side-content tags (controlled list below). [] for none
  "era": "poe1_campaign",               // REQUIRED, see Eras
  "chronology": {
    "in_world_year": null,              // number if known (Imperial calendar IC / relative), else null
    "relative": "c. 1000 years before PoE1",   // free text
    "story_order": null                 // integer ONLY for exile-journey beats (see Main plot spine)
  },
  "acts": ["poe1_act6"],                // act ids if tied to campaign acts, else []
  "canon_status": "canon",              // canon | dev_statement | inferred | community_theory
  "confidence": "high",                 // high | medium | low
  "sources": [ {"source_id": "src_poewiki_kitava", "locator": "section 'History' / [12:31] / quote: \"...\""} ]  // REQUIRED, >=1
}
```

### Node types
`character` (mortal/immortal persons, incl. NPCs, bosses), `deity` (gods, primordials, Beast-like entities),
`faction` (orders, empires, tribes, syndicates, guilds), `location` (continents, cities, areas, planes),
`event` (battles, cataclysms, plot beats, rituals), `artifact` (named items, relics, devices),
`concept` (corruption, Beast, Atlas, edicts-as-laws, magic systems, calendars), `era` (an age/period),
`league` (a league/expansion as a release container), `act` (campaign act), `text` (in-game document / book / journal / edict text),
`creature` (non-individual monster races: Breachspawn, Kalguuran dead, etc.)

### Plot roles (the label the user asked for)
- `main_plot` — the Exile's critical-path story (campaign acts, main antagonists, epilogue, PoE2 campaign) and the endgame "story arc" bosses the Exile must defeat (Shaper, Elder, Sirus, Maven, Exarch, Eater, PoE2 Arbiter etc. → use `endgame_plot`, see below)
- `endgame_plot` — Atlas storyline (PoE1 Atlas / PoE2 Atlas of Worlds) — main progression after campaign
- `branch` — league / side-mechanic storyline (Breach, Ritual, Kingsmarch, Delve, …). Always has `branches` non-empty
- `background` — deep history / worldbuilding that explains the plot but the Exile does not directly live through (Precursors, Vaal, Eternal Empire …)
- `meta` — out-of-world facts (league release, act container, source text)

### Eras (chronological buckets, in order)
`primordial` (before mortals: gods, Beast, Precursor-era cosmology) → `precursor` → `azmeri_ezomyte_ancient` → `vaal` (Vaal civilisation up to Vaal Cataclysm) → `post_vaal_dark_age` → `eternal_empire_rise` → `eternal_empire_fall` (Chitus/Malachai/Cataclysm ~300 yrs before PoE1) → `post_cataclysm` (the 250-ish years until PoE1; Theocracy of Oriath) → `poe1_campaign` (Acts 1-10, Epilogue) → `poe1_atlas` (Shaper/Elder/Sirus/Maven/Exarch/Eater) → `poe1_leagues` (league stories occurring alongside PoE1) → `interlude_between_games` (~20 years) → `poe2_campaign` → `poe2_endgame` → `unknown`

### Branch tags (controlled; add new snake_case tags only when needed)
breach, legion, abyss, delve, incursion, betrayal, synthesis, blight, metamorph, delirium, harvest, heist, ritual, ultimatum, expedition, scourge, archnemesis, sentinel, kalandra, sanctum, crucible, ancestor, affliction, necropolis, kingsmarch (Settlers of Kalguur), mercenaries, phrecia, secrets_of_the_atlas, keepers_of_the_flame, labyrinth, bestiary, essence, harbinger, prophecy, perandus, torment, tempest, warbands, talisman, domination, nemesis, beyond, invasion, ambush, rampage, bloodlines, anarchy, onslaught, strongbox, shrine, abyssal_depths, conquerors, elder_shaper, atlas, trial_of_chaos (PoE2 Trialmaster), trial_of_sekhemas, delirium, pantheon, twilight_order, poe2_abyss, rogue_exiles, master_missions, forsaken_masters

## Edge
```json
{
  "id": "e_char_exile_poe1__kills__char_kitava__act10",   // REQUIRED, unique
  "source": "char_exile_poe1",          // REQUIRED node id
  "target": "char_kitava",              // REQUIRED node id
  "relation": "defeats",                // REQUIRED, controlled vocabulary below
  "description": "In Act 10 the Exile defeats Kitava in the Feeding Trough.",
  "games": ["poe1"], "plot_role": "main_plot", "branches": [], "era": "poe1_campaign",
  "sequence": null,                     // integer for main-plot spine edges (exile journey ordering)
  "canon_status": "canon", "confidence": "high",
  "sources": [ {"source_id": "...", "locator": "..."} ]
}
```

### Relation vocabulary
Character/agency: `defeats`, `kills`, `imprisons`, `frees`, `resurrects`, `corrupts`, `betrays`, `allies_with`, `opposes`, `serves`, `commands`, `leads`, `member_of`, `founded`, `created`, `destroyed`, `worships`, `sacrifices`, `possesses`, `wields`, `seeks`, `guides` (quest-giver/mentor), `rescues`, `exiles`, `rules`, `succeeded_by`, `transforms_into`, `aspect_of`, `same_entity_as`, `reincarnation_of`
Kinship: `parent_of`, `sibling_of`, `spouse_of`, `lover_of`, `descendant_of`, `student_of`
Spatial: `located_in`, `occurs_in`, `originates_from`, `travels_to`, `part_of`
Narrative/causal: `causes`, `leads_to`, `precedes` (chronological), `participates_in`, `witnesses`, `reveals`, `mentions` (text→entity), `introduced_in` (entity→league/act), `associated_with` (last resort), `continues_in` (PoE1 → PoE2 continuity)
Spine: `next_beat` (exile journey: beat_n → beat_n+1, carries `sequence`)

## Main plot spine
The Exile is the centre. Nodes `char_exile_poe1` and `char_exile_poe2` (two different protagonists) both link to `concept_exile` (exile as archetype).
Each campaign / endgame story beat is an `event` node with `plot_role: main_plot|endgame_plot`, `chronology.story_order` = integer,
connected `char_exile_* -[participates_in]-> event` and `event -[next_beat]-> event` (edge `sequence` = source order).
Order key spaces: PoE1 campaign 1000-1999 (act*100 + n), PoE1 epilogue 2000s, PoE1 Atlas 3000-3999, PoE2 campaign 5000-5999 (act*100+n, interludes 5500s), PoE2 endgame 6000s.

## Source
```json
{ "id": "src_poewiki_kitava", "title": "Kitava — PoE Wiki", "url": "https://www.poewiki.net/wiki/Kitava",
  "type": "wiki | official_site | patch_notes | forum_post | youtube | book | in_game_text | dev_interview | reddit | fandom | other",
  "author_or_channel": "community wiki", "accessed": "2026-11-05", "reliability": "primary | secondary | tertiary" }
```
Reliability: `primary` = in-game text/dialogue, official GGG publications, dev statements; `secondary` = curated wikis quoting primary; `tertiary` = YouTube lore videos, Reddit, fan theories.
Source ids: `src_poewiki_<page>`, `src_poe2wiki_<page>`, `src_yt_<videoid>`, `src_ggg_<slug>`, `src_book_<slug>`, `src_reddit_<slug>`.

## ID rules
Prefix by type: `char_`, `deity_`, `faction_`, `loc_`, `event_`, `artifact_`, `concept_`, `era_`, `league_`, `act_`, `text_`, `creature_`.
Body = lowercase ascii snake_case of the most common English name, no articles: `char_atziri`, `deity_kitava`, `faction_vaal`, `loc_oriath`, `league_breach`, `act_poe1_act6`, `act_poe2_act1`.
Gods/primordials use `deity_` (e.g. `deity_kitava`, `deity_arakaali`, `deity_beast`). Events: `event_<short_slug>` (e.g. `event_vaal_cataclysm`, `event_poe1_a10_kill_kitava`).
See `docs/CANONICAL_IDS.md` for pre-assigned ids shared by all research domains.

## Fields added at merge time (released dataset only)

Nodes:
| field | meaning |
|---|---|
| `eras` | every era any source placed the entity in; `era` is the earliest (its origin) |
| `plot_roles` | every plot role assigned; `plot_role` is the most central (main > endgame > branch > background > meta) |
| `domains` | research fragments that contributed the record (provenance) |
| `alt_summaries` | differing summaries from other fragments, kept rather than discarded |
| `release_status` | `released`, or `datamined_pre_1.0` for unreleased PoE2 Acts 5–6 content (will be revised after PoE2 1.0, 11 Dec 2026) |
| `chronology.parallel_group` | beats that may be completed in any order share a group id |
| `curation` | reasons for manual/audit corrections applied from `dataset/curation/patches.json` |
| `degree`, `exile_distance`, `distance_from_char_exile_poe1/2`, `is_spine` | computed graph metrics (hops from the Exile, on undirected graph) |

Edges:
| field | meaning |
|---|---|
| `ordering` (spine only) | `required` (fixed order), `any_order` (parallel quests), `provisional` (datamined) |
| `domains`, `curation` | as for nodes |

Spine (`next_beat`) edges are regenerated deterministically from `chronology.story_order` of `main_plot`/`endgame_plot` events: PoE1 1000–3999 (campaign → epilogue → Atlas) and PoE2 5000–6999 (campaign → interludes → endgame).

## Curation layer
* `dataset/curation/id_aliases.json` — `{"duplicate_id": "canonical_id"}` merges applied before anything else.
* `dataset/curation/patches.json` — field corrections, edge removals/rewrites, optional side-quest list, release-status overrides; every operation carries a `reason` (most come from the two Codex audits in `verification/`). Rejected audit items are listed under `rejected_audit_items` with the counter-evidence.
