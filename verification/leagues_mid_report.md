# Fact-check report: leagues_mid (PoE1 leagues 2019-2022 branch lore)

Checked by: fact-checker subagent (claude-haiku-5-5), 2026-11-06.
Fragment: `staging/leagues_mid.json`. Backup of the pre-check version: `scripts/tmp_leagues_mid_before_verify.json`.
Result: validator reports **0 errors**, 122 warnings (all are references to ids owned by other domains, e.g. `char_exile_poe1`, `char_venarius`, `char_dominus`).
Counts: before 117 nodes / 255 edges / 53 sources; after 119 nodes / 251 edges / 62 sources.

## What was checked and how

- **Local corpus**: `data/raw/poewiki` and `data/raw/poe2wiki` (grep and read), plus `data/raw/youtube/transcripts/3yLajHc4gA8.txt`.
- **Pages missing from the local corpus** were fetched as raw wikitext (`action=raw`) into the scratchpad. Cited pages include Cavas, Sister Cassia, Oshabi, Tane Octavius, Venarius, The Trialmaster, Dannig, Rog, Tujen, Gwennen, Faustus, Kurai, Karst, Tibbs, Isla, Tullina, Niles, Nenet, Vinderi, Huck, Adiyah, Gianna, Olroth, Medved, Vorana, Uhtred, Strange Voice, and the PoE2 Dark Mists, Ominous Altars, Grand Expedition, Runes of Aldur, Forbidden Rites, Aldur, Farrow, Legacy of the Maji and Trial of Chaos pages. Some poewiki fetches were rate-limited (HTTP 429) and retried with pacing.
- **Not retrievable**: the GGG forum thread 3106179 (Cloudflare block). The Chaos quote was checked through the wiki's Chaos (lore) page, which quotes it. Both YouTube transcripts for the heist videos (`EWkMFZSh8pM`, `evAoWgn-B3g`) are not on disk and could not be fetched in this run. Their claims were removed rather than kept on title-only evidence.
- Every node and edge was read against its locator. Dates and league facts were checked against infoboxes (for example Metamorph 2019-12-13 to 2020-03-09, Ritual 2021-01-15 to 2021-04-12).

## Main corrections

### Wrong direction or wrong relation
- `league_poe2_forbidden_rites -continues_in-> league_ritual` reversed to `league_ritual -continues_in-> league_poe2_forbidden_rites` (PoE1 mechanic continues into PoE2).
- `league_poe2_runes_of_aldur -continues_in-> league_expedition` reversed to `league_expedition -continues_in-> league_poe2_runes_of_aldur`.
- `faction_order_of_the_djinn betrays char_kalandra` changed to `associated_with`. Etching VI says the Order discovered her and promised to free her; it does not say they betrayed her.
- `deity_tangmazu reveals char_exile_poe2` changed to `char_exile_poe2 witnesses deity_tangmazu` (PoE2 Dark Mists: freeing Freya reveals Tangmazu to the exile).
- `char_kalandra opposes char_administrator_qotra` changed to `associated_with` (lake commentary only).
- `deity_tangmazu opposes deity_lunaris` changed to `associated_with` (the wiki says Tangmazu set the two sisters against each other).
- Several `member_of` / `allies_with` / `guides` relations downgraded where the source only supports weaker ties: Sister Cassia (former Templar, now `associated_with`), Oshabi (exile of the Azmeri, duplicate `member_of` deleted), Faustus (vendor, `associated_with`), the hireable rogues other than Karst and Huck (`associated_with` the Ring), the Ring as the exile's ally (`associated_with`), Cassia's pump (`associated_with`, she places it and builds towers).

### Unsupported claims deleted
- `char_venarius associated_with deity_chaos`. The Chaos page mentions Venarius only as the enslaver in one alternate timeline.
- `concept_fragmented_memory reveals char_malachai`.
- `char_dominus exiles char_tane` (low-confidence inference, no source support).
- `char_oshabi member_of faction_azmeri` (duplicate of `faction_azmeri exiles char_oshabi`, which stays).
- `char_isla serves char_venarius` (the cited History section does not mention Isla) and `char_isla associated_with artifact_sentinels` (Recombinator is not a Sentinel).
- `char_administrator_qotra associated_with faction_the_ring` and `faction_the_crimson_scribe associated_with faction_the_ring` (Qotra and the Crimson Scribe are only heist contract clients).
- `char_aldur created artifact_triskelion_flame` (PoE2 Aldur page: the Runefathers forged it; the edge is kept as `faction_runefathers created`).
- `faction_druids_of_the_broken_circle associated_with deity_hinekora` (not in the cited section).
- Two YouTube title-only sources (`EWkMFZSh8pM`, `evAoWgn-B3g`). The heist unlock chain is now sourced to the rogue wiki pages, which state each unlock explicitly.

