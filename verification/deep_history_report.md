# deep_history verification report

Checked against local poewiki/poe2wiki files (History_of_Wraeclast, Kalandra, Kalandra_league, The_Azmeri, The_Maraketh, Order_of_the_Djinn, The_Lightless, The_Molten_One, The_Ezomytes, Kalguur, Ngamakanui, The_Vastiri_Plains, Calendar_lore_, Eternal_Empire, poe2 The_Beast, Lore, Legacy_of_the_Precursors, Act_4), the Doryani video transcript (1Zt4tv8fjI4) and a web search for Legacy of Phrecia dates.
Result: 92 nodes, 160 edges, 0 validator errors.

## Verified without change
Kalandra/Lake lore, Titans/Redblades/Molten One, Precursor description, primeval civilisation (Uzaza, Putembo, Aul, Ahkeli), Lightless/Kulemak, Winter of the World names (Great Fire/Wasting), Azmeri/Maji/Draiocht, Maraketh (304 generations, Keth, Orbala/Garukhan, Saresh/Afarud), Ezomyte First Ones, Karui, the Kalguur expedition arc, the calendar (week, 13 moons, Atziri 8th), BIC dates.

## Changes
- event_order_of_djinn_forsake_kalandra and its edges: added that the scribes burned their books and self-immolated out of fear (Kalandra page), not only "abandoned".
- league_phrecia: corrected. The event ran earlier (first run ended 23 Apr 2025) and returned 29 Jan - 19 Feb 2026 in the 3.27 cycle. Dates come from third-party news only; added a PoE Vault source, confidence low.
- event_phrecian_perpetual_night: added in_world_year 35 IC (Alano Phrecia quote) and the quote locator.
- Draiocht -> Tears of Maji: the relation "created" was unsupported. Changed to associated_with (the Azmeri page says the Draiocht forbade touching gems), canon/medium.
- Faridun -> Maraketh: "descendant_of" changed to "originates_from" (outcasts, not descendants).
- Olroth -> Triskelion Flame: "wields" changed to "possesses" (he staked the Flame).
- loc_precursor_towers: removed unverifiable claim about the first Tower near the Ziggurat Encampment; now cites Legacy of the Precursors (Precursor Fortress rises, leylines).
- artifact_precursor_weapon / char_the_hooded_one: added that the Hooded One is the intended wielder (Legacy of the Precursors quest) and a new edge Hooded One -wields-> Precursor Weapon; noted the video's claim that the weapon was scattered by 400 BIC.
- event_aul_final_ritual: added History page as co-source (the poe2wiki Ahn's Citadel page is not in the corpus).
- Added missing minimal nodes for dangling canonical ids: act_poe2_act4, loc_aul_s_domain. Added faction_caaltu (+ low-confidence edge to Vastiri), previously listed as a gap.

## Remaining doubts
- poe2wiki Tower, The Grand Project, Ahn's Citadel, Keth, Wraeclast, Atalui pages could not be fetched (Anubis block / not in corpus); related claims rest on the History page quoting them.
- Precursors as "Atlas-builders" stays inferred/low; Hooded One as former Precursor is a single-video community theory.
- Eagon/Originator (Secrets of the Atlas) left to the atlas domain.
- Many ids are defined in several fragments (faction_azmeri, faction_karui, char_olroth, artifact_precursor_weapon, etc.); the merge step must dedupe.
- No 2026 PoE2 content beyond Act 4/endgame was checked for new deep-history lore.
