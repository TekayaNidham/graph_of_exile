"""Validate a staging fragment (or a merged master) against docs/SCHEMA.md.
Usage: python3 -I scripts/validate_fragment.py staging/<domain>.json [--strict-refs]
Exit code 0 = OK (warnings allowed), 1 = errors."""
import json, re, sys

NODE_TYPES = {"character", "deity", "faction", "location", "event", "artifact", "concept", "era",
              "league", "act", "text", "creature"}
PLOT_ROLES = {"main_plot", "endgame_plot", "branch", "background", "meta"}
ERAS = ["primordial", "precursor", "azmeri_ezomyte_ancient", "vaal", "post_vaal_dark_age",
        "eternal_empire_rise", "eternal_empire_fall", "post_cataclysm", "poe1_campaign", "poe1_atlas",
        "poe1_leagues", "interlude_between_games", "poe2_campaign", "poe2_endgame", "unknown"]
GAMES = {"poe1", "poe2"}
CANON = {"canon", "dev_statement", "inferred", "community_theory"}
CONF = {"high", "medium", "low"}
RELATIONS = set("""defeats kills imprisons frees resurrects corrupts betrays allies_with opposes serves commands leads
member_of founded created destroyed worships sacrifices possesses wields seeks guides rescues exiles rules succeeded_by
transforms_into aspect_of same_entity_as reincarnation_of parent_of sibling_of spouse_of lover_of descendant_of student_of
located_in occurs_in originates_from travels_to part_of causes leads_to precedes participates_in witnesses reveals mentions
introduced_in associated_with continues_in next_beat""".split())
SRC_TYPES = {"wiki", "official_site", "patch_notes", "forum_post", "youtube", "book", "in_game_text",
             "dev_interview", "reddit", "fandom", "other"}
RELIAB = {"primary", "secondary", "tertiary"}
PREFIX = {"character": "char_", "deity": "deity_", "faction": "faction_", "location": "loc_", "event": "event_",
          "artifact": "artifact_", "concept": "concept_", "era": "era_", "league": "league_", "act": "act_",
          "text": "text_", "creature": "creature_"}
ID_RE = re.compile(r"^[a-z][a-z0-9_]*$")


def validate(d, strict_refs=False):
    errs, warns = [], []
    srcs = {s.get("id") for s in d.get("sources", [])}
    for s in d.get("sources", []):
        for k in ("id", "title", "type", "reliability"):
            if not s.get(k): errs.append(f"source missing {k}: {s}")
        if s.get("type") not in SRC_TYPES: errs.append(f"source {s.get('id')} bad type {s.get('type')}")
        if s.get("reliability") not in RELIAB: errs.append(f"source {s.get('id')} bad reliability")
        if not s.get("url") and s.get("type") not in ("book", "in_game_text"): warns.append(f"source {s.get('id')} has no url")
    ids = set()
    for n in d.get("nodes", []):
        i = n.get("id", "?")
        if not ID_RE.match(i): errs.append(f"node bad id {i!r}")
        if i in ids: errs.append(f"duplicate node id {i}")
        ids.add(i)
        for k in ("name", "type", "summary", "plot_role", "era", "canon_status", "confidence"):
            if not n.get(k): errs.append(f"node {i} missing {k}")
        if n.get("type") not in NODE_TYPES: errs.append(f"node {i} bad type {n.get('type')}")
        elif not i.startswith(PREFIX[n["type"]]): warns.append(f"node {i} prefix mismatch for type {n['type']}")
        if n.get("plot_role") not in PLOT_ROLES: errs.append(f"node {i} bad plot_role {n.get('plot_role')}")
        if n.get("era") not in ERAS: errs.append(f"node {i} bad era {n.get('era')}")
        if not set(n.get("games", [])) <= GAMES: errs.append(f"node {i} bad games {n.get('games')}")
        if n.get("canon_status") not in CANON: errs.append(f"node {i} bad canon_status")
        if n.get("confidence") not in CONF: errs.append(f"node {i} bad confidence")
        if n.get("plot_role") == "branch" and not n.get("branches"): errs.append(f"node {i} is branch but has no branches")
        if not n.get("sources"): errs.append(f"node {i} has no sources")
        for s in n.get("sources", []):
            if s.get("source_id") not in srcs: errs.append(f"node {i} cites unknown source {s.get('source_id')}")
    eids = set()
    for e in d.get("edges", []):
        i = e.get("id", "?")
        if i in eids: errs.append(f"duplicate edge id {i}")
        eids.add(i)
        for k in ("source", "target", "relation", "plot_role", "era", "canon_status", "confidence"):
            if not e.get(k): errs.append(f"edge {i} missing {k}")
        if e.get("relation") not in RELATIONS: errs.append(f"edge {i} bad relation {e.get('relation')}")
        if e.get("plot_role") not in PLOT_ROLES: errs.append(f"edge {i} bad plot_role")
        if e.get("era") not in ERAS: errs.append(f"edge {i} bad era {e.get('era')}")
        if not set(e.get("games", [])) <= GAMES: errs.append(f"edge {i} bad games")
        if e.get("canon_status") not in CANON: errs.append(f"edge {i} bad canon_status")
        if e.get("confidence") not in CONF: errs.append(f"edge {i} bad confidence")
        if not e.get("sources"): errs.append(f"edge {i} has no sources")
        for s in e.get("sources", []):
            if s.get("source_id") not in srcs: errs.append(f"edge {i} cites unknown source {s.get('source_id')}")
        for end in ("source", "target"):
            if e.get(end) not in ids:
                (errs if strict_refs else warns).append(f"edge {i} {end} {e.get(end)} not defined in this file")
    return errs, warns


if __name__ == "__main__":
    d = json.load(open(sys.argv[1]))
    errs, warns = validate(d, "--strict-refs" in sys.argv)
    print(f"nodes={len(d.get('nodes', []))} edges={len(d.get('edges', []))} sources={len(d.get('sources', []))}")
    print(f"{len(errs)} errors, {len(warns)} warnings")
    for x in errs[:60]: print("ERROR", x)
    for x in warns[:25]: print("WARN ", x)
    sys.exit(1 if errs else 0)
