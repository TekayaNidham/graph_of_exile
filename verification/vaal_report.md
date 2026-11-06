# Vaal fragment verification report

Checked against local corpus: poewiki (The_Vaal, Doryani, Atziri_lore_, Vaal_Oversoul, Incursion_league, Xibaqua, Hinekora, History_of_Wraeclast, Sin, Act_7) and poe2wiki (Legacy_of_the_Vaal, Fate_of_the_Vaal quest and league, Atziri_s_Temple, Xipocado, Atziri_the_Red_Queen, Recruit_the_Vaal, Environmental_lore, Act_3, Vaal_Ruins, Treasures_of_Utzaal, Quest/Act pages) plus the YouTube transcript 1Zt4tv8fjI4. No web searches were run (poewiki is Cloudflare-blocked per researcher; the poe2 corpus looks like ~0.5.x).

## Changes
- IDs: deity_the_beast -> deity_beast and loc_the_ancient_pyramid -> loc_ancient_pyramid (match canonical/other fragments).
- Deleted unsupported edges: Atziri descendant_of Tetzlapokal; Atziri succeeded_by Vaal survivors; Cataclysm causes the Beast.
- Hinekora "opposes Doryani" -> associated_with, games poe2 (the quote "Doryani is missing" is PoE2 Trial of the Ancestors dream dialogue).
- Malachai student_of Doryani -> associated_with (wiki only says he sought to follow his footsteps).
- Downgraded: Doryani created Oversoul (inferred, low); Doryani created time gateway and Ketzuli serves Doryani (community_theory: the "2,000-year contingency" idea comes only from the YouTube video, not from game text); concept_doryani_contingencies low; Chayula worship low; Zerphi->Cataclysm inferred; Viper serves Doryani low.
- Vaal City is a PoE1 Act 7 area (was labelled Act 3).
- Vaal/Azmeri contact: c. 1160 BC (not a 1160-1200 range).
- Viper Napuatzi: removed invented "commander of Utzaal"; Ketzuli: "guarding" -> boss in the temple; Black Chambers: "beneath Aggorat" -> within Aggorat.
- Uber Atziri: removed unverified "level 80" and "Incursion Atziri" alias; re-sourced to Atziri_lore (the Atziri,_Queen_of_the_Vaal page is not in the corpus). Omnitect: boss of present-day Temple of Atzoatl.
- Interlude 3 (Doryani's Contingency) acts set for Recruit the Vaal nodes; Zolin/Zelina appear to be siblings (environmental texts).
- Doryani node enriched (Sin's "Vaalish overreacher", PoE2 reframing).
- Added nodes: Queen of Filth, Xyclucian, Uromoti (Architect of Expansion), Architects' notes text; added edges (Exile defeats Queen of Filth/Xyclucian, Omnitect located_in Temple, Uromoti links, same_entity_as links to poe2_endgame duplicates loc_atziri_s_temple and event_poe2_fate_of_the_vaal_quest, Oversoul part_of Shadow of the Vaal, Kishara possesses Kishara's Star, Recruit the Vaal part_of Interlude 3).

## Findings on researcher's open questions
- Doryani's Machinarium is a unique item (flavour text), Doryani's Institute is an Incursion room (Chronicle of Atzoatl); neither is a location node. Jiquani's Machinarium (PoE2) is correct.
- PoE2 "Vaal Incursion" epilogue quest (boss Doryani) was removed in 0.5.0; not modelled.

## Remaining doubts
- Not covered: other Incursion architects/rooms, PoE2 epilogue quest "Doryani's Science", any PoE2 1.0 (Act 5/6) Vaal content after the corpus snapshot; Sacrifice of the Vaal release date not re-verified; Kamasa/Kopec/Yaomac deity details taken at face value from cited pages; K'aj demon trio and Tacati unverified (source pages not in corpus); branch tags sacrifice_of_the_vaal/fate_of_the_vaal are not in the controlled list.
