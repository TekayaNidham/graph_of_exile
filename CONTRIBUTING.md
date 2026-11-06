# Contributing to Graph of Exile

Thank you for helping. This is an alpha, and the lore of Path of Exile is huge, so there are certainly gaps and mistakes. Every correction counts, from a misspelled name to a missing league. You do not need to write code to help.

## Ways to help

| You want to… | Do this |
|---|---|
| Report a wrong fact, label or link | Open a **Lore correction** issue |
| Report missing lore (a character, event, league storyline…) | Open a **Missing lore** issue |
| Suggest a better or primary source | Open a **Lore correction** issue with the source |
| Fix or add data yourself | Open a pull request (protocol below) |
| Improve the explorer or scripts | Open a pull request with a short description and a screenshot if it is visual |

## What a good report contains

1. **The id**: the node or edge `id` (shown in the explorer's details panel and in `dataset/master/*.json`). For missing lore, give the name instead.
2. **The claim**: what is wrong, or what should be there.
3. **A source with a locator**: a wiki page and section, a quest or NPC dialogue line, an item's flavour text, or a video with a timestamp. In-game text and official GGG posts are the strongest sources.
4. **Spoiler or datamine status**: say whether it comes from released content or from a datamine.

## Pull request protocol

1. **Never edit `dataset/master/`, `dataset/poe1/` or `dataset/poe2/` by hand.** They are generated.
2. **Choose where your change goes:**
   - **New or extended lore:** add a fragment `dataset/fragments/<topic>.json`, or extend the matching existing fragment. The format is in [`dataset/schema/SCHEMA.md`](dataset/schema/SCHEMA.md).
   - **Corrections to existing data:** add an operation to [`dataset/curation/patches.json`](dataset/curation/patches.json) (`set_node`, `set_edge`, `remove_edge`), with a `reason`.
   - **Duplicate entities:** add `"duplicate_id": "canonical_id"` to [`dataset/curation/id_aliases.json`](dataset/curation/id_aliases.json).
3. **Follow the rules:**
   - Reuse existing ids. Search `dataset/master/nodes.json` by name and aliases first, and follow the id conventions in [`docs/CANONICAL_IDS.md`](docs/CANONICAL_IDS.md).
   - Every node and edge needs at least one source with a precise `locator`.
   - Label honestly. Use `canon_status` (`canon`, `dev_statement`, `inferred` or `community_theory`) and `confidence` (`high`, `medium` or `low`), and tag unreleased content with `release_status: "datamined_pre_1.0"`.
   - Use the controlled vocabularies for `type`, `plot_role`, `era` and `relation` (see the schema).
   - Do not paste long copyrighted text. Summarise in your own words and quote only short lines in `locator`.
4. **Rebuild and validate:**
   ```bash
   python3 scripts/validate_fragment.py dataset/fragments/<topic>.json
   python3 scripts/merge.py
   for v in master poe1 poe2; do python3 scripts/validate_fragment.py dataset/$v/graph.json --strict-refs; done
   ```
   The CI workflow re-runs the merge and fails if the committed dataset does not match the fragments and patches.
5. **Keep one topic per pull request**, and say in the description what you changed and where the evidence is.

## Review

A maintainer checks each change against its sources. Disputed lore is not rejected: it is kept and labelled as `inferred` or `community_theory`, with the competing sources attached.

## After PoE2 1.0

When PoE2 1.0 releases (planned 11 December 2026), the nodes tagged `datamined_pre_1.0` will be replaced with the released Act 5–6 lore. Help with that update is especially welcome.
