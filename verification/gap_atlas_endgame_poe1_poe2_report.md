# Fact-check changelog: gap_atlas_endgame_poe1_poe2

Date: 2026-11-06
Fragment: `staging/gap_atlas_endgame_poe1_poe2.json` (edited in place)
Checked against: `data/raw/poewiki/*.wiki`, `data/raw/poe2wiki/*.wiki`, and the master graph (`build/master/nodes.json`, `edges.json`, `sources.json`) for duplicates and referenced ids.

## Result

- Nodes: 12 (was 12). All are new. None duplicates an existing master node (checked by id, name, alias and summary).
- Edges: 39 (was 40). One unsupported edge removed, one edge renamed.
- Sources: 17 (was 16). `src_poewiki_the_maven_quest` added, copied exactly from master.
- `scripts/validate_fragment.py`: 0 errors, 41 warnings. All warnings are references to existing master nodes, which the validator cannot resolve on its own.
- All edge endpoints resolve to the fragment or to master. Every cited source id is declared in the fragment. Every declared source is cited.

## Node changes

- `event_the_mavens_game`: The summary said defeating the Maven "grants an Atlas Book of Skill". The page says the quest's "Use the Atlas Book of Skill" step gives 1 Atlas passive point and 2 respec points. Summary reworded. `story_order` 3075 changed to null, because no source gives an order. Added source `src_poewiki_the_maven_quest` for the Writ step.
- `event_searing_exarch_quest`: `story_order` 3081 changed to null. The page says the quest runs in parallel to The Maven and The Eater of Worlds quests, not "parallel to the Eater" only. Summary updated.
- `event_eater_of_worlds_quest`: `story_order` 3082 changed to null.
- `artifact_atlas_book_of_skill`: "respec point" changed to "respec points" to match the page wording.
- `event_lost_voidstones`: removed the meta sentence about Watchstones. The page does not discuss them, and the sentence is not a fact about the quest.
- `event_poe2_ancient_beacons_quest`: removed "Ancient Beacons can randomly summon the Royal Colossus and Royal Sentinel". That claim is on the monster pages, not on the quest page cited for the node.
- `concept_atlas_passive_tree`: locator corrected. The page says the earned points are shown "at the bottom of the Atlas passive tree".

## Edge changes

- `e_event_atlas_maven_witness -> precedes -> event_the_mavens_game`: was `inferred`/medium, with a locator that said the order was not stated. The Maven quest page does state it: the Maven's Writ is formed after the witnessed-boss cycle and is "used to challenge The Maven". Now `canon`/high, citing `src_poewiki_the_maven_quest` and the Maven's Game page.
- REMOVED `e_event_the_mavens_game -> precedes -> event_atlas_siege`. Its only basis was the invented `story_order` values, and the cited page does not state the order.
- `e_event_the_mavens_game -> associated_with -> artifact_atlas_book_of_skill`: description corrected (quest step, not a grant on defeat).
- `e_event_searing_exarch_quest -> part_of -> event_atlas_siege`: description clarified, confidence set to medium. The cited pages do not mention the siege. The link rests on the master node "Siege of the Atlas: Exarch and Eater".
- `e_char_black_star -> participates_in -> event_searing_exarch_quest`: "champion" replaced with the Polaric Void arena wording used on the page.
- `e_artifact_voidstone -> associated_with -> event_searing_exarch_quest`: "per the 3.17.0 page" removed. The completion step (Kirac gives the Omniscient Voidstone) is explicit. Confidence high.
- `e_artifact_voidstone -> associated_with -> event_eater_of_worlds_quest`: same treatment (Grasping Voidstone). Confidence high.
- `e_concept_atlas_passive_tree -> part_of -> concept_atlas`: locator replaced. The page does not say "part of the Atlas". The cited text now refers to the Atlas passive tree itself.
- `e_artifact_atlas_book_of_skill -> part_of -> concept_atlas_passive_tree`: RENAMED to `e_artifact_atlas_book_of_skill__associated_with__concept_atlas_passive_tree__gap_atlas` with relation `associated_with`. A consumable reward is not "part of" the tree. It is a source of points spent in it.
- `e_event_lost_voidstones -> associated_with -> artifact_voidstone`: meta text removed from the description.
- `e_event_poe2_ancient_beacons_quest -> leads_to -> loc_atziri_s_temple`: locator now cites the lead ("serves as an introduction to Atziri's Temple") and the completion text.
- `e_event_poe2_ancient_beacons_quest -> associated_with -> concept_ancient_beacons`: description corrected. The page says the quest is triggered by finding a beacon. It does not say the quest introduces the mechanic. The locator is now the trigger sentence.
- `same_entity_as` (Legacy of the Precursors pair): the "0.5.0" claim is now cited to the page's version history. Locator corrected.
- `same_entity_as` (The Grand Expedition pair): description rewritten to match the stub page (start "Speak to Farrow", version 0.5.0).

## Verified without change

- The Maven's Game: starts with a Maven's Writ after entering Absence of Mercy and Empathy; the Maven boss fight; "Introduced" in 3.13.0; reward steps; Kirac and the Ceremonial Voidstone; the quoted line "Defeat her so that she cannot."
- The Searing Exarch and The Eater of Worlds: Envoy and Luminous Astrolabe / Flesh Compass; Tier 9+ to 16+ influence; Polaric Invitation (area level 79) and Black Star arena; Incandescent and Writhing/Screaming invitations and their arenas; boss names; the Eldritch Voidstone drop conditions; quest-complete reward of 2 skill points and 4 respec points; introduced in 3.17.0.
- Lost Voidstones: visibility conditions; completion through Kirac; "not displayed on the World Map".
- Atlas Book of Skill: 9 books for 12 points; obtained from Kirac or Eagon after pinnacle bosses; Eldritch variant.
- The Elder (used as a locator): 1 skill point and 2 respec points.
- The Atlas of Worlds: "Upon completing A Call to Arms ... explore the Atlas".
- Threads of the Originator: Eagon's quoted line "we can chase down the one creating them. The Originator."
- Ancient Beacons: 0.4.0; exclusive to Fate of the Vaal; sacrifice, beacon activation, Vaal Ruins, Temple Console.
- Royal Colossus (Slam Combo, Charged Slam, lightning), Royal Sentinel (variant of Stone Sentinel, lightning conversion 60% and 70%), Royal Commander (variant of Blackjaw, Atziri's Temple, Commander room), Royal Blood Priest (variant of Zolin, Sacrificial Chamber room), Royal Spy Master (Spymaster room). All introduced 0.4.0.
- The Grand Expedition and Legacy of the Precursors: both pages are `{{stub}}`. Both are 0.5.0 per version history.

## Open items (not changed here)

- The Royal monsters are typed `character` (unique bosses). The schema does not name a better fit.
- The two `same_entity_as` pairs flag existing master duplicates. Merging them has to happen in the master, which is read-only for this task.
- `story_order` is null for the Maven, Searing Exarch and Eater quests. The sources give no absolute order. The other Atlas nodes in master keep their values.
- No edges were added from `char_exile_poe2` to the Royal monsters. The pages describe them as summoned or located in encounters, and do not say the Exile fights them.
- Branch tag `fate_of_the_vaal` is used here and in master, but it is not in the controlled list in `docs/SCHEMA.md`. It was kept for consistency with `league_poe2_fate_of_the_vaal`. The schema list may need the tag added.
- Source `accessed` dates were not re-fetched. Corpus files were used as the evidence.
