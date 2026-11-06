# Fact-check report: poe2_acts_1_3

Fragment: staging/poe2_acts_1_3.json (edited in place). Validator: 0 errors, 73 warnings (all "not defined in this file" for canonical cross-domain ids such as char_exile_poe2, loc_vastiri, event_vaal_cataclysm).

## What was checked

- Lore (poe2wiki Lore: Prelude > Count Geonor, Act 1 section), Act_1, Act_2, Act_3 progression tables.
- Quest pages in data/raw/poe2wiki: The_Trail_of_Corruption, The_Trail_of_Corruption_Act_2_, The_Mad_Wolf_of_Ogham, Secrets_in_the_Dark, The_Mysterious_Shade, Reaching_Clearfell, Sorrow_Among_Stones, Earning_Passage, The_City_of_Seven_Waters, A_Theft_of_Ivory, A_Crown_of_Stone, Ascent_to_Power, Legacy_of_the_Vaal, Treasures_of_Utzaal, The_Trials_of_Chaos, Tradition_s_Toll (Lailuma), Faridun, The_Countess, The_Beast, Oswald_s_Death_Journal (not used).
- PoE1 wiki pages in corpus: Doryani, Sin, Viper_Napuatzi, Orbala.
- YouTube transcript 6W2cqV9l3wE (Act 2): timestamps 14:20, 23:10, 26:50-30:25, 77:07-77:14 checked against the transcript text.
- One web search for 0.5 / Act 3 changes. The poe2wiki Count_Geonor raw page was not reachable (Anubis access block).

## Verified as correct (no change)

