# Verification report: poe1_acts_6_10

Method: every node and edge was checked against the local PoE1 wiki corpus (Act 6-10 pages, quest pages, boss pages, Sin, Kitava, Garukhan, Orbala, Tolman, Letters of Exile, Quest, Campaign). The live poewiki.net was blocked by bot protection, so no web search was possible and 2025-2026 changes could not be checked online. No YouTube transcripts were used.

Result: 138 nodes, 277 edges, 81 sources, validator 0 errors (89 warnings, all references to other domains).

## Confirmed as correct
Act names and order (The Rising Tide, Lord and Legion, Eclipse, Reunion, Return to Oriath), monster levels and towns. The god-kill chain: Tukohama, Abberath, Ryslatha, Brine King, Ralakesh, Gruthkul, Arakaali, Yugul, Solaris and Lunaris, Garukhan, Shakari. Sin's Dark Ember plan with Shavronne, Maligaro and Doedre merging into the Depraved Trinity. Sin as Garukhan's husband and Shakari's father, and Garukhan = Orbala (stated by the wiki). The Bannon, Staff, Innocence, Horns and Kitava sequence, and the Pantheon membership (the nodes did not say which gods are major and which minor; this is now added).

## Changes
- Lilly Roth: removed the invented "Black Crest's successor" and fixed it to granddaughter of Weylam and captain of her own ship. Weylam is now described as summoned by the Black Flag at the Beacon.
- Maramoa: "Maraketh-descended" was wrong. He is a Karui exile from Ngamakanui (Letters of Exile, sentenced 1597 IC) and an Act 3 and Act 8 NPC.
- Lani and Bannon: removed the unsupported "Templar" label. Lani leads the rebels at Overseer's Tower; Bannon is an Act 5 vendor who bears the fire of Ngamahu.
- Eramir: removed "elderly". He is a Theopolis museum scholar. Greust and Silk: removed "warrior" and "artist" overstatements and lowered confidence to medium.
- Kira, Irasha, Tasuni and Oyun: corrected the dekhara/akhara wording. Irasha's twin sister died of a scorpion sting.
- Ryslatha and Abberath: summaries corrected to match Sin's and Bestel's dialogue. Gruthkul: added the hint that her daughters plotted against Arakaali.
- Saresh: era changed to unknown and confidence to low (the date is not stated). Orbala: era changed to unknown and canon_status to canon; only the "she freed Sin" link remains inferred.
- Garukhan's Pantheon edge was raised from medium to high; the Garukhan page says she is a minor Pantheon goddess.
- The Sin -> Pantheon `created` edge was unsupported (Sin captures souls; he did not create the Pantheon) and became `associated_with`.
- Removed the loose edge "Brine King's Reef part_of Tsoatha" (not supported) and the duplicate "defeats Kitava" edge.
- Epilogue chain: Kirac's "Picking Up the Pieces" quest is historical content (v3.9, removed in 3.17). The current Epilogue is Karui Shores with Helena and Commander Kirac ("A Call to Arms"). The Kirac event was removed from the next_beat chain (marked historical), and sail_away now goes straight to atlas_begins. Updated the Epilogue, Kirac and Zana nodes.
- Act 5 Kitava event: added the Kitava page source (the fight is unwinnable, the Sign of Purity is destroyed, Sin rescues the exile).
- Avarius defeat edge: clarified that the target is "Avarius, Reassembled", a Wicker Man.
- Descriptions and sources: generic edges that cited only "Campaign: Overview" now cite the relevant quest pages. Generic descriptions ("Encountered here.") are now specific.

## Added
Nodes: Cultists of Kitava, Kitava's Horns, Sekhema Asenath, Veruso, and the events Gemling Legion Rises (Act 8), No Love for Old Ghosts (Act 10) and Web of Secrets (Act 7). New edges (21) cover Sin rescuing the exile, Kitava defeating the exile, the cultists, Hector killing Asenath, Piety killing Tolman, Tukohama's warriors against Ryslatha, the Vaal against Gruthkul, Lilly and Weylam seeking artifacts, and Kira carrying the Sekhema Feather.

## Remaining doubts
- The ordering of the Act 7 beats (Ralakesh, Gruthkul, Maligaro, Arakaali) is player-choice dependent; the chain follows one plausible route. Act 6 order is also approximate.
- Dusk and Dawn are known only through Maramoa's remarks (medium confidence).
- Solaris/Lunaris = Solerai/Lundara is speculative (noted as such).
- Quests not covered: The Rogue Harbour, Unearthing the Past, The Lost Expedition, The Silver Locket, The Immortal Syndicate, Fastis Fortuna (Rogue Exiles, masters and others belong to other domains).
- The `char_veruso` and `char_asenath` nodes are minimal and may duplicate nodes owned by other domains.
- No check against 2025-2026 patches was possible (site blocked), and the Epilogue may have changed in recent versions.
