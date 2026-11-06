# Fact-check changelog: staging/gap_exile_classes.json

Checked: 60 nodes, 173 edges, 65 sources (before). Corpus: data/raw/poewiki(_extra), data/raw/poe2wiki(_extra); live fetch not needed.
After: 60 nodes, 165 edges, 69 sources. Validator: 0 errors (162 warnings, all "target not defined in this file" for nodes that exist in build/master). No fragment node duplicates an existing master node by id or name. Near-matches checked and kept separate: char_class_templar_poe2 vs char_class_templar (PoE1 class), faction_druids_of_skothe vs faction_druids_of_the_broken_circle (master: Kalguuran, different order).

## Method
- Every quoted locator fragment was matched against its cited wiki file (normalised). All quotes now resolve.
- Every summary's parenthetical skill names were matched against the cited page.
- Each relation and direction was re-read against the cited passage. Speakers of Dominus lines and NPC intros were checked in context.
- Corpus pages for the PoE2 pairings, Beidat leadership, Tale-women/Sekhema and Pathfinder Concoctions were searched and not found.

## Removed (8 edges)
- 6 x same_entity_as: Marauder=Warrior, Ranger=Huntress, Witch=Sorceress, Duelist=Mercenary, Shadow=Monk, Templar=Druid. The Character class page says only that "each pair of classes is the same person" and never names the pairs (checked against the live poe2wiki page too).
- char_ascendancy_gemling_legionnaire_poe2 -> faction_gemling_legion (self-described inferred link; the page says nothing about the PoE1 Gemling Legion).
- char_class_sorceress_poe2 -> concept_sekhema (the page says only that she was to be a tale-woman; the tale-women/Sekhema link is not on the page).

## Node summary corrections (8)
- char_class_marauder_poe2, char_class_duelist_poe2, char_class_shadow_poe2, char_class_templar_poe2: removed invented "paired with X" clauses. The four pages carry {{unreleased}} with ascendancies marked TBA. Added src_poe2wiki_{marauder,duelist,shadow,templar} (new sources, verified). Duelist and Shadow rename note (Gladiator/Assassin, reversed before Early Access) is sourced to Character class Trivia.
- char_class_warrior_poe2: "Karui-born orphan" changed to the wiki's "born into a family of Karui slaves".
- faction_druids_of_skothe: wiki does not call the order "of Ezomyte druids"; the Druid is the Ezomyte.
- char_ascendancy_pathfinder_poe2: removed "Concoctions" (not on page).
- char_ascendancy_deadeye_poe2: "Called Shots marks" changed to "Called Shots".

## Edge relation, target and locator fixes
- loc_lord_s_labyrinth: part_of concept_ascendancy -> leads_to (new id e_loc_lord_s_labyrinth__leads_to__concept_ascendancy). Locators replaced with verbatim quotes (Ascendancy_class Overview; Lord's Labyrinth quest intro).
- 13 x mentions -> associated_with (char_nessa / char_bestel -> six class nodes each, char_maramoa -> marauder). "mentions" is text->entity. Each locator now quotes the NPC introduction line verbatim. Description rewritten: the intro addresses the class by name (the "as an exile from Oriath" wording was not on every page).
- char_class_mercenary_poe2 -> creature_trarthan_mercenaries (Trarthan hirable units) changed to faction_trarthans (the Trivia says the in-game Mercenary is Trarthan, i.e. the people). Confidence low.
- char_ascendancy_abyssal_lich_poe2 -> event_poe2_kulemak_encounter: locator now quotes the Ascendancy_class alternate-ascendancy section. Description tightened.
- char_ascendancy_abyssal_lich_poe2 -> deity_kulemak: confidence low; locator now quotes the Abyssal Lich Overview; description states the link rests on Kulemak's Invitation and the encounter name.
- char_ascendancy_abyssal_lich_poe2 -> char_class_witch_poe2: description now says it is an alternate Ascendancy class (alternate of the Lich).
- char_ascendancy_infernalist_poe2 -> char_beidat: removed "leader of the pale demons" (not on the Infernalist page; it is in the Beidat master node). Kept the three contracts with Beidat.
- 12 x char_class_*_poe2 -> char_exile_poe2 (aspect_of): description rewritten. The old text said "one of the two PoE2 classes selectable" (there are twelve) and did not reflect the wiki's note that technically none of the player characters are exiles. Relation kept.
- 24 x char_ascendancy_*_poe2 -> concept_ascension_trials: description no longer claims a specific trial list per class; now cites the Ascendancy_class Overview sentence ("Ascendancies can be unlocked by completing Ascension Trials through the campaign and endgame").
- char_ascendancy_*: duplicate identical source entries removed (mercenary, acolyte).

## Verified and kept (no change)
- All 19 PoE1 Ascendancy class nodes and their part_of edges (Marauder, Duelist, Ranger, Shadow, Witch, Templar, Scion) match Character class and each class page. The Labyrinth -> Altar of Ascendancy unlock matches Ascendancy_class line 12.
- All 24 PoE2 Ascendancy part_of edges match the Character class base-class mapping (Monk, Warrior, Ranger, Huntress, Witch, Sorceress, Mercenary, Druid). Abyssal Lich is noted as an alternate, not in that mapping.
- Djinns (Ruzhan, Navira, Kelari): names, bound-to-serve-Varashta, invulnerable and inert-in-barya claims match the Disciple of Varashta page. The Djinn-to-Disciple commands edges match.
- Dominus "exiles" edges to the PoE1 class nodes: speeches checked for speaker attribution (Marauder, Duelist, Ranger, Shadow, Templar, Scion, Witch). Kept as-is; master models class nodes as Exile classes.
- PoE2 class lore: Warrior (Karui slaves, Renly, Ogham, Clearfell), Ranger (Grelwood), Huntress (Maji, virtue gem, Delwyn same village), Sorceress (Maraketh, banished from akhara), Mercenary (Trarthus), Monk (Keepers, Dreamer, Hiveborn, Monastery, Ezomyte heritage), Druid (Druids of Skothe, King in the Mists, wife Aoife), Warbringer (Karui and Ezomyte ancestry), Smith of Kitava (Kitava), Witch (swamp coven, Black Fen).
- Trial links: Varashta created the Trial of the Sekhemas; Vaal priests designed the Trial of Chaos; the third trial is confirmed as the Trial of the Ancestors.
- Renly parent_of Warrior: kept, description says adoptive.

## Open points (not changed)
- The fragment does not link the Djinns to master faction_order_of_the_djinn. No corpus statement supports that link, so none was added.
- Two of the PoE2 class lore edges carry medium confidence on a single overview sentence each; left as found.
- Druids of Skothe is kept separate from master Druids of the Broken Circle; no source states they are the same order.