### Node text corrected
- `concept_blightheart`: removed the claim that the Winged Blight scarab says it still exists (not in the wiki). It is now an inferred, medium-confidence concept.
- `char_the_boss_of_the_ring`: now canon, low confidence (the in-game dialogue refers to "the Boss", identity unknown). Its source is Kurai's dialogue, not a title-only video.
- `char_adiyah`: removed the unsupported "Maraketh outcast / tattoos / pariahs" text. The Adiyah page says she is a Maraketh warrior, and her sister Nashta is the Heist boss.
- `char_faustus`: removed the unsupported "Faustus, the Financier" alias and currency-exchange role.
- `char_karst`, `char_tibbs`, `char_huck`, `char_niles`, `char_vinderi`, `char_gianna`, `char_tullina`, `char_nenet`, `char_isla`: summaries rewritten to the facts in the rogue pages. Removed the invented "Opal's Jewels", "Viridi's Finger", "Contract: The Vinderi Bomb", "Blackguard" and "poker table" details.
- `char_the_trialmaster`: removed the unsourced "antagonist but not an enemy" quote and the "thousands-year-old" age.
- `char_kalandra`: removed the invented "older than gods", "Einhar visited" (Einhar appears only in Atziri's lore as a comparison) and "Reflecting Mists in 3.25" claims.
- `loc_lake_of_kalandra`, `artifact_mirror_of_kalandra`, `char_evilandra`, `text_ancient_etchings`: removed the unsupported "Reflecting Mists", "duplicates map bosses", "etching VIII" and "duplicates an item" claims.
- `league_expedition`: removed "added to core in 3.16.0" (not in the wiki).
- `league_sentinel`, `artifact_sentinels`: corrected the Power Core / Recombinator roles and the 3.25 core date.
- `char_king_cadigan_the_third`: removed the "c. 400 BIC" date (not in the History page).
- `char_the_king_in_the_mists`: Aoife's line corrected (she recalls being drawn to him; she does not say he deceived her).
- `char_oshabi_avatar_of_the_grove`: boss trigger corrected (a Sacred Blossom map fragment in the Map Device; the Heart of the Grove is the separate challenge).
- `faction_the_ring`: games set to `poe1` only (no PoE2 evidence in the corpus). Count Geonor's "contracts the Ring" kept as an edge. The "PoE2 lore" claim was removed.
- `char_olroth`, `char_medved`, `char_vorana`, `char_uhtred`, `event_priesthood_conspiracy`: rewritten to the History page (twelve priests, 71 wounds, Vorana killed all twelve).
- `char_nenet`: the questline was never released (the Book of Jamanra), stated as such.
- `loc_middengard`: "south-east of Wraeclast" per the Kalguur page.
- `char_rog`, `char_tujen`, `char_gwennen`, `char_dannig`: aliases corrected to the Kalguur page's nicknames (the earlier aliases contained descriptions).

### Edge sources and descriptions corrected
- Expedition boss defeats (`char_exile_poe1 defeats` Olroth, Medved, Vorana, Uhtred) now cite the History "Aftermath" section and the Olroth boss page, not the league's unique-item list.
- PoE2 Grand Expedition defeats/guides (Olroth, Medved, Vorana, Uhtred, Gwennen) are downgraded to **low** confidence. The wiki's quest-step text for them is inside an HTML comment (`<!-- -->`).
- `char_dannig guides char_exile_poe2` era corrected to `poe2_campaign` (Dark Mists is Act 4).
- `char_the_trialmaster`: PoE1 defeat cites the "As a boss" section.
- `char_the_last_to_die` guides: corrected to "appears from The Coast and gives the exile the Blood Crucible".
- `char_kalandra witnesses char_the_clayshaper` and `char_kalandra witnesses faction_kalguuran` changed to `associated_with`.
- `faction_order_of_the_djinn` founder edges: added `faction_maraketh founded faction_order_of_the_djinn` (the Order page names both founders).
- `char_king_cadigan rules loc_kalguur`, `char_aldur founded faction_kalguuran` and `faction_kalguuran associated_with loc_kingsmarch` source/relation corrected (Kingsmarch is "seek to develop", not founded).
- `char_isla serves char_dominus` kept as medium confidence, sourced to the Isla page.
- `char_nenet member_of faction_faridun` kept (the History Jamanra section calls Nenet a Faridun).
- Hinekora `serves` Order raised to canon/medium (Chaos (lore) page: "as a servant of Order").

### Additions (sourced)
- `concept_heart_of_the_grove` (new concept node) with `char_oshabi transforms_into concept_heart_of_the_grove` and `concept_heart_of_the_grove leads_to char_oshabi_avatar_of_the_grove`. Sources: Harvest league and Oshabi pages.
- `char_nashta` (new heist character, sister of Adiyah, Maraketh) with `char_adiyah sibling_of char_nashta`, `char_nashta member_of faction_maraketh`, `char_exile_poe1 defeats char_nashta`. Source: Adiyah page (Heart of Glory contract).
- The heist unlock chain `Tibbs -> Tullina -> Nenet`, `Karst -> Huck -> Niles -> Vinderi -> Gianna` is kept and now sourced to each rogue page ("To unlock X, run a contract with Y").
- Delirium: the Tangmazu–Delirium association is kept (canon, medium). It is sourced to the God and Strange Voice wiki pages. The YouTube video (`3yLajHc4gA8`, verified against its transcript) is cited only as a fan theory that Tangmazu is the league boss.

## Checked and left as is
- Synthesis: Cavas = Venarius (`same_entity_as`), Templar Laboratory memory, Memory Nexus bosses, Synthetes.
- Blight: Cassia guides and introduces the league, Dominus exiles Cassia, Piety replaces her, the Purification Pump, Innocence line.
- Metamorph: Tane guides, Tane kills and was apprentice to Lucan Octavius, Metamorph boss, Tane's laboratory, Tukohama and Piety lines.
- Harvest: Oshabi guides, Avatar of the Grove, Lifeforce named by Oshabi, Sacred Grove quest (Wild/Vivid/Primal).
- Heist: Rogue Harbour quest (Kurai, Karst, Adiyah, Faustus), Kurai's Ring dialogue, the Ring operating from the Harbour, Count Geonor contracting the Ring.
- Ritual: Ominous Altars (PoE2 King in the Mists, Freythorn), concept_ritual, Forbidden Rites.
- Ultimatum: Trialmaster = Ixchel, Chaos as master, Temple of Chaos near Utzaal, Trials of Chaos (PoE1 3.14, core 3.23; PoE2 Act 3, up to 10 trials), Yaomac, Atziri quote.
- Scourge: Last to Die, Blood Crucible and Nightmare, K'Tash, Ghorr and Beidat as Scourge bosses, Scourge monsters becoming the Beyond monsters.
- Expedition: Kalguur structure (Knights of the Sun, Druids, Black Scythe, Remembrancers, Order of the Chalice), First Kalguuran Expedition (Cadigan III), Priesthood conspiracy, Medved's challenge, Triskelion Flame loss, Lost Expedition quest (Act 6, Dannig), the four Expedition NPCs.
- Kalandra: Lake of Kalandra, Ancient Etchings, Mirror of Kalandra, Evilandra, Kalandra's reflections on Clayshaper / Tane / Last to Die / Tangmazu.
- Archnemesis (petrified monsters), Sentinel (Stalker, Apex, Pandemonium).
- PoE2 Runes of Aldur (2026-05-29, 0.5.0) and Forbidden Rites (2026-09-04, 0.5.5) dates.

## Remaining doubts and gaps
1. **Community-only claims kept**: `concept_lifeforce associated_with concept_wildwood_humours` (comm, low; the names match but the game does not state identity). `char_the_empty_eyed_fiend same_entity_as char_elder` (inferred, low; the Kalguur page links the Fiend to The Elder).
2. **PoE2 membership of the Ring** is unverified. `faction_the_ring` was reduced to PoE1; if PoE2 evidence exists, add it.
3. **Two-game entities**: `char_the_king_in_the_mists` merges the PoE1 Wildwood/Affliction boss (outside the 2019-2022 window) with the PoE2 Freythorn boss. This should probably be two nodes linked `same_entity_as` or split. Not changed.
4. **Edges outside the 2019-2022 scope** kept: Affliction-linked King in the Mists edges, the Kalandra/Expedition PoE2 items, and the 2026 PoE2 leagues. These are correct but belong to other domains' timelines.
5. **Coverage gaps** (not added, no time to source properly): Heist's Vox twins (Kurai's final contract), Nenet's unreleased Jamanra questline as its own node, Scourge's Blood Altar, Archnemesis narrative (there is none in the corpus), Sentinel narrative (none), Harvest's Sacred Blossom as an item, and the Delirium orbs/splinters as separate nodes.
6. **Source fetches**: the GGG forum post (3106179) could not be read directly (Cloudflare). The Chaos quote relies on the wiki's quotation. The PoE2 commented quest steps are kept only as low-confidence edges.
7. **Stale wording to watch**: several nodes still carry "Expedition league 'added to core'" style statements from other domains or are inherited from the earlier run; these were checked here only where they are in this fragment.

## Files
- Fragment (corrected): `staging/leagues_mid.json`
- Pre-check backup: `scripts/tmp_leagues_mid_before_verify.json`
- Fact-check scripts (temporary, kept for audit): `scripts/tmp_verify_leagues_mid_*.py`
- Fetched wiki raw pages used as evidence: `<local scratch>`
