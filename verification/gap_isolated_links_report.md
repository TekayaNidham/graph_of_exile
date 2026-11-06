# Fact-check changelog: staging/gap_isolated_links.json

Date: 2026-11-06. Checker: independent re-read of every cited corpus file (data/raw/poe2wiki, poewiki, youtube transcript 7QuY96FyhG4).
Validator: `python3 -I scripts/validate_fragment.py staging/gap_isolated_links.json` gives 0 errors, 163 warnings. The warnings are only "edge endpoint not defined in this file" for nodes that exist in build/master (allowed).

## Totals

| | Before | After |
|---|---|---|
| Nodes | 2 | 1 (`concept_corruption`, new and verified) |
| Edges | 87 | 83 |
| Sources | 41 | 41 (2 new, 4 dropped as unused) |

Every edge endpoint resolves to a master node or to the fragment node. No edge id collides with a master edge id.

## Nodes

- **Removed `loc_the_beyond`** (name "The Beyond"). It duplicates existing `concept_beyond` ("The Beyond", same demon realm reached through Beyond portals). The two edges that touched it were dropped (see below).
- **Kept `concept_corruption`.** No master node with this id exists. Its three cited sources check out: Karui Gods (Haku, "Kitava, God of Corruption"), Sin ("the Seed of Corruption"), and History of Wraeclast (Vaal temple, "worship of Corruption").

## Edges removed

| Edge | Reason |
|---|---|
| `e_loc_the_beyond__same_entity_as__concept_beyond` | Node loc_the_beyond removed as duplicate; self-loop after re-pointing. |
| `e_loc_the_beyond__associated_with__league_beyond` | Re-pointed it would be `concept_beyond -associated_with-> league_beyond`, which duplicates master `e_league_beyond__introduced_in__concept_beyond`. Redundant. |
| `e_artifact_count_lachlanns_ring__associated_with__char_lachlann` | No corpus page identifies Count Lachlann (ring owner) with Lachlann of Endless Lament. The Mysterious Shade and Secrets in the Dark do not name the same person. Unsupported. |
| `e_loc_the_abyss__associated_with__concept_abyss` | The Abyss Mechanics section does not say the place and the concept are the same realm. The edge was speculation ("possibly the same"). |

## Edges corrected (facts, locators, relations, labels)

**PoE2 quests and items**
- `e_char_exile_poe2__seeks__artifact_count_lachlanns_ring`: bringing the ring to Una is optional per The Mysterious Shade. Description fixed.
- `e_artifact_balbalas_barya__associated_with__event_balbala_released`: description and locator now follow Ascent to Power's note (barya comes from defeating Balbala in Traitor's Passage).
- `e_char_exile_poe2__seeks__artifact_essence_of_water`, `..._mastodon_tusks`, `..._flame_ruby`: descriptions tightened to the quest text.
- `e_char_una__located_in__loc_clearfell`: the old locator (Reaching Clearfell) does not mention Una. Re-cited to Secrets in the Dark ("Return to Clearfell Encampment and speak to Una"). "Act 1 hub" wording removed from this edge.
- `e_loc_clearfell__located_in__loc_ogham`: "Ezomyte" was not supported by the cited page. Re-cited to Act 1 (Ogham region; Clearfell Encampment as town hub). Description fixed.
- `e_loc_hunting_grounds__located_in__loc_ogham`: re-cited to The Mysterious Shade ("Beyond our clan graves is the Hunting Grounds") plus Act 1.
- `e_loc_drowned_city__located_in__loc_utzaal`: locator re-cited to Legacy of the Vaal.
- `e_loc_mawdun_quarry__associated_with__faction_faridun`: description now says the Countess asked the Faridun to rally at the quarry (not "Jamanra's followers").
- `e_loc_mawdun_quarry__associated_with__loc_mawdun_mine`: "foundry area" was not in the source. Now cites Act 2's area table ("Mawdun Mine ↔ Mawdun Quarry"). Source `src_poe2wiki_act_2` added.
- `e_char_doryani__located_in__loc_mount_kriar`: "sealed" removed from description.
- `e_loc_path_of_mourning__located_in__loc_deshar`: description tightened.
- `e_char_the_hooded_one__associated_with__concept_corruption`: the Faridun page supports the Countess's plan to feed the Seed to the Beast, not the Hooded One's plot. Now cites both Faridun and The Mysterious Shade.

