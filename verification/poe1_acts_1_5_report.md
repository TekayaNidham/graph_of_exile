# Fact-check: poe1_acts_1_5

Checked against the local poewiki corpus (quest pages, Act 1-5, Dominus, Gravicius, Piety, Kaom, Voll, Daresso, Merveil, Brutus, Shavronne, Maligaro, Doedre, Sin, Avarius, Kitava, Victario, Tolman, Rapture Device, Letters of Exile). Nearly all quest-beat, boss and NPC claims held. Live poewiki.net is Cloudflare-blocked, so NPC pages missing from the corpus (Tarkleigh, Nessa, Bestel, Greust, Silk, Yeena, Eramir, Helena, Lani, Utula and others) were checked only through quest dialogue on the corpus pages. No 2025-2026 content or YouTube transcripts were checked.

Result: 184 -> 188 nodes, 383 -> 394 edges, 119 sources, 0 validator errors.

## Changes
- **Source URLs:** many wiki URLs were not real page addresses (e.g. `The_Siren_s_Cadence`, `The_Sceptre_of_God_quest_`). They were rebuilt from `_index.json` titles (`The_Siren%27s_Cadence`, `The_Sceptre_of_God_(quest)`).
- **Class nodes:** the Witch "PC Gamer developer interview" reason could not be verified (page text unavailable), so it was removed. The Letters of Exile cite was misused for class lore, because it lists individual NPC exiles, not the seven classes. The class summaries now rest on Dominus's and Gravicius's class-specific boss dialogue. The Marauder is Karui. Ranger, Duelist, Shadow, Templar and Scion crimes are undocumented; all set to low confidence and `inferred` where not Marauder.
- **Story spine:** the old chain put Way Forward before Siren's Cadence and Deal with the Bandits first in Act 2. Rebuilt per the wiki: Way Forward completes in the Act 2 Western Forest; Deal with the Bandits is given after Through Sacred Ground. All story_order values and 43 next_beat edges were regenerated (sequence = source story_order).
- **Merveil and Daresso:** they married (the wiki's "grand wedding"), and Daresso then fled. Fixed the "fiancee" wording and removed a duplicate `lover_of` edge whose description was swapped with `spouse_of`.
- **Corrections:**
  - Removed the `spouse_of` edge Tolman -> Clarissa (boyfriend, not spouse).
  - Removed the odd `Alira possesses Apex` edge.
  - Act 4 area `loc_the_ascent` re-tagged to Act 4 (it is on the Act 4 area list).
  - `event_a1_shipwreck` renamed: the wiki says exiles were dumped off a ship, not shipwrecked.
  - Fairgraves is no longer described as a "pirate"; the "four(nine)" Golden Pages typo is now four.
  - Maramoa is no longer called a "leader"; the Karui link is inferred and low confidence.
  - Icius Perandus's membership of the Perandus family is not verified.
  - Greust's ethnicity is not stated; Helena only calls the village Azmeri.
  - Malachai was spared by Voll, not self-spared.
  - Niko now has the `delve` branch tag (a `branch` plot_role needs one).
  - Geofri defeat edge raised to high confidence (his boss status is supported).
  - Lorrata, Axiom Prison, Oak, Alira, Lani, Utula, Grigor and Kaom summaries tightened to what the wiki says.
- **Additions:**
  - Nodes: Petarus and Vanja, Kira, General Lioneye, Hyrri.
  - Edges: Kaom/Deshret -> Voll, Kaom defeats Lioneye, Voll spares Malachai and burns Maligaro and Doedre, Malachai serves Chitus, and `concept_the_beast_act4` same_entity_as `deity_beast`.

## Remaining doubts
- Merveil's "former court beauty" and the Kaom-Kitava relationship (Haku vs. carvings) are interpretive.
- Class backstories are largely undocumented in the corpus. The Scion unlock point was not re-verified.
- The Lord's Labyrinth and Strange Growths quests (Acts 1-3) and Niko's quests are not modelled.
- Source types: `src_ingame_*` entries reuse wiki URLs, which is acceptable but duplicative.
- Dominus "rules Oriath" is medium confidence; the wiki only calls him the highest Templar rank.
