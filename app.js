const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const EMAIL = "official.priyanshchauhan@gmail.com";

// ---------- helpers ----------
const toast = (msg) => { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 1800); };
const copyEmail = async () => { try { await navigator.clipboard.writeText(EMAIL); toast("Email copied"); } catch { location.href = "mailto:" + EMAIL; } };
const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };

// ---------- loader ----------
const hideLoader = () => { const l = $("#loader"); if (!l) return; l.classList.add("done"); setTimeout(() => l.remove(), 600); };
addEventListener("load", () => setTimeout(hideLoader, reduced ? 0 : 700));
setTimeout(hideLoader, 2500);
$("#yr").textContent = new Date().getFullYear();

// ---------- typing ----------
(() => {
  const roles = ["software developer", "full-stack developer", "Spring Boot + React engineer", "ML, shipped behind real APIs", "300+ DSA problems in Java"];
  const el = $("#typed");
  if (reduced) { el.textContent = roles[0]; return; }
  let r = 0, i = 0, del = false;
  (function tick() {
    const word = roles[r];
    el.textContent = word.slice(0, i);
    if (!del && i === word.length) { del = true; return setTimeout(tick, 1600); }
    if (del && i === 0) { del = false; r = (r + 1) % roles.length; }
    i += del ? -1 : 1;
    setTimeout(tick, del ? 35 : 70);
  })();
})();

// ---------- theme ----------
const setTheme = (t) => { document.documentElement.dataset.theme = t; store.set("theme", t); $('meta[name="theme-color"]').content = t === "light" ? "#f5f6fb" : "#07080d"; };
const toggleTheme = () => setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
$("#themeBtn").addEventListener("click", toggleTheme);
$("#copyMail").addEventListener("click", copyEmail);

// ---------- marquee ----------
const items = ["Java", "Spring Boot", "PHP", "CodeIgniter", "MySQL", "React", "Recharts", "JavaScript", "Python", "FastAPI", "PyTorch", "HuggingFace", "MLflow", "OpenCV", "PostgreSQL", "Redis", "Docker", "Nginx", "Git"];
$("#track").innerHTML = [...items, ...items].map((t) => `<span>${t}</span>`).join("");

// ---------- projects ----------
const grid = $("#pgrid");
grid.innerHTML = PROJECTS.map((p, i) => `
  <button class="card proj" data-id="${p.id}" data-tags="${p.tags.join(" ")}" type="button">
    <span class="n mono">${String(i + 1).padStart(2, "0")}${p.flagship ? '<span class="star">flagship</span>' : ""}${p.work ? `<span class="star">@ ${p.work}</span>` : ""}</span>
    <h3>${p.name}</h3>
    <p>${p.blurb}</p>
    <div>${p.stack.slice(0, 4).map((s) => `<span class="tag">${s}</span>`).join("")}</div>
    <span class="more mono">details &rarr;</span>
  </button>`).join("");

$("#filters").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  $$("#filters button").forEach((x) => x.classList.toggle("on", x === b));
  const f = b.dataset.f;
  $$(".proj").forEach((c) => c.classList.toggle("hide", f !== "all" && !c.dataset.tags.split(" ").includes(f)));
});

const modal = $("#modal");
const openProject = (id) => {
  const p = PROJECTS.find((x) => x.id === id); if (!p) return;
  const d = p.detail, list = (a) => `<ul>${a.map((x) => `<li>${x}</li>`).join("")}</ul>`;
  $("#mbody").innerHTML = `
    <span class="label mono">${p.tags.join(" · ")}</span>
    <h3>${p.name}</h3><p>${p.blurb}</p>
    ${d.metrics ? `<div class="mstats">${d.metrics.map(([v, l]) => `<div><b>${v}</b>${l}</div>`).join("")}</div>` : ""}
    <h4>Problem</h4><p>${d.problem}</p>
    <h4>What I built</h4>${list(d.built.slice(0, 3))}
    <h4>Stack</h4><div>${p.stack.map((s) => `<span class="tag">${s}</span>`).join("")}</div>
    <div class="cta" style="margin-top:22px">
      <a class="btn p" href="case.html?id=${p.id}">Full case study &rarr;</a>
      ${p.repo ? `<a class="btn" href="${p.repo}" target="_blank" rel="noopener">Source code</a>` : ""}
      ${p.live ? `<a class="btn" href="${p.live}" target="_blank" rel="noopener">Live demo</a>` : ""}
    </div>`;
  modal.showModal();
};
grid.addEventListener("click", (e) => { const c = e.target.closest(".proj"); if (c) openProject(c.dataset.id); });
$("#mclose").addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