- Act 1 spine: death sentence and ocean escape (Lore), Reaching Clearfell, Secrets in the Dark (runes, Renly's spikes, Una's "only ancient runes can break it"), Mysterious Shade (Lachlann's ring), Sorrow Among Stones (Asinia, Draven, Lachlann), Trail of Corruption Act 1 (Executioner, Leitis), Mad Wolf of Ogham (Geonor killed, Oriana escapes with the Beast).
- Act 2: Earning Passage (Rathbreaker, Zarka, jingakh), Mawdun Mine (Rudja), Risu, Traitor's Passage (Balbala, transcript timestamps), Halani Gates, Keth (Azarian, Halani burned at her request), Bone Pits (Ekbab, Iktab), Titan Grotto (Zalmarath, Flame Ruby), Horn of the Vastiri (three components: Essence of Water, Flame Ruby, Mastodon Tusks), Deshar (Tor Gul), Dreadnought (Jamanra the Abomination, beheaded by Asala), Hooded One confession "I am a god... I am Sin... It was I who created the Beast" (wiki quest log + transcript 77:07-77:14).
- Act 3: Ziggurat, Oswald (Quartermaster), Servi (tribal guide, Soul Cores), Xyclucian (drops Chimeral Inscribed Ultimatum), Matlan Waterways, Zicoatl and the large Soul Core, Queen of Filth and Temple Door Idol, Ketzuli and the elevator/gateway, Viper Napuatzi, Doryani capture in Black Chambers, Cataclysm in the past, Doryani's weapon piece, Ngamakanui and Kingsmarch.
- Spine ordering 5100-5211 and 5300-5310 matches quest order for the sections the wiki gives.

## Changes made

1. char_count_geonor (summary) and e_char_count_geonor__imprisons__char_the_hooded_one (description): "20 years before the campaign" was wrong. Lore says Geonor's ambush happened 20 years after Kitava's defeat, which is the same point the campaign starts. Now "in the Prelude, about 20 years after Kitava's defeat".
2. event_reaching_clearfell: removed "receives an Uncut Skill Gem from Renly". The wiki reward line for Renly is blank; the Uncut Skill Gem is from the Executioner quest. Also the Bloated Miller is the Riverbank boss (Progression table), so the event now points to a new location node loc_riverbank (new node added, canon, sourced to Act_1 progression and the Reaching Clearfell quest). Edge e_event_reaching_clearfell__occurs_in__loc_clearfell renamed to ...__loc_riverbank. Defeat edge description adjusted.
3. e_event_earning_passage__occurs_in: loc_ardura_caravan -> loc_vastiri (Rathbreaker is fought in the Vastiri Outskirts, not in the caravan). Edge id renamed.
4. event_halani_gates_first_battle: removed "Jamanra is wounded". The Faridun page says Jamanra retreated and summoned an impassable sandstorm during the gates fight; the Countess escapes (walkthrough). Updated loc_halani_gates summary accordingly ("summons a sandstorm at them" was unclear).
5. loc_ogham_manor: "Act 1 act boss in its lowest level" was not supported; replaced with the Progression-table fact.
6. loc_deshar: "city of the dead" was not supported; replaced with the Burial Spires / sky-burial description from the Trail of Corruption quest log.
7. char_servi: removed claims "of Azmeri descent" and "explains Azak and Orok politics". Neither term appears in the corpus Legacy of the Vaal page. Summary now reflects Servi's actual dialogue (warns of a forsaken ruin where Soul Cores may be found).
8. e_char_oswald__guides__char_exile_poe2 -> associated_with (Oswald is a Quartermaster/merchant, not a quest-giving mentor). Edge id renamed.
9. deity_garukhan (summary): the Garukhan = Orbala identification is attributed in the PoE1 wiki to PoE2 information, and the PoE1 Sin page says Garukhan is Sin's wife. Summary now says this is inferred; canon stays inferred / medium.
10. char_doryani (summary): "Atziri's foremost researcher" changed to "Royal Thaumaturgist to Queen Atziri" (PoE1 wiki: "Queen's Thaumaturgist"). Edge e_char_doryani__opposes__char_atziri: description aligned with the quote (he pleaded for patience; she refused). Added src_poewiki_doryani as a second source.
11. event_time_portal_utzaal_past: "Doryani welcomes the Cataclysm" was not supported (the "It begins..." line is spoken before the jump). Rewritten.
12. event_utzaal_past_cataclysm: the lament ("they're all long dead... this city is nothing but a grave") is spoken after returning to the present, not in the past. Rewritten.
13. e_char_oriana__opposes__char_exile_poe2: the "You again!... the fool under the Hooded One's sway" taunt is in the Dreadnought fight, not at the gates. Sequence set to null (it was 5203 and was misplaced); description corrected.
14. e_char_viper_napuatzi__imprisons__char_alva -> opposes (Napuatzi orders Alva taken to Doryani; she does not imprison her herself). Edge id renamed.
15. char_ketzuli: games changed from [poe1, poe2] to [poe2]. Ketzuli is not in the PoE1 corpus; the only source is the PoE2 Legacy of the Vaal quest.
16. deity_sin, deity_beast and e_deity_sin__created__deity_beast: era interlude_between_games -> primordial (schema: gods and Beast are primordial; the Beast predates the Precursors' era per the PoE2 Beast page).
17. event_trail_of_corruption_act1: "sent to Geonor after Leitis reports Eamon's death" was an inference. Leitis says "He killed Eamon" and then asks the Exile to depose Geonor (Mad Wolf quest start). Rewritten to match.
18. artifact_count_lachlanns_ring: "to break the Hooded One's binding" -> "to heal the Hooded One's runic wound" (Mysterious Shade quest wording).
19. event_sandstorm_dispelled: "Asala allows entry to Deshar" -> "Asala turns the caravan toward Deshar" (the quest only says to travel to Deshar next).
20. artifact_balbalas_barya: "to bind her" -> "so that she can serve as a mentor Djinn" (Ascent to Power wording).
21. e_char_alva__descendant_of__faction_vaal -> associated_with (descendant_of is a kinship relation between persons).

Validator after edits: 0 errors.

## Remaining doubts / not fixed

- Act 2 route ordering: the wiki says that after the Halani Gates, three routes (Keth; Bone Pits + Titan Grotto; Buried Shrines/Spires) can be done in any order. The fragment linearises Keth -> Bone Pits -> Titan Grotto -> Horn, which is one valid order, not canonical. Left as is; flagged in the spine.
- Jamanra the Abomination placement: the quest log lists "Defeat Jamanra, the Abomination" (objective "The Faridun are atop Deshar") before "Defeat Tor Gul", but the phase text and the Act 2 progression table place the boss on the Dreadnought. Kept the Dreadnought placement; ordering unresolved.
- Count Geonor's wiki page was not in the corpus and could not be fetched. The "Iron Count" nickname is not used. The "20 years after Kitava" timing rests on the Lore page only.
- Not covered (gaps, not added): Act 1 bosses Beira of the Rotten Pack, The Devourer, The Brambleghast, The Rotten Druid, Crowbell, The King in the Mists, Candlemass (Ogham Manor sub-boss); Act 2 Kabala (Keth), Rathbreaker-side Trial of the Sekhemas (Rattlecage); Act 3 Rootdredge, Mighty Silverfist, Blackjaw, Ignagduk (Azak Bog). None are on the spine. Side quests named in the researcher note remain unnodded, as stated there.
- Act 1 transcript (CcsuQaHvsnY) still unavailable; Act 1 beats rely on poe2wiki only.
- Post-0.5 changes: one web search found a May 2026 Patch 0.5.0 campaign-change note (currency-seller blog, secondary) and an undated "Act 3 trim" note. These could not be checked against official patch notes. Act 3 area and boss details may be outdated.
- Class-specific exile backstories (hanging cart, per-class execution scenes) are still not covered; no source was found in the corpus.
- deity_garukhan / Orbala identification: the source chain is indirect (PoE1 wiki citing PoE2); stays inferred.
- Hooded One = Sin is confirmed in the PoE2 quest log and transcript (canon). The Lore page itself says "likely", so the two sources are not in conflict.
