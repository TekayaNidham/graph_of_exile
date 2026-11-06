# eternal_empire fact-check report

Checked against the local PoE wiki corpus: Eternal_Empire, History_of_Wraeclast, Order_of_the_Templar, Sin, Trarthus, Purity Chronicles, Perandus family, Avarius, Doedre/Shavronne/Maligaro pages, Hyrri, and PoE2 Faridun, Sorrow Among Stones, Environmental_lore and Lore. All 36 wiki source ids resolve to corpus files. A WebFetch of poe2wiki returned an anti-bot page, so no web checks were possible.

I read all 142 nodes and 287 edges. Core chronology was verified and is correct: founding 1 IC, Alano 35 IC, Tyndarus 870-872, Labyrinth 1317, Chitus 1319, Bloody Flowers/Titucius 1333, Geofri 1332, siege and Chitus' death 1334, Rapture Device 1336, Cataclysm ~1339, PoE1 set 1599-1600.

## Changes
- Removed the edge Alano victory occurs_in Phrecia Cathedral. The wiki only says the heartlands were named after Alano; the sealing happened in the dark being's lair.
- Veruso `exiles` thaumaturgy became `opposes`. Lazhwar `guides` Malachai became `associated_with`, since the wiki says only that Malachai drew on Lazhwar's work. Karui `founded` Lioneye's Watch became `associated_with`.
- Malachai kills Kaom is now `inferred` with low confidence. The wiki says a voice posing as Tukohama (Beast/Malachai) lured him and the Beast devoured him. Original Sin causes Beast creation is now `inferred`.
- Garukhan rescues Sin is upgraded to canon/high. It is sourced from in-game item text (Chains of Castigation, Blood of Innocence) and Sin's dialogue. The Garukhan node now states she was the Sekhema Orbala, married Sin and bore Shakari.
- Sin's summary now says "likely" the Hooded One; the PoE2 wiki Lore page itself says "likely". It also states that Sin and Innocence are brothers, with "twin" coming from the stained-glass windows, which are Templar propaganda. This is not "friends" as the task text suggested.
- PoE2: the exile `defeats` Jamanra became `opposes` (medium). Jamanra retreated and was killed by Asala.
- Exile defeats Doedre was mis-sourced to the Gemling Legion page. It now cites Doedre Stamatis (Act 4 Harvest, Act 8 Cesspool, Act 9).
- Added exile defeats Shavronne (Act 4, The Harvest), which was missing. Maligaro's edge now also notes Acts 4 and 9.
- Added Victario lover_of Hyrri, with Hyrri's daughter Ahuana (per Hyrri's wiki page). Added Purity Chronicles `mentions` edges for Books 1, 2, 5 and 6, and Voll crowned leads_to Malachai spared.
- Golden Pages are softened to "possibly" and set to medium confidence, as the wiki says. Voll's coronation date now records the discrepancy: 1st Sacrato plus a week (EE page) vs the 2nd Sacrato (Purity Chronicles). Daresso's 1450 IC date is flagged as contradicting the 1336 IC use of his Eye of Desire; the wiki itself calls it inexplicable.
- Added 4 sources. The fragment now has 142 nodes, 293 edges and 46 sources, with 0 validator errors.

## Remaining doubts and gaps
- Caspiro killed by the "dark being" = Vaal Oversoul is stated only in the Eternal Empire member list and the GGG Q&A, so it stays medium confidence.
- The order of Romira's reign relative to Tyndarus is not given. The edge saying the Night of a Thousand Ribbons festival "precedes" Chitus' assassination was reworded to stay neutral.
- Not checked in detail: the many locator strings that cite the Eternal Empire page, and the YouTube sources.
- Still thin or missing: Valdo, Clarissa, Sekhemas as a class, Kastov, Medici Perandus, Fairgraves, Akoya, Skothe, Ahuana; the PoE2 Eternal presence beyond the Ogham cemetery; Labyrinth Ascendancy classes as lore figures; Phrecia league links; 2025-2026 content.
- Templar and Innocence nodes list only poe1 in `games`; PoE2 mentions were not verified.
