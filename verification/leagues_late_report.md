# Fact-check report: staging/leagues_late.json (domain leagues_late)

Checker: independent verification pass (Haiku 5.5 subagent), 2026-11-06.
Validator: `python3 -I scripts/validate_fragment.py staging/leagues_late.json` -> **0 errors**, 110 warnings (all are references to ids owned by other domains, e.g. `char_exile_poe1`, `faction_templar`, `deity_innocence`; accepted per task).
Before/after: nodes 163 -> 167, edges 278 -> 284, sources 60 -> 57 (4 unused sources pruned, 1 GGG forum source attached). Pre-fix backup: <local scratch>

## What was checked

- **League release chronology and dates** (all 10 league pages in corpus plus the Settlers GGG forum post): Sanctum 3.20 (9 Dec 2022 - 4 Apr 2023), Crucible 3.21 (7 Apr - 15 Aug 2023), Ancestor 3.22 (18 Aug - 5 Dec 2023), Affliction 3.23 (8 Dec 2023 - 26 Mar 2024), Necropolis 3.24 (29 Mar - 23 Jul 2024), Settlers 3.25 (26 Jul 2024 - 9 Jun 2025), Mercenaries 3.26 (13 Jun - 27 Oct 2025), Keepers 3.27 (31 Oct 2025 - 2 Mar 2026), Mirage 3.28 (6 Mar - 20 Jul 2026), Allflame 3.29 (24 Jul - 9 Nov 2026). All precedes-edges and their dates are correct.
- **Kingsmarch** (Kingsmarch page, Kalguur page, Johan page, Exploring Kingsmarch, Settlers of Kalguur expansion page, Letter (Kingsmarch) page, Trarthus page): NPC roles and names checked (Dannig = Warrior Skald/Blacksmith, Tujen = Haggler/Harbourmaster, Rog = Disenchanter, Gwennen = Gambler, Johan = King's Hand/Treasurer). Kalguuran "Society" groups, Triskelion Flame history, the 1st expedition, the rebellion, letters, boss facts, and shipping ports were checked.
- **Karui / Trial of the Ancestors** (Karui, Karui Gods, Hinekora, King Kaom, Ancestor league, PoE2 Trial quest): chieftain-to-tribe list, Halls of the Dead, Hinekora's creation of the Halls, Kaom's post-death role, Hinekora's Lock and omens as rewards.
- **Sanctum** (Sanctum league, Lycia page, Aiding an Archivist, video 7QuY96FyhG4 at 7:01, 9:39-11:50, 24:43-25:00, 28:00-30:30, 32:42-33:30, 34:21-34:30, 36:38, 43:59): Lycia's pact with Beidat, the fourth-floor boss role, Maxarius = Innocence (also in History of Wraeclast), Sin/Innocence as brothers.
- **Keepers** (Keepers league, Gifts for the Genesis Tree, It That Was Tul/Esh, Vruun), **Necropolis** (league page, Undertaker Arimor, God page Thruldana entry), **Mirage** (Mirage league content, Varashta, Ridan, Saresh, Faridun, Order of the Djinn), **Allflame** (Valerie, Vesper, Curse of the Allflame), **Trarthus / Mercenaries**, **Zana / Threads**, **Legacy of Phrecia**, **PoE2 Act 4** (The Search, Runeseeker, Hostile Takeover, Dark Mists, Grand Expedition, Trial quest, Act 4 page).
- **Citation locators**: every quoted locator string was matched against the corpus or fetched page (script-based check). After fixes all quoted locators match. Video timestamps were checked against transcripts for the claims they support.

## What was changed and why

### Direction and relation errors
- `introduced_in` is entity -> league per schema, but 5 edges had it reversed. Fixed: `loc_forbidden_sanctum`, `char_molten_one`, `loc_azmeri_wildwood`, `concept_allflame`, `loc_kingsmarch` now point to their league (ids renamed).
- Kalguur: `char_aldur created artifact_triskelion_flame` was wrong. The wiki says the Runefathers forged the Flame after Aldur's death. Replaced with `artifact -associated_with-> char_aldur` (community_theory, medium). Added `faction_runefathers created artifact_triskelion_flame`.
- `char_johan rules loc_kingsmarch` -> `leads` (wiki: Treasurer). `char_raulf` / `char_johan commands workers` -> `associated_with` (Raulf runs recruitment; Johan manages the Treasury only).
- `concept_kingsmarch_charter founded loc_kingsmarch` and `char_ixan_keita founded loc_korathin` -> `associated_with` (no source says the charter or Ixan founded them).
- `loc_kingsmarch located_in loc_karui_shores` -> `associated_with` (Karui Shores is the access point, not the containing region).
- `allies_with` from Karui and Ezomytes to Trarthans -> `associated_with`. The wiki says the aid was not requested.
- `aspect_of` used for Vesper/Sovereign and Tul/Esh -> `associated_with`. Tul/Esh -> deity links are name-only and are now marked community_theory/low.

### Factual corrections
- `char_cadigan_the_first` summary conflated the usurper and Cadigan I. Rewritten per the Triskelion section.
- `char_isla` "shared criminal past" was not in any source. Replaced with the letter's actual wording.
- `char_vruun` "prerequisite" was interpretive. Reworded to the quest text.
- `char_undertaker_arimor` "(Not Ambrius.)" removed (unsupported). Thruldana now cites God page.
- `league_phrecia`: the start date "20 Feb" is not in the corpus. Reworded to "after Necro Settlers, until 23 April 2025". Phrecia is an event, not a league, and the summary now says so.
- `league_settlers_of_kalguur`: removed the unsupported "shipping route between Wraeclast and Kalguur" claim. Added the GGG forum source (end date 10 Jun 2025 00:00 GMT+2 = 9 Jun 22:00 UTC) and "Kingsmarch going core in 3.26".
- `event_kingsmarch_founding`: "funds town-building" -> "invests Gold" (Exploring Kingsmarch tutorial).
- `char_matiki` plot_role `main_plot` -> `branch` (Trial of the Ancestors is an optional quest, "required = No").
- `char_navali` edge description: removed "hatungo" (that term is a different role).
- `char_maata` / `char_utula`: removed History-of-Wraeclast source; it cites in-world efn quote sources, not chieftain identity. Karui chieftain list is kept.
- `char_isla`/`char_faustus` member_of `faction_kalguuran` -> canon_status inferred / confidence low (neither is in the Kalguur "Notable members" list).
- `char_maxarius` and its `same_entity_as` / `opposes` edges: upgraded to canon/high because History of Wraeclast (line ~188, from Lycia's relic texts) and the Innocence wiki page state it. Video remains a supporting source.
- `e_char_ailith__located_in__loc_monastery_of_the_keepers` locator changed to the exact quote.
- `e_char_exile_poe1__participates_in__league_phrecia` locator fixed to real text (Settlers page: Legacy of Phrecia "held immediately after until April 23").

### Removed
- `loc_phrecia` node and its 2 edges (`league_phrecia -associated_with-> loc_phrecia`, `loc_phrecia -associated_with-> char_tyndarus_phrecius`). No source places Phrecia as a location; the name-link was unsupported.
- 4 unused sources pruned (kingsmarch_prospecting, orbala, poe2wiki tribal_medicine, utopia).

### Added (lore that was missing from the Kingsmarch / Settlers domain)
- `loc_starfall_crater` (Black Knight's location; Kingsmarch Bosses section) with edge `char_the_black_knight located_in loc_starfall_crater`.
- `concept_verisium` (meteorite ore; Kalguur Runes; PoE2 Dark Mists) with `concept_verisium associated_with concept_kalguuran_runesmithing`.
- `faction_runefathers` (Kalguuran runesmiths; Triskelion Flame forging).
- `concept_royal_order_of_criminal_hanging` (Johan's letter: unenforceable under the Charter statute of limitations) with edges to Johan and to the Charter.
- `event_virtue_gem_ban` (Cadigan III bans virtue gem collection; Kalguur Thaumaturgy) with `char_cadigan_the_third commands event_virtue_gem_ban`.
- `loc_pondium_wraeclast associated_with loc_pondium` (low, name match only: Valerie's Pondium vs the Kalguuran shipping port Pondium).

## Remaining doubts
1. **Branch tags `allflame` and `mirage`** are not in the controlled list in SCHEMA.md. They are used here as new snake_case tags for 2026 leagues. Reviewer should confirm or merge.
2. **Karui tribe -> deity pairs** (`faction_karui_tribe_* worships deity_*`): checked for Ngamahu, Tasalio, Tawhoa, Tukohama, Ramako, Valako, Kitava and Hinekora. Arohongui and Rongokurai are only weakly attested (Karui Gods page). Rongokurai is not on the Karui Gods page, so its edge is canon_status medium/low. Some other Karui-tribe/deity edges still rest on the chieftain list alone.
3. **Lycia's `allies_with` Beidat** is a pact-based relation; the relation vocabulary has no better fit. Kept.
4. **`char_divinia` location**: the Aiding an Archivist wiki page says Oriath Docks (Act 10). The video places the first meeting in the Act 2 camp. The fragment follows the wiki and notes it; the conflict is unresolved.
5. **Video transcripts** are auto-captions with misheard names (Lycia/Lycea, Beidat/Baydat, Divinia/Davina, Azmeri/Asmiri). Timestamps were checked, but the quoted wording is approximate. The `a charlatan, a liar and a power seeker` locator is a caption paraphrase.
6. **`char_zana_the_originator` vs `char_zana`**: the wiki names Zana Caeserius "the Originator" but does not say whether she is the Master Cartographer Zana. Kept as inferred/low.
7. **Kalguuran membership of Isla and Faustus** is inferred only (see above).
8. **Legacy of Phrecia** as "league" type: it is an event that ran outside the challenge-league calendar. The type is kept because the schema uses `league` for release containers. Consider `event`.
9. **Settlers league end-date** uses GGG's local-time statement; the UTC-based dates on the wiki infobox agree.
10. **Not verified line by line**: the Ancestor-league tournament details (team compositions, unique items per tribe), Mercenary unique items, Necropolis unique-item stats and Keepers graft/implant items. These were checked only as far as the lore claims go.
11. **Sources not present in the local corpus** (fetched live on 2026-11-05 from poewiki raw): Kingsmarch, Johan, Curse of the Allflame, Path of Exile: Settlers of Kalguur, Legacy of Phrecia, Valerie, Vesper, Lycia, Innocence (via corpus). Their locators are verified against the fetched text. The corpus index lacks them.
