# Verification report: exile_and_sources

Fragment: staging/exile_and_sources.json
Result after fixes: 63 nodes, 82 edges, 12 sources, validator 0 errors, 0 warnings.
Verifier model: Haiku 5.5 (per the user's instruction for the verification step).

## What was checked

- Local wiki corpus, re-read against the claims: History_of_Wraeclast (intro, Vaal Cataclysm, Kalguur, Eternal Empire, Izaro/Labyrinth, Chitus, Purity Rebellion, Cataclysm, Oriath, The Present, Atlas of Worlds), Order_of_the_Templar, Letters_of_Exile, The_Lord_s_Labyrinth_quest_, Chaos_lore_, Return_to_Oriath, Path_of_Exile_Origins.
- PoE2 corpus: Lore, Ascension_trials, Trial_of_the_Sekhemas, The_Trial_of_Chaos, Act_3, Environmental_lore, The_Beast (for cross-game mentions).
- Live fetch: poewiki Marauder and Scion pages (blocked by Anubis, access denied). Two web searches for class backstories and 2025-2026 official lore returned no usable lore.

## Changes made

Sources
- src_book_path_of_exile_origins: writers corrected to Edwin McRae and Royal McGraw (wiki infobox); illustrator Carlos Rodriguez kept.
- src_book_the_lords_labyrinth_gamebook: added URL https://www.pathofexile.com/forum/view-thread/2671008 (GGG post, 28 Oct 2019, cited by the wiki). Removed the unsupported "supporter tier" claim.

Nodes corrected
- text_path_of_exile_origins: issue dates (July 2014 to April 2015 digital; June 2015 paperback) and the writer credit.
- char_victario: the wiki says he created the Ancient Graffiti; "Death to Sin" is his ambush cry and the title of issue #3, not the graffiti. Alias "Victario Nevalius" added.
- char_voll, event_purity_rebellion, char_victario: games set to ["poe1"]. The corpus has no PoE2 mention of these (grep = 0).
- char_exile_poe1: summary now lists the Act 5 Avarius/Innocence fight.
- event_vaal_cataclysm: added the PoE2 Fate of the Vaal time-travel beat, cited to the History page.
- char_class_templar: summary tightened to what the wiki supports.
- char_the_trialmaster: branches changed to ultimatum and trial_of_chaos (the Trialmaster originates in PoE1 Ultimatum).
- text_lords_labyrinth_gamebook: summary rewritten to what the wiki says (not canon, inconsistencies).

Nodes added (the Exile's direct interactions and missing Eternal Empire beats)
- char_avarius, deity_innocence, deity_sin, char_malachai (minimal, shared canonical ids; merge should prefer the owning domain's definitions).
- char_ondar (Lord Mayor Ondar), event_siege_of_sarn (Divini 1334 IC), event_assassination_of_chitus (Night of a Thousand Ribbons, 1334 IC).

Edges corrected
- e_char_exile_poe2__participates_in__concept_trial_of_chaos and __concept_trial_of_the_sekhemas renamed to seeks. The trials are optional, so "participates_in" was wrong.
- e_char_exile_poe1__opposes__char_izaro: added the Labyrinth quest infobox (boss = Izaro) as a source.
- e_char_class_templar__associated_with__char_exile_poe1: description no longer claims "starting class", which the wiki does not say.
- Two next_beat edges converted to precedes with sequence null: Sentenced -> Kitava defeated (duplicated an existing precedes edge, which was kept) and Kitava defeated -> Elder expelled. The spine skipped all intervening acts and epilogue, so as next_beat it would be a broken chain. The Exile-journey spine should be built by the acts domains.

Edges added
- char_exile_poe1 defeats char_avarius (Act 5), defeats deity_innocence (Act 5), allies_with deity_sin (Act 10).
- char_malachai causes event_eternal_empire_cataclysm.
- char_voll participates_in event_siege_of_sarn.
- char_ondar kills char_chitus; char_ondar, char_victario and char_chitus participates_in event_assassination_of_chitus.

## Verified as correct (no change)

- Winter of the World, Lightless, Order of the Djinn, Slumber of the Gods, Vaal Cataclysm (3,126 survivors), Kalguur expedition leaders (Olroth, Uhtred, Vorana, Medved), Night of a Thousand Ribbons (c. 334 IC), Lord's Labyrinth opened 1317 IC, Chitus crowned 1319 IC and sealing Izaro, Purity Rebellion 1333-1334, Cataclysm c. 1339 IC, Oriath as theocracy, PoE1 campaign 1599-1600 IC, Dominus killed atop Sceptre of God in Act 3, Voll's remains in Act 4, Kitava defeated in Act 10 with Sin after Bannon's sacrifice, Return to Oriath (Act 5, Mt. Veruso portal).
- Letters of Exile sentence template quote (exact).
- PoE2 prelude: twenty years after Kitava, Count Geonor, Hooded One, Seed of Corruption, Ogham death sentence, escape by jumping into the ocean.
- Ascension Trials: Sekhemas (Djinn Barya / Balbala's Barya, Act 2, bosses Rattlecage, Hadi and Rafiq, Ashar, Zarokh) and Chaos (Chimeral Inscribed Ultimatum from Xyclucian, Act 3, Temple of Chaos). 4 tiers, 2 points each, 8 total. Third trial not yet released.
- Chaos lore: Impulse, Trialmaster's master, Vaal worship, Blood Crucible pact, Trialmaster several thousand years old.

## Remaining doubts and gaps

- PoE1 class backstories other than Templar (Marauder, Duelist, Ranger, Shadow, Witch, Scion) are NOT modelled. Wiki class pages are blocked, and searches gave only gameplay guides.
- PoE2 playable classes and PoE1 ascendancy classes (Berserker, Slayer, Inquisitor and others) are NOT modelled. No corpus pages.
- Official out-of-game lore is thin. Verified items: Origins comic (2014-2015) and the Lord's Labyrinth gamebook (2019, not canon). No 2025-2026 book, novel, ExileCon lore talk or dev lore interview was found. The GGG "Lore Q&A Part One" post is not read.
- The Shaper and Elder defeat beats are only partly modelled. Zana, the Shaper and the Elderslayers belong to the Atlas domain. The Elder-expulsion event here follows the wiki's Zana narrative; the exile's role in luring it is per Zana's dialogue.
- Ordering: winter -> slumber -> Vaal precedes edges are medium/dev_statement; the wiki says the prehistory order is not chronological. The Eternal Empire rise/fall boundary (c. 334 IC) is a convention.
- Siege of Sarn and Assassination of Chitus are not ordered relative to each other (the wiki does not fix the order of the siege and the festival ambush).
- Eternal Empire Cataclysm games set to poe1 and poe2 by the researcher. The corpus gives no PoE2 mention of the Eternal Cataclysm itself, only of the Eternal Empire and Vaal Cataclysm. Confirm before merge.
- Malachai appears in the PoE2 corpus only via The_Beast page; games kept as poe1 only in the minimal node.
- Trialmaster's era stays poe2_campaign while the entity is PoE1 Ultimatum-origin. The era could arguably be poe1_leagues.
