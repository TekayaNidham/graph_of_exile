# Verification report: poe2_endgame

Checked against local poe2wiki/poewiki snapshots (Legacy_of_the_Precursors, Legacy_of_the_Maji, Strange_Reflection, The_Grand_Expedition, The_Search, Tecrod, The_Pinnacle_of_Flame, Faridun_Foray, Ezomyte_Infiltration, Vaal_Incursion, Hilda_s_Hunting, Well_of_Souls quest, Act_2, Siege_of_Oriath, Fate_of_the_Vaal quest/league, The_Dreamer, Vruun, Rise_of_the_Abyssal, Forbidden_Rites, Trial pages, poewiki The_Lightless / God / History_of_Wraeclast / Kurgal), the official 0.5.0 notes (forum 3932540, fetched) and web searches. Result: 0 validator errors; 108 nodes, 175 edges, 56 sources (was 97/139/41). YouTube transcripts for the Arbiter/Bodach/King videos were rate-limited again, so none were added.

## Changes (what and why)
- Atlas chain: the Western/Eastern Gateways and Enigma Chambers come AFTER the Burning Monolith in the quest log, not inside the Ancient Gateway step; descriptions rewritten. Added the missing Halls beat (Phyx, Sentinel of the Spark / Phya, Sentinel of the Cradle, Precursor Reactor, Origin Core; story_order 6065) and rebuilt the next_beat chain with sequence = source story_order (old sequences 6001-6008 did not match story_order). Those steps sit in a commented-out block of the wiki, so medium confidence.
- Waygate: removed the unsupported "Precursor-built, rediscovered" claim; Doryani->created Waygate downgraded to inferred/low.
- Crisis Fragments: 0.5 log only collects Ancient (Count Geonor) and Weathered (Doryani); the three-fragment rule is 0.1-0.4.
- Citadels: upgraded from inferred/low to canon/medium (Iron=Count Geonor, Copper=Jamanra, Stone=Doryani, several guides plus poe2wiki Doryani page); added the three removed 0.1-0.4 epilogue quests (Faridun Foray, Ezomyte Infiltration with boss "The Perennial King", Vaal Incursion) and edges boss->Citadels. Fragment-to-Citadel mapping still differs between guides.
- Arbiter of Ash: now "Precursor-created guardian of the Flame Seed" (poewiki History of Wraeclast); Unblinking Eye link kept low/speculative. Added Precursors created Arbiter and Arbiter possesses Flame Seed edges.
- Tecrod: the wiki says both "independent" and "the Master shall know unending power"; poewiki Lightless says he was forsaken by Kulemak and wants his favour. Rewrote, added Tecrod serves Kulemak (inferred, medium). Arbiter of Divinity summary no longer asserts unsourced identity.
- Masters of the Atlas: removed invented "ascendancy-like specialisation"; added official unlock conditions (Jado anomaly map, Doryani corruption nexus); Hilda's Hunting = four Great Beasts.
- Ritual: added Legacy of the Maji quest (primary-ish wiki text) and Crux of Nothingness. Bodach is the quest's final boss (was "per community guide"); King in the Mists KILLED Aoife (relation imprisons -> kills), was already killed once in Ogham; deleted the unsupported King located_in Viridian Wildwood edge; King serves Bodach downgraded to low; Rite of the Nameless description corrected.
- Delirium: "Elder Maddox" is Elder Madox (Azmeri of Mount Kriar, Winter Owl) - id/name fixed, confidence raised to high via Strange Reflection quest; added that quest. Tangmazu now poe1+poe2, aliases Tekaru/Black Crow, brother of Ralakesh (poewiki God), confidence high.
- Breach: renamed deity_xesht -> canonical deity_xesh; Xesht is the incomplete union of Xoph, Tul, Esh, Uul-Netol (Chayula severed). Added Tul and Esh nodes, Exile defeats edges, Ailith founded Keepers / serves Chayula (Dreamer reveals the Ailiths are copies), Chayula's true aim. Hiveborn description corrected.
- Abyss: removed odd "General" phrasing; Kulemak era set to primordial (matches gods_cosmology); added Tasgul/Vandroth (low, guide-only) and the Vessel of Kulemak details; Kulemak's Invitation/Abyssal Lich unlock conditions are guide-sourced and vary.
- Trial of Sekhemas: added Zarokh, the Temporal (guide).
- Expedition: Danig typo fixed; added Vorana/Uhtred defeat edges and titles from the quest log; Grand Expedition infobox completion "Defeat The Aberration"; Verisium-meteor link now cited from the official 0.5.0 notes (still only medium for Expedition, low for Uhtred).
- Fate of the Vaal quest: added completion text (failed to stop the Vaal Cataclysm), Act 4 acts tag.
- Siege of Oriath: added completion "end up at the Ziggurat Refuge" and a same_entity_as link to the Twilight Order fragment's event id.
- Fixed node type/prefix mismatches (5 concept_ nodes typed artifact/location/event).

## Remaining doubts
- Quest-log step numbers (Halls, Enigma Chambers, Maji, Grand Expedition) come from hidden comment blocks on wiki pages.
- Whether The Perennial King is a Citadel boss distinct from Jamanra is unresolved.
- A guide claims Arbiter of Divinity was added in 0.5.4; the wiki and other results show it existed in 0.5 (kept as 0.5).
- Wikipedia (via search) lists the PoE2 1.0 release as 11 Dec 2026; unverified, not encoded.
- Elder Madox/Tangmazu-Hare story, Tul/Esh fortress details, Sky Hive / Hiveborn content rely on official summaries and press coverage; no PoE2 lore text for Rise of the Abyssal beyond Well of Souls dialogue.
- branches tags poe2_runes_of_aldur, vaal_temple, poe2_azmeri are not in the controlled list (validator accepts them); could be normalised at merge.
- Kulemak, Tecrod, Arbiter nodes also exist in other fragments with different wording; merge should prefer the more cautious summaries.
