# Fact-check report: gap_deep_history_vaal_precursor_eternal

Fragment: `staging/gap_deep_history_vaal_precursor_eternal.json`
Checked against: `data/raw/poewiki/*.wiki`, `data/raw/poe2wiki/*.wiki`, `data/raw/youtube/transcripts/*.txt`, and the existing master graph (`build/master/nodes.json`, `edges.json`, `sources.json`). Live API fetches were not needed because every cited page is in the corpus.

Validator result after edits: **0 errors**, 73 warnings. All warnings are "source node not defined in this file", which is expected because they point to existing master nodes.

## Duplicate check

- No fragment node id exists in `build/master/nodes.json`.
- No fragment node duplicates an existing master node by name or near-name. Searches covered Corruption, Cataclysm, Karui, Eternal Empire, Kastov, Medici, Letters, Guatelitzi, Hayoxi, Thesis, Ablation, Orb of Sacrifice, Stridevolf, and Cemetery.
- Every edge endpoint resolves either to a fragment node or to an existing master node. No dangling ids.
- Source ids: all 27 fragment sources are cited, and every cited source is defined in the fragment. Copies of the 15 sources already in master are kept, as the rules require.

## Verified as correct (no change)

- All PoE2 soul core quotes and effects: Citaqualotl's, Guatelitzi's Thesis, Jiquani's, Quipolatl's. Flavour text, drop level, 0.4.0 release.
- Guatelitzi's Ablation (Sacrifice 25% Life, Power Charge, Lineage Gems Vault in Atziri's Temple) and Hayoxi's Fulmination (7-second Annihilation trigger, flavour text).
- The four Orb of Sacrifice items: 0.5.4 release, Royal Trove drop after Atziri, Rare slot targets.
- Fate of the Vaal league: 0.4.0, launched 2025-12-12.
- The Beast page: Sin used the Seed of Corruption to create the Beast (paragraph 2); the exile killed the Beast about 20 years before PoE2 (paragraph 3); Count Geonor seeks its lingering powers.
- Karui Gods page: nine god headings match the fragment list; Kitava "God of Corruption" quote (Haku, Kaom dialogue).
- History of Wraeclast: Precursors "After mastering corruption..."; Precursor Weapon "to destroy corruption"; Temple of Atzoatl used for "worship of Corruption"; Vaal Cataclysm "also known as The Fall"; c. 400 BIC heading.
- Eternal Empire: Cataclysm ~1339 IC ended Voll's reign; "mutations and corruption"; Members list (Kastov, Medici Perandus).
- Purity Chronicles and Victario: Kastov among Voll's allies in 1333 IC; neither Victario nor Kastov turned undead or a ghost, unlike Voll, Ondar, Geofri and Adus.
- Letters of Exile: formula quote, 1597-1599 IC sentencing dates, Hillock (1599), Kraityn (1598), Maramoa (1597), Lothar (Templar authority), Ebony Legion counts, version 0.10.8.
- Environmental lore: Cemetery of the Eternals inscription "in life and death".
- Perandus family: Medici Perandus, Prefect to the Treasury, known only from the Signet flavour text.
- YouTube 1Zt4tv8fjI4 at [7:13]-[7:24] does contain the Hooded One / Precursor hint (auto-captions).

## Corrections made

Factual errors:
1. **Abandoned Prison** (edge `e_faction_eternal_empire__associated_with__loc_abandoned_prison`): the description said "in PoE2 Act 1 terms outside the Ogham cemetery". The wiki says the quest is one of the secondary main story quests in **Act 4**, reached by sailing. Description rewritten. Also added the missing Exile edge `e_char_exile_poe2__travels_to__loc_abandoned_prison` (src_poe2wiki_abandoned_prison_quest, intro "sailing towards Abandoned Prison").
2. **Cataclysm's Wake** (node `concept_cataclysm`): the summary said it is "a game quest name with no lore content". The page calls it an epilogue quest that is the Atlas tutorial. Summary corrected and source `src_poe2wiki_cataclysm_s_wake` added (new source; locator on the intro line).
3. **Vaal Cataclysm / Doryani** (edge `e_event_vaal_cataclysm__associated_with__concept_corruption`): "Doryani's final project" is not in the source. The wiki says "the exact details of his experiments ... are extremely nebulous". Description and locator corrected to cite the "The Fall" section.
4. **Karui gods** (node `concept_karui_gods`): removed the unsupported claim that each tribe's Ancestor is one of these gods and the reference to worships edges. The cited page does not state it.
5. **Orb of Sacrifice naming** (four artifact nodes and four `associated_with deity_*` edges): the wiki does not say the orbs are named after the Vaal gods. Only the item title shares the name. Summaries and descriptions reworded to "name match only, origin not stated". Those four edges changed to canon_status inferred, confidence low. The "Vaal era name" chronology note was removed (not sourced).
6. **Guatelitzi / Hayoxi** (nodes `char_guatelitzi`, `char_hayoxi`): the Vaal era placement is an inference from the Atziri's Temple drop location or the royal-temple setting, not a stated fact. Summaries and `chronology.relative` now say so. Removed the reference to the Thesis name, which the node did not cite.
7. **Artifact-to-character edges** for Hayoxi and Guatelitzi: descriptions said "Named in the flavour text" and "Named for". Reworded to "item title carries the name; flavour text ...".
8. **Hooded One** (edge `e_char_the_hooded_one__member_of__faction_precursors`): the claim "Not stated in-game or on the wiki pages checked" could not be verified by this check and was removed. Description now states it is a single auto-captioned video's claim and a community theory.
9. **Chitus and Malachai** (edge `e_char_chitus__allies_with__char_malachai`): description now quotes the auto-caption ("chiles perandus", "lethal maturity" for thaumaturgy) and states it rests on one video.

Structure and confidence:
10. **Era meta edges** (`e_era_poe1_campaign`, `_atlas`, `_leagues`, `e_era_poe2_campaign`, `_endgame`) and nodes `era_poe1`, `era_poe2`: the cited Beast page only supports the PoE1-before-PoE2 gap, not the bucket composition. Set canon_status to inferred, confidence low, and added a note that the grouping is structural. The two Eternal Empire `part_of` edges keep canon high, since their cited sections support them.

## Open points (not changed)

- `e_char_hayoxi__associated_with__faction_vaal_architects` is already inferred/low. The master node `faction_vaal_architects` notes a Medallion flavour "Architects of ... Destruction", which would support the link if cited. Left as is.
- Several YouTube-sourced claims (Chitus/Malachai, Hooded One) rest on auto-captions and one channel each. Kept at tertiary/low.
- `loc_abandoned_prison` and `loc_cemetery_of_the_eternals` are master nodes; their existing master summaries were not edited here.
- Master already holds Exile edges for the Beast (`char_exile_poe1` defeats/destroyed `deity_beast`) and the Vaal Cataclysm (`char_exile_poe2` witnesses `event_vaal_cataclysm`). No duplicate Exile-Beast edges were added.