// ---------- architecture ----------
const showNode = (n) => {
  const [title, tech, port, text] = ARCH[n];
  $("#archInfo").innerHTML = `<span class="label mono">service</span><h3>${title}</h3><span class="port mono">${tech} · ${port}</span><p>${text}</p>`;
  $$(".nodeb").forEach((b) => b.classList.toggle("on", b.dataset.n === n));
};
$("#diagram").addEventListener("click", (e) => { const b = e.target.closest(".nodeb"); if (b) showNode(b.dataset.n); });
showNode("frontend");

// ---------- sorting lab ----------
(() => {
  const bars = $("#bars"), cmpEl = $("#cmp"), wrEl = $("#wr");
  const CPLX = { bubble: "avg O(n²)", selection: "avg O(n²)", insertion: "avg O(n²)", merge: "O(n log n)", quick: "avg O(n log n)" };
  let arr = [], running = false, stopFlag = false;

  const render = (hl = [], ok = false) => {
    bars.innerHTML = arr.map((v, i) => `<i style="height:${v}%" class="${ok ? "ok" : hl.includes(i) ? "cmp" : ""}"></i>`).join("");
  };
  const shuffle = () => { stopFlag = true; const n = +$("#size").value; arr = Array.from({ length: n }, () => 5 + Math.random() * 95); cmpEl.textContent = wrEl.textContent = 0; render(); };

  function* bubble(a) { for (let i = 0; i < a.length; i++) for (let j = 0; j < a.length - i - 1; j++) { yield ["c", j, j + 1]; if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; yield ["w", j, j + 1]; } } }
  function* selection(a) { for (let i = 0; i < a.length; i++) { let m = i; for (let j = i + 1; j < a.length; j++) { yield ["c", m, j]; if (a[j] < a[m]) m = j; } if (m !== i) { [a[i], a[m]] = [a[m], a[i]]; yield ["w", i, m]; } } }
  function* insertion(a) { for (let i = 1; i < a.length; i++) { let j = i; while (j > 0) { yield ["c", j - 1, j]; if (a[j - 1] <= a[j]) break; [a[j - 1], a[j]] = [a[j], a[j - 1]]; yield ["w", j - 1, j]; j--; } } }
  function* merge(a, lo = 0, hi = a.length - 1) {
    if (lo >= hi) return; const mid = (lo + hi) >> 1;
    yield* merge(a, lo, mid); yield* merge(a, mid + 1, hi);
    const L = a.slice(lo, mid + 1), R = a.slice(mid + 1, hi + 1); let i = 0, j = 0, k = lo;
    while (i < L.length && j < R.length) { yield ["c", lo + i, mid + 1 + j]; a[k] = L[i] <= R[j] ? L[i++] : R[j++]; yield ["w", k++]; }
    while (i < L.length) { a[k] = L[i++]; yield ["w", k++]; }
    while (j < R.length) { a[k] = R[j++]; yield ["w", k++]; }
  }
  function* quick(a, lo = 0, hi = a.length - 1) {
    if (lo >= hi) return; const p = a[hi]; let i = lo;
    for (let j = lo; j < hi; j++) { yield ["c", j, hi]; if (a[j] < p) { [a[i], a[j]] = [a[j], a[i]]; yield ["w", i, j]; i++; } }
    [a[i], a[hi]] = [a[hi], a[i]]; yield ["w", i, hi];
    yield* quick(a, lo, i - 1); yield* quick(a, i + 1, hi);
  }
  const ALGOS = { bubble, selection, insertion, merge, quick };

  const run = async () => {
    if (running) return;
    running = true; stopFlag = false; $("#run").textContent = "Sorting...";
    let c = 0, w = 0;
    const gen = ALGOS[$("#algo").value](arr);
    for (const [t, ...idx] of gen) {
      if (stopFlag) break;
      t === "c" ? c++ : w++;
      cmpEl.textContent = c; wrEl.textContent = w;
      render(idx);
      const speed = +$("#speed").value;
      await new Promise((r) => setTimeout(r, reduced ? 0 : Math.max(1, 120 - speed * 1.2)));
    }
    if (!stopFlag) render([], true);
    running = false; $("#run").textContent = "Sort";
  };

  $("#run").addEventListener("click", run);
  $("#shuffle").addEventListener("click", () => { shuffle(); });
  $("#size").addEventListener("input", () => { if (!running) shuffle(); });
  $("#algo").addEventListener("change", () => { $("#cplx").textContent = CPLX[$("#algo").value]; });
  shuffle();
})();

