/* Graph of Exile — explorer
 * Static, dependency-light (Cytoscape.js only). Data: data/<variant>.json built by scripts/build_site.py
 */
(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- vocabularies & palettes ----------
  const ROLES = ["main_plot", "endgame_plot", "branch", "background", "meta"];
  const ROLE_LABEL = { main_plot: "Main plot", endgame_plot: "Endgame plot", branch: "Branch", background: "Background", meta: "Meta" };
  const ROLE_COLOR = { main_plot: "#e0a43a", endgame_plot: "#d0402e", branch: "#8b8bff", background: "#1ba29b", meta: "#aa9e82" };
  const ERAS = ["primordial", "precursor", "azmeri_ezomyte_ancient", "vaal", "post_vaal_dark_age", "eternal_empire_rise", "eternal_empire_fall",
    "post_cataclysm", "poe1_campaign", "poe1_atlas", "league_storylines", "interlude_between_games", "poe2_campaign", "poe2_endgame", "unknown"];
  const ERA_LABEL = {
    primordial: "Primordial age", precursor: "Precursors", azmeri_ezomyte_ancient: "Azmeri & Ezomyte antiquity", vaal: "Vaal civilisation",
    post_vaal_dark_age: "Dark age after the Vaal", eternal_empire_rise: "Rise of the Eternal Empire", eternal_empire_fall: "Fall of the Empire (Cataclysm)",
    post_cataclysm: "Theocracy of Oriath", poe1_campaign: "PoE1 campaign", poe1_atlas: "PoE1 Atlas", league_storylines: "League storylines (PoE1 → PoE2)",
    interlude_between_games: "Between the games", poe2_campaign: "PoE2 campaign", poe2_endgame: "PoE2 endgame", unknown: "Unknown",
  };
  // old (teal/blue) -> recent (gold/blood) — perceptually ordered
  const ERA_RAMP = ["#2f6f73", "#2c7f7a", "#2f8f78", "#4c9a6a", "#6fa05a", "#93a24a", "#b49d40", "#c9923a", "#e0a43a", "#e3863a", "#d97a5a", "#c45a3a", "#c0402e", "#9e2a20", "#6b6257"];
  const TYPES = ["character", "deity", "faction", "location", "event", "artifact", "concept", "creature", "text", "league", "act", "era"];
  const TYPE_COLOR = { character: "#e8cf98", deity: "#d0402e", faction: "#8b8bff", location: "#1ba29b", event: "#e0a43a", artifact: "#af6025",
    concept: "#b48ad8", creature: "#7f9f4a", text: "#aa9e82", league: "#5b8fd8", act: "#8d7c62", era: "#c9a45c" };
  const TYPE_SHAPE = { character: "ellipse", deity: "star", faction: "hexagon", location: "round-rectangle", event: "diamond", artifact: "triangle",
    concept: "octagon", creature: "vee", text: "rhomboid", league: "tag", act: "rectangle", era: "barrel" };
  const CONF_COLOR = { high: "#e0a43a", medium: "#8a6a3b", low: "#6b5a4a" };
  const GAME_COLOR = { both: "#e8cf98", poe1: "#e0a43a", poe2: "#8b8bff", none: "#6b6257" };
  const COMM = ["#e0a43a", "#8b8bff", "#1ba29b", "#d0402e", "#b48ad8", "#7f9f4a", "#af6025", "#5b8fd8", "#e8cf98", "#c45a8a", "#3fa0a0", "#c9923a",
    "#8fb35a", "#a35c3a", "#6a7fd0", "#d0a0d0", "#9e9e5a", "#5aa07f", "#d07f5a", "#7a7a9e"];
  const SPEED_MS = [11000, 8500, 6500, 4800, 3200];
  // entity-first view: events are hidden and drawn as "shared event" links between the entities involved
  const ENTITY = new Set(["character", "deity", "faction", "location", "artifact", "creature"]);

  // ---------- state ----------
  const S = {
    variant: "master", layout: "s", colorBy: "plot_role", sizeBy: "pr", labels: "auto",
    roles: new Set(ROLES), eras: new Set(ERAS), types: new Set(TYPES), branches: null, rels: null,
    conf: new Set(["high", "medium", "low"]), datamined: true, spineOnly: false, maxDist: 8,
    selected: null, hops: 1, follow: null, exileClass: "", focusOnly: false, playing: false, beat: -1, exileToggle: 0, events: false,
  };
  let D = null; // current data
  let cy = null;
  const cache = {};
  let byId = new Map(), spine = [], playTimer = null, cardTimer = null, mmDirty = true;

  // ---------- URL state ----------
  function readHash() {
    const h = new URLSearchParams(location.hash.slice(1));
    if (["master", "poe1", "poe2"].includes(h.get("v"))) S.variant = h.get("v");
    if (["s", "p", "t", "r", "c"].includes(h.get("l"))) S.layout = h.get("l");
    if (h.get("f")) S.follow = h.get("f");
    if (h.get("ex")) S.exileClass = h.get("ex");
    S.focusOnly = h.get("only") === "1";
    if (h.get("color")) S.colorBy = h.get("color");
    if (h.get("size")) S.sizeBy = h.get("size");
    S.events = h.get("ev") === "1";
    S.pendingNode = h.get("n");
  }
  function writeHash() {
    const h = new URLSearchParams({ v: S.variant, l: S.layout, color: S.colorBy, size: S.sizeBy });
    if (S.events) h.set("ev", "1");
    if (S.follow) h.set("f", S.follow);
    if (S.exileClass) h.set("ex", S.exileClass);
    if (S.focusOnly) h.set("only", "1");
    if (S.selected) h.set("n", S.selected);
    history.replaceState(null, "", "#" + h.toString());
  }

  // ---------- encodings ----------
  function gameKey(n) {
    const g = n.games || [];
    return g.includes("poe1") && g.includes("poe2") ? "both" : g.includes("poe1") ? "poe1" : g.includes("poe2") ? "poe2" : "none";
  }
  function colorOf(n) {
    switch (S.colorBy) {
      case "era": return ERA_RAMP[Math.max(0, ERAS.indexOf(n.era))];
      case "type": return TYPE_COLOR[n.type] || "#888";
      case "cm": return n.cm >= 0 ? COMM[n.cm % COMM.length] : "#555";
      case "confidence": return CONF_COLOR[n.confidence] || "#555";
      case "game": return GAME_COLOR[gameKey(n)];
      default: return ROLE_COLOR[n.plot_role] || "#888";
    }
  }
  function sizeOf(n) {
    if (n.id.startsWith("char_exile_")) return 74;
    const m = S.sizeBy === "pr" ? n.pr : S.sizeBy === "bt" ? n.bt : S.sizeBy === "degree" ? Math.min(1, (n.degree || 0) / 60) : 0.08;
    return Math.round(12 + 52 * Math.sqrt(m || 0));
  }
  function fontOf(n) {
    if (n.id.startsWith("char_exile_")) return 26;
    return Math.round(10 + 14 * Math.sqrt(n.pr || 0));
  }
  function applyEncoding() {
    if (!cy) return;
    cy.batch(() => {
      cy.nodes(".n").forEach((el) => {
        const n = el.data("raw");
        el.data({ color: colorOf(n), size: sizeOf(n), fs: fontOf(n) });
      });
    });
    cy.nodes(".n").removeClass("lbl-all lbl-none").addClass(S.labels === "all" ? "lbl-all" : S.labels === "none" ? "lbl-none" : "");
    renderLegend();
    mmDirty = true;
  }

  // ---------- Cytoscape style ----------
  const STYLE = [
    { selector: "node.n", style: {
      "background-color": "data(color)", width: "data(size)", height: "data(size)", shape: "data(shape)",
      label: "data(label)", "font-family": "Crimson Pro, Georgia, serif", "font-size": "data(fs)", color: "#ead7a8",
      "text-outline-color": "#090705", "text-outline-width": 2, "text-valign": "bottom", "text-margin-y": 3,
      "min-zoomed-font-size": 8, "border-width": 1, "border-color": "#000", "text-max-width": 140, "text-wrap": "ellipsis",
      "transition-property": "opacity, border-width, border-color", "transition-duration": reduceMotion ? 0 : 180,
    } },
    { selector: "node.exile", style: { "border-width": 4, "border-color": "#f3e2b4", "underlay-color": "#e0a43a", "underlay-padding": 14, "underlay-opacity": 0.28, "underlay-shape": "ellipse", "font-family": "Cinzel, serif", color: "#f3e2b4", "text-max-width": 420, "text-wrap": "none" } },
    { selector: "node.lbl-all", style: { "min-zoomed-font-size": 0 } },
    { selector: "node.lbl-none", style: { label: "" } },
    { selector: "node.band", style: {
      shape: "rectangle", "background-opacity": 0, label: "data(label)", "font-family": "Cinzel, serif", "font-size": 56, color: "#a07e48",
      "text-opacity": 0.75, "text-valign": "center", width: 1, height: 1, events: "no", "min-zoomed-font-size": 0, "text-wrap": "wrap", "text-max-width": "data(w)",
    } },
    { selector: "edge", style: {
      "curve-style": "haystack", "haystack-radius": 0, width: 1, "line-color": "#6b5434", opacity: 0.32,
      "transition-property": "opacity, line-color, width", "transition-duration": reduceMotion ? 0 : 180,
    } },
    { selector: "edge.derived", style: { "line-color": "#8a6a3b", "line-style": "dashed", "line-dash-pattern": [5, 4], opacity: 0.28 } },
    { selector: "edge.trailx", style: { "curve-style": "bezier", width: 5, "line-color": "#f0c060", opacity: 0.95, "target-arrow-shape": "triangle", "target-arrow-color": "#f0c060", "arrow-scale": 1.1, "z-index": 90 } },
    { selector: "node.beat-loc", style: { "border-width": 6, "border-color": "#fff3cf", "underlay-color": "#e0a43a", "underlay-padding": 16, "underlay-opacity": 0.4, "z-index": 100, "min-zoomed-font-size": 0 } },
    { selector: "edge.spine", style: { "line-color": "#e0a43a", width: 2.6, opacity: 0.75 } },
    { selector: "edge.spine.endgame", style: { "line-color": "#d0402e" } },
    { selector: "edge.spine.saga", style: { width: 16, opacity: 0.55 } },
    { selector: "edge.dim", style: { opacity: 0.035 } },
    { selector: "node.wp", style: { width: 18, height: 18, shape: "diamond", label: "", "border-width": 2, "border-color": "#f0c060", "background-color": "#3a2a14" } },
    { selector: "node.wp.beat-active, node.wp.focus", style: { width: 30, height: 30, label: "data(label)", "font-size": 20, "min-zoomed-font-size": 0 } },
    { selector: "node.ctx", style: { "font-size": 22, "min-zoomed-font-size": 0, "text-opacity": 1, "text-max-width": 420 } },
    { selector: "node.sband", style: { "font-size": 70, color: "#8a6a3b", "text-opacity": 0.85, "text-max-width": 2400 } },
    { selector: "node.sband.big", style: { "font-size": 200, color: "#c9a45c", "text-wrap": "none", "text-max-width": 9000 } },
    { selector: "node.band.lane", style: { "font-size": 44, "text-halign": "left", "text-wrap": "none", color: "#c9a45c" } },
    { selector: ".faded", style: { opacity: 0.06, "text-opacity": 0 } },
    { selector: "node.ctx", style: { opacity: 1, "text-opacity": 1, "min-zoomed-font-size": 0 } },
    { selector: "edge.hl", style: {
      opacity: 0.95, "line-color": "#c9a45c", width: 1.8, "curve-style": "bezier", "target-arrow-shape": "triangle", "target-arrow-color": "#c9a45c",
      "arrow-scale": 0.8, label: "data(rel)", "font-size": 10, color: "#cdbb9b", "text-rotation": "autorotate", "text-outline-color": "#090705",
      "text-outline-width": 2, "min-zoomed-font-size": 7, "font-family": "Crimson Pro, serif",
    } },
    { selector: "node.focus", style: { "border-width": 4, "border-color": "#fff3cf", "underlay-color": "#fff3cf", "underlay-padding": 10, "underlay-opacity": 0.22, "min-zoomed-font-size": 0, "z-index": 99 } },
    { selector: "node.path", style: { "border-width": 4, "border-color": "#d0402e", opacity: 1, "text-opacity": 1, "min-zoomed-font-size": 0 } },
    { selector: "edge.path", style: { opacity: 1, width: 4, "line-color": "#d0402e", "curve-style": "bezier", label: "data(rel)", "font-size": 12, color: "#f3e2b4", "text-outline-color": "#000", "text-outline-width": 2, "text-rotation": "autorotate" } },
    { selector: "node.visited", style: { "border-width": 3, "border-color": "#c9a45c" } },
    { selector: "edge.trail", style: { opacity: 1, width: 4, "line-color": "#f0c060", "curve-style": "bezier" } },
    { selector: "node.beat-active", style: { "border-width": 6, "border-color": "#fff3cf", "underlay-color": "#e0a43a", "underlay-padding": 18, "underlay-opacity": 0.4, "z-index": 100, "min-zoomed-font-size": 0, "font-size": 20 } },
    { selector: ".hidden", style: { display: "none" } },
    { selector: ".force-show", style: { display: "element" } },
    { selector: "node:selected", style: { "overlay-color": "#e8cf98", "overlay-opacity": 0.18, "overlay-padding": 6 } },
  ];

  // ---------- loading ----------
  async function loadVariant(v) {
    if (!cache[v]) {
      const r = await fetch(`data/${v}.json`);
      if (!r.ok) throw new Error(`Failed to load ${v}`);
      cache[v] = await r.json();
    }
    return cache[v];
  }

  async function show(variant, { keepSelection = false } = {}) {
    stopPlay();
    $("#loading").classList.remove("done");
    S.variant = variant;
    document.querySelectorAll("#variants button").forEach((b) => b.classList.toggle("active", b.dataset.v === variant));
    D = await loadVariant(variant);
    if (document.fonts && document.fonts.ready) await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]);
    byId = new Map(D.nodes.map((n) => [n.id, n]));
    // facets that depend on data
    const allBranches = new Set(["(none)"]); D.nodes.forEach((n) => (n.branches || []).forEach((b) => allBranches.add(b)));
    if (!S.branches) S.branches = new Set(allBranches);
    else allBranches.forEach((b) => { if (!S._branchSeen?.has(b)) S.branches.add(b); });
    S._branchSeen = allBranches;
    const allRels = new Set(D.edges.map((e) => e.relation));
    if (!S.rels) S.rels = new Set(allRels);
    else allRels.forEach((r) => { if (!S._relSeen?.has(r)) S.rels.add(r); });
    S._relSeen = allRels;

    const els = [];
    for (const n of D.nodes) {
      const pos = n[S.layout] || n.p;
      els.push({ group: "nodes", classes: "n" + (n.id.startsWith("char_exile_") ? " exile" : ""),
        data: { id: n.id, label: n.name, raw: n, shape: TYPE_SHAPE[n.type] || "ellipse", color: colorOf(n), size: sizeOf(n), fs: fontOf(n) }, position: { x: pos[0], y: pos[1] } });
    }
    for (const e of D.edges) {
      if (!byId.has(e.source) || !byId.has(e.target)) continue;
      const spineE = e.relation === "next_beat";
      const xera = byId.get(e.source).era !== byId.get(e.target).era;
      els.push({ group: "edges", classes: (spineE ? "spine" + (e.plot_role === "endgame_plot" ? " endgame" : "") : "") + (xera && !spineE ? " xera" : ""),
        data: { id: e.id, source: e.source, target: e.target, rel: e.relation.replace(/_/g, " "), raw: e } });
    }
    // ---- entity-first: derive "shared event" links between entities that take part in the same event
    S.adj = new Map();
    const direct = new Set(), evNbr = new Map();
    const addAdj = (a, b, rel, dir) => { if (!S.adj.has(a)) S.adj.set(a, []); S.adj.get(a).push({ other: b, rel, dir }); };
    for (const e of D.edges) {
      const a = byId.get(e.source), b = byId.get(e.target);
      if (!a || !b) continue;
      addAdj(a.id, b.id, e.relation, "out"); addAdj(b.id, a.id, e.relation, "in");
      direct.add(a.id < b.id ? a.id + "|" + b.id : b.id + "|" + a.id);
      if (e.relation === "next_beat") continue;
      if (a.type === "event" && ENTITY.has(b.type)) (evNbr.get(a.id) || evNbr.set(a.id, []).get(a.id)).push(b.id);
      if (b.type === "event" && ENTITY.has(a.type)) (evNbr.get(b.id) || evNbr.set(b.id, []).get(b.id)).push(a.id);
    }
    const derived = new Map();
    const link = (x, y, ev) => {
      if (x === y) return;
      const key = x < y ? x + "|" + y : y + "|" + x;
      if (direct.has(key)) return;
      if (!derived.has(key)) derived.set(key, { x, y, events: [] });
      const d = derived.get(key); if (!d.events.includes(ev)) d.events.push(ev);
    };
    S.spineEnt = new Set(["char_exile_poe1", "char_exile_poe2"]);
    for (const [ev, list] of evNbr) {
      const ents = [...new Set(list)], E = byId.get(ev);
      if (E.chronology && E.chronology.story_order != null) ents.forEach((i) => S.spineEnt.add(i));
      const locs = ents.filter((i) => byId.get(i).type === "location"), others = ents.filter((i) => byId.get(i).type !== "location");
      others.forEach((o) => locs.forEach((l) => link(o, l, ev)));
      if (others.length <= 6) { for (let i = 0; i < others.length; i++) for (let j = i + 1; j < others.length; j++) link(others[i], others[j], ev); }
      else {
        const hub = others.find((i) => i.startsWith("char_exile_")) || [...others].sort((a, b) => (byId.get(b).pr || 0) - (byId.get(a).pr || 0))[0];
        others.forEach((o) => link(hub, o, ev));
      }
      if (!others.length) for (let i = 1; i < locs.length; i++) link(locs[i - 1], locs[i], ev);
    }
    const RANK = { main_plot: 0, endgame_plot: 1, branch: 2, background: 3, meta: 4 };
    for (const [key, d] of derived) {
      const evs = d.events.map((i) => byId.get(i)).sort((a, b) => (RANK[a.plot_role] ?? 9) - (RANK[b.plot_role] ?? 9));
      const raw = { id: "d_" + key, source: d.x, target: d.y, relation: "shared_event", events: d.events, plot_role: evs[0].plot_role,
        description: "Together in: " + evs.map((x) => x.name).join("; "), branches: [...new Set(evs.flatMap((x) => x.branches || []))],
        games: [...new Set(evs.flatMap((x) => x.games || []))], canon_status: "inferred", confidence: "medium",
        sources: evs.slice(0, 3).flatMap((x) => (x.sources || []).slice(0, 1)) };
      els.push({ group: "edges", classes: "derived", data: { id: raw.id, source: d.x, target: d.y, rel: evs[0].name + (evs.length > 1 ? ` (+${evs.length - 1})` : ""), raw } });
    }
    D._derivedCount = derived.size;
    S.rels.add("shared_event"); S._relSeen.add("shared_event");
    if (cy) cy.destroy();
    cy = cytoscape({
      container: $("#cy"), elements: els, style: STYLE, layout: { name: "preset" },
      minZoom: 0.02, maxZoom: 4, boxSelectionEnabled: true, selectionType: "additive",
      textureOnViewport: els.length > 4000, hideEdgesOnViewport: false, pixelRatio: "auto", motionBlur: false,
    });
    addBands();
    bindCy();
    buildFacets();
    applyEncoding();
    applyFilters();
    buildJourney();
    buildNames();
    setLayout(S.layout, { animate: false });
    $("#loading").classList.add("done");
    const want = keepSelection && S.selected && byId.has(S.selected) ? S.selected : (S.pendingNode && byId.has(S.pendingNode) ? S.pendingNode : null);
    S.pendingNode = null;
    if (!isExileFollow() && S.focusOnly) enterPlotView();
    if (want) select(want, { center: true }); else { clearSelection(); if (S.layout !== "f") focusOn(cy.nodes(".n:visible"), 40, 1.0, 0); }
    writeHash();
  }

  function addBands() {
    // era labels for the timeline layout (positions precomputed in build_site.py)
    const bands = (D.bands || []).map((b) => ({ group: "nodes", classes: "band" + (b.lane != null ? " lane" : ""), selectable: false, grabbable: false,
      data: { id: "band_" + (b.era || "lane" + b.lane), label: b.label || ERA_LABEL[b.era] || b.era, w: b.w || 2000 }, position: { x: b.x, y: b.y } }));
    cy.add(bands);
    cy.add((D.saga_labels || []).map((b, k) => ({ group: "nodes", classes: "band sband" + (b.big ? " big" : ""), selectable: false, grabbable: false,
      data: { id: "sband_" + k, label: b.label }, position: { x: b.x, y: b.y } })));
    cy.nodes(".band").addClass("hidden");
  }

  // ---------- facets ----------
  function countBy(fn) { const m = new Map(); for (const n of D.nodes) for (const k of [].concat(fn(n))) m.set(k, (m.get(k) || 0) + 1); return m; }
  function checkList(el, items, set, { swatch, label, onChange }) {
    el.innerHTML = "";
    for (const [key, count] of items) {
      const id = `${el.id}_${key}`.replace(/[^a-z0-9_]/gi, "_");
      const lab = document.createElement("label");
      lab.className = "check";
      lab.innerHTML = `<input type="checkbox" id="${id}" ${set.has(key) ? "checked" : ""}>${swatch ? `<i class="sw" style="background:${swatch(key)}"></i>` : ""}<span>${esc(label ? label(key) : key.replace(/_/g, " "))}</span><span class="n" data-k="${esc(key)}">${count}</span>`;
      lab.querySelector("input").addEventListener("change", (ev) => { ev.target.checked ? set.add(key) : set.delete(key); onChange?.(); applyFilters(); });
      el.appendChild(lab);
    }
  }
  function buildFacets() {
    const roles = countBy((n) => n.plot_role);
    checkList($("#fRole"), ROLES.filter((r) => roles.has(r)).map((r) => [r, roles.get(r)]), S.roles, { swatch: (k) => ROLE_COLOR[k], label: (k) => ROLE_LABEL[k] });
    const eras = countBy((n) => n.era);
    checkList($("#fEra"), ERAS.filter((e) => eras.has(e)).map((e) => [e, eras.get(e)]), S.eras, { swatch: (k) => ERA_RAMP[ERAS.indexOf(k)], label: (k) => ERA_LABEL[k] });
    const types = countBy((n) => n.type);
    checkList($("#fType"), TYPES.filter((t) => types.has(t)).map((t) => [t, types.get(t)]), S.types, { swatch: (k) => TYPE_COLOR[k] });
    renderBranches();
    const rels = new Map(); D.edges.forEach((e) => rels.set(e.relation, (rels.get(e.relation) || 0) + 1));
    rels.set("shared_event", D._derivedCount || 0);
    checkList($("#fRel"), [...rels].sort((a, b) => b[1] - a[1]), S.rels, {});
    const conf = countBy((n) => n.confidence);
    checkList($("#fConf"), ["high", "medium", "low"].filter((c) => conf.has(c)).map((c) => [c, conf.get(c)]), S.conf, { swatch: (k) => CONF_COLOR[k], label: (k) => k + " confidence" });
  }
  function renderBranches() {
    const q = $("#branchFilter").value.trim().toLowerCase();
    const br = countBy((n) => (n.branches && n.branches.length ? n.branches : ["(none)"]));
    const items = [...br].filter(([k]) => !q || k.includes(q)).sort((a, b) => (a[0] === "(none)" ? -1 : b[0] === "(none)" ? 1 : b[1] - a[1]));
    checkList($("#fBranch"), items, S.branches, {});
  }

  // ---------- filtering ----------
  function nodePasses(n) {
    if (n.id.startsWith("char_exile_")) return true;
    if (!S.roles.has(n.plot_role) || !S.eras.has(n.era) || !S.types.has(n.type) || !S.conf.has(n.confidence)) return false;
    if (!S.datamined && n.release_status && n.release_status !== "released") return false;
    const b = n.branches && n.branches.length ? n.branches : ["(none)"];
    if (!b.some((x) => S.branches.has(x))) return false;
    if (S.maxDist < 8 && (n.exile_distance == null || n.exile_distance > S.maxDist)) return false;
    if (S.focusOnly && S.focusSet && !S.focusSet.has(n.id)) return false;
    if (!S.events && n.type === "event" && !(S.layout === "s" && n.chronology && n.chronology.story_order != null) && !(S.layout === "f" && S.plotIds && S.plotIds.has(n.id))) return false;
    if (S.spineOnly) {
      if (S.events && !(n.chronology && n.chronology.story_order != null)) return false;
      if (!S.events && !S.spineEnt.has(n.id)) return false;
    }
    return true;
  }
  function applyFilters() {
    if (!cy) return;
    const vis = new Set();
    cy.batch(() => {
      cy.nodes(".n").forEach((el) => {
        const raw = el.data("raw");
        const ok = nodePasses(raw);
        el.toggleClass("hidden", !ok);
        el.toggleClass("wp", !S.events && raw.type === "event");
        if (ok) vis.add(el.id());
      });
      cy.edges().not(".trailx").not(".pspine").forEach((el) => {
        const e = el.data("raw");
        const ok = vis.has(e.source) && vis.has(e.target) && (S.rels.has(e.relation) || (S.spineOnly && e.relation === "next_beat")) &&
          (e.relation !== "shared_event" || !S.events);
        el.toggleClass("hidden", !ok);
      });
    });
    // linked facet counts: visible / total
    const vc = { role: new Map(), era: new Map(), type: new Map(), conf: new Map(), br: new Map() };
    for (const id of vis) {
      const n = byId.get(id);
      const inc = (m, k) => m.set(k, (m.get(k) || 0) + 1);
      inc(vc.role, n.plot_role); inc(vc.era, n.era); inc(vc.type, n.type); inc(vc.conf, n.confidence);
      (n.branches && n.branches.length ? n.branches : ["(none)"]).forEach((b) => inc(vc.br, b));
    }
    const upd = (sel, m) => document.querySelectorAll(`${sel} .n`).forEach((s) => {
      const total = s.dataset.total || (s.dataset.total = s.textContent);
      const v = m.get(s.dataset.k) || 0;
      s.textContent = v === +total ? total : `${v}/${total}`;
    });
    upd("#fRole", vc.role); upd("#fEra", vc.era); upd("#fType", vc.type); upd("#fConf", vc.conf); upd("#fBranch", vc.br);
    const ve = cy.edges(":visible").length;
    $("#visibleCount").textContent = `${vis.size} of ${D.nodes.length} nodes · ${ve} of ${D.edges.length} edges visible`;
    if (S.selected) highlight(S.selected);
    mmDirty = true;
  }

  // ---------- layouts ----------
  function setLayout(key, { animate = true } = {}) {
    if (key === "s" && cy && !cy.nodes(".n").first().data("raw").s) key = "p";
    if (key === "f" && !S.plotPos) key = "s";
    if (!cy) return;
    document.querySelectorAll("#layouts button").forEach((b) => b.classList.toggle("active", b.dataset.l === key || (key === "f" && b.dataset.l === "s")));
    cy.nodes(".band").not(".sband").toggleClass("hidden", key !== "t");
    cy.nodes(".sband").toggleClass("hidden", key !== "s");
    cy.edges(".xera").toggleClass("dim", key === "t" || key === "s");
    cy.edges(".spine").toggleClass("saga", key === "s");
    if (key === "live") {
      const eles = cy.elements(".n:visible, edge:visible");
      if (eles.nodes().length > 1600) { if (!confirm(`Re-flow ${eles.nodes().length} nodes? This can take a few seconds.`)) return; }
      eles.layout({ name: "cose", animate: animate && !reduceMotion && eles.nodes().length < 700 ? "end" : false, randomize: false,
        nodeRepulsion: () => 9000, idealEdgeLength: () => 70, edgeElasticity: () => 80, gravity: 0.6, numIter: 1200, fit: true, padding: 40 }).run();
      return;
    }
    S.layout = key;
    cy.edges(".pspine").remove();
    if (key === "f") addPlotSpine();
    applyFilters();
    if (!S.playing && S.beat >= 0) { hideCard(); clearTrail(); cy.elements().removeClass("faded hl ctx force-show"); S.beat = -1; updateProgress();
      document.querySelectorAll(".beat").forEach((b) => b.classList.remove("sel", "visited")); if (S.selected) highlight(S.selected); }
    const opts = { name: "preset", positions: (el) => { if (!el.hasClass("n")) return el.position(); const p = key === "f" ? (S.plotPos.get(el.id()) || el.data("raw").s || el.data("raw").p) : (el.data("raw")[key] || el.data("raw").p); return { x: p[0], y: p[1] }; },
      fit: false, animate: animate && !reduceMotion, animationDuration: 650, animationEasing: "ease-in-out-cubic",
      stop: () => focusOn(cy.nodes(".n:visible").union(cy.nodes(".band:visible")), 40, 1.0, 400) };
    cy.nodes().layout(opts).run();
    writeHash();
    mmDirty = true;
  }

  // camera: fit a collection, but never zoom closer than maxZ
  function focusOn(eles, pad = 110, maxZ = 1.4, dur = 800) {
    if (!eles || !eles.length) return;
    // fit inside the part of the canvas that is not covered by the side panels, story card or legend
    const stage = $("#stage").getBoundingClientRect();
    const fl = $("#filters"), dt = $("#details");
    const left = fl.offsetParent && getComputedStyle(fl).transform === "none" ? fl.getBoundingClientRect().right - stage.left : 0;
    const right = !dt.hidden ? stage.right - dt.getBoundingClientRect().left : 0;
    const card = $("#storyCard"); const top = !card.hidden ? Math.min(card.getBoundingClientRect().bottom - stage.top, stage.height * 0.45) : 0;
    const W = cy.width() - Math.max(0, left) - Math.max(0, right), H = cy.height() - Math.max(0, top);
    const bb = eles.boundingBox();
    const z = Math.min(maxZ, Math.max(cy.minZoom(), Math.min((W - 2 * pad) / Math.max(bb.w, 1), (H - 2 * pad) / Math.max(bb.h, 1))));
    const pan = { x: Math.max(0, left) + W / 2 - z * (bb.x1 + bb.w / 2), y: Math.max(0, top) + H / 2 - z * (bb.y1 + bb.h / 2) };
    cy.stop(); cy.animate({ zoom: z, pan }, { duration: reduceMotion ? 0 : dur, easing: "ease-in-out-cubic" });
  }

  function recenter() {
    if (!cy) return;
    if (S.beat >= 0 && spine[S.beat]) {
      const el = cy.getElementById(spine[S.beat].id);
      const ppl = participants(el).filter((x) => x.data("raw").type !== "event");
      return focusOn(ppl.length ? beatFocus(el, ppl).union(S.events ? el : cy.collection()) : hero(spine[S.beat]), 120, 1.1, 600);
    }
    if (cy.$(".path").length) return focusOn(cy.$(".path"), 80, 1.4, 600);
    if (S.selected) return focusOn(neighbourhood(cy.getElementById(S.selected), 1), 90, 1.6, 600);
    if (!$("#storyCard").hidden && profile()) return showPrologue();
    const h = hero(null);
    if (h && h.length) return focusOn(h.closedNeighborhood(":visible"), 90, 1.0, 600);
    focusOn(cy.nodes(".n:visible"), 40, 1.0, 600);
  }

  // camera target for a story beat: the participants closest to the beat (far-flung recurring characters are lit but not framed)
  function beatFocus(el, ppl) {
    if (!ppl.length) return ppl;
    const p = el.position();
    const d = (x) => { const q = x.position(); return Math.hypot(q.x - p.x, q.y - p.y); };
    const sorted = ppl.toArray().sort((a, b) => d(a) - d(b));
    let near = sorted.filter((x) => d(x) < 1100).slice(0, 5);
    if (!near.length) near = el.visible() ? [] : sorted.slice(0, 1);
    const c = cy.collection(near);
    return el.visible() ? c.union(el) : c;
  }

  // ---------- selection & neighbourhood ----------
  function neighbourhood(el, hops) {
    let nb = el.closedNeighborhood(":visible");
    for (let i = 1; i < hops; i++) nb = nb.closedNeighborhood(":visible");
    return nb;
  }
  function highlight(id) {
    const el = cy.getElementById(id);
    if (!el.length) return;
    cy.batch(() => {
      cy.elements().removeClass("faded hl focus ctx");
      const nb = neighbourhood(el, S.hops);
      cy.elements().not(nb).not(".band").addClass("faded");
      nb.edges().addClass("hl");
      nb.nodes().addClass("ctx");
      el.addClass("focus");
    });
  }
  function select(id, { center = true, keepPlaying = false } = {}) {
    if (!keepPlaying) stopPlay();
    const el = cy.getElementById(id);
    if (!el.length) return;
    S.selected = id;
    if (el.hasClass("hidden")) el.addClass("force-show");
    clearPath();
    highlight(id);
    renderDetails(byId.get(id));
    $("#hopBar").hidden = false;
    if (center) {
      const nb = neighbourhood(el, Math.min(S.hops, 1));
      focusOn(nb, 90, 1.6, 500);
    }
    document.querySelectorAll(".beat").forEach((b) => b.classList.toggle("sel", b.dataset.id === id));
    writeHash();
  }
  function clearSelection() {
    S.selected = null;
    if (!cy) return;
    cy.elements().removeClass("faded hl focus ctx force-show");
    clearPath();
    $("#details").hidden = true; document.body.classList.remove("details-open");
    $("#hopBar").hidden = true;
    document.querySelectorAll(".beat.sel").forEach((b) => b.classList.remove("sel"));
    writeHash();
  }

  // ---------- details panel ----------
  const relLabel = (r) => r.replace(/_/g, " ");
  function srcHtml(pairs) {
    if (!pairs || !pairs.length) return "";
    return pairs.map(([sid, loc]) => {
      const s = D.sources[sid] || { title: sid };
      const t = s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>` : esc(s.title);
      return `<div class="src">${t} <span class="rel-tag">${esc(s.type || "")}${s.reliability ? " · " + esc(s.reliability) : ""}</span>${loc ? `<span class="loc">${esc(loc)}</span>` : ""}</div>`;
    }).join("");
  }
  function renderDetails(n) {
    const out = [], inc = [];
    cy.getElementById(n.id).connectedEdges().not(".pspine, .trailx").forEach((ed) => {
      const e = ed.data("raw");
      (e.source === n.id ? out : inc).push(e);
    });
    const relRow = (e, other, dir) => {
      const o = byId.get(other);
      if (!o) return "";
      const conf = e.confidence !== "high" ? `<span class="rel-tag">${esc(e.confidence)}</span>` : "";
      return `<div class="rel">${dir === "out" ? `<b>${esc(relLabel(e.relation))}</b> → ` : ""}<a data-go="${esc(o.id)}">${esc(o.name)}</a>${dir === "in" ? ` <b>${esc(relLabel(e.relation))}</b> this` : ""}${conf}${e.description ? `<span class="desc">${esc(e.description)}</span>` : ""}</div>`;
    };
    const ch = n.chronology || {};
    const rank = [...byId.values()].filter((x) => (x.pr || 0) > (n.pr || 0)).length + 1;
    const chips = [
      `<span class="chip role-${n.plot_role}">${ROLE_LABEL[n.plot_role]}</span>`,
      ...(n.branches || []).map((b) => `<span class="chip">${esc(b.replace(/_/g, " "))}</span>`),
      `<span class="chip">${esc(n.canon_status)} · ${esc(n.confidence)}</span>`,
      n.release_status && n.release_status !== "released" ? `<span class="chip warn">datamined · pre-1.0</span>` : "",
    ].join("");
    const sortRels = (a) => a.sort((x, y) => (x.relation === "next_beat") - (y.relation === "next_beat") || x.relation.localeCompare(y.relation));
    $("#detailBody").innerHTML = `
      <h2 class="d-title ${n.plot_role}">${esc(n.name)}</h2>
      <div class="d-sub">${esc(n.type)}${n.subtype ? " · " + esc(n.subtype.replace(/_/g, " ")) : ""} · ${esc(ERA_LABEL[n.era] || n.era)} · ${(n.games || []).map((g) => (g === "poe1" ? "PoE 1" : "PoE 2")).join(" & ") || "out-of-game"}</div>
      <div class="chips">${chips}</div>
      ${n.aliases && n.aliases.length ? `<div class="d-sub">Also: ${esc(n.aliases.join(", "))}</div>` : ""}
      <p class="d-summary">${esc(n.summary)}</p>
      ${n.alt_summaries ? `<details><summary class="small">Other accounts (${n.alt_summaries.length})</summary>${n.alt_summaries.map((a) => `<p class="small">${esc(a.summary)}</p>`).join("")}</details>` : ""}
      <div class="sep"></div>
      <dl class="kv">
        ${n.eras && n.eras.length > 1 ? `<dt>Spans</dt><dd>${n.eras.map((e) => esc(ERA_LABEL[e] || e)).join(" → ")}</dd>` : ""}
        ${ch.relative ? `<dt>When</dt><dd>${esc(ch.relative)}</dd>` : ""}
        ${ch.in_world_year != null ? `<dt>Year</dt><dd>${esc(ch.in_world_year)}</dd>` : ""}
        ${ch.story_order != null ? `<dt>Story beat</dt><dd>#${esc(ch.story_order)}</dd>` : ""}
        ${n.acts && n.acts.length ? `<dt>Acts</dt><dd>${esc(n.acts.join(", ").replace(/_/g, " "))}</dd>` : ""}
        <dt>From the Exile</dt><dd>${n.exile_distance == null ? "unconnected" : n.exile_distance + " step" + (n.exile_distance === 1 ? "" : "s")}</dd>
        <dt>Importance</dt><dd>#${rank} of ${D.nodes.length} (PageRank)</dd>
        ${n.cm >= 0 && D.communities[n.cm] ? `<dt>Community</dt><dd>${esc(D.communities[n.cm].label)} circle</dd>` : ""}
      </dl>
      ${(() => {
        const beats = (S.adj.get(n.id) || []).map((x) => byId.get(x.other)).filter((x) => x && x.type === "event" && x.chronology && x.chronology.story_order != null)
          .sort((a, b) => a.chronology.story_order - b.chronology.story_order);
        const uniq = [...new Map(beats.map((b) => [b.id, b])).values()];
        return uniq.length && n.type !== "event" ? `<div class="rels"><h4>In the Exile's journey (${uniq.length})</h4>${uniq.map((b) => `<div class="rel"><a data-go="${esc(b.id)}">${esc(b.name)}</a> <span class="rel-tag">${esc(chapterOf(b))}</span></div>`).join("")}</div>` : "";
      })()}
      <div class="rels">
        ${out.length ? `<h4>Relations (${out.length})</h4>${sortRels(out).map((e) => relRow(e, e.target, "out")).join("")}` : ""}
        ${inc.length ? `<h4>Referenced by (${inc.length})</h4>${sortRels(inc).map((e) => relRow(e, e.source, "in")).join("")}` : ""}
      </div>
      <div class="srcs"><h4>Sources (${(n.sources || []).length})</h4>${srcHtml(n.sources)}</div>`;
    $("#details").hidden = false;
    document.body.classList.add("details-open");
    $("#details").scrollTop = 0;
  }
  function renderEdgeDetails(e) {
    const a = byId.get(e.source), b = byId.get(e.target);
    if (e.relation === "shared_event") {
      $("#detailBody").innerHTML = `
        <h2 class="d-title ${e.plot_role}">${esc(a?.name)} <span class="small">&amp;</span> ${esc(b?.name)}</h2>
        <div class="d-sub">appear together in ${e.events.length} event${e.events.length > 1 ? "s" : ""}</div>
        <div class="rels">${e.events.map((id) => byId.get(id)).map((ev) => `<div class="rel"><a data-go="${esc(ev.id)}">${esc(ev.name)}</a><span class="desc">${esc(ev.summary || "")}</span></div>`).join("")}</div>
        <div class="rels"><h4>People &amp; places</h4><div class="rel"><a data-go="${esc(e.source)}">${esc(a?.name)}</a></div><div class="rel"><a data-go="${esc(e.target)}">${esc(b?.name)}</a></div></div>`;
      $("#details").hidden = false; document.body.classList.add("details-open");
      return;
    }
    $("#detailBody").innerHTML = `
      <h2 class="d-title ${e.plot_role}">${esc(a?.name)} <span class="small">${esc(relLabel(e.relation))}</span> ${esc(b?.name)}</h2>
      <div class="chips"><span class="chip role-${e.plot_role}">${ROLE_LABEL[e.plot_role]}</span>${(e.branches || []).map((x) => `<span class="chip">${esc(x)}</span>`).join("")}<span class="chip">${esc(e.canon_status)} · ${esc(e.confidence)}</span></div>
      <p class="d-summary">${esc(e.description || "")}</p>
      <div class="rels"><div class="rel"><a data-go="${esc(e.source)}">${esc(a?.name)}</a></div><div class="rel"><a data-go="${esc(e.target)}">${esc(b?.name)}</a></div></div>
      <div class="srcs"><h4>Sources</h4>${srcHtml(e.sources)}</div>`;
    $("#details").hidden = false; document.body.classList.add("details-open");
  }
  $("#detailBody").addEventListener("click", (ev) => { const a = ev.target.closest("[data-go]"); if (a) select(a.dataset.go); });

  // ---------- tooltip ----------
  function bindCy() {
    const tip = $("#tooltip");
    cy.on("mouseover", "node.n", (ev) => {
      const n = ev.target.data("raw");
      tip.innerHTML = `<b>${esc(n.name)}</b><i>${esc(n.type)} · ${esc(ERA_LABEL[n.era] || n.era)} · ${esc(ROLE_LABEL[n.plot_role])}</i><br>${esc((n.summary || "").slice(0, 170))}${(n.summary || "").length > 170 ? "…" : ""}`;
      tip.hidden = false;
      if (!S.selected && !S.playing) ev.target.connectedEdges(":visible").addClass("hl");
    });
    cy.on("mousemove", "node.n", (ev) => {
      const r = $("#stage").getBoundingClientRect(), x = ev.renderedPosition.x, y = ev.renderedPosition.y;
      tip.style.left = Math.min(x + 16, r.width - 320) + "px"; tip.style.top = Math.min(y + 16, r.height - 120) + "px";
    });
    cy.on("mouseout", "node.n", (ev) => { tip.hidden = true; if (!S.selected && !S.playing) ev.target.connectedEdges().removeClass("hl"); });
    cy.on("tap", "node.n", (ev) => select(ev.target.id(), { center: false }));
    cy.on("tap", "edge", (ev) => { if (ev.target.hasClass("trailx")) return; stopPlay(); renderEdgeDetails(ev.target.data("raw")); });
    cy.on("tap", (ev) => { if (ev.target === cy) { clearSelection(); hideCard(); } });
    cy.on("boxend", () => setTimeout(() => {
      const sel = cy.nodes(".n:selected");
      if (sel.length > 1) { cy.elements().addClass("faded"); sel.removeClass("faded").addClass("ctx"); sel.edgesWith(sel).removeClass("faded").addClass("hl");
        $("#visibleCount").textContent = `${sel.length} nodes box-selected · Esc to clear`; }
    }, 0));
    cy.on("viewport render", () => { mmDirty = true; });
  }

  // ---------- legend ----------
  function renderLegend() {
    let items = [];
    if (S.colorBy === "plot_role") items = ROLES.map((r) => [ROLE_LABEL[r], ROLE_COLOR[r]]);
    else if (S.colorBy === "era") items = ERAS.filter((e) => e !== "unknown").map((e, i) => [ERA_LABEL[e], ERA_RAMP[i]]);
    else if (S.colorBy === "type") items = TYPES.map((t) => [t, TYPE_COLOR[t]]);
    else if (S.colorBy === "confidence") items = Object.entries(CONF_COLOR);
    else if (S.colorBy === "game") items = [["both games", GAME_COLOR.both], ["PoE 1", GAME_COLOR.poe1], ["PoE 2", GAME_COLOR.poe2], ["out-of-game", GAME_COLOR.none]];
    else if (S.colorBy === "cm") items = (D?.communities || []).slice(0, 12).map((c, i) => [`${c.label} (${c.size})`, COMM[i % COMM.length]]);
    $("#legend").innerHTML = items.map(([l, c]) => `<span><i style="background:${c}"></i>${esc(l)}</span>`).join("") +
      `<span class="small">${S.events ? "" : "dashed = shared event · "}shape = type · size = ${({ pr: "PageRank", bt: "betweenness", degree: "degree", none: "uniform" })[S.sizeBy]}</span>`;
  }

  // ---------- search ----------
  let sugg = [], suggIdx = -1;
  function score(n, q) {
    const nm = n.name.toLowerCase();
    if (nm === q) return 100;
    if (nm.startsWith(q)) return 80 + (n.pr || 0);
    if (nm.includes(q)) return 60 + (n.pr || 0);
    if ((n.aliases || []).some((a) => a.toLowerCase().includes(q))) return 50 + (n.pr || 0);
    if (q.length > 3 && (n.summary || "").toLowerCase().includes(q)) return 20 + (n.pr || 0);
    return 0;
  }
  function runSearch() {
    const q = $("#search").value.trim().toLowerCase();
    const ul = $("#suggest");
    if (!q || !D) { ul.hidden = true; $("#search").setAttribute("aria-expanded", "false"); return; }
    sugg = D.nodes.map((n) => [score(n, q), n]).filter((x) => x[0] > 0).sort((a, b) => b[0] - a[0]).slice(0, 14).map((x) => x[1]);
    suggIdx = -1;
    ul.innerHTML = sugg.length ? sugg.map((n, i) => `<li role="option" data-i="${i}"><span>${esc(n.name)}</span><small>${esc(n.type)} · ${esc(ROLE_LABEL[n.plot_role])}</small></li>`).join("") : `<li><small>No echoes found in Wraeclast.</small></li>`;
    ul.hidden = false; $("#search").setAttribute("aria-expanded", "true");
  }
  function pickSuggestion(i) {
    const n = sugg[i]; if (!n) return;
    $("#suggest").hidden = true; $("#search").value = n.name; $("#search").blur();
    select(n.id);
  }
  $("#search").addEventListener("input", runSearch);
  $("#search").addEventListener("keydown", (ev) => {
    const items = [...document.querySelectorAll("#suggest li[data-i]")];
    if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
      ev.preventDefault(); suggIdx = (suggIdx + (ev.key === "ArrowDown" ? 1 : -1) + items.length) % Math.max(items.length, 1);
      items.forEach((li, i) => li.classList.toggle("sel", i === suggIdx));
    } else if (ev.key === "Enter") pickSuggestion(suggIdx >= 0 ? suggIdx : 0);
    else if (ev.key === "Escape") { $("#suggest").hidden = true; $("#search").blur(); }
  });
  $("#suggest").addEventListener("mousedown", (ev) => { const li = ev.target.closest("li[data-i]"); if (li) pickSuggestion(+li.dataset.i); });
  $("#search").addEventListener("blur", () => setTimeout(() => ($("#suggest").hidden = true), 150));

  // ---------- path finder ----------
  function buildNames() { /* comboboxes query D.nodes directly */ }
  function topSuggestions(q, k = 12) {
    q = (q || "").trim().toLowerCase();
    const pool = D.nodes.filter((n) => S.events || n.type !== "event");
    if (!q) return [...pool].sort((a, b) => (b.pr || 0) - (a.pr || 0)).slice(0, k);
    return pool.map((n) => [score(n, q), n]).filter((x) => x[0] > 0).sort((a, b) => b[0] - a[0]).slice(0, k).map((x) => x[1]);
  }
  function attachCombo(input) {
    const ul = input.parentElement.querySelector(".suggest");
    let items = [], idx = -1;
    const render = (q) => {
      items = topSuggestions(q); idx = -1;
      ul.innerHTML = items.map((n, i) => `<li data-i="${i}"><span>${esc(n.name)}</span><small>${esc(n.type)}</small></li>`).join("") || `<li><small>No match</small></li>`;
      ul.hidden = false;
    };
    const pick = (i) => { const n = items[i]; if (!n) return; input.value = n.name; input.dataset.id = n.id; ul.hidden = true; };
    // focusing selects the text, so typing replaces it; the list always opens (popular entries when nothing is typed)
    input.addEventListener("focus", () => { input.select(); render(input.dataset.id ? "" : input.value); });
    input.addEventListener("input", () => { delete input.dataset.id; render(input.value); });
    input.addEventListener("keydown", (ev) => {
      const lis = [...ul.querySelectorAll("li[data-i]")];
      if (ev.key === "ArrowDown" || ev.key === "ArrowUp") { ev.preventDefault(); idx = (idx + (ev.key === "ArrowDown" ? 1 : -1) + lis.length) % Math.max(lis.length, 1); lis.forEach((li, i) => li.classList.toggle("sel", i === idx)); }
      else if (ev.key === "Enter") { ev.preventDefault(); pick(idx >= 0 ? idx : 0); if (input.id === "pathB") findPath(); else $("#pathB").focus(); }
      else if (ev.key === "Escape") { ul.hidden = true; input.blur(); }
    });
    ul.addEventListener("mousedown", (ev) => { const li = ev.target.closest("li[data-i]"); if (li) { ev.preventDefault(); pick(+li.dataset.i); } });
    input.addEventListener("blur", () => setTimeout(() => (ul.hidden = true), 120));
  }
  attachCombo($("#pathA")); attachCombo($("#pathB"));
  document.querySelectorAll("[data-clear]").forEach((b) => b.addEventListener("click", () => { const i = $("#" + b.dataset.clear); i.value = ""; delete i.dataset.id; i.focus(); }));
  $("#swapPath").addEventListener("click", () => {
    const a = $("#pathA"), b = $("#pathB");
    [a.value, b.value] = [b.value, a.value];
    const ia = a.dataset.id, ib = b.dataset.id; delete a.dataset.id; delete b.dataset.id;
    if (ib) a.dataset.id = ib;
    if (ia) b.dataset.id = ia;
    if (cy.$(".path").length) findPath();
  });
  function resolveEnd(input) {
    if (input.dataset.id && byId.has(input.dataset.id)) return input.dataset.id;
    const best = topSuggestions(input.value, 1)[0];
    return input.value.trim() && best ? best.id : null;
  }
  function clearPath() { if (cy) cy.elements().removeClass("path"); }
  function stopTracing() {
    if (!cy) return;
    clearPath(); cy.elements().removeClass("faded force-show");
    $("#pathOut").textContent = ""; $("#stopPath").hidden = true;
    if (S.selected) highlight(S.selected);
  }
  function findPath() {
    const a = resolveEnd($("#pathA")), b = resolveEnd($("#pathB"));
    const out = $("#pathOut");
    if (!a || !b) { out.textContent = "Name both ends — no match found in Wraeclast."; return; }
    if (a === b) { out.textContent = "Pick two different ends."; return; }
    stopPlay(); hideCard(); clearTrail();
    let pool = cy.elements(".n:visible, edge:visible").not(".trailx");
    let all = cy.elements(".n, edge").not(".trailx");
    if ($("#avoidExile").checked) {
      const ex = cy.nodes(".exile").filter((x) => x.id() !== a && x.id() !== b);
      pool = pool.not(ex).not(ex.connectedEdges()); all = all.not(ex).not(ex.connectedEdges());
    }
    const run = (eles) => eles.aStar({ root: "#" + CSS.escape(a), goal: "#" + CSS.escape(b), directed: false });
    let res = run(pool), note = "";
    if (!res.found) { res = run(all); note = " (through currently filtered nodes)"; }
    if (!res.found) { out.textContent = "No thread connects them" + ($("#avoidExile").checked ? " without the Exile — try unticking ‘Avoid the Exile’." : "."); return; }
    S.selected = null; $("#hopBar").hidden = true;
    cy.batch(() => {
      cy.elements().removeClass("hl focus ctx path").addClass("faded");
      res.path.removeClass("faded").addClass("path force-show");
    });
    focusOn(res.path, 80, 1.4, 600);
    const steps = res.path.nodes().map((n) => `<a data-go="${esc(n.id())}">${esc(n.data("label"))}</a>`);
    out.innerHTML = `${res.path.nodes().length - 1} step(s)${note}: ${steps.join(" → ")}`;
    $("#stopPath").hidden = false;
  }
  $("#findPath").addEventListener("click", findPath);
  $("#stopPath").addEventListener("click", stopTracing);
  $("#pathOut").addEventListener("click", (ev) => { const a = ev.target.closest("[data-go]"); if (a) select(a.dataset.go); });


  // ---------- minimap ----------
  function drawMinimap() {
    requestAnimationFrame(drawMinimap);
  // labels are measured with the web fonts once they have loaded (avoids clipped labels)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (cy) cy.style().update(); });
  $("#focusOnly").checked = S.focusOnly;
    if (!mmDirty || !cy) return;
    mmDirty = false;
    const c = $("#minimap"); if (c.offsetParent === null) return;
    const ctx = c.getContext("2d"), W = c.width, H = c.height;
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = "rgba(10,8,6,.9)"; ctx.fillRect(0, 0, W, H);
    const nodes = cy.nodes(".n:visible"); if (!nodes.length) return;
    const bb = nodes.boundingBox(), sc = Math.min(W / bb.w, H / bb.h) * 0.92;
    const ox = (W - bb.w * sc) / 2 - bb.x1 * sc, oy = (H - bb.h * sc) / 2 - bb.y1 * sc;
    c._map = { sc, ox, oy };
    nodes.forEach((n) => {
      const p = n.position(); ctx.fillStyle = n.data("color") || "#888";
      ctx.globalAlpha = n.hasClass("faded") ? 0.15 : 0.9;
      ctx.fillRect(p.x * sc + ox - 1, p.y * sc + oy - 1, n.hasClass("exile") ? 4 : 2, n.hasClass("exile") ? 4 : 2);
    });
    ctx.globalAlpha = 1;
    const ex = cy.extent();
    ctx.strokeStyle = "#e8cf98"; ctx.lineWidth = 1;
    ctx.strokeRect(ex.x1 * sc + ox, ex.y1 * sc + oy, ex.w * sc, ex.h * sc);
  }
  function minimapPan(ev) {
    const c = $("#minimap"), m = c._map; if (!m) return;
    const r = c.getBoundingClientRect();
    const x = ((ev.clientX - r.left) * (c.width / r.width) - m.ox) / m.sc, y = ((ev.clientY - r.top) * (c.height / r.height) - m.oy) / m.sc;
    const z = cy.zoom(); cy.pan({ x: cy.width() / 2 - x * z, y: cy.height() / 2 - y * z });
  }
  let mmDrag = false;
  $("#minimap").addEventListener("pointerdown", (ev) => { mmDrag = true; minimapPan(ev); });
  window.addEventListener("pointermove", (ev) => { if (mmDrag) minimapPan(ev); });
  window.addEventListener("pointerup", () => (mmDrag = false));

  // ---------- journey & story playback ----------
  function chapterOf(n) {
    const so = n.chronology ? n.chronology.story_order : null;
    if (so == null) return ERA_LABEL[n.era] || n.era;
    const a = (n.acts || [])[0];
    if (a) {
      const m = a.match(/(poe[12])_(act|interlude)(\d+)|(poe[12])_epilogue/);
      if (m && m[2]) return `${m[1] === "poe1" ? "PoE1" : "PoE2"} ${m[2] === "act" ? "Act" : "Interlude"} ${m[3]}`;
      if (m && m[4]) return `${m[4] === "poe1" ? "PoE1" : "PoE2"} Epilogue`;
    }
    if (so < 1100) return "Prologue";
    if (so < 2000) return `PoE1 Act ${Math.floor(so / 100) - 10}`;
    if (so < 3000) return "PoE1 Epilogue";
    if (so < 4000) return "The Atlas";
    if (so < 5100) return "PoE2 Prologue";
    if (so < 5500) return `PoE2 Act ${Math.floor(so / 100) - 50}`;
    if (so < 5510) return "PoE2 Interludes";
    if (so < 5520) return "PoE2 Act 5 (datamined)";
    if (so < 6000) return "PoE2 Act 6 (datamined)";
    return "PoE2 Endgame";
  }
  // which plot are we following?  exile:poe1 | exile:poe2 | exile:saga | node:<id>
  const isExileFollow = () => !S.follow || S.follow.startsWith("exile:");
  const plotCache = new Map();
  function plotOf(id) {
    // the plot of a faction / god / character: every event involving it or its members, in chronological order
    const key = S.variant + "|" + id;
    if (plotCache.has(key)) return plotCache.get(key);
    const actors = new Set([id]), places = new Set();
    const IN_MEMBER = new Set(["member_of", "leads", "founded", "serves", "commands", "rules", "descendant_of", "part_of", "originates_from", "aspect_of"]);
    const addMembers = (fid, depth) => {
      for (const x of S.adj.get(fid) || []) {
        const o = byId.get(x.other); if (!o) continue;
        if (x.dir === "in" && IN_MEMBER.has(x.rel) && ["character", "deity", "faction", "creature"].includes(o.type) && !o.id.startsWith("char_exile_") && !actors.has(o.id)) {
          actors.add(o.id); if (o.type === "faction" && depth < 1) addMembers(o.id, depth + 1);
        }
        if (o.type === "location" && ((x.dir === "in" && x.rel === "part_of") || (x.dir === "out" && (x.rel === "rules" || x.rel === "originates_from" || x.rel === "located_in")))) places.add(o.id);
      }
    };
    addMembers(id, 0);
    const evs = new Map();
    for (const a of actors) for (const x of S.adj.get(a) || []) { const o = byId.get(x.other); if (o && o.type === "event") evs.set(o.id, o); }
    for (const l of places) for (const x of S.adj.get(l) || []) { const o = byId.get(x.other); if (o && o.type === "event" && x.rel === "occurs_in") evs.set(o.id, o); }
    const year = (n) => { const y = n.chronology && n.chronology.in_world_year; return typeof y === "number" ? y : 0; };
    const so = (n) => (n.chronology && n.chronology.story_order != null ? n.chronology.story_order : 0);
    const list = [...evs.values()].sort((a, b) => ERAS.indexOf(a.era) - ERAS.indexOf(b.era) || year(a) - year(b) || so(a) - so(b) || a.name.localeCompare(b.name));
    const focus = new Set([...actors, ...places, ...list.map((e) => e.id)]);
    for (const e of list) for (const x of S.adj.get(e.id) || []) { const o = byId.get(x.other); if (o && ENTITY.has(o.type)) focus.add(o.id); }
    const r = { list, focus, actors };
    plotCache.set(key, r);
    return r;
  }
  // a followed plot gets its own saga: events on a serpentine line in order, members & places beside them
  function strHash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function computePlotPos() {
    const K = 10, DX = 380, DY = 950, pos = new Map();
    spine.forEach((e, k) => { const r = Math.floor(k / K), c = k % K; pos.set(e.id, [r % 2 ? (K - 1 - c) * DX : c * DX, r * DY]); });
    const acc = new Map();
    for (const e of spine) for (const x of S.adj.get(e.id) || []) {
      if (!S.focusSet.has(x.other) || pos.has(x.other)) continue;
      const p = pos.get(e.id); if (!acc.has(x.other)) acc.set(x.other, []); acc.get(x.other).push(p);
    }
    for (const [id, pts] of acc) {
      const [mx, my] = pts[0], h = strHash(id);  // beside the event where they first appear
      const ang = (h % 360) / 180 * Math.PI, rad = 150 + (h >> 9) % 230;
      pos.set(id, [mx + rad * Math.cos(ang), my + rad * Math.sin(ang) * 1.3]);
    }
    let k = 0;
    for (const id of S.focusSet) if (!pos.has(id)) { pos.set(id, [-700 - (k % 3) * 220, Math.floor(k / 3) * 200]); k++; }
    S.plotPos = pos; S.plotIds = new Set(spine.map((e) => e.id));
  }
  function addPlotSpine() {
    const els = [];
    for (let k = 1; k < spine.length; k++) els.push({ group: "edges", classes: "spine saga pspine", data: { id: `pspine_${k}`, source: spine[k - 1].id, target: spine[k].id, rel: "", raw: { relation: "next_beat", source: spine[k - 1].id, target: spine[k].id } } });
    cy.add(els);
  }
  function enterPlotView() {
    if (isExileFollow()) { if (S.layout === "f") setLayout("s"); return; }
    computePlotPos();
    if (!S.focusOnly) { S.focusOnly = true; $("#focusOnly").checked = true; }
    setLayout("f");
  }
  function buildFollowOptions() {
    const sel = $("#follow");
    const ex = S.variant === "poe1" ? [["exile:poe1", "The Exile — Path of Exile 1"]] : S.variant === "poe2" ? [["exile:poe2", "The Exile — Path of Exile 2"]]
      : [["exile:saga", "The Exile — full saga (PoE1 → PoE2)"], ["exile:poe1", "The Exile — Path of Exile 1"], ["exile:poe2", "The Exile — Path of Exile 2"]];
    const pick = (type, min, max) => D.nodes.filter((n) => n.type === type && !n.id.startsWith("char_exile_") && !n.id.startsWith("char_class_"))
      .map((n) => [n, plotOf(n.id).list.length]).filter((x) => x[1] >= min).sort((a, b) => b[1] - a[1]).slice(0, max);
    const grp = (label, rows) => rows.length ? `<optgroup label="${label}">${rows.map(([n, c]) => `<option value="node:${esc(n.id)}">${esc(n.name)} (${c})</option>`).join("")}</optgroup>` : "";
    sel.innerHTML = `<optgroup label="The Exile">${ex.map(([v, l]) => `<option value="${v}">${l}</option>`).join("")}</optgroup>` +
      grp("Factions & peoples", pick("faction", 2, 60)) + grp("Gods & powers", pick("deity", 2, 40)) + grp("Characters", pick("character", 3, 60));
    if (!S.follow || ![...sel.options].some((o) => o.value === S.follow)) S.follow = ex[0][0];
    sel.value = S.follow;
  }
  function exileProfiles() {
    const g = S.follow === "exile:poe1" ? ["poe1"] : S.follow === "exile:poe2" ? ["poe2"] : ["poe1", "poe2"];
    return (S.exiles || []).filter((p) => g.includes(p.game) && (S.variant === "master" || p.game === S.variant));
  }
  function buildExileOptions() {
    const wrap = $("#exileWrap"), sel = $("#exileClass");
    wrap.hidden = !isExileFollow();
    const ps = exileProfiles();
    sel.innerHTML = `<option value="">any exile</option>` + ["poe1", "poe2"].map((g) => {
      const rows = ps.filter((p) => p.game === g);
      return rows.length ? `<optgroup label="${g === "poe1" ? "Path of Exile 1" : "Path of Exile 2"}">${rows.map((p) => `<option value="${p.id}">${esc(p.class)}</option>`).join("")}</optgroup>` : "";
    }).join("");
    if (!ps.some((p) => p.id === S.exileClass)) S.exileClass = "";
    sel.value = S.exileClass;
  }
  const profile = () => (isExileFollow() ? (S.exiles || []).find((p) => p.id === S.exileClass) : null);
  function hero(n) {
    if (!isExileFollow()) return cy.getElementById(S.follow.slice(5));
    const so = n && n.chronology && n.chronology.story_order;
    const g = so != null ? (so < 5000 ? "poe1" : "poe2") : (S.follow === "exile:poe2" || (profile() && profile().game === "poe2") ? "poe2" : "poe1");
    const id = g === "poe1" ? "char_exile_poe1" : "char_exile_poe2";
    return byId.has(id) ? cy.getElementById(id) : cy.nodes(".exile").first();
  }
  function buildJourney() {
    buildFollowOptions(); buildExileOptions();
    if (isExileFollow()) {
      const ranges = S.follow === "exile:poe1" ? [[1000, 4000]] : S.follow === "exile:poe2" ? [[5000, 7000]] : [[1000, 4000], [5000, 7000]];
      spine = D.nodes.filter((n) => n.type === "event" && n.chronology && n.chronology.story_order != null &&
        ranges.some(([lo, hi]) => n.chronology.story_order >= lo && n.chronology.story_order < hi)).sort((a, b) => a.chronology.story_order - b.chronology.story_order);
      S.focusSet = new Set(["char_exile_poe1", "char_exile_poe2", ...spine.map((n) => n.id)]);
      for (const b of spine) for (const x of S.adj.get(b.id) || []) { const o = byId.get(x.other); if (o && ENTITY.has(o.type)) S.focusSet.add(o.id); }
      const p = profile(); if (p && p.node) S.focusSet.add(p.node);
      if (p && p.sentence && p.sentence.node) S.focusSet.add(p.sentence.node);
    } else {
      const pl = plotOf(S.follow.slice(5));
      spine = pl.list; S.focusSet = pl.focus;
    }
    const track = $("#journey");
    let html = "", last = null;
    if (profile()) html += `<div class="beat prologue" role="listitem" tabindex="0" data-i="-1"><span class="no">Prologue</span>Your sentence<span class="where">the ${esc(profile().class)}</span></div>`;
    spine.forEach((n, i) => {
      const chp = chapterOf(n);
      if (chp !== last) { html += `<div class="chapter" aria-hidden="true">${esc(chp)}</div>`; last = chp; }
      const dm = n.release_status && n.release_status !== "released";
      const pl = primaryOf(n.id);
      const sub = [pl.loc && byId.get(pl.loc).name, pl.who && byId.get(pl.who).name].filter(Boolean).join(" · ");
      html += `<div class="beat ${n.plot_role}${dm ? " datamined" : ""}" role="listitem" tabindex="0" data-i="${i}" data-id="${esc(n.id)}" title="${esc(n.summary || "")}"><span class="no">${i + 1}</span>${esc(n.name)}${sub ? `<span class="where">${esc(sub)}</span>` : ""}</div>`;
    });
    track.innerHTML = html || `<span class="hint">No recorded events for this plot in this view.</span>`;
    S.beat = -1;
    updateProgress();
    if (S.focusOnly) applyFilters();
  }
  $("#follow").addEventListener("change", (ev) => {
    stopPlay(); hideCard(); clearTrail(); S.follow = ev.target.value; buildJourney(); applyFilters(); writeHash();
    if (!isExileFollow()) return enterPlotView();
    if (S.layout === "f") setLayout("s");
    const h = hero(spine[0]);
    if (h && h.length) focusOn(S.focusOnly ? cy.nodes(".n:visible") : h.closedNeighborhood(":visible"), 90, 1.0, 600);
  });
  $("#exileClass").addEventListener("change", (ev) => {
    stopPlay(); S.exileClass = ev.target.value; buildJourney(); writeHash();
    if (profile()) showPrologue(); else hideCard();
  });
  $("#focusOnly").addEventListener("change", (ev) => {
    S.focusOnly = ev.target.checked; writeHash();
    if (!isExileFollow()) { if (S.focusOnly) return enterPlotView(); if (S.layout === "f") return setLayout("s"); }
    applyFilters();
    focusOn(cy.nodes(".n:visible"), 50, 1.0, 500);
  });
  const PROLOGUE_MS = 14000;
  function showPrologue() {
    const p = profile(); if (!p) return;
    S.beat = -1; updateProgress();
    clearTrail(); cy.elements().removeClass("faded hl focus ctx force-show");
    const ex = hero(null), cls = p.node ? cy.getElementById(p.node) : cy.collection();
    const grp = ex.union(cls).union(p.sentence && p.sentence.node ? cy.getElementById(p.sentence.node) : cy.collection());
    grp.addClass("ctx force-show"); ex.addClass("beat-loc");
    cy.elements().not(grp).not(grp.edgesWith(grp)).not(".band").addClass("faded");
    if ($("#followCam").checked) focusOn(grp, 180, 0.9, 800);
    document.querySelectorAll(".beat").forEach((b) => b.classList.toggle("sel", b.dataset.i === "-1"));
    const para = (t) => esc(t).split(/\n\n+/).join("<br><br>");
    const card = $("#storyCard");
    card.innerHTML = `
      <div class="act">Prologue · ${p.game === "poe1" ? "Path of Exile 1" : "Path of Exile 2"} · you are the ${esc(p.class)}</div>
      <h2>The ${esc(p.class)}'s sentence</h2>
      ${p.sentence && p.sentence.text ? `<p class="sentence">“${para(p.sentence.text)}”</p><div class="who">— ${esc(p.sentence.by)}</div>` : `<p>No sentence is recorded for this class in the sources.</p>`}
      ${p.own_words ? `<p class="own">${para(p.own_words)}</p>` : ""}
      ${p.lore && p.game === "poe2" ? `<div class="who">${para(p.lore)}</div>` : ""}
      <div class="who">Source: <a href="${esc(p.source.url)}" target="_blank" rel="noopener">${esc(p.source.title)}</a></div>
      <div class="bar"><i></i></div>`;
    card.hidden = !$("#storyCards").checked;
    const bar = card.querySelector(".bar i");
    if (S.playing && !reduceMotion) { bar.style.transition = "none"; bar.style.width = "0"; requestAnimationFrame(() => { bar.style.transition = `width ${PROLOGUE_MS}ms linear`; bar.style.width = "100%"; }); }
  }
  function updateProgress() { $("#beatProgress").textContent = spine.length ? `${Math.max(S.beat + 1, 0)} / ${spine.length}` : ""; }
  const openBeat = (b) => { stopPlay(); if (b.dataset.i === "-1") showPrologue(); else goToBeat(+b.dataset.i, { manual: true }); };
  $("#journey").addEventListener("click", (ev) => { const b = ev.target.closest(".beat"); if (b) openBeat(b); });
  $("#journey").addEventListener("keydown", (ev) => { const b = ev.target.closest(".beat"); if (b && (ev.key === "Enter" || ev.key === " ")) { ev.preventDefault(); openBeat(b); } });

  function primaryOf(evId) {
    // most important location and character/deity of an event
    const nb = (S.adj.get(evId) || []).map((x) => byId.get(x.other)).filter(Boolean);
    const best = (arr) => arr.sort((a, b) => (b.pr || 0) - (a.pr || 0))[0]?.id;
    return { loc: best(nb.filter((x) => x.type === "location")),
      who: best(nb.filter((x) => (x.type === "character" || x.type === "deity") && !x.id.startsWith("char_exile_"))) };
  }
  function clearTrail() { if (cy) { cy.elements().removeClass("visited trail beat-active beat-loc"); cy.remove(cy.edges(".trailx")); } }
  function participants(el) {
    // who/what is involved in this beat: neighbours that are not other beats
    return el.connectedEdges().not(".pspine, .trailx").connectedNodes("node.n").not(el).filter((x) => !(x.data("raw").chronology && x.data("raw").chronology.story_order != null) && !(S.plotIds && S.plotIds.has(x.id()) && !isExileFollow()));
  }
  function goToBeat(i, { manual = false } = {}) {
    if (!spine.length || !cy) return;
    i = Math.max(0, Math.min(spine.length - 1, i));
    S.beat = i;
    const n = spine[i], el = cy.getElementById(n.id);
    S.selected = null; $("#hopBar").hidden = true;
    if (!S.events) { entityBeat(i, n, el); return afterBeat(i, n, el, manual); }
    cy.batch(() => {
      cy.elements().removeClass("faded hl focus ctx path beat-active force-show");
      clearTrail();
      for (let k = 0; k <= i; k++) cy.getElementById(spine[k].id).addClass("visited force-show");
      for (let k = 0; k < i; k++) cy.getElementById(spine[k].id).edgesWith(cy.getElementById(spine[k + 1].id)).addClass("trail force-show");
      const ppl = participants(el);
      const ctx = el.union(ppl).union(el.connectedEdges().filter((e) => ppl.contains(e.source()) || ppl.contains(e.target())));
      cy.elements().not(ctx).not(".visited").not(".trail").not(".band").addClass("faded");
      ctx.addClass("force-show"); ppl.addClass("ctx"); el.connectedEdges().addClass("hl");
      el.addClass("beat-active");
    });
    if ($("#followCam").checked) {
      const ppl = participants(el);
      const focus = el.union(ppl.length > 14 ? ppl.sort((a, b) => (b.data("raw").pr || 0) - (a.data("raw").pr || 0)).slice(0, 14) : ppl);
      focusOn(focus, 110, 1.2, 900);
    }
    afterBeat(i, n, el, manual);
  }
  function entityBeat(i, n, el) {
    // entity-first story step: light up who & where; trail runs place -> place
    const exile = hero(n);
    const ppl = participants(el).filter((x) => x.data("raw").type !== "event");
    const locs = [];
    for (let k = 0; k <= i; k++) { const l = primaryOf(spine[k].id).loc; if (l && locs[locs.length - 1] !== l) locs.push(l); }
    cy.batch(() => {
      cy.elements().removeClass("faded hl focus ctx path beat-active force-show");
      clearTrail();
      const trail = [];
      for (let k = 1; k < locs.length; k++) trail.push({ group: "edges", classes: "trailx", data: { id: `trail_${k}_${locs[k - 1]}_${locs[k]}`, source: locs[k - 1], target: locs[k], rel: "", raw: { relation: "trail" } } });
      const tr = cy.add(trail);
      const visitedLocs = cy.collection(locs.map((l) => cy.getElementById(l)));
      visitedLocs.addClass("visited force-show");
      const group = ppl.union(exile);
      const inner = group.edgesWith(group).filter((e) => !e.hasClass("hidden") || e.hasClass("derived"));
      cy.elements().not(group).not(inner).not(visitedLocs).not(tr).not(el).addClass("faded");
      group.addClass("ctx force-show"); inner.addClass("hl force-show");
      el.addClass("beat-active force-show");
      cy.collection(spine.slice(0, i + 1).map((b) => cy.getElementById(b.id))).addClass("visited");
      for (let k = 0; k < i; k++) cy.getElementById(spine[k].id).edgesWith(cy.getElementById(spine[k + 1].id)).addClass("trail");
      const cur = primaryOf(n.id).loc;
      if (cur) cy.getElementById(cur).addClass("beat-loc");
      else exile.addClass("beat-loc");
    });
    if ($("#followCam").checked) focusOn(ppl.length ? beatFocus(el, ppl) : exile, 120, 1.1, 900);
  }
  function afterBeat(i, n, el, manual) {
    document.querySelectorAll(".beat").forEach((b, k) => { b.classList.toggle("sel", k === i); b.classList.toggle("visited", k < i); });
    const cur = document.querySelector(`.beat[data-i="${i}"]`);
    cur?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", inline: "center", block: "nearest" });
    updateProgress();
    if ($("#storyCards").checked) showCard(n, el); else hideCard();
    if (manual) renderDetails(n);
  }
  function showCard(n, el) {
    const ppl = participants(el).sort((a, b) => (b.data("raw").pr || 0) - (a.data("raw").pr || 0));
    const who = ppl.filter((x) => ["character", "deity", "faction"].includes(x.data("raw").type)).slice(0, 7);
    const where = ppl.filter((x) => x.data("raw").type === "location").slice(0, 3);
    const src = (n.sources || [])[0];
    const s = src && D.sources[src[0]];
    const dm = n.release_status && n.release_status !== "released";
    const card = $("#storyCard");
    card.innerHTML = `
      ${dm ? `<span class="tag warn">datamined · may change at 1.0</span>` : ""}
      <div class="act">${isExileFollow() && profile() ? `as the ${esc(profile().class)} · ` : !isExileFollow() ? `${esc(byId.get(S.follow.slice(5))?.name || "")} · ` : ""}${esc(chapterOf(n))}${n.chronology && typeof n.chronology.in_world_year === "number" ? ` · ${n.chronology.in_world_year} IC` : ""} · ${S.beat + 1} of ${spine.length}</div>
      <h2>${esc(n.name)}</h2>
      <p>${esc(n.summary || "")}</p>
      ${who.length ? `<div class="who">Featuring ${who.map((x) => `<a data-go="${esc(x.id())}">${esc(x.data("label"))}</a>`).join(", ")}</div>` : ""}
      ${where.length ? `<div class="who">At ${where.map((x) => `<a data-go="${esc(x.id())}">${esc(x.data("label"))}</a>`).join(", ")}</div>` : ""}
      ${s ? `<div class="who">Source: ${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>` : esc(s.title)}</div>` : ""}
      <div class="bar"><i></i></div>`;
    card.hidden = false;
    card.style.animation = "none"; void card.offsetWidth; card.style.animation = "";
    const bar = card.querySelector(".bar i");
    if (S.playing && !reduceMotion) {
      const d = dwell(n);
      bar.style.transition = "none"; bar.style.width = "0";
      requestAnimationFrame(() => { bar.style.transition = `width ${d}ms linear`; bar.style.width = "100%"; });
    }
  }
  $("#storyCard").addEventListener("click", (ev) => { const a = ev.target.closest("[data-go]"); if (a) select(a.dataset.go); });
  function hideCard() { $("#storyCard").hidden = true; }
  function dwell(n) { return SPEED_MS[+$("#speed").value - 1] + Math.min(4000, (n.summary || "").length * 12); }
  function scheduleNext() {
    clearTimeout(playTimer);
    if (!S.playing) return;
    playTimer = setTimeout(() => {
      if (S.beat >= spine.length - 1) { stopPlay(); return; }
      goToBeat(S.beat + 1); scheduleNext();
    }, dwell(spine[S.beat]));
  }
  function startPlay() {
    if (!spine.length) return;
    S.playing = true;
    $("#playBtn").textContent = "❚❚"; $("#playBtn").classList.add("playing"); $("#playBtn").setAttribute("aria-label", "Pause");
    $("#details").hidden = true; document.body.classList.remove("details-open");
    if ((S.beat < 0 || S.beat >= spine.length - 1) && isExileFollow() && profile()) {
      showPrologue(); clearTimeout(playTimer);
      playTimer = setTimeout(() => { if (!S.playing) return; goToBeat(0); scheduleNext(); }, PROLOGUE_MS);
      return;
    }
    goToBeat(S.beat < 0 || S.beat >= spine.length - 1 ? 0 : S.beat + 1);
    scheduleNext();
  }
  function stopPlay() {
    if (!S.playing) return;
    S.playing = false; clearTimeout(playTimer);
    $("#playBtn").textContent = "▶"; $("#playBtn").classList.remove("playing"); $("#playBtn").setAttribute("aria-label", "Play the story");
    const bar = document.querySelector("#storyCard .bar i"); if (bar) { bar.style.transition = "none"; }
  }
  $("#playBtn").addEventListener("click", () => (S.playing ? stopPlay() : startPlay()));
  $("#nextBeat").addEventListener("click", () => { const p = S.playing; goToBeat(S.beat + 1, { manual: !p }); if (p) scheduleNext(); });
  $("#prevBeat").addEventListener("click", () => { const p = S.playing; goToBeat(S.beat - 1, { manual: !p }); if (p) scheduleNext(); });
  $("#storyCards").addEventListener("change", (ev) => { if (!ev.target.checked) hideCard(); else if (S.beat >= 0) showCard(spine[S.beat], cy.getElementById(spine[S.beat].id)); });
  $("#speed").addEventListener("change", () => { if (S.playing) scheduleNext(); });

  // ---------- controls ----------
  document.querySelectorAll("#variants button").forEach((b) => b.addEventListener("click", () => { if (b.dataset.v !== S.variant) show(b.dataset.v, { keepSelection: true }); }));
  document.querySelectorAll("#layouts button").forEach((b) => b.addEventListener("click", () => setLayout(b.dataset.l)));
  $("#colorBy").addEventListener("change", (ev) => { S.colorBy = ev.target.value; applyEncoding(); writeHash(); });
  $("#sizeBy").addEventListener("change", (ev) => { S.sizeBy = ev.target.value; applyEncoding(); writeHash(); });
  $("#labels").addEventListener("change", (ev) => { S.labels = ev.target.value; applyEncoding(); });
  $("#showEvents").addEventListener("change", (ev) => {
    S.events = ev.target.checked; stopPlay(); hideCard(); clearTrail(); S.beat = -1; updateProgress();
    document.querySelectorAll(".beat").forEach((b) => b.classList.remove("sel", "visited"));
    applyFilters(); renderLegend(); writeHash();
  });
  $("#distance").addEventListener("input", (ev) => { S.maxDist = +ev.target.value; $("#distanceVal").textContent = S.maxDist >= 8 ? "all" : S.maxDist; applyFilters(); });
  $("#spineOnly").addEventListener("click", (ev) => {
    S.spineOnly = !S.spineOnly; ev.target.classList.toggle("on", S.spineOnly); ev.target.setAttribute("aria-pressed", S.spineOnly);
    applyFilters(); cy.animate({ fit: { eles: cy.nodes(".n:visible"), padding: 40 }, duration: reduceMotion ? 0 : 500 });
  });
  $("#focusExile").addEventListener("click", () => {
    const ids = ["char_exile_poe1", "char_exile_poe2"].filter((i) => byId.has(i));
    if (!ids.length) return;
    select(ids[S.exileToggle++ % ids.length]);
  });
  $("#hops").addEventListener("input", (ev) => { S.hops = +ev.target.value; $("#hopsVal").textContent = `${S.hops} hop${S.hops > 1 ? "s" : ""}`; if (S.selected) highlight(S.selected); });
  $("#clearSel").addEventListener("click", clearSelection);
  $("#branchFilter").addEventListener("input", renderBranches);
  $("#branchAll").addEventListener("click", () => { S._branchSeen.forEach((b) => S.branches.add(b)); renderBranches(); applyFilters(); });
  $("#branchNone").addEventListener("click", () => { S.branches.clear(); renderBranches(); applyFilters(); });
  $("#showDatamined").addEventListener("change", (ev) => { S.datamined = ev.target.checked; applyFilters(); });
  $("#resetFilters").addEventListener("click", () => {
    S.roles = new Set(ROLES); S.eras = new Set(ERAS); S.types = new Set(TYPES); S.conf = new Set(["high", "medium", "low"]);
    S.branches = new Set(S._branchSeen); S.rels = new Set(S._relSeen); S.datamined = true; S.spineOnly = false; S.maxDist = 8;
    $("#showDatamined").checked = true; $("#distance").value = 8; $("#distanceVal").textContent = "all"; $("#spineOnly").classList.remove("on");
    $("#branchFilter").value = ""; buildFacets(); applyFilters(); clearSelection(); hideCard(); stopPlay(); clearTrail();
    cy.fit(cy.nodes(".n:visible"), 40);
  });
  $("#zoomIn").addEventListener("click", () => cy.animate({ zoom: { level: cy.zoom() * 1.4, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } }, duration: 200 }));
  $("#zoomOut").addEventListener("click", () => cy.animate({ zoom: { level: cy.zoom() / 1.4, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } }, duration: 200 }));
  $("#fit").addEventListener("click", () => cy.animate({ fit: { eles: cy.nodes(".n:visible"), padding: 40 }, duration: reduceMotion ? 0 : 400 }));
  $("#closeDetails").addEventListener("click", clearSelection);
  $("#recenter").addEventListener("click", recenter);
  $("#aboutBtn").addEventListener("click", () => $("#about").showModal());
  $("#toggleFilters").addEventListener("click", (ev) => {
    const open = document.body.classList.toggle("filters-open"); ev.currentTarget.setAttribute("aria-expanded", open);
  });

  document.addEventListener("keydown", (ev) => {
    const typing = /INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName) && document.activeElement.type !== "checkbox" && document.activeElement.type !== "range";
    if (ev.key === "Escape") { stopPlay(); hideCard(); clearSelection(); clearTrail(); stopTracing(); cy?.nodes().unselect(); applyFilters(); return; }
    if (typing || $("#about").open) return;
    if (ev.key === "/") { ev.preventDefault(); $("#search").focus(); }
    else if (ev.key === " ") { ev.preventDefault(); S.playing ? stopPlay() : startPlay(); }
    else if (ev.key === "ArrowRight") { ev.preventDefault(); $("#nextBeat").click(); }
    else if (ev.key === "ArrowLeft") { ev.preventDefault(); $("#prevBeat").click(); }
    else if ("123456".includes(ev.key) && ev.key.length === 1) setLayout(["s", "p", "t", "r", "c", "live"][+ev.key - 1]);
    else if (ev.key === "c" || ev.key === "C") recenter();
    else if (ev.key === "f" || ev.key === "F") $("#fit").click();
    else if (ev.key === "+" || ev.key === "=") $("#zoomIn").click();
    else if (ev.key === "-") $("#zoomOut").click();
    else if (ev.key === "?") $("#about").showModal();
  });

  // ---------- boot ----------
  readHash();
  $("#colorBy").value = S.colorBy; $("#sizeBy").value = S.sizeBy; $("#showEvents").checked = S.events;
  requestAnimationFrame(drawMinimap);
  // labels are measured with the web fonts once they have loaded (avoids clipped labels)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (cy) cy.style().update(); });
  fetch("data/exiles.json").then((r) => (r.ok ? r.json() : [])).catch(() => []).then((x) => { S.exiles = x; if (D) buildJourney(); });
  show(S.variant).catch((err) => {
    $("#loading").innerHTML = `<span>The Atlas could not be read: ${esc(err.message)}</span>`;
    console.error(err);
  });
  try { if (!localStorage.getItem("goe_seen_about")) { $("#about").showModal(); localStorage.setItem("goe_seen_about", "1"); } } catch (_) { /* storage blocked */ }
})();
