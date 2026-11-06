# Verification report: poe2_acts_4_plus

Checked: all quoted locators were grepped against the local wiki files (only paraphrase-level misses remained, which are fine); Act 4/5/6, The Search, Dark Mists, Trial of the Ancestors, Recruit_* quests, Siege of Oriath, Legacy of the Precursors, Countess, Beast, Sin (poewiki), league pages, and YouTube 1U2bFh1V9Mo timestamps. The 1.0 release date (2026-12-11, Acts 5-6 still unreleased) was confirmed by web search; poe2db Act 5 listings (bosses, quests) confirmed. The Kitten Cat Noodle and Gavryn transcripts could not be fetched (rate-limited), so they were not used.

Changes
- The main spine had 6 undefined beats (precursor_script_memory, defeat_torvian, defeat_benedictus, reveal_third_edict, siege_of_oriath, legacy_of_precursors) plus char_benedictus. They are now defined with story_order and part_of/participates_in edges.
- Fixed story_order off-by-one (Tavakai fight 5409, cure 5410, call to arms 5411). This matches the quest-log order (steal, then Third Edict reveal, then fight).
- Endgame chain corrected: Ziggurat Refuge -> Legacy of the Precursors (6000) -> Waygate (6001); the reversed waygate->legacy edge was removed. Ziggurat Refuge era changed to poe2_campaign.
- Captain Hartlin: removed the unsupported claim that Tangmazu turned him undead (wiki only says he died and became undead; the "his lies" line is an inference).
- Hooded One / Sin: the identity confession is in Act 2 (Trail of Corruption), so acts were updated. The "discrepancy with PoE1 lore" was wrong: the poewiki Sin page already gives him a brother (Innocence) and a vaguely remembered sister; the real open point is the "somewhere else" (Precursor-like) origin. Added a low-confidence inferred edge to faction_precursors.
- Removed misleading edges: Tujen continues_in free_tangmazu; Act 4 introduced_in the Rise of the Abyssal league (it came with the Third Edict update; the league edge was misattributed).
- Added the Kanu death (Tavakai strikes, medium: implied) and Exile defeats Benedictus.
- Interlude names verified via Act wiki page; source added. Kingsmarch ruins revisit corrected (Dannig and Makoru, not Farrow).

Remaining doubts
- Acts 5/6 nodes are datamine-only (low confidence). Interludes may be renumbered or removed at 1.0 (unconfirmed).
- Siege of Oriath is labelled Act 4 in the wiki infobox but follows the Interludes; filed under Interlude 3.
- Duplicate characters (Orianna/Countess, Doryani, Asala, Renly) may overlap other domains; merge handles ids.
- Act 4 YouTube compilations not checked.