// ---------- github live ----------
(async () => {
  const box = $("#repos");
  try {
    const [user, repos] = await Promise.all([
      fetch("https://api.github.com/users/PriyanshCh").then((r) => { if (!r.ok) throw r; return r.json(); }),
      fetch("https://api.github.com/users/PriyanshCh/repos?sort=updated&per_page=100").then((r) => { if (!r.ok) throw r; return r.json(); }),
    ]);
    $("#gRepos").textContent = $("#hRepos").textContent = user.public_repos;
    $("#gFol").textContent = user.followers;
    const counts = {};
    repos.forEach((r) => r.language && (counts[r.language] = (counts[r.language] || 0) + 1));
    $("#gLang").textContent = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
    box.innerHTML = repos.filter((r) => !r.fork && r.name !== "PriyanshCh").slice(0, 6).map((r) => `
      <a class="repo" href="${r.html_url}" target="_blank" rel="noopener">
        <b>${r.name}</b>
        <span class="mono">${r.language || "misc"} · ★ ${r.stargazers_count} · updated ${new Date(r.pushed_at).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</span>
      </a>`).join("");
  } catch {
    box.innerHTML = `<p style="color:var(--dim)">GitHub's API is rate-limited right now. <a href="https://github.com/PriyanshCh" style="color:var(--lime)" target="_blank" rel="noopener">See repos on GitHub &rarr;</a></p>`;
  }
})();

// ---------- contact (mailto, no backend) ----------
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const subject = encodeURIComponent(`Portfolio message from ${f.get("name")}`);
  const body = encodeURIComponent(`${f.get("msg")}\n\nReply to: ${f.get("email")}`);
  location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  toast("Opening your mail app...");
});

// ---------- scroll: progress, active nav, reveal, back-to-top ----------
const navLinks = $$("nav a[data-s]");
const sections = navLinks.map((a) => document.getElementById(a.dataset.s));
const onScroll = () => {
  const h = document.documentElement;
  $("#progress").style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
  $("#top-btn").classList.toggle("show", h.scrollTop > 700);
  let cur = "top";
  sections.forEach((s) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) cur = s.id; });
  navLinks.forEach((a) => a.classList.toggle("on", a.dataset.s === cur));
};
addEventListener("scroll", onScroll, { passive: true }); onScroll();
$("#top-btn").addEventListener("click", () => scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));

const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.06 });
$$(".rv").forEach((el) => io.observe(el));

// card spotlight
document.addEventListener("pointermove", (e) => {
  const c = e.target.closest?.(".card"); if (!c) return;
  const r = c.getBoundingClientRect();
  c.style.setProperty("--mx", e.clientX - r.left + "px"); c.style.setProperty("--my", e.clientY - r.top + "px");
});

