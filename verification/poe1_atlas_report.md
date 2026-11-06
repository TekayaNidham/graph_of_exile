# poe1_atlas verification report

Checked against the local poewiki corpus (quest pages, journals, History_of_Wraeclast, Struggle/Decay/Cleansing Fire/Tangle/Watchers pages, league pages) plus poedb Kirac dialogue. Validator: 0 errors (59 warnings, all cross-domain refs). YouTube transcripts could not be fetched (rate limit), so no src_yt sources.

## Verified OK
League versions/dates (Echoes 3.13.0, Siege 3.17.0, Secrets 3.26.0 = 2025-06-13, Synthesis 3.6.0, Keepers 3.27.0, Mirage 3.28.0 2026-03-06, Allflame 3.29.0 2026-07-24), Guardian/Elder Guardian names, Elderslayers roster, journal content, Threads of the Originator beats, 3.28 Atlas rework, next_beat chain (3001-3090, release order).

## Fixed
- Map Device: removed "Venarius created it" and "originates from Theopolis". Watchers of Decay built it (Book of Memories p9); Templars found a broken one; Kirac rebuilt one from the Vault of Venarius (legacy). Added Watchers->created edge.
- Removed unsupported edges: Watchstone->Voidstone ("replaced"), Sirus corrupts Baran, Elder precedes Maven, Exarch opposes Eater (replaced by Cleansing Fire opposes Tangle), Venarius allies_with Elder / corrupts Valdo (replaced by imprisons Valdo, seeks Elder).
- Downgraded: Zana lover_of Sirus (unspoken attraction only), Sirus defeats Elder, Incarnation aspect_of edges (interpretive), Eagon sibling_of Originator (inferred), Eater/Exarch seeks Atlas (re-sourced to Kirac quotes instead of unread forum post).
- Starforge: sources disagree on forger (Watchers vs Order of the Djinn/Egrin); documented. Added Qianga, Betucia, Egrin edges, Lightkeeper node.
- Struggle concept rewritten (champion duels, Lightkeeper); Cleansing Fire "neural network" now sourced; Kirac rewritten (officer, younger brother of Baran, Vanguard, backs the Maven); added Maven resurrects Baran, Kirac/Exile allies Maven, Elder defeat -> Struggle, Kirac Baran-search legacy event; Voidstone/Watchstone summaries corrected; Secrets of the Atlas date.
- Removed unsupported alias "Arkhon Caeserius" from Valdo.

## Remaining doubts
- Same-entity status of Zana vs Zana the Originator, and Eagon's parentage, stay uncertain.
- Venarius as Synthesis boss is assumed to be the High Templar (not confirmed).
- Cavas identity and Maven origin unresolved; Memory Nexus (Synthesis) vs Valdo's "Nexus" may differ.
- Uber variants still one concept node; Maven's Game, Moments only thinly covered; forum posts not read directly.
- No 2026 Atlas story found beyond 3.28 rework.
