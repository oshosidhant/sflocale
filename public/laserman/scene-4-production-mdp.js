(() => {
  const $ = (selector) => document.querySelector(selector);
  const world = $("#world");
  const stage = $("#stage");
  const svg = $("#canvas");
  const shell = $("#shell");
  const inspector = $("#inspector");
  const list = $("#keyframe-list");
  const state = { data: null, mode: "overview", currentKF: null, selected: null, x: 0, y: 0, scale: 1, graphWidth: 1, graphHeight: 1, nav: "all" };
  let drag = null;

  const escapeHTML = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" }[char]));
  const short = (value, length = 25) => String(value ?? "").length > length ? `${String(value).slice(0, 11)}…${String(value).slice(-7)}` : String(value ?? "");
  const el = (tag, attributes = {}, text = "") => { const node = document.createElementNS("http://www.w3.org/2000/svg", tag); Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value))); if (text) node.textContent = text; return node; };
  const addText = (group, x, y, text, className, anchor = "start") => { const node = el("text", { x, y, class: className, "text-anchor": anchor }, text); group.append(node); return node; };
  const addRect = (group, x, y, width, height, className, radius = 9) => { const node = el("rect", { x, y, width, height, rx: radius, class: className }); group.append(node); return node; };
  const addPath = (x1, y1, x2, y2, className = "edge") => { const path = el("path", { d: `M${x1} ${y1} C${x1 + (x2 - x1) * 0.4} ${y1} ${x1 + (x2 - x1) * 0.6} ${y2} ${x2} ${y2}`, class: className }); world.append(path); return path; };

  function applyTransform() { world.setAttribute("transform", `translate(${state.x} ${state.y}) scale(${state.scale})`); }
  function fit() { const width = stage.clientWidth; const height = stage.clientHeight; state.scale = Math.min((width - 34) / state.graphWidth, (height - 34) / state.graphHeight); state.x = (width - state.graphWidth * state.scale) / 2; state.y = (height - state.graphHeight * state.scale) / 2; applyTransform(); }
  function zoom(multiplier, clientX = stage.clientWidth / 2, clientY = stage.clientHeight / 2) { const scale = Math.max(0.06, Math.min(3, state.scale * multiplier)); const wx = (clientX - state.x) / state.scale; const wy = (clientY - state.y) / state.scale; state.x = clientX - wx * scale; state.y = clientY - wy * scale; state.scale = scale; applyTransform(); }
  function center(x, y, multiplier = 1) { if (multiplier !== 1) zoom(multiplier); state.x = stage.clientWidth / 2 - x * state.scale; state.y = stage.clientHeight / 2 - y * state.scale; applyTransform(); }
  function keyframeById(id) { return state.data.keyframes.find((keyframe) => String(keyframe.keyframe_id) === String(id)); }
  function actionsFor(id) { return state.data.actions.filter((action) => String(action.keyframe_id) === String(id)).sort((a, b) => a.action_index - b.action_index); }
  function candidatesForAction(id) { return state.data.candidates.filter((candidate) => candidate.actionId === id).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)); }
  function isLinked(keyframe) { return state.data.actions.some((action) => String(action.keyframe_id) === String(keyframe.keyframe_id) && action.refs.some((ref) => ref.internal)); }

  function renderNavigator() {
    const query = $("#nav-search").value.trim().toLowerCase();
    const filter = state.nav;
    const keyframes = state.data.keyframes.filter((keyframe) => (filter === "all" || isLinked(keyframe)) && (!query || `${keyframe.keyframe_id} ${keyframe.keyframe}`.toLowerCase().includes(query)));
    list.replaceChildren();
    for (const keyframe of keyframes) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `keyframe-item ${isLinked(keyframe) ? "linked" : ""} ${String(keyframe.keyframe_id) === String(state.currentKF) ? "active" : ""}`;
      button.innerHTML = `<span class="row"><span>KF ${escapeHTML(keyframe.keyframe_id)}</span><span>${keyframe.action_count} actions</span></span><small>${escapeHTML(short(keyframe.keyframe, 32))} · ${keyframe.candidate_count} candidates</small><small>Approved asset · source candidate unlinked</small>`;
      button.addEventListener("click", () => focusKeyframe(keyframe.keyframe_id, true));
      list.append(button);
    }
  }

  function selectNode(node, selection) {
    world.querySelectorAll(".canvas-node").forEach((item) => item.classList.remove("selected"));
    node?.classList.add("selected");
    state.selected = selection;
  }
  function makeNode(group, selection, handler) { group.classList.add("canvas-node"); group.dataset.selection = selection; group.addEventListener("click", (event) => { event.stopPropagation(); selectNode(group, selection); handler(); }); world.append(group); }

  function drawOverview() {
    state.mode = "overview";
    state.currentKF = null;
    state.selected = null;
    $("#overview").classList.add("active"); $("#generations").classList.remove("active");
    $("#status-text").textContent = "Keyframe map: select a family to open all recorded actions and candidates. Violet paths identify generated references reused in a later action.";
    world.replaceChildren();
    state.graphWidth = 2560; state.graphHeight = 1750;
    const positions = new Map();
    const keyframes = state.data.keyframes;
    const lineage = [];
    for (const action of state.data.actions) for (const ref of action.refs || []) if (ref.internal && ref.sourceKeyframe && String(ref.sourceKeyframe) !== String(action.keyframe_id)) lineage.push([String(ref.sourceKeyframe), String(action.keyframe_id)]);
    keyframes.forEach((keyframe, index) => { const col = index % 5; const row = Math.floor(index / 5); positions.set(String(keyframe.keyframe_id), { x: 105 + col * 485, y: 105 + row * 235 }); });
    for (const [source, target] of [...new Set(lineage.map((edge) => edge.join(">")))].map((edge) => edge.split(">"))) { const from = positions.get(source); const to = positions.get(target); if (from && to) addPath(from.x + 164, from.y + 92, to.x + 164, to.y + 92, "lineage-edge"); }
    for (const keyframe of keyframes) {
      const point = positions.get(String(keyframe.keyframe_id)); const group = el("g");
      addRect(group, point.x, point.y, 328, 190, `scene-card ${isLinked(keyframe) ? "linked" : ""}`);
      group.append(el("image", { x: point.x + 10, y: point.y + 35, width: 308, height: 103, href: keyframe.image, preserveAspectRatio: "xMidYMid slice" }));
      addText(group, point.x + 12, point.y + 22, `KF ${keyframe.keyframe_id}`, "label");
      addText(group, point.x + 316, point.y + 22, `${keyframe.candidate_count} candidates`, "small", "end");
      addText(group, point.x + 12, point.y + 158, short(keyframe.keyframe, 31), "small");
      addText(group, point.x + 12, point.y + 176, `${keyframe.action_count} actions · approved asset`, "small");
      makeNode(group, `keyframe:${keyframe.keyframe_id}`, () => focusKeyframe(keyframe.keyframe_id, true));
    }
    showOverview(); renderNavigator(); fit();
  }

  function drawRoute(keyframeId, focus = null) {
    const keyframe = keyframeById(keyframeId); if (!keyframe) return;
    state.mode = "generations"; state.currentKF = String(keyframeId); state.selected = null;
    $("#overview").classList.remove("active"); $("#generations").classList.add("active");
    $("#status-text").textContent = `KF ${keyframe.keyframe_id}: every recorded candidate is shown. Select an action or image for prompt, references, heuristic reward heads and evidence status.`;
    world.replaceChildren();
    const actions = actionsFor(keyframeId); const maxCandidates = Math.max(1, ...actions.map((action) => candidatesForAction(action.action_id).length));
    state.graphWidth = Math.max(1540, 210 + actions.length * 550 + 390); state.graphHeight = Math.max(1260, 520 + Math.ceil(maxCandidates / 3) * 154 + 130);
    const actionPositions = new Map(); const candidatePositions = new Map();
    actions.forEach((action, index) => {
      const x = 170 + index * 550; const actionY = 265; actionPositions.set(action.action_id, { x: x + 220, y: actionY + 59 });
      if (index > 0) { const prior = actionPositions.get(actions[index - 1].action_id); addPath(prior.x + 220, prior.y, x, actionY + 59); }
      const reference = el("g"); addRect(reference, x + 34, 135, 372, 66, "scene-card"); addText(reference, x + 48, 160, `${action.reference_count} action references`, "label"); addText(reference, x + 48, 183, `${action.refs.filter((ref) => ref.internal).length} generated · ${action.refs.filter((ref) => !ref.internal).length} external/prior`, "small"); makeNode(reference, `references:${action.action_id}`, () => showReferences(action));
      const group = el("g"); addRect(group, x, actionY, 440, 118, "action-card"); addText(group, x + 14, actionY + 25, `${action.action_id} · ${action.output_count} outputs`, "label"); addText(group, x + 14, actionY + 51, short(action.prompt.replace(/\s+/g, " "), 58), "small"); addText(group, x + 14, actionY + 76, `${action.providers.join(", ")} · ${action.reference_count} references`, "small"); addText(group, x + 14, actionY + 99, "No authoritative candidate lock", "small"); makeNode(group, `action:${action.action_id}`, () => showAction(action)); addPath(x + 220, 201, x + 220, actionY);
      const candidates = candidatesForAction(action.action_id);
      candidates.forEach((candidate, candidateIndex) => {
        const cx = x + (candidateIndex % 3) * 148; const cy = 450 + Math.floor(candidateIndex / 3) * 154; candidatePositions.set(candidate.id, { x: cx + 66, y: cy + 62 }); addPath(x + 220, actionY + 118, cx + 66, cy, "edge");
        const candidateGroup = el("g"); addRect(candidateGroup, cx, cy, 132, 130, `candidate-card ${candidate.keyframeRank === 1 ? "best" : ""}`, 7); candidateGroup.append(el("image", { x: cx + 6, y: cy + 6, width: 120, height: 76, href: candidate.image, preserveAspectRatio: "xMidYMid slice" }));
        if (candidate.keyframeRank === 1) { addRect(candidateGroup, cx + 6, cy + 6, 78, 15, "badge", 3); addText(candidateGroup, cx + 45, cy + 17, "BEST", "badge-text", "middle"); }
        addText(candidateGroup, cx + 7, cy + 99, short(candidate.id, 17), "tiny"); addText(candidateGroup, cx + 125, cy + 99, candidate.score.toFixed(3), "tiny", "end"); addText(candidateGroup, cx + 7, cy + 117, `A#${candidate.actionRank} · KF#${candidate.keyframeRank}`, "tiny"); makeNode(candidateGroup, `candidate:${candidate.id}`, () => showCandidate(candidate));
      });
    });
    const approvedX = 170 + actions.length * 550; const approved = el("g"); addRect(approved, approvedX, 265, 320, 250, "approved-card"); approved.append(el("image", { x: approvedX + 10, y: 275, width: 300, height: 158, href: keyframe.image, preserveAspectRatio: "xMidYMid slice" })); addText(approved, approvedX + 14, 460, "Approved keyframe asset", "label"); addText(approved, approvedX + 14, 484, "Candidate source unlinked", "small"); addText(approved, approvedX + 14, 506, "No candidate receives human reward 1", "small"); makeNode(approved, `approved:${keyframe.keyframe_id}`, () => showKeyframe(keyframe));
    for (const action of actions) for (const ref of action.refs || []) if (ref.internal) { const from = candidatePositions.get(ref.id); const to = actionPositions.get(action.action_id); if (from && to) addPath(from.x, from.y, to.x, to.y, "lineage-edge"); }
    renderNavigator(); fit();
    if (focus?.startsWith("candidate:")) { const candidate = state.data.candidates.find((item) => `candidate:${item.id}` === focus); const point = candidatePositions.get(candidate?.id); if (candidate && point) { center(point.x, point.y, 1.7); const node = world.querySelector(`[data-selection="${focus}"]`); selectNode(node, focus); showCandidate(candidate); } } else showKeyframe(keyframe);
  }

  function showOverview() { inspector.innerHTML = `<h2>Scene 4 production map</h2><p class="sub">Act 5 · LM Tries to Fight Sandman, Bubble and Freezer</p><div class="notice"><strong>Archive evidence.</strong><br>${state.data.meta.keyframe_count} approved keyframe assets; ${state.data.meta.action_count} actions; ${state.data.meta.candidate_count.toLocaleString()} generated candidates.</div><h3>Map semantics</h3><dl class="metrics"><dt>Keyframe family</dt><dd>Approved asset associated with an action/candidate family.</dd><dt>Lineage</dt><dd>Violet edge: a generated candidate was reused as a reference by a later action.</dd><dt>Locks</dt><dd>${state.data.meta.human_lock_count} authoritative candidate locks are linked in this workbook.</dd></dl><h3>Evidence boundary</h3><p class="sub">Candidate exposure and explicit rejection reasons remain unknown. Counterfactual ranks are computed heuristic audits, not filmmaker preference labels.</p>`; }
  function showKeyframe(keyframe) { inspector.innerHTML = `<img class="hero-image" src="${escapeHTML(keyframe.image)}" alt="Approved keyframe ${escapeHTML(keyframe.keyframe_id)}"><h2>KF ${escapeHTML(keyframe.keyframe_id)}</h2><p class="sub">${escapeHTML(keyframe.keyframe)}</p><div class="notice"><strong>Approved production asset.</strong><br>The workbook does not link this asset to an individual candidate, so no candidate is assigned human reward 1.</div><dl class="metrics"><dt>Generated candidates</dt><dd>${keyframe.candidate_count}</dd><dt>Actions</dt><dd>${keyframe.action_count}</dd><dt>Counterfactual best</dt><dd>${escapeHTML(keyframe.top_counterfactual_candidate)} · ${keyframe.top_counterfactual_score.toFixed(4)}</dd><dt>Route status</dt><dd>Approved asset; candidate source unlinked</dd></dl><h3>Open route</h3><button id="open-route" class="close" style="width:auto;padding:0 10px;font-size:12px">All generations →</button>`; $("#open-route").onclick = () => drawRoute(keyframe.keyframe_id); }
  function showAction(action) { inspector.innerHTML = `<h2>${escapeHTML(action.action_id)}</h2><p class="sub">KF ${escapeHTML(action.keyframe_id)} · action ${action.action_index}</p><dl class="metrics"><dt>Outputs</dt><dd>${action.output_count}</dd><dt>Providers</dt><dd>${escapeHTML(action.providers.join(", "))}</dd><dt>References</dt><dd>${action.reference_count}</dd><dt>Lock status</dt><dd>No authoritative candidate lock</dd></dl><h3>Generation prompt</h3><p class="prompt">${escapeHTML(action.prompt)}</p><h3>Reference events</h3><p class="sub">${(action.refs || []).map((ref) => `${escapeHTML(ref.id)} · ${ref.internal ? `generated candidate from KF ${ref.sourceKeyframe}` : "external/prior asset"}`).join("<br>") || "None recorded"}</p>`; }
  function showReferences(action) { inspector.innerHTML = `<h2>References → ${escapeHTML(action.action_id)}</h2><p class="sub">Generated-reference edges terminate on the later action, never directly on its output candidates.</p><dl class="metrics">${(action.refs || []).map((ref) => `<dt>${escapeHTML(ref.id)}</dt><dd>${ref.internal ? `Generated candidate from KF ${ref.sourceKeyframe}` : "External or prior-production asset"} · ${ref.rawCount} raw rows</dd>`).join("") || "<dt>References</dt><dd>None recorded</dd>"}</dl>`; }
  function showCandidate(candidate) { const action = state.data.actions.find((item) => item.action_id === candidate.actionId); const rewards = Object.entries(candidate.reward).map(([key, value]) => `<div class="headbar"><span>${escapeHTML(key.replaceAll("_", " "))}</span><div class="bar"><i style="width:${Math.round(value * 100)}%"></i></div><strong>${value.toFixed(2)}</strong></div>`).join(""); inspector.innerHTML = `<img class="hero-image" src="${escapeHTML(candidate.image)}" alt="Generated candidate ${escapeHTML(candidate.id)}"><h2>${escapeHTML(short(candidate.id, 30))}</h2><p class="sub">KF ${candidate.keyframeId} · ${escapeHTML(candidate.actionId)} · score ${candidate.score.toFixed(4)}</p><div class="warning"><strong>${candidate.keyframeRank === 1 ? "Counterfactual best." : "Candidate audit."}</strong><br>${escapeHTML(candidate.reason)}</div><dl class="metrics"><dt>Keyframe rank</dt><dd>#${candidate.keyframeRank}</dd><dt>Action rank</dt><dd>#${candidate.actionRank}</dd><dt>Human lock</dt><dd>${candidate.humanLock}</dd><dt>Exposure</dt><dd>${escapeHTML(candidate.exposure)}</dd><dt>Failure hypothesis</dt><dd>${escapeHTML(candidate.failure.replaceAll("_", " "))} · ${escapeHTML(candidate.basis)}</dd></dl><h3>Heuristic reward vector</h3>${rewards}<h3>Generation prompt</h3><p class="prompt">${escapeHTML(action?.prompt || "Not recorded")}</p>`; }

  function focusKeyframe(id, openRoute) { const keyframe = keyframeById(id); if (!keyframe) return; if (openRoute) drawRoute(id); else showKeyframe(keyframe); }
  function search() { const value = $("#query").value.trim().toLowerCase(); if (!value) return; const candidate = state.data.candidates.find((item) => item.id.toLowerCase().includes(value) || item.failure.toLowerCase().includes(value)); if (candidate) { drawRoute(candidate.keyframeId, `candidate:${candidate.id}`); return; } const action = state.data.actions.find((item) => item.action_id.toLowerCase() === value || item.prompt.toLowerCase().includes(value)); if (action) { drawRoute(action.keyframe_id); const node = world.querySelector(`[data-selection="action:${action.action_id}"]`); selectNode(node, `action:${action.action_id}`); showAction(action); return; } const keyframe = state.data.keyframes.find((item) => String(item.keyframe_id) === value.replace(/^kf\s*/, "") || item.keyframe.toLowerCase().includes(value)); if (keyframe) { drawRoute(keyframe.keyframe_id); return; } $("#status-text").textContent = `No image, action or keyframe matched “${value}”.`; }
  function wire() {
    $("#overview").onclick = drawOverview; $("#generations").onclick = () => drawRoute(state.currentKF || state.data.keyframes[0].keyframe_id); $("#plus").onclick = () => zoom(1.2); $("#minus").onclick = () => zoom(.82); $("#fit").onclick = fit; $("#query").addEventListener("keydown", (event) => { if (event.key === "Enter") search(); }); $("#query").addEventListener("change", search); $("#nav-search").addEventListener("input", renderNavigator); $("#nav-all").onclick = () => { state.nav = "all"; $("#nav-all").classList.add("active"); $("#nav-linked").classList.remove("active"); renderNavigator(); }; $("#nav-linked").onclick = () => { state.nav = "linked"; $("#nav-linked").classList.add("active"); $("#nav-all").classList.remove("active"); renderNavigator(); }; $("#filter").onchange = () => { state.nav = $("#filter").value; $("#nav-all").classList.toggle("active", state.nav === "all"); $("#nav-linked").classList.toggle("active", state.nav === "linked"); renderNavigator(); }; $("#hide-left").onclick = () => shell.classList.add("left-hidden"); $("#hide-right").onclick = () => shell.classList.add("right-hidden"); $("#show-left").onclick = () => { shell.classList.remove("left-hidden"); shell.classList.toggle("mobile-left-open", innerWidth <= 760); }; $("#show-right").onclick = () => { shell.classList.remove("right-hidden"); shell.classList.toggle("mobile-right-open", innerWidth <= 760); }; $("#status-toggle").onclick = () => { const open = $("#status").classList.toggle("expanded"); $("#status-toggle").setAttribute("aria-expanded", String(open)); }; stage.addEventListener("pointerdown", (event) => { if (event.target.closest(".canvas-node")) return; drag = { x: event.clientX, y: event.clientY }; stage.classList.add("drag"); stage.setPointerCapture(event.pointerId); }); stage.addEventListener("pointermove", (event) => { if (!drag) return; state.x += event.clientX - drag.x; state.y += event.clientY - drag.y; drag = { x: event.clientX, y: event.clientY }; applyTransform(); }); stage.addEventListener("pointerup", (event) => { drag = null; stage.classList.remove("drag"); if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId); }); stage.addEventListener("wheel", (event) => { event.preventDefault(); const rect = stage.getBoundingClientRect(); zoom(event.deltaY < 0 ? 1.12 : .88, event.clientX - rect.left, event.clientY - rect.top); }, { passive: false }); new ResizeObserver(() => fit()).observe(stage); }
  async function load() { try { const raw = await fetch("/laserman/scene-4-keyframe-canvas.html").then((response) => response.text()); const start = raw.indexOf("const DATA=") + "const DATA=".length; const end = raw.indexOf("}]};\n(()=>{", start); if (start < "const DATA=".length || end < 0) throw new Error("Could not locate the source archive."); state.data = JSON.parse(raw.slice(start, end + 3)); $("#summary").textContent = `${state.data.meta.keyframe_count} keyframe families · ${state.data.meta.action_count} actions · ${state.data.meta.candidate_count.toLocaleString()} generated states · heuristic audit`; wire(); drawOverview(); } catch (error) { $("#summary").textContent = "Archive load failed"; inspector.innerHTML = `<div class="empty">${escapeHTML(error.message)}</div>`; } }
  load();
})();