// ---------- command palette ----------
(() => {
  const pal = $("#palette"), input = $("#pin"), list = $("#plist");
  const go = (id) => () => document.getElementById(id).scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  const CMDS = [
    ["Go to About", "section", go("about")], ["Go to Experience", "section", go("experience")], ["Go to Skills", "section", go("skills")], ["Go to Projects", "section", go("work")],
    ["Go to System design", "section", go("architecture")], ["Go to Algorithm lab", "section", go("lab")],
    ["Go to GitHub activity", "section", go("github")], ["Go to Contact", "section", go("contact")],
    ...PROJECTS.map((p) => [`Open ${p.name}`, "project", () => openProject(p.id)]),
    ["Toggle theme", "action", toggleTheme], ["Copy email", "action", copyEmail],
    ["Open GitHub", "link", () => open("https://github.com/PriyanshCh", "_blank")],
    ["Open LinkedIn", "link", () => open("https://www.linkedin.com/in/priyansh1204", "_blank")],
    ["Open LeetCode", "link", () => open("https://leetcode.com/u/PriyanshChauhan/", "_blank")],
  ];
  let shown = CMDS, sel = 0;
  const draw = () => {
    const q = input.value.toLowerCase().trim();
    shown = CMDS.filter(([n]) => n.toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    list.innerHTML = shown.map(([n, k], i) => `<li data-i="${i}" class="${i === sel ? "on" : ""}">${n}<small>${k}</small></li>`).join("") || `<li>No match</li>`;
  };
  const exec = (i) => { const c = shown[i]; if (!c) return; pal.close(); c[2](); };
  const openPal = () => { input.value = ""; sel = 0; draw(); pal.showModal(); input.focus(); };
  $("#cmdBtn").addEventListener("click", openPal);
  addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.open ? pal.close() : openPal(); }
  });
  input.addEventListener("input", () => { sel = 0; draw(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % shown.length; draw(); }
    if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + shown.length) % shown.length; draw(); }
    if (e.key === "Enter") { e.preventDefault(); exec(sel); }
  });
  list.addEventListener("click", (e) => { const li = e.target.closest("li[data-i]"); if (li) exec(+li.dataset.i); });
  pal.addEventListener("click", (e) => { if (e.target === pal) pal.close(); });
})();

// ---------- neural network background ----------
(() => {
  if (reduced) return;
  const cv = $("#net"), cx = cv.getContext("2d");
  let W, H, pts = [], m = { x: -999, y: -999 };
  const size = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(90, Math.floor((W * H) / 18000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35 }));
  };
  addEventListener("resize", size);
  addEventListener("pointermove", (e) => { m.x = e.clientX; m.y = e.clientY; });
  size();
  (function draw() {
    const cs = getComputedStyle(document.documentElement);
    const net = cs.getPropertyValue("--net").trim(), dot = cs.getPropertyValue("--dot").trim();
    cx.clearRect(0, 0, W, H);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      const dx = p.x - m.x, dy = p.y - m.y, d = Math.hypot(dx, dy);
      if (d < 140 && d > 0) { p.x += (dx / d) * 1.2; p.y += (dy / d) * 1.2; }
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 130) { cx.strokeStyle = `rgba(${net},${(1 - d / 130) * 0.35})`; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(pts[i].x, pts[i].y); cx.lineTo(pts[j].x, pts[j].y); cx.stroke(); }
      }
      const near = Math.hypot(pts[i].x - m.x, pts[i].y - m.y) < 180;
      cx.fillStyle = `rgba(${dot},${near ? 1 : 0.55})`;
      cx.beginPath(); cx.arc(pts[i].x, pts[i].y, near ? 2.6 : 1.8, 0, Math.PI * 2); cx.fill();
    }
    requestAnimationFrame(draw);
  })();
})();