**Shambrin (Tradition's Toll, new source)**
- `e_char_shambrin__guides__char_exile_poe2`: the Lailuma detail was not in the cited Act 2 page. It is in Tradition's Toll (`src_poe2wiki_tradition_s_toll`, added).
- `e_char_shambrin__member_of__faction_maraketh`: "dekhara (akhara-level leader)" and "appeals for the Maraketh's lost dead" were unsupported. Downgraded to `inferred` / `low`, rewritten to rest on Asala's "my dekhara" line.

**Other PoE2**
- `e_concept_utopia__associated_with__faction_twilight_order`: the cited Utopia page does not mention the Twilight Order. Re-cited to The Search (Countess: "The Twilight Order will see to it that the world is remade...").
- `e_concept_utopia__associated_with__event_poe2_a4_utopia_oath`: re-cited to the Utopia quest ("take an oath to The Saviour"). Description fixed (Lorandis "encourages").
- `e_text_tavakais_declaration__mentions__char_tavakai`: the declaration is unsigned in the wiki. Attribution is only from the heading "Tavakai's Declaration". Relation changed to `associated_with`, `inferred`, `low`.
- `e_text_tavakais_declaration__located_in__loc_ngakanu`: locator added.

**PoE1 leagues and Atlas**
- `e_concept_azurite__introduced_in__league_delve`, `e_concept_azurite__associated_with__loc_azurite_mine`: "crystal" and "mined resource" wording replaced with what the Delve page says (Azurite obtained in Delves, used to upgrade equipment).
- `e_event_keepers_allflame_not_atlas__associated_with__league_keepers_of_the_flame`: now states what the Keepers page says (expands Breach lore). The "not continuing the Atlas story" claim is not in the cited pages and was removed from the edges.
- `..._league_mirage`, `..._league_allflame`: same change. Descriptions now say only that these are 2025-26 challenge leagues in the same release run.
- `e_artifact_watchstone__part_of__concept_atlas`: "socketed into Citadels in the legacy 3.9-3.16 Atlas" was not in History of Wraeclast. Re-cited to the Scourge league challenge ("Socket each ... Watchstone ... into a Citadel on your Atlas"). Source `src_poewiki_list_of_scourge_league_challenges` added.
- `e_artifact_watchstone__associated_with__char_elder`: locator refined to the Conquerors of the Atlas passage.
- `e_artifact_voidstone__part_of__concept_atlas`, `e_char_exile_poe1__seeks__artifact_voidstone`: "upgrade the Atlas" replaced with what Endgame states (Voidstones unlocked by pinnacle bosses).
- `e_concept_uber_pinnacle_bosses__part_of__concept_atlas`: "Uber Sirus/Maven/Exarch" and "24 Tier 14+ maps" were not in The Elder (quest). Scope reduced to Uber Elder.
- `e_concept_uber_pinnacle_bosses__associated_with__char_elder`: re-cited to the Elder quest intro ("culminates in the Uber Elder boss fight").
- `e_deity_god_of_domination__associated_with__league_harbinger`: era changed to `poe1_leagues`, plot_role to `branch` with branches `harbinger` (the edge concerns a league).

**PoE1 Act 10, Sanctum, other**
- `e_artifact_sanctum_relics__associated_with__char_lycia`: the YouTube transcript says "the actual story as we hear it from Lycia on a unique relic" (auto-captions). The description now says only that. Kept at `medium`.
- `e_char_exile_poe1__opposes__char_lorrata`: "to open the Vaal doors" was not in the page. Now says the poison is meant to get the roots before Piety reaches the ruin.
- `e_loc_temple_of_decay__located_in__loc_the_vaal_city`: "Geography" lists the temple but not its city. Re-cited to Lighting the Way ("Yeena is located inside The Vaal City ... Arakaali's temple") plus The Vaal.
- `e_char_yeena__located_in__loc_the_vaal_city`: locator updated to Lighting the Way (the burn quote and the location line).
- `e_char_lazhwar__created__loc_eternal_laboratory`: locator and description now match the Eternal Empire passage ("experimented with thaumaturgy and discovered maps").
- `e_loc_mount_veruso__associated_with__concept_virtue_gems`: locator now quotes the overview sentence.
- `e_char_jaetai__serves__char_atziri`: name-based inference only. Downgraded to `inferred` / `low`.
- `e_char_kaom__participates_in__event_kaom_massacre`: the "possible duplicate" note removed from the description. The Kaom duplication is recorded below for the merge owner.
- `e_faction_the_crimson_scribe__associated_with__deity_solaris` and `..._deity_lunaris`: the page says the sisters "may be one and the same" with the twin sekhema, and does not link them to heist targets. Descriptions rewritten. Era changed to `azmeri_ezomyte_ancient`. Confidence set to `low`.
- `e_text_letter_kingsmarch__mentions__char_dannig`, `..._char_rog`, `..._char_tujen`: "reveal secret rebel ties" was not in the letters. Descriptions now say what each letter is headed by / written by.
- `e_loc_the_abyss__associated_with__league_abyss`: description tightened to the Mechanics wording.
- `e_concept_exile_journey__*`, `e_concept_sekhema__part_of__faction_maraketh`, `e_char_tetzlapokal__*`, `e_char_izaro__worships__*`, `e_char_avarius__*`, `e_char_bannon__*`, `e_loc_the_cathedral_rooftop__*`, `e_char_kaom__*` (except description), `e_char_exile_poe1__participates_in__event_poe1_a10_vilentas_vengeance`, `e_event_poe1_a10_*`, `e_loc_forbidden_sanctum*`, Horn of the Vastiri edges, Legacy of the Vaal edges, Sanctum relic `introduced_in`, Secrets in the Dark occurs_in, Kingsmarch `located_in`, Tavakai `located_in`, Sin/Kitava corruption edges: verified, unchanged.

## Sources

- Added: `src_poe2wiki_tradition_s_toll` (https://www.poe2wiki.net/wiki/Tradition's_Toll), `src_poewiki_list_of_scourge_league_challenges` (https://www.poewiki.net/wiki/List_of_Scourge_league_challenges). Both `secondary`, accessed 2026-11-05 to match the other corpus-derived entries.
- Copied from master (cited, not redefined): `src_poe2wiki_act_1`, `src_poe2wiki_act_2`, `src_poe2wiki_the_search`, `src_poe2wiki_utopia`, and the other existing ids cited by the edges.
- Dropped as no longer cited: `src_poe2wiki_reaching_clearfell`, `src_poe2wiki_the_trail_of_corruption`, `src_poewiki_beyond_league`, `src_poewiki_scourge_league`.

## Flagged for the merge owner (master, not changed here)

1. **Kaom duplicate events**: master has both `event_death_of_kaom_highgate` ("Kaom's march on Highgate and death") and `event_kaom_massacre` ("Kaom at Highgate"). They describe the same event. The fragment's edge still points at `event_kaom_massacre`.
2. **The Abyss duplicate?**: master has `concept_abyss` and `loc_the_abyss` ("The Abyss (place)"). Neither the wiki page cited here nor the rest of the corpus establishes they are the same. Left as two nodes.
3. **Master summaries overstate the corpus**: `char_shambrin` ("Maraketh dekhara") and `char_lorrata` ("roots held the Vaal doors shut") go beyond the cited pages. `loc_clearfell` "Ezomyte" is not in the Clearfell pages. `event_keepers_allflame_not_atlas` ("not continuing the Atlas story") is not in the cited league pages. These node summaries are outside this fragment; they should be checked in their own domain.
4. **Balbala's Barya**: the edge `e_char_exile_poe2__associated_with__artifact_balbalas_barya` is kept as `associated_with` (the wiki says "place"/"receives"). A more specific relation could be chosen by the merge owner.

Checked against: corpus files `data/raw/poe2wiki/{Sorrow_Among_Stones (grep only), A_Crown_of_Stone, A_Theft_of_Ivory, Ascent_to_Power, Environmental_lore, Faridun, Legacy_of_the_Vaal, Reaching_Clearfell, Recruit_the_Maraketh, Recruit_the_Vaal, Secrets_in_the_Dark, The_City_of_Seven_Waters, The_Mysterious_Shade, The_Search, The_Trail_of_Corruption, The_Trail_of_Corruption_Act_2_, Tradition_s_Toll, Utopia, Act_1, Act_2}.wiki`, `data/raw/poewiki/{Abyss_league, Aiding_an_Archivist, Allflame_league, Avarius_Reassembled, Beyond_league, Delve_league, Endgame, Eternal_Empire, God, History_of_Wraeclast, Karui_Gods, Keepers_league, Letter_Kingsmarch_, Lighting_the_Way, Mirage_league, Safe_Passage, Sanctum_league, Sin, The_Crimson_Scribe, The_Elder_quest_, The_Root_of_the_Problem, The_Vaal, Vilenta_s_Vengeance, List_of_Scourge_league_challenges}.wiki`, and `data/raw/youtube/transcripts/7QuY96FyhG4.txt` (lines 585-630).
