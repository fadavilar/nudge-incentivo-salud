/* ============================================================
   App — Nudge o incentivo: guiar o recompensar la conducta en salud
   Motor de la skill "explorador-interactivo" (tema, acordeón, buscador,
   atajos, scrollspy, exportación, modos enfocado/resumen) + render
   específicos: diagrama de mecanismos, evidencia, calculadora del costo
   de un punto de adherencia, ejemplos colombianos y lista de chequeo.
   ============================================================ */
(function(){
  "use strict";

  /* ---------------- Theme ---------------- */
  const THEME_KEY = "nis_theme";
  function applyTheme(mode){
    if(mode === "light" || mode === "dark") document.documentElement.setAttribute("data-theme", mode);
    else document.documentElement.removeAttribute("data-theme");
  }
  function currentEffectiveTheme(){
    const attr = document.documentElement.getAttribute("data-theme");
    if(attr) return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function initTheme(){
    let saved = null;
    try{ saved = localStorage.getItem(THEME_KEY); }catch(e){}
    applyTheme(saved);
  }
  function toggleTheme(){
    const next = currentEffectiveTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    try{ localStorage.setItem(THEME_KEY, next); }catch(e){}
  }
  initTheme();

  /* ---------------- Utility ---------------- */
  const svgNS = "http://www.w3.org/2000/svg";
  function el(tag, attrs, children){
    const node = document.createElement(tag);
    if(attrs){
      Object.keys(attrs).forEach(k=>{
        if(k === "class") node.setAttribute("class", attrs[k]);
        else if(k === "html") node.innerHTML = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children||[]).forEach(c=>{ if(c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return node;
  }
  function svgEl(tag, attrs){
    const n = document.createElementNS(svgNS, tag);
    Object.keys(attrs||{}).forEach(k=> n.setAttribute(k, attrs[k]));
    return n;
  }
  function escapeXML(s){
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }
  function wrapLabel(text, maxChars){
    const words = text.split(" ");
    const lines = []; let cur = "";
    words.forEach(w=>{
      if((cur+" "+w).trim().length > maxChars){ if(cur) lines.push(cur.trim()); cur = w; }
      else cur = (cur+" "+w).trim();
    });
    if(cur) lines.push(cur);
    return lines;
  }
  function slug(s){
    return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  }
  function studyByKey(key){ return DATA.studies.find(s=>s.key===key); }
  function refInfo(key){
    const s = studyByKey(key);
    if(s) return { label:key, url:s.url, title:`${s.author} (${s.year}). ${s.title}. ${s.journal}.` };
    return { label:key, url:null, title:key };
  }
  function refChips(keys){
    const span = el("span",{class:"refs"});
    (keys||[]).forEach(k=>{
      const r = refInfo(k);
      span.appendChild(r.url
        ? el("a",{class:"cite-tag", href:r.url, target:"_blank", rel:"noopener noreferrer", title:r.title},[r.label])
        : el("span",{class:"cite-tag", title:r.title},[r.label]));
    });
    return span;
  }
  function refsHTML(keys){
    if(!keys || !keys.length) return "";
    return `<p class="tt-refs">Fuentes: ` + keys.map(k=>{
      const r = refInfo(k);
      return r.url ? `<a href="${escapeXML(r.url)}" target="_blank" rel="noopener noreferrer">${escapeXML(r.label)}</a>` : escapeXML(r.label);
    }).join(" · ") + `</p>`;
  }
  const CONFIDENCE_LABEL = { verificado:"Verificado en fuente", "nota-autor":"Síntesis del autor", pendiente:"Pendiente de verificación" };
  function confidenceTag(level, label){
    return el("span",{class:"confidence-tag confidence-"+level, title:"Procedencia: "+(label||CONFIDENCE_LABEL[level])},[label||CONFIDENCE_LABEL[level]]);
  }
  function noteLine(text, level){
    return el("p",{class:"author-note"},[ confidenceTag(level||"nota-autor"), " ", text ]);
  }
  function h4(text){ return el("h4",{class:"block-title"},[text]); }
  function extLink(label, url){ return el("a",{href:url, target:"_blank", rel:"noopener noreferrer"},[label]); }
  function tableWrap(headers, rows, opts){
    opts = opts || {};
    const table = el("table",{class:"data-table wrap-table"+(opts.cls?" "+opts.cls:"")},[
      opts.caption ? el("caption",{class:"sr-only"},[opts.caption]) : null,
      el("thead",{},[ el("tr",{}, headers.map(h=> el("th",{},[h]))) ]),
      el("tbody",{}, rows.map(r=> el("tr",{}, r.map(c=> el("td",{}, [c]))))),
    ]);
    return el("div",{class:"table-wrap"},[table]);
  }
  const NF = (d)=> new Intl.NumberFormat("es-CO",{ maximumFractionDigits:d, minimumFractionDigits:0 });
  function fmt(x, d){ return (x==null || !isFinite(x)) ? "—" : NF(d==null?0:d).format(x); }
  function money(x){ return (x==null || !isFinite(x)) ? "—" : "$ "+NF(0).format(Math.round(x)); }

  /* ============================================================
     SECTIONS
     ============================================================ */
  const SECTIONS = [
    { id:"resumen", num:"01", title:"Resumen", sub:"Tres mensajes clave y cómo leer la app según tu perfil", open:true,
      subs:[ { id:"resumen-mensajes", label:"Tres mensajes clave" }, { id:"resumen-perfiles", label:"Cómo leer esta app" } ] },
    { id:"diferencia", num:"02", title:"Nudge o incentivo: la diferencia", sub:"Definiciones, seis dimensiones, el mecanismo en un diagrama y las cuatro familias de intervenciones", open:false,
      subs:[ { id:"dif-definiciones", label:"Definiciones" }, { id:"dif-tabla", label:"Seis dimensiones" }, { id:"dif-diagrama", label:"Dos rutas hacia la conducta" }, { id:"dif-familias", label:"Cuatro familias de intervenciones" } ] },
    { id:"evidencia", num:"03", title:"Lo que dice la evidencia", sub:"Incentivos, nudges y las tensiones de la literatura 2021–2026", open:false,
      subs:[ { id:"ev-incentivos", label:"Incentivos financieros" }, { id:"ev-nudges", label:"Nudges" }, { id:"ev-tensiones", label:"Tensiones y advertencias" } ] },
    { id:"calculadora", num:"04", title:"Calculadora: el costo de un punto de adherencia", sub:"Plantilla interactiva con un caso real colombiano y un ejercicio ilustrativo por defecto", open:false,
      subs:[ { id:"calc-plantilla", label:"Plantilla interactiva" }, { id:"calc-comparar", label:"Comparar escenarios" }, { id:"calc-formulas", label:"Cómo se calcula" } ] },
    { id:"colombia", num:"05", title:"Ejemplos en el escenario colombiano", sub:"Normas y programas reales clasificados por mecanismo, más ideas para tu institución", open:false,
      subs:[ { id:"col-ejemplos", label:"Ocho ejemplos verificados" }, { id:"col-ideas", label:"Ideas para tu institución" } ] },
    { id:"etica", num:"06", title:"Ética y diseño", sub:"¿Cuándo es legítimo empujar o pagar? Incluye una lista de chequeo antes de lanzar una intervención", open:false,
      subs:[ { id:"etica-posiciones", label:"Tres posiciones" }, { id:"etica-checklist", label:"Lista de chequeo" } ] },
    { id:"glosario", num:"07", title:"Glosario", sub:DATA.glossary.length+" términos con su equivalente en inglés", open:false },
    { id:"metodos", num:"08", title:"Metodología y fuentes", sub:"De dónde sale el contenido, qué limitaciones tiene y los "+DATA.studies.length+" documentos citados", open:false,
      subs:[ { id:"met-revision", label:"La revisión de alcance" }, { id:"met-fuentes", label:"Fuentes y etiquetas" }, { id:"met-estudios", label:"Documentos citados" }, { id:"met-limitaciones", label:"Limitaciones" } ] },
    { id:"conclusion", num:"09", title:"Conclusión", sub:"Guiar o recompensar, y luego medir", open:false },
  ];

  function buildAccordionShell(){
    const root = document.getElementById("accordion");
    SECTIONS.forEach(s=>{
      const item = el("div",{class:"acc-item"+(s.open?" open":""), id:"sec-"+s.id});
      const header = el("button",{class:"acc-header", id:"hdr-"+s.id, "aria-expanded": s.open?"true":"false", "aria-controls":"panel-"+s.id, type:"button"},[
        el("span",{class:"num"},[s.num]),
        el("span",{class:"titles"},[ el("h3",{},[s.title]), el("span",{class:"sub"},[s.sub]) ]),
        el("svg",{class:"chev",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round",html:'<path d="M6 9l6 6 6-6"/>'}),
      ]);
      header.addEventListener("click", ()=> toggleSection(item, header));
      const panel = el("div",{class:"acc-panel", id:"panel-"+s.id});
      panel.appendChild(el("div",{},[ el("div",{class:"acc-body", id:"body-"+s.id, role:"region", "aria-labelledby":"hdr-"+s.id}) ]));
      item.appendChild(header); item.appendChild(panel);
      root.appendChild(item);
    });
  }
  function toggleSection(item, header, forceOpen){
    const willOpen = typeof forceOpen === "boolean" ? forceOpen : !item.classList.contains("open");
    item.classList.toggle("open", willOpen);
    header.setAttribute("aria-expanded", willOpen ? "true":"false");
  }
  function setAllSections(open){
    document.querySelectorAll(".acc-item").forEach(item=> toggleSection(item, item.querySelector(".acc-header"), open));
  }
  function openSection(sectionId){
    const item = document.getElementById("sec-"+sectionId);
    if(item) toggleSection(item, item.querySelector(".acc-header"), true);
  }
  function sectionDivider(body, id, title, subtitle){
    body.appendChild(el("h3",{id:id, class:"subsection-title"},[title]));
    if(subtitle) body.appendChild(el("p",{class:"subsection-subtitle"},[subtitle]));
  }
  function goTo(sectionId, anchorId){
    if(document.body.classList.contains("summary-mode")) setSummaryMode(false);
    openSection(sectionId);
    setTimeout(()=> scrollToId(anchorId || ("sec-"+sectionId)), 60);
  }
  function jumpButton(label, sectionId, anchorId){
    const b = el("button",{class:"btn btn-small", type:"button"},[label]);
    b.addEventListener("click", ()=> goTo(sectionId, anchorId));
    return b;
  }
  function flash(id){
    setTimeout(()=>{ const c = document.getElementById(id); if(c){ c.classList.remove("flash"); void c.offsetWidth; c.classList.add("flash"); } }, 380);
  }

  /* ============================================================
     HERO
     ============================================================ */
  function renderHero(){
    const m = DATA.meta;
    document.getElementById("brand-title").textContent = m.shortTitle;
    document.getElementById("hero-title").textContent = m.title;
    document.getElementById("hero-lede").textContent = m.subtitle;
    document.getElementById("hero-framework").textContent = m.framework;
    document.getElementById("hero-period").textContent = m.period;
    document.getElementById("byline").innerHTML = `<strong>${escapeXML(m.author)}</strong>, ${escapeXML(m.credentials)} · ${escapeXML(m.affiliation)}`;
    const cta = DATA.calculator.cta;
    const ctaBtn = el("button",{class:"btn btn-primary hero-cta-btn", type:"button"},[cta.button+" →"]);
    ctaBtn.addEventListener("click", ()=> goTo("calculadora","calc-plantilla"));
    document.getElementById("hero-cta").appendChild(el("div",{class:"hero-cta-box"},[
      el("div",{class:"hero-cta-text"},[ el("p",{class:"hero-cta-title"},[cta.title]), el("p",{},[cta.text]) ]),
      ctaBtn ]));
    const grid = document.getElementById("stat-grid");
    DATA.heroCards.forEach(c=>{
      const s = SECTIONS.find(x=>x.id===c.sec);
      const card = el("button",{class:"stat-card hero-jump", type:"button", "aria-label":"Ir a la sección "+s.num+": "+s.title},[
        el("div",{class:"value"},[c.value]), el("div",{class:"label"},[c.label]), el("div",{class:"detail"},[c.detail]),
      ]);
      card.addEventListener("click", ()=> goTo(c.sec));
      grid.appendChild(card);
    });
    const c = DATA.citation;
    const cit = document.getElementById("hero-citation");
    cit.appendChild(el("p",{class:"hero-citation-label"},["Cómo citar"]));
    cit.appendChild(el("p",{class:"hero-citation-text"},[c.text]));
    cit.appendChild(el("a",{class:"hero-citation-link", href:c.url, target:"_blank", rel:"noopener noreferrer"},[c.linkLabel+" →"]));

    document.getElementById("footer-disclaimer").textContent = m.disclaimer;
    document.getElementById("footer-author").textContent = m.author+", "+m.credentials+" · "+m.affiliation;
    document.getElementById("year").textContent = new Date().getFullYear();
    const lic = m.license;
    const badge = document.getElementById("cc-badge");
    badge.href = lic.url; badge.title = lic.name;
    badge.innerHTML = `
      <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true">
        <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" stroke-width="1.6"/>
        <circle cx="11.2" cy="16" r="6.4" fill="none" stroke="currentColor" stroke-width="1.6"/>
        <circle cx="20.8" cy="16" r="6.4" fill="none" stroke="currentColor" stroke-width="1.6"/>
        <path d="M13 13.1c-.7-.5-1.4-.7-2.2-.7-1.9 0-3.3 1.5-3.3 3.6s1.4 3.6 3.3 3.6c.9 0 1.6-.2 2.3-.8l-.6-1.1c-.5.4-1 .6-1.6.6-1.1 0-1.9-.9-1.9-2.3s.8-2.3 1.9-2.3c.5 0 1 .2 1.5.5z" fill="currentColor" stroke="none"/>
        <path d="M22.6 13.1c-.7-.5-1.4-.7-2.2-.7-1.9 0-3.3 1.5-3.3 3.6s1.4 3.6 3.3 3.6c.9 0 1.6-.2 2.3-.8l-.6-1.1c-.5.4-1 .6-1.6.6-1.1 0-1.9-.9-1.9-2.3s.8-2.3 1.9-2.3c.5 0 1 .2 1.5.5z" fill="currentColor" stroke="none"/>
      </svg>
      <span>${escapeXML(lic.name)}</span>`;
    document.getElementById("footer-license-text").textContent = lic.text;
  }

  /* ============================================================
     01 RESUMEN
     ============================================================ */
  function renderResumen(){
    const body = document.getElementById("body-resumen");
    sectionDivider(body, "resumen-mensajes", "Tres mensajes clave", "Lo esencial en tres ideas. Cada una enlaza a la evidencia que la sustenta.");
    const grid = el("div",{class:"abstract-grid"});
    DATA.keyMessages.forEach((k,i)=> grid.appendChild(el("div",{class:"pcc-card"},[ el("div",{class:"k"},[(i+1)+" · "+k.title]), el("p",{},[k.text]), k.refs.length ? refChips(k.refs) : null,
      k.calc ? el("div",{class:"btn-row"},[ jumpButton("Calcularlo con la calculadora →","calculadora","calc-plantilla") ]) : null ])));
    body.appendChild(grid);
    sectionDivider(body, "resumen-perfiles", "Cómo leer esta app según tu perfil", "Tres rutas sugeridas. Todas las secciones siguen colapsadas hasta que las abras.");
    const aud = el("div",{class:"audience-grid"});
    DATA.audiences.forEach(a=>{
      const row = el("div",{class:"btn-row"});
      a.jump.forEach(id=>{ const s = SECTIONS.find(x=>x.id===id); row.appendChild(jumpButton(s.num+" · "+s.title+" →", id)); });
      aud.appendChild(el("div",{class:"audience-card"},[ el("h4",{},[a.who]), el("p",{},[a.path]), row ]));
    });
    body.appendChild(aud);
    const rw = DATA.meta.relatedWorks[0];
    body.appendChild(el("div",{class:"card", style:"margin-top:14px"},[ el("strong",{},["Explorador relacionado · "]), extLink(rw.title, rw.url), el("p",{style:"margin:6px 0 0"},[rw.text]) ]));
  }

  /* ============================================================
     02 DIFERENCIA
     ============================================================ */
  function renderDiferencia(){
    const body = document.getElementById("body-diferencia");
    const d = DATA.difference;
    body.appendChild(el("p",{},[d.intro]));
    sectionDivider(body, "dif-definiciones", "Definiciones", "Tres familias de intervenciones conductuales.");
    const defs = el("div",{class:"triple-grid"});
    d.definitions.forEach(x=> defs.appendChild(el("div",{class:"card"},[ el("strong",{},[x.term]), el("p",{style:"margin:6px 0 8px"},[x.text]), refChips(x.refs) ])));
    body.appendChild(defs);

    sectionDivider(body, "dif-tabla", "Seis dimensiones", "Guiar o recompensar: la misma meta por dos caminos.");
    const t = el("table",{class:"data-table compare-table"},[
      el("caption",{class:"sr-only"},["Comparación entre nudge e incentivo en seis dimensiones"]),
      el("thead",{},[ el("tr",{},[ el("th",{},["Dimensión"]), el("th",{class:"col-nudge"},["Nudge · guía"]), el("th",{class:"col-incentive"},["Incentivo · recompensa"]) ]) ]),
      el("tbody",{}, d.table.map(r=> r.shared
        ? el("tr",{class:"shared-row"},[ el("th",{scope:"row"},[r.dim]), el("td",{colspan:"2"},[r.shared]) ])
        : el("tr",{},[ el("th",{scope:"row"},[r.dim]), el("td",{},[r.nudge]), el("td",{},[r.incentive]) ]) )),
    ]);
    body.appendChild(el("div",{class:"table-wrap"},[t]));
    body.appendChild(noteLine(d.tableNote));
    body.appendChild(el("p",{class:"muted-small"},["Documentos: ", refChips(d.tableRefs)]));

    sectionDivider(body, "dif-diagrama", "Dos rutas hacia la conducta", "Toca o recorre con el teclado cada caja para ver qué dice la evidencia en ese punto.");
    const wrap = diagramWrap(buildMechanismSVG());
    body.appendChild(wrap);
    body.appendChild(el("p",{class:"diagram-hint"},["Las dos ramas superiores son los mecanismos; las inferiores, lo que hay que medir después: el resultado en salud y si el efecto persiste."]));
    const list = el("ul",{class:"gap-list a11y-list"});
    d.diagram.nodes.forEach(n=> list.appendChild(el("li",{},[ el("div",{},[ el("strong",{},[n.label+". "]), n.detail, " ", refChips(n.refs) ]) ])));
    addAccessibleListToggle(body, wrap, list);
    body.appendChild(noteLine("Diagrama didáctico del autor; el contenido de cada caja resume los documentos citados."));

    sectionDivider(body, "dif-familias", "Cuatro familias de intervenciones", "Una familia de incentivos y tres de nudges.");
    const fam = el("div",{class:"mini-grid family-grid"});
    d.families.forEach(f=> fam.appendChild(el("div",{class:"mini-card family-"+f.kind},[
      el("span",{class:"kind-chip kind-"+f.kind},[f.kind==="nudge"?"Nudge":"Incentivo"]),
      el("strong",{},[f.name]), el("p",{},[f.examples]), refChips(f.refs) ])));
    body.appendChild(fam);
    body.appendChild(el("p",{},[d.frameworks, " ", refChips(d.frameworkRefs)]));
  }

  function buildMechanismSVG(){
    const dg = DATA.difference.diagram;
    const W = 960, H = 490, BW = 230, BH = 62;
    const svg = svgEl("svg",{viewBox:`0 0 ${W} ${H}`, width:"100%", role:"img", "aria-label":"Diagrama: la decisión de salud puede cambiarse por la arquitectura de la elección (nudge) o por los pagos (incentivo); ambas rutas llevan a la conducta, que debe evaluarse en el resultado en salud y en su persistencia"});
    svg.appendChild(arrowDefs("marr"));
    const P = {}; dg.nodes.forEach(n=> P[n.id] = n);
    function anchor(a, b){
      // punto en el borde de la caja a, en dirección a b
      const dx = b.x - a.x, dy = b.y - a.y;
      const sx = (BW/2) / Math.max(Math.abs(dx), 1e-6), sy = (BH/2) / Math.max(Math.abs(dy), 1e-6);
      const s = Math.min(sx, sy);
      return { x: a.x + dx*s, y: a.y + dy*s };
    }
    dg.edges.forEach(e=>{
      const a = P[e.from], b = P[e.to];
      const p1 = anchor(a,b), p2 = anchor(b,a);
      svg.appendChild(svgEl("line",{x1:p1.x, y1:p1.y, x2:p2.x, y2:p2.y, class:"flow-edge mech-edge"+(e.label?" mech-edge-"+e.label:""), "marker-end":"url(#marr)"}));
      if(e.label){
        const mx = (p1.x+p2.x)/2, my = (p1.y+p2.y)/2 - 8;
        const w = e.label.length*8 + 20;
        const g = svgEl("g",{class:"edge-label-pill pill-"+(e.label==="nudge"?"nudge":"incentive")});
        g.innerHTML = `<rect x="${mx-w/2}" y="${my-12}" width="${w}" height="24" rx="12"></rect><text x="${mx}" y="${my+4}" text-anchor="middle">${escapeXML(e.label)}</text>`;
        svg.appendChild(g);
      }
    });
    dg.nodes.forEach(n=>{
      const g = svgEl("g",{class:"node-box mech-node mech-"+n.kind});
      const lines = wrapLabel(n.label, 22);
      let html = `<rect x="${n.x-BW/2}" y="${n.y-BH/2}" width="${BW}" height="${BH}" rx="14"></rect>`;
      lines.forEach((l,i)=> html += `<text x="${n.x}" y="${n.y - (lines.length-1)*9 + 5 + i*18}" text-anchor="middle" class="agent-name">${escapeXML(l)}</text>`);
      g.innerHTML = html;
      attachTooltip(g, n.label, ()=> `<h5>${escapeXML(n.label)}</h5><p>${escapeXML(n.detail)}</p>${refsHTML(n.refs)}`);
      svg.appendChild(g);
    });
    svg.addEventListener("mouseleave", scheduleHideTooltip);
    return svg;
  }

  /* ============================================================
     03 EVIDENCIA
     ============================================================ */
  const EV_ANCHOR = { incentivos:"ev-incentivos", nudges:"ev-nudges", tensiones:"ev-tensiones" };
  function renderEvidencia(){
    const body = document.getElementById("body-evidencia");
    const ev = DATA.evidence;
    body.appendChild(el("p",{},[ev.intro]));
    body.appendChild(el("div",{class:"card how-to-read"},[
      el("strong",{},["Cómo leer las cifras"]),
      el("dl",{class:"htr-list"}, ev.howToRead.reduce((acc,x)=> acc.concat([ el("dt",{},[x.k]), el("dd",{},[x.v]) ]), [])),
    ]));
    ev.groups.forEach(g=>{
      sectionDivider(body, EV_ANCHOR[g.id], g.title, null);
      const grid = el("div",{class:"evidence-grid"});
      g.items.forEach(it=> grid.appendChild(el("div",{class:"evidence-card "+g.color},[
        el("div",{class:"evidence-stat"},[it.stat]), it.metric ? el("div",{class:"evidence-metric"},[it.metric]) : null, el("p",{},[it.text]), refChips(it.refs) ])));
      body.appendChild(grid);
    });
    body.appendChild(el("div",{class:"card", style:"margin-top:16px"},[ el("strong",{},["¿Y la evidencia económica?"]), el("p",{style:"margin:6px 0 8px"},[ev.economics]), refChips(ev.economicsRefs) ]));
    body.appendChild(el("div",{class:"btn-row", style:"margin-top:12px"},[ jumpButton("Llevar estas cifras a la calculadora →","calculadora","calc-plantilla") ]));
  }

  /* ============================================================
     04 CALCULADORA
     ============================================================ */
  const calcState = {};      // valores vigentes por escenario (las ediciones se conservan al cambiar de pestaña)
  let calcActive = "compensar";
  let calcRefresh = null;
  DATA.calculator.presets.forEach(p=> calcState[p.id] = Object.assign({}, p.values));

  function compute(v){
    const n = +v.n, cp = +v.costPerson, fixed = +v.fixed || 0, base = +v.base, treat = +v.treat;
    const r = {};
    r.delta = treat - base;
    r.relative = base > 0 ? r.delta / base * 100 : null;
    r.total = fixed + n * cp;
    r.extra = n * r.delta / 100;
    r.perPoint = r.delta > 0 ? r.total / r.delta : null;
    r.nnt = r.delta > 0 ? 100 / r.delta : null;
    r.perExtra = r.extra > 0 ? r.total / r.extra : null;
    const hasSus = v.sustained !== null && v.sustained !== "" && isFinite(+v.sustained);
    r.hasSus = hasSus;
    if(hasSus){
      r.deltaSus = +v.sustained - base;
      r.extraSus = n * r.deltaSus / 100;
      r.perExtraSus = r.extraSus > 0 ? r.total / r.extraSus : null;
    }
    const hasWtp = v.wtp !== null && v.wtp !== "" && isFinite(+v.wtp) && +v.wtp > 0;
    r.hasWtp = hasWtp;
    if(hasWtp && r.perExtra != null){ r.wtp = +v.wtp; r.below = r.perExtra <= r.wtp; r.ratio = r.perExtra / r.wtp; }
    return r;
  }

  function renderCalculadora(){
    const body = document.getElementById("body-calculadora");
    const C = DATA.calculator;
    body.appendChild(el("p",{},[C.intro]));

    sectionDivider(body, "calc-plantilla", "Plantilla interactiva", "Elige un escenario, cambia cualquier valor y los resultados se recalculan al instante.");
    const tabs = el("div",{class:"filter-row calc-tabs", role:"tablist", "aria-label":"Escenarios de la calculadora"});
    const tabEls = {};
    C.presets.forEach(p=>{
      const b = el("button",{class:"filter-chip", type:"button", role:"tab", "aria-selected":"false", id:"calc-tab-"+p.id},[p.short]);
      b.addEventListener("click", ()=>{ calcActive = p.id; refreshAll(); });
      tabs.appendChild(b); tabEls[p.id] = b;
    });
    body.appendChild(tabs);
    const noteBox = el("div",{class:"calc-note"});
    body.appendChild(noteBox);

    const layout = el("div",{class:"calc-layout"});
    const form = el("form",{class:"calc-form", novalidate:"novalidate", "aria-label":"Datos de entrada"});
    form.addEventListener("submit", e=> e.preventDefault());
    const inputs = {};
    C.fields.forEach(f=>{
      const id = "calc-"+f.id;
      const input = el("input",{type:"number", id:id, inputmode:"decimal", step:String(f.step), min:String(f.min)});
      if(f.max!=null) input.setAttribute("max", String(f.max));
      input.addEventListener("input", ()=>{
        const raw = input.value.trim();
        calcState[calcActive][f.id] = raw === "" ? (f.optional ? null : 0) : +raw;
        renderResults(); renderComparison();
      });
      inputs[f.id] = input;
      form.appendChild(el("div",{class:"calc-field"},[
        el("label",{for:id},[ f.label ]),
        el("div",{class:"calc-input-row"},[ input, el("span",{class:"unit"},[f.unit]) ]),
        el("p",{class:"calc-help"},[f.help]),
      ]));
    });
    const actions = el("div",{class:"btn-row calc-actions"});
    const resetBtn = el("button",{class:"btn btn-small", type:"button"},["Restaurar valores del escenario"]);
    resetBtn.addEventListener("click", ()=>{ const p = C.presets.find(x=>x.id===calcActive); calcState[calcActive] = Object.assign({}, p.values); refreshAll(); });
    const xlsBtn = el("button",{class:"btn btn-small btn-primary", type:"button"},["Descargar en Excel (con fórmulas)"]);
    xlsBtn.addEventListener("click", downloadCalcXLSX);
    const linkBtn = el("button",{class:"btn btn-small", type:"button"},["Copiar enlace con estos datos"]);
    linkBtn.addEventListener("click", ()=> copyCalcLink(linkBtn));
    const xlsx = el("a",{class:"btn btn-small", href:"downloads/plantilla_costo_punto_adherencia.xlsx", download:"plantilla_costo_punto_adherencia.xlsx"},["Plantilla Excel en blanco"]);
    [xlsBtn, linkBtn, resetBtn, xlsx].forEach(b=> actions.appendChild(b));
    form.appendChild(el("p",{class:"calc-help"},["El Excel trae el escenario activo con sus fórmulas vivas y una hoja que compara los tres escenarios: cambia cualquier dato en Excel y los resultados se recalculan."]));
    form.appendChild(actions);

    const results = el("div",{class:"calc-results", "aria-live":"polite"});
    layout.appendChild(form); layout.appendChild(results);
    body.appendChild(layout);

    function renderResults(){
      const v = calcState[calcActive], r = compute(v);
      results.innerHTML = "";
      const p = C.presets.find(x=>x.id===calcActive);
      results.appendChild(el("h4",{class:"block-title"},["Resultados · "+p.short]));
      const warn = [];
      if(!(+v.n > 0)) warn.push("Escribe un número de personas mayor que cero.");
      if(r.delta <= 0) warn.push("La tasa con la intervención no supera a la tasa sin ella: no hay puntos ganados que costear.");
      if(+v.treat > 100 || +v.base > 100) warn.push("Las tasas deben estar entre 0 y 100 %.");
      warn.forEach(w=> results.appendChild(el("p",{class:"calc-warn", role:"alert"},[w])));
      const cards = [
        { k:"Diferencia", v: fmt(r.delta,2)+(Math.abs(r.delta)===1?" punto":" puntos"), d: r.relative!=null ? "+"+fmt(r.relative,0)+" % relativo frente a la tasa sin intervención" : "" },
        { k:"Personas adicionales", v: fmt(r.extra,1), d:"con la conducta gracias a la intervención" },
        { k:"Costo total", v: money(r.total), d:"costo fijo + personas × costo por persona" },
        { k:"Costo de un punto de adherencia", v: money(r.perPoint), d:"por cada punto porcentual ganado en esta cohorte", hl:true },
        { k:"Personas a intervenir por cada adicional", v: fmt(r.nnt,1), d:"NNT = 100 / diferencia" },
        { k:"Costo por persona adicional", v: money(r.perExtra), d:"costo total / personas adicionales", hl:true },
      ];
      if(r.hasSus) cards.push({ k:"Con persistencia", v: r.perExtraSus!=null ? money(r.perExtraSus) : "Sin efecto sostenido", d: "costo por persona adicional si solo cuentan las "+fmt(r.extraSus,1)+" personas que mantienen la conducta ("+fmt(r.deltaSus,2)+" puntos)" , warnc: true });
      const grid = el("div",{class:"result-grid"});
      cards.forEach(c=> grid.appendChild(el("div",{class:"result-card"+(c.hl?" hl":"")+(c.warnc?" warnc":"")},[ el("div",{class:"rk"},[c.k]), el("div",{class:"rv"},[c.v]), el("div",{class:"rd"},[c.d]) ])));
      results.appendChild(grid);
      if(r.hasWtp){
        results.appendChild(el("p",{class:"calc-verdict "+(r.below?"ok":"no")},[
          r.below ? "Por debajo del valor de referencia: " : "Por encima del valor de referencia: ",
          "el costo por persona adicional ("+money(r.perExtra)+") es "+fmt(r.ratio*100,0)+" % del valor que tu programa está dispuesto a pagar ("+money(r.wtp)+")." ]));
      } else {
        results.appendChild(el("p",{class:"muted-small"},["Escribe un valor de referencia para comparar el costo por persona adicional con lo que tu programa está dispuesto a pagar, como una RCEI frente a un umbral."]));
      }
    }
    function renderNote(){
      const p = C.presets.find(x=>x.id===calcActive);
      noteBox.innerHTML = "";
      noteBox.appendChild(el("p",{},[ confidenceTag(p.level, p.level==="verificado" ? "Caso real verificado" : (p.id==="ilustrativo" ? "Datos ilustrativos" : "Valores de ejemplo")), " ", el("strong",{},[p.name+". "]), p.note ]));
      if(p.source) noteBox.appendChild(el("p",{class:"muted-small"},["Fuente: ", extLink(p.source.label, p.source.url)]));
    }
    function refreshAll(){
      C.presets.forEach(p=>{ const on = p.id===calcActive; tabEls[p.id].classList.toggle("active", on); tabEls[p.id].setAttribute("aria-selected", on?"true":"false"); });
      const v = calcState[calcActive];
      C.fields.forEach(f=>{ inputs[f.id].value = (v[f.id]===null || v[f.id]===undefined) ? "" : v[f.id]; });
      renderNote(); renderResults(); renderComparison();
    }
    calcRefresh = (id)=>{ if(id) calcActive = id; refreshAll(); };

    sectionDivider(body, "calc-comparar", "Comparar escenarios", "Los tres escenarios con sus valores vigentes (incluidos tus cambios). El gráfico usa escala logarítmica porque los costos difieren en varios órdenes de magnitud.");
    const cmp = el("div",{class:"calc-compare"});
    body.appendChild(cmp);
    function renderComparison(){
      cmp.innerHTML = "";
      const rows = C.presets.map(p=>{ const v = calcState[p.id], r = compute(v); return { p, v, r }; });
      cmp.appendChild(tableWrap(["Escenario","Personas","Diferencia (puntos)","Costo total","Costo de un punto","Costo por persona adicional","Con persistencia"],
        rows.map(x=>[ el("strong",{},[x.p.short]), fmt(+x.v.n,0), fmt(x.r.delta,2), money(x.r.total), money(x.r.perPoint), money(x.r.perExtra), x.r.hasSus ? (x.r.perExtraSus!=null ? money(x.r.perExtraSus) : "Sin efecto") : "—" ]),
        {caption:"Comparación de escenarios de la calculadora"}));
      cmp.appendChild(buildCompareChart(rows));
    }
    refreshAll();

    sectionDivider(body, "calc-formulas", "Cómo se calcula", "Aritmética simple y transparente: puedes verificar cada resultado a mano.");
    body.appendChild(tableWrap(["Resultado","Fórmula"], C.formulas.map(f=>[ el("strong",{},[f.name]), f.f ]), {caption:"Fórmulas de la calculadora"}));
    body.appendChild(h4("Antes de usar el resultado"));
    const ul = el("ul",{class:"gap-list"});
    C.caveats.forEach(c=> ul.appendChild(el("li",{},[ el("div",{},[c]) ])));
    body.appendChild(ul);
    body.appendChild(noteLine("La calculadora y sus fórmulas son una herramienta didáctica del autor. El costo de un punto depende del tamaño de la cohorte; para comparar programas de distinto tamaño usa el costo por persona adicional."));
  }

  function buildCompareChart(rows){
    const W = 760, rowH = 46, top = 30, left = 200, right = 120;
    const vals = rows.map(x=> x.r.perExtra).filter(v=> v && v > 0);
    const wrap = el("div",{class:"chart-box"});
    if(!vals.length){ wrap.appendChild(el("p",{class:"muted-small"},["Sin valores válidos para graficar."])); return wrap; }
    const lo = Math.pow(10, Math.floor(Math.log10(Math.min.apply(null, vals)))), hi = Math.pow(10, Math.ceil(Math.log10(Math.max.apply(null, vals))));
    const H = top + rows.length*rowH + 40;
    const sx = (v)=> left + (Math.log10(v) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo) || 1) * (W - left - right);
    const svg = svgEl("svg",{viewBox:`0 0 ${W} ${H}`, width:"100%", role:"img", "aria-label":"Costo por persona adicional por escenario, en escala logarítmica"});
    svg.appendChild(Object.assign(svgEl("text",{x:left, y:18, class:"chart-title"}),{textContent:"Costo por persona adicional (COP, escala logarítmica)"}));
    for(let e = Math.log10(lo); e <= Math.log10(hi); e++){
      const x = sx(Math.pow(10,e));
      svg.appendChild(svgEl("line",{x1:x, y1:top, x2:x, y2:top+rows.length*rowH, class:"chart-grid"}));
      svg.appendChild(Object.assign(svgEl("text",{x:x, y:top+rows.length*rowH+18, "text-anchor":"middle", class:"chart-tick"}),{textContent:"$ "+NF(0).format(Math.pow(10,e))}));
    }
    rows.forEach((x,i)=>{
      const y = top + i*rowH + 10;
      svg.appendChild(Object.assign(svgEl("text",{x:left-10, y:y+16, "text-anchor":"end", class:"chart-label"}),{textContent:x.p.short}));
      const v = x.r.perExtra;
      if(v && v > 0){
        svg.appendChild(svgEl("rect",{x:left, y:y, width:Math.max(2, sx(v)-left), height:24, rx:6, class:"chart-bar bar-"+x.p.id}));
        svg.appendChild(Object.assign(svgEl("text",{x:sx(v)+8, y:y+17, class:"chart-value"}),{textContent:money(v)}));
      } else {
        svg.appendChild(Object.assign(svgEl("text",{x:left+6, y:y+17, class:"chart-value"}),{textContent:"Sin diferencia positiva"}));
      }
    });
    wrap.appendChild(svg);
    return wrap;
  }

  /* Exportación a Excel: el escenario activo con fórmulas vivas y una hoja que compara los tres */
  const XL_RESULTS = [
    { id:"d",   label:"Diferencia", unit:"puntos porcentuales", st:"dec2", f:"{t}-{b}", how:"Tasa con la intervención − tasa sin ella", val:r=> r.delta },
    { id:"rel", label:"Diferencia relativa", unit:"%", st:"dec1", f:'IF({b}>0,{d}/{b}*100,"")', how:"Diferencia / tasa sin intervención × 100", val:r=> r.relative },
    { id:"x",   label:"Personas adicionales con la conducta", unit:"personas", st:"dec1", f:"{n}*{d}/100", how:"Personas intervenidas × diferencia / 100", val:r=> r.extra },
    { id:"tot", label:"Costo total", unit:"COP", st:"money", f:"{fx}+{n}*{cp}", how:"Costo fijo + personas × costo por persona", val:r=> r.total },
    { id:"pp",  label:"Costo de un punto de adherencia", unit:"COP por punto", st:"moneyHL", f:'IF({d}>0,{tot}/{d},"")', how:"Costo total / diferencia", val:r=> r.perPoint },
    { id:"nnt", label:"Personas a intervenir por cada adicional (NNT)", unit:"personas", st:"dec1", f:'IF({d}>0,100/{d},"")', how:"100 / diferencia", val:r=> r.nnt },
    { id:"pe",  label:"Costo por persona adicional", unit:"COP", st:"moneyHL", f:'IF({x}>0,{tot}/{x},"")', how:"Costo total / personas adicionales", val:r=> r.perExtra },
    { id:"ds",  label:"Diferencia sostenida", unit:"puntos porcentuales", st:"dec2", f:'IF({s}="","",{s}-{b})', how:"Tasa sostenida − tasa sin intervención (si hay dato)", val:r=> r.hasSus ? r.deltaSus : "" },
    { id:"pes", label:"Costo por persona adicional sostenida", unit:"COP", st:"money", f:'IF({s}="","",IF({s}-{b}>0,{tot}/({n}*({s}-{b})/100),"Sin efecto sostenido"))', how:"Costo total / personas que mantienen la conducta", val:r=> r.hasSus ? (r.perExtraSus!=null ? r.perExtraSus : "Sin efecto sostenido") : "" },
    { id:"ver", label:"Frente al valor de referencia", unit:"", st:"label", f:'IF(OR({w}="",{pe}=""),"",IF({pe}<={w},"Por debajo del valor de referencia","Por encima del valor de referencia"))', how:"Compara el costo por persona adicional con el valor de referencia", val:r=> (r.hasWtp && r.perExtra!=null) ? (r.below ? "Por debajo del valor de referencia" : "Por encima del valor de referencia") : "" },
  ];
  const XL_FIELD_KEY = { n:"n", costPerson:"cp", fixed:"fx", base:"b", treat:"t", sustained:"s", wtp:"w" };
  const XL_INT_FIELDS = { n:true, fixed:true, wtp:true };
  function xlFormula(tpl, refs){ return tpl.replace(/\{(\w+)\}/g, (m,k)=> refs[k]); }
  function xlNum(x){ return (typeof x === "number" && isFinite(x)) ? Math.round(x*1e6)/1e6 : (x==null ? "" : x); }
  function xlRowHeight(text, chars){ return Math.max(15, Math.ceil(String(text).length / chars) * 14 + 4); }

  function calcWorkbook(){
    const C = DATA.calculator, S = MiniXLSX.S;
    const p = C.presets.find(x=>x.id===calcActive), v = calcState[calcActive], r = compute(v);
    const today = new Date().toLocaleDateString("es-CO",{ day:"2-digit", month:"2-digit", year:"numeric" });
    const appUrl = location.origin + location.pathname;
    const txt = (t, st)=> ({ v:t, s:S[st||"normal"] });

    /* Hoja 1: escenario activo */
    const rows = [], merges = [];
    rows.push([ txt("Costo de un punto de adherencia","title") ]);
    rows.push([ txt("Escenario: "+p.name,"bold") ]);
    rows.push([ txt("Exportado el "+today+" desde "+appUrl,"subtitle") ]);
    rows.push(null);
    rows.push([ txt("Dato de entrada","header"), txt("Valor","header"), txt("Unidad","header"), txt("Qué significa","header") ]);
    const refs = {};
    C.fields.forEach(f=>{
      refs[XL_FIELD_KEY[f.id]] = "B"+(rows.length+1);
      const val = v[f.id]==null || v[f.id]==="" ? null : +v[f.id];
      rows.push({ cells:[ txt(f.label,"label"), { v:val, s: XL_INT_FIELDS[f.id] ? S.inInt : S.inDec }, txt(f.unit,"label"), txt(f.help,"text") ], height: xlRowHeight(f.help, 60) });
    });
    rows.push(null);
    rows.push([ txt("Resultado","header"), txt("Valor","header"), txt("Unidad","header"), txt("Cómo se calcula","header") ]);
    XL_RESULTS.forEach(x=>{
      refs[x.id] = "B"+(rows.length+1);
      rows.push([ txt(x.label,"labelBold"), { f: xlFormula(x.f, refs), v: xlNum(x.val(r)), s: S[x.st] }, txt(x.unit,"label"), txt(x.how,"text") ]);
    });
    rows.push(null);
    rows.push([ txt("Las celdas amarillas son los datos de entrada: cámbialas y Excel recalcula los resultados.","note") ]); merges.push("A"+rows.length+":D"+rows.length);
    rows.push(null);
    rows.push([ txt("Nota del escenario","bold") ]);
    rows.push({ cells:[ txt(p.note,"note") ], height: xlRowHeight(p.note, 140) }); merges.push("A"+rows.length+":D"+rows.length);
    if(p.source){ rows.push({ cells:[ txt("Fuente: "+p.source.label+" "+p.source.url,"note") ], height: xlRowHeight(p.source.label+p.source.url, 140) }); merges.push("A"+rows.length+":D"+rows.length); }
    rows.push(null);
    rows.push([ txt("Antes de usar el resultado","bold") ]);
    C.caveats.forEach(c=>{ rows.push({ cells:[ txt("• "+c,"note") ], height: xlRowHeight(c, 140) }); merges.push("A"+rows.length+":D"+rows.length); });
    rows.push(null);
    rows.push([ txt(DATA.meta.author+", "+DATA.meta.credentials+" · "+DATA.citation.url+" · "+DATA.meta.license.name,"subtitle") ]);
    const sheet1 = { name:"Escenario activo", cols:[46, 18, 20, 58], rows, merges };

    /* Hoja 2: comparación de los tres escenarios */
    const presets = C.presets, rows2 = [];
    rows2.push([ txt("Comparación de escenarios","title") ]);
    rows2.push([ txt("Valores vigentes en la app al exportar (incluidos tus cambios). Cada columna tiene sus propias fórmulas.","subtitle") ]);
    rows2.push(null);
    rows2.push([ txt("Dato de entrada","header") ].concat(presets.map(x=> txt(x.short,"header"))));
    const colRefs = presets.map(()=> ({}));
    C.fields.forEach(f=>{
      const rowNum = rows2.length + 1;
      rows2.push([ txt(f.label+" ("+f.unit+")","label") ].concat(presets.map((x,k)=>{
        colRefs[k][XL_FIELD_KEY[f.id]] = MiniXLSX.colName(k+1)+rowNum;
        const val = calcState[x.id][f.id];
        return { v: val==null || val==="" ? null : +val, s: XL_INT_FIELDS[f.id] ? S.inInt : S.inDec };
      })));
    });
    rows2.push([ txt("Resultado","header") ].concat(presets.map(()=> txt("","header"))));
    XL_RESULTS.forEach(x=>{
      const rowNum = rows2.length + 1;
      rows2.push([ txt(x.label+(x.unit?" ("+x.unit+")":""),"labelBold") ].concat(presets.map((pp,k)=>{
        colRefs[k][x.id] = MiniXLSX.colName(k+1)+rowNum;
        return { f: xlFormula(x.f, colRefs[k]), v: xlNum(x.val(compute(calcState[pp.id]))), s: S[x.st] };
      })));
    });
    const sheet2 = { name:"Comparación", cols:[50, 24, 24, 24], rows: rows2 };
    return [sheet1, sheet2];
  }
  function calcXLSXBlob(){
    return new Blob([MiniXLSX.build(calcWorkbook())], {type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
  }
  function downloadCalcXLSX(){
    const url = URL.createObjectURL(calcXLSXBlob());
    const a = document.createElement("a"); a.href = url; a.download = "costo_punto_adherencia_"+calcActive+".xlsx";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(()=> URL.revokeObjectURL(url), 1000);
  }
  function copyCalcLink(btn){
    const v = calcState[calcActive];
    const params = new URLSearchParams();
    params.set("esc", calcActive);
    DATA.calculator.fields.forEach(f=>{ if(v[f.id]!=null && v[f.id]!=="") params.set(f.id, v[f.id]); });
    const url = location.origin + location.pathname + "#calc?" + params.toString();
    const done = ()=>{ const t = btn.textContent; btn.textContent = "Enlace copiado ✓"; setTimeout(()=> btn.textContent = t, 1800); };
    if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, ()=> window.prompt("Copia este enlace:", url));
    else window.prompt("Copia este enlace:", url);
  }
  function loadCalcFromHash(){
    const h = location.hash || "";
    if(h.indexOf("#calc?") !== 0) return false;
    const params = new URLSearchParams(h.slice(6));
    const esc = params.get("esc");
    const target = DATA.calculator.presets.some(p=>p.id===esc) ? esc : "propio";
    DATA.calculator.fields.forEach(f=>{
      if(params.has(f.id)){ const x = parseFloat(params.get(f.id)); calcState[target][f.id] = isFinite(x) ? x : (f.optional ? null : 0); }
      else if(f.optional) calcState[target][f.id] = null;
    });
    if(calcRefresh) calcRefresh(target);
    goTo("calculadora","calc-plantilla");
    return true;
  }

  /* ============================================================
     05 COLOMBIA
     ============================================================ */
  function renderColombia(){
    const body = document.getElementById("body-colombia");
    const co = DATA.colombia;
    body.appendChild(el("p",{},[co.intro]));
    sectionDivider(body, "col-ejemplos", "Ocho ejemplos verificados", "Filtra por mecanismo. Los dos últimos son contraejemplos: incentivos, no nudges.");
    const chips = el("div",{class:"filter-row", role:"group", "aria-label":"Filtrar ejemplos por mecanismo"});
    const opts = [{id:"all",label:"Todos"},{id:"nudge",label:"Nudges"},{id:"incentive",label:"Incentivos"}];
    let current = "all";
    const chipEls = opts.map(o=>{
      const b = el("button",{class:"filter-chip"+(o.id==="all"?" active":""), type:"button", "aria-pressed": o.id==="all"?"true":"false"},[o.label]);
      b.addEventListener("click", ()=>{ current = o.id; refresh(); });
      chips.appendChild(b); return {o,b};
    });
    body.appendChild(chips);
    const grid = el("div",{class:"colombia-grid"});
    body.appendChild(grid);
    const cards = co.examples.map(x=>{
      const foot = el("div",{class:"col-foot"},[ confidenceTag(x.level||"verificado"), " ", el("span",{class:"muted-small"},["Fuente: "]), extLink(x.source.label, x.source.url) ]);
      const card = el("article",{class:"col-card kind-border-"+x.kind, id:"col-"+x.id},[
        el("div",{class:"col-head"},[ el("span",{class:"kind-chip kind-"+x.kind},[x.kind==="nudge"?"Nudge":"Incentivo"]), el("span",{class:"col-mech"},[x.mech]), el("span",{class:"col-year"},[x.year]) ]),
        el("h4",{},[x.name]),
        el("p",{},[x.text]),
        el("p",{class:"col-why"},[ el("strong",{},["Por qué es "+(x.kind==="nudge"?"un nudge":"un incentivo")+": "]), x.why ]),
        foot,
        x.extra ? el("p",{class:"muted-small"},["Ver también: ", extLink(x.extra.label, x.extra.url)]) : null,
        x.caveat ? el("p",{class:"muted-small"},[x.caveat]) : null,
        x.related ? el("p",{class:"muted-small"},["Evidencia relacionada: ", refChips(x.related)]) : null,
      ]);
      if(x.calc){
        const b = el("button",{class:"btn btn-small btn-primary", type:"button"},["Abrir este caso en la calculadora →"]);
        b.addEventListener("click", ()=>{ if(calcRefresh) calcRefresh(x.calc); goTo("calculadora","calc-plantilla"); });
        card.appendChild(el("div",{class:"btn-row"},[b]));
      }
      return { x, card };
    });
    function refresh(){
      chipEls.forEach(({o,b})=>{ const on = o.id===current; b.classList.toggle("active", on); b.setAttribute("aria-pressed", on?"true":"false"); });
      grid.innerHTML = "";
      cards.forEach(c=>{ if(current==="all" || c.x.kind===current) grid.appendChild(c.card); });
    }
    refresh();
    body.appendChild(noteLine("La clasificación de cada norma o programa como nudge o incentivo es interpretación del autor."));
    body.appendChild(el("div",{class:"selective-box"},[ el("h4",{},["¿Y la evidencia sintetizada?"]), el("p",{},[co.evidenceNote]), refChips(co.evidenceRefs) ]));

    sectionDivider(body, "col-ideas", co.ideas.title, null);
    body.appendChild(noteLine(co.ideas.note));
    const ig = el("div",{class:"mini-grid"});
    co.ideas.items.forEach(i=> ig.appendChild(el("div",{class:"mini-card"},[
      el("span",{class:"kind-chip kind-"+(i.mech==="Incentivo"?"incentive":"nudge")},[i.mech]),
      el("strong",{},[i.name]), el("p",{},[i.basis]), i.refs.length ? refChips(i.refs) : el("p",{class:"muted-small"},["Base: ejemplos colombianos de esta sección."]) ])));
    body.appendChild(ig);
  }

  /* ============================================================
     06 ÉTICA
     ============================================================ */
  function renderEtica(){
    const body = document.getElementById("body-etica");
    const et = DATA.ethics;
    body.appendChild(el("p",{},[et.intro]));
    sectionDivider(body, "etica-posiciones", "Tres posiciones", null);
    const g = el("div",{class:"triple-grid"});
    et.positions.forEach(p=> g.appendChild(el("div",{class:"card"},[ el("strong",{},[p.who]), el("p",{style:"margin:6px 0 8px"},[p.text]), refChips(p.refs) ])));
    body.appendChild(g);
    body.appendChild(el("p",{class:"author-note"},[ confidenceTag("nota-autor"), " ", et.verdict, " ", refChips(et.verdictRefs) ]));

    sectionDivider(body, "etica-checklist", "Lista de chequeo", null);
    body.appendChild(noteLine(et.checklist.intro));
    const wrap = el("div",{class:"selfcheck-wrap"});
    const answers = {};
    const result = el("div",{class:"selfcheck-result card", "aria-live":"polite"});
    et.checklist.items.forEach((it, idx)=>{
      const name = "chk-"+idx;
      const opts = el("div",{class:"selfcheck-options", role:"radiogroup", "aria-label":it.q});
      [["si","Sí"],["parcial","En parte"],["no","No"]].forEach(([val,lab])=>{
        const id = name+"-"+val;
        const input = el("input",{type:"radio", name:name, id:id, value:val});
        input.addEventListener("change", ()=>{ answers[idx] = val; updateResult(); });
        opts.appendChild(el("span",{class:"selfcheck-opt"},[ input, el("label",{for:id},[lab]) ]));
      });
      wrap.appendChild(el("div",{class:"selfcheck-item"},[
        el("div",{class:"selfcheck-statement"},[(idx+1)+". "+it.q]), opts,
        el("p",{class:"selfcheck-meta"},[it.basis, " ", it.refs.length ? refChips(it.refs) : null]) ]));
    });
    body.appendChild(wrap);
    body.appendChild(result);
    function updateResult(){
      const n = et.checklist.items.length;
      const vals = Object.values(answers);
      const si = vals.filter(v=>v==="si").length, parcial = vals.filter(v=>v==="parcial").length;
      const pend = et.checklist.items.map((it,i)=> answers[i]==="si" ? null : (i+1)).filter(Boolean);
      result.innerHTML = "";
      result.appendChild(el("strong",{},["Respondiste "+vals.length+" de "+n+" · "+si+" «Sí», "+parcial+" «En parte»."]));
      result.appendChild(el("p",{style:"margin:6px 0 0"},[ pend.length ? "Puntos por reforzar antes de lanzar: "+pend.join(", ")+"." : "Todos los criterios están cubiertos." ]));
    }
    updateResult();
  }

  /* ============================================================
     07 GLOSARIO
     ============================================================ */
  let glossaryState = { q:"", cat:"all" };
  let glossaryRefresh = null;
  function renderGlosario(){
    const body = document.getElementById("body-glosario");
    body.appendChild(el("p",{},[DATA.glossaryNote, " ", refChips(DATA.glossaryRefs)]));
    const controls = el("div",{class:"glossary-controls"});
    const input = el("input",{type:"search", class:"text-filter", placeholder:"Filtrar términos (español o inglés)…", "aria-label":"Filtrar términos del glosario"});
    controls.appendChild(input);
    const chips = el("div",{class:"filter-row", role:"group", "aria-label":"Filtrar por tipo de término"});
    const opts = [{id:"all",label:"Todos"}].concat(DATA.glossaryCats.map(c=>({id:c.id, label:c.label})));
    const chipEls = opts.map(o=>{
      const b = el("button",{class:"filter-chip"+(o.id==="all"?" active":""), type:"button", "aria-pressed": o.id==="all"?"true":"false"},[o.label]);
      b.addEventListener("click", ()=>{ glossaryState.cat = o.id; refresh(); });
      chips.appendChild(b); return {o,b};
    });
    controls.appendChild(chips);
    body.appendChild(controls);
    const count = el("p",{class:"muted-small", "aria-live":"polite"});
    body.appendChild(count);
    const listWrap = el("div",{class:"glossary-list"});
    body.appendChild(listWrap);
    const cards = DATA.glossary.slice().sort((a,b)=> a.t.localeCompare(b.t,"es")).map(g=>{
      const cat = DATA.glossaryCats.find(c=>c.id===g.cat);
      const card = el("div",{class:"glossary-card "+cat.color, id:"g-"+slug(g.t)},[
        el("div",{class:"glossary-head"},[ el("dfn",{},[g.t]), el("span",{class:"en-term"},[g.en]), el("span",{class:"chip chip-muted"},[cat.label]) ]),
        el("p",{},[g.d]),
        g.refs.length ? refChips(g.refs) : null,
      ]);
      return { g, card, letter: g.t.normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^A-Za-z]/g,"")[0].toUpperCase() };
    });
    function refresh(){
      const q = glossaryState.q.trim().toLowerCase();
      chipEls.forEach(({o,b})=>{ const on = o.id===glossaryState.cat; b.classList.toggle("active", on); b.setAttribute("aria-pressed", on?"true":"false"); });
      listWrap.innerHTML = "";
      let shown = 0, last = null;
      cards.forEach(c=>{
        const ok = (glossaryState.cat==="all" || c.g.cat===glossaryState.cat) && (!q || (c.g.t+" "+c.g.en+" "+c.g.d).toLowerCase().indexOf(q) >= 0);
        if(ok){ if(c.letter!==last){ listWrap.appendChild(el("div",{class:"glossary-letter"},[c.letter])); last = c.letter; } listWrap.appendChild(c.card); shown++; }
      });
      count.textContent = shown+" de "+DATA.glossary.length+" términos";
    }
    input.addEventListener("input", ()=>{ glossaryState.q = input.value; refresh(); });
    glossaryRefresh = (reset)=>{ if(reset){ glossaryState = {q:"", cat:"all"}; input.value = ""; } refresh(); };
    refresh();
  }
  function showGlossaryTerm(term){
    if(glossaryRefresh) glossaryRefresh(true);
    goTo("glosario", "g-"+slug(term.t));
    flash("g-"+slug(term.t));
  }

  /* ============================================================
     08 MÉTODOS
     ============================================================ */
  function renderMetodos(){
    const body = document.getElementById("body-metodos");
    const me = DATA.methods;
    sectionDivider(body, "met-revision", "La revisión de alcance", null);
    body.appendChild(el("p",{},[me.review]));
    const flow = el("div",{class:"flow-steps"});
    me.flow.forEach(f=> flow.appendChild(el("div",{class:"flow-step"},[ el("div",{class:"fs-n"},[ f.n!=null ? fmt(f.n,0) : String(DATA.studies.length) ]), el("div",{class:"fs-l"},[f.label]) ])));
    body.appendChild(flow);
    body.appendChild(el("p",{class:"author-note"},[ confidenceTag("verificado","LILACS"), " ", me.lilacs ]));
    body.appendChild(el("p",{class:"muted-small"},["Guía de reporte: ", extLink(me.methodRefs[0].label, me.methodRefs[0].url)]));

    sectionDivider(body, "met-fuentes", "Fuentes y etiquetas", null);
    body.appendChild(el("p",{},[me.extraSources]));
    const ul = el("ul",{class:"gap-list"});
    me.labels.forEach(l=> ul.appendChild(el("li",{},[ el("div",{},[ confidenceTag(l.level), " ", l.text ]) ])));
    body.appendChild(ul);

    sectionDivider(body, "met-estudios", "Documentos citados (n = "+DATA.studies.length+")", "Todos provienen de la revisión de alcance; el resultado principal se extrajo del resumen. Filtra por texto.");
    const filter = el("input",{type:"search", class:"text-filter", placeholder:"Filtrar por autor, título o resultado…", "aria-label":"Filtrar documentos citados"});
    body.appendChild(filter);
    const tbWrap = el("div",{});
    body.appendChild(tbWrap);
    const sorted = DATA.studies.slice().sort((a,b)=> a.key.localeCompare(b.key,"es"));
    function draw(){
      const q = filter.value.trim().toLowerCase();
      const rows = sorted.filter(s=> !q || (s.key+" "+s.title+" "+s.result+" "+s.journal).toLowerCase().indexOf(q)>=0)
        .map(s=>[ el("strong",{id:"st-"+slug(s.key)},[s.key]), extLink(s.title, s.url), s.journal, s.type, s.quality, s.result ]);
      tbWrap.innerHTML = "";
      tbWrap.appendChild(tableWrap(["Documento","Título (enlace)","Revista","Tipo","Calidad","Resultado principal"], rows, {caption:"Documentos citados en la app", cls:"studies-table"}));
    }
    filter.addEventListener("input", draw);
    draw();

    sectionDivider(body, "met-limitaciones", "Limitaciones", null);
    const lim = el("ul",{class:"gap-list"});
    me.limitations.forEach(l=> lim.appendChild(el("li",{},[ el("div",{},[l]) ])));
    body.appendChild(lim);
  }

  function renderConclusion(){
    const body = document.getElementById("body-conclusion");
    body.appendChild(el("div",{class:"selective-box", style:"margin-top:0"},[ el("h4",{},["Conclusión"]), el("p",{},[DATA.conclusion]) ]));
    body.appendChild(el("div",{class:"btn-row", style:"margin-top:12px"},[ jumpButton("Probar la calculadora →","calculadora","calc-plantilla"), jumpButton("Ver los ejemplos colombianos →","colombia","col-ejemplos") ]));
  }

  /* ============================================================
     RESUMEN DE UNA PÁGINA (reutiliza textos de DATA)
     ============================================================ */
  function renderSummaryPanel(){
    const p = document.getElementById("summary-panel");
    p.appendChild(el("div",{class:"summary-head"},[ el("h2",{},["Resumen de una página"]), el("p",{class:"summary-sub"},["Vista compacta con los textos de la propia app. Vuelve al documento completo con el mismo botón del encabezado."]) ]));
    const ul = el("ul",{class:"gap-list"});
    DATA.keyMessages.forEach(k=> ul.appendChild(el("li",{},[ el("div",{},[ el("strong",{},[k.title+". "]), k.text ]) ])));
    p.appendChild(ul);
    p.appendChild(el("div",{class:"selective-box"},[ el("h4",{},["Conclusión"]), el("p",{},[DATA.conclusion]) ]));
    const back = el("button",{class:"btn btn-primary", type:"button", style:"margin-top:16px"},["Volver al documento completo"]);
    back.addEventListener("click", ()=> setSummaryMode(false));
    p.appendChild(back);
  }
  function setSummaryMode(on){
    document.body.classList.toggle("summary-mode", on);
    document.getElementById("summary-toggle").setAttribute("aria-pressed", on?"true":"false");
    window.scrollTo({top: on ? document.getElementById("summary-panel").offsetTop - 80 : 0, behavior:"smooth"});
  }
  function initSummaryMode(){
    document.getElementById("summary-toggle").addEventListener("click", ()=> setSummaryMode(!document.body.classList.contains("summary-mode")));
  }

  /* ============================================================
     Diagram helpers
     ============================================================ */
  function arrowDefs(id){
    const defs = svgEl("defs");
    defs.innerHTML = `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"></path></marker>`;
    return defs;
  }
  function diagramWrap(svg, extraCls){
    const wrap = el("div",{class:"diagram-wrap"+(extraCls?" "+extraCls:"")});
    wrap.appendChild(svg);
    const tt = el("div",{class:"diagram-tooltip", hidden:"hidden", role:"status"});
    tt.addEventListener("mouseenter", cancelHideTooltip);
    tt.addEventListener("mouseleave", scheduleHideTooltip);
    wrap.appendChild(tt);
    return wrap;
  }
  function showDiagramTooltip(targetEl, html){
    const wrap = targetEl.closest(".diagram-wrap");
    const tooltip = wrap ? wrap.querySelector(".diagram-tooltip") : null;
    if(!tooltip || !wrap) return;
    tooltip.innerHTML = html;
    tooltip.hidden = false;
    const wrapRect = wrap.getBoundingClientRect(), elRect = targetEl.getBoundingClientRect();
    const cx = elRect.left - wrapRect.left + wrap.scrollLeft + elRect.width/2;
    const topOfEl = elRect.top - wrapRect.top + wrap.scrollTop, bottomOfEl = elRect.bottom - wrapRect.top + wrap.scrollTop;
    requestAnimationFrame(()=>{
      const tw = tooltip.offsetWidth, th = tooltip.offsetHeight;
      let left = cx - tw/2, top = topOfEl - th - 10;
      if(top < wrap.scrollTop + 4) top = bottomOfEl + 10;
      left = Math.max(wrap.scrollLeft + 6, Math.min(left, wrap.scrollLeft + wrapRect.width - tw - 6));
      tooltip.style.left = left + "px"; tooltip.style.top = top + "px";
    });
  }
  function hideDiagramTooltip(){
    document.querySelectorAll(".diagram-tooltip").forEach(t=> t.hidden = true);
    document.querySelectorAll(".node-box").forEach(n=>n.classList.remove("active"));
  }
  let tooltipHideTimer = null;
  function scheduleHideTooltip(){ clearTimeout(tooltipHideTimer); tooltipHideTimer = setTimeout(hideDiagramTooltip, 300); }
  function cancelHideTooltip(){ clearTimeout(tooltipHideTimer); }
  function attachTooltip(gEl, label, htmlFn){
    const show = ()=>{
      cancelHideTooltip();
      document.querySelectorAll(".node-box").forEach(n=>n.classList.remove("active"));
      gEl.classList.add("active");
      showDiagramTooltip(gEl, htmlFn());
    };
    gEl.setAttribute("tabindex","0"); gEl.setAttribute("role","button"); gEl.setAttribute("aria-label", label);
    gEl.addEventListener("mouseenter", show);
    gEl.addEventListener("focus", show);
    gEl.addEventListener("click", (e)=>{ e.stopPropagation(); show(); });
    gEl.addEventListener("keydown", (e)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); show(); } });
  }
  function addAccessibleListToggle(body, wrap, listEl){
    listEl.hidden = true;
    const btn = el("button",{class:"btn", type:"button", "aria-pressed":"false"},["Ver como lista (accesible)"]);
    btn.addEventListener("click", ()=>{
      const showingList = listEl.hidden;
      listEl.hidden = !showingList; wrap.hidden = showingList;
      btn.setAttribute("aria-pressed", showingList?"true":"false");
      btn.textContent = showingList ? "Ver como diagrama" : "Ver como lista (accesible)";
    });
    body.appendChild(el("div",{class:"a11y-list-toggle"},[btn]));
    body.appendChild(listEl);
  }


  /* ============================================================
     SIDEBAR TOC + SCROLLSPY + BREADCRUMB
     ============================================================ */
  function scrollToId(id){ const t = document.getElementById(id); if(t) t.scrollIntoView({behavior:"smooth", block:"start"}); }
  function renderSidebarTOC(){
    const nav = document.getElementById("toc");
    SECTIONS.forEach(s=>{
      const a = el("a",{class:"toc-link", href:"#sec-"+s.id, "data-target":"sec-"+s.id},[ el("span",{class:"toc-num"},[s.num]), s.title ]);
      a.addEventListener("click",(e)=>{ e.preventDefault(); goTo(s.id); closeMobileSidebar(); });
      nav.appendChild(a);
      (s.subs||[]).forEach(sub=>{
        const sa = el("a",{class:"toc-link sub", href:"#"+sub.id, "data-target":sub.id},[sub.label]);
        sa.addEventListener("click",(e)=>{ e.preventDefault(); goTo(s.id, sub.id); closeMobileSidebar(); });
        nav.appendChild(sa);
      });
    });
  }
  let landmarks = [];
  function buildLandmarks(){
    landmarks = [];
    SECTIONS.forEach(s=>{
      landmarks.push({ sectionId:s.id, subId:null, el: document.getElementById("sec-"+s.id) });
      (s.subs||[]).forEach(sub=> landmarks.push({ sectionId:s.id, subId:sub.id, el: document.getElementById(sub.id) }));
    });
  }
  function setActiveTOC(lm){
    if(!lm) return;
    document.querySelectorAll(".toc-link").forEach(a=> a.classList.remove("active"));
    const link = document.querySelector('.toc-link[data-target="'+(lm.subId || ("sec-"+lm.sectionId))+'"]');
    if(link) link.classList.add("active");
    renderBreadcrumb(lm);
  }
  function renderBreadcrumb(lm){
    const bc = document.getElementById("breadcrumb");
    bc.innerHTML = "";
    const section = SECTIONS.find(s=>s.id===lm.sectionId);
    const home = el("a",{href:"#"},["Inicio"]);
    home.addEventListener("click",(e)=>{ e.preventDefault(); window.scrollTo({top:0, behavior:"smooth"}); });
    bc.appendChild(home);
    if(section){
      bc.appendChild(el("span",{class:"sep"},["›"]));
      bc.appendChild(el("span",{class: lm.subId?"":"current"},[section.title]));
      if(lm.subId){
        const sub = (section.subs||[]).find(su=>su.id===lm.subId);
        if(sub){ bc.appendChild(el("span",{class:"sep"},["›"])); bc.appendChild(el("span",{class:"current"},[sub.label])); }
      }
    }
  }
  let scrollRAF = null;
  function initScrollspy(){
    buildLandmarks();
    function update(){
      let current = null;
      for(const lm of landmarks){
        if(!lm.el) continue;
        if(lm.subId){ const parentItem = document.getElementById("sec-"+lm.sectionId); if(!parentItem || !parentItem.classList.contains("open")) continue; }
        if(lm.el.getBoundingClientRect().top - 110 <= 0) current = lm;
      }
      setActiveTOC(current || landmarks[0]);
    }
    window.addEventListener("scroll", ()=>{ if(scrollRAF) return; scrollRAF = requestAnimationFrame(()=>{ update(); scrollRAF = null; }); }, {passive:true});
    update();
  }

  /* ============================================================
     MOBILE SIDEBAR
     ============================================================ */
  function initMobileSidebar(){
    const toggle = document.getElementById("toc-toggle"), sidebar = document.getElementById("sidebar"), scrim = document.getElementById("sidebar-scrim");
    toggle.addEventListener("click", ()=>{
      const open = !sidebar.classList.contains("open");
      sidebar.classList.toggle("open", open); scrim.hidden = !open;
      toggle.setAttribute("aria-expanded", open?"true":"false");
    });
    scrim.addEventListener("click", closeMobileSidebar);
  }
  function closeMobileSidebar(){
    const sidebar = document.getElementById("sidebar"), scrim = document.getElementById("sidebar-scrim"), toggle = document.getElementById("toc-toggle");
    if(!sidebar) return;
    sidebar.classList.remove("open"); scrim.hidden = true; toggle.setAttribute("aria-expanded","false");
  }

  /* ============================================================
     LIVE SEARCH
     ============================================================ */
  let SEARCH_INDEX = [], searchResults = [], searchActiveIndex = -1;
  function clip(t){ return t.length>110 ? t.slice(0,110)+"…" : t; }
  function buildSearchIndex(){
    const idx = [];
    DATA.glossary.forEach(g=> idx.push({ type:"Glosario", label:g.t+" ("+g.en+")", detail:g.d, action:()=> showGlossaryTerm(g) }));
    DATA.difference.table.forEach(r=> idx.push({ type:"Nudge o incentivo", label:r.dim, detail: r.shared || (r.nudge+" · "+r.incentive), sectionId:"diferencia", anchorId:"dif-tabla" }));
    DATA.difference.families.forEach(f=> idx.push({ type:"Familia de intervenciones", label:f.name, detail:f.examples, sectionId:"diferencia", anchorId:"dif-familias" }));
    DATA.evidence.groups.forEach(g=> g.items.forEach(it=> idx.push({ type:"Evidencia · "+g.title, label:it.stat+" — "+clip(it.text), detail:it.refs.join(" · "), sectionId:"evidencia", anchorId:EV_ANCHOR[g.id] })));
    DATA.colombia.examples.forEach(x=> idx.push({ type:"Colombia · "+(x.kind==="nudge"?"Nudge":"Incentivo"), label:x.name, detail:x.source.label, action:()=>{ goTo("colombia","col-"+x.id); flash("col-"+x.id); } }));
    DATA.colombia.ideas.items.forEach(i=> idx.push({ type:"Idea para tu institución", label:i.name, detail:i.basis, sectionId:"colombia", anchorId:"col-ideas" }));
    DATA.ethics.checklist.items.forEach(i=> idx.push({ type:"Lista de chequeo", label:i.q, detail:i.basis, sectionId:"etica", anchorId:"etica-checklist" }));
    DATA.calculator.formulas.forEach(f=> idx.push({ type:"Calculadora", label:f.name, detail:f.f, sectionId:"calculadora", anchorId:"calc-formulas" }));
    DATA.calculator.presets.forEach(p=> idx.push({ type:"Escenario de la calculadora", label:p.name, detail:clip(p.note), action:()=>{ if(calcRefresh) calcRefresh(p.id); goTo("calculadora","calc-plantilla"); } }));
    DATA.studies.forEach(s=> idx.push({ type:"Documento citado", label:s.key+" — "+s.title, detail:s.result, action:()=>{ goTo("metodos","st-"+slug(s.key)); flash("st-"+slug(s.key)); } }));
    SECTIONS.forEach(s=> (s.subs||[]).forEach(sub=> idx.push({ type:"Sección "+s.num, label:sub.label, detail:s.title, sectionId:s.id, anchorId:sub.id })));
    return idx;
  }
  function normalize(s){ return (s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,""); }
  function openSearch(){
    const panel = document.getElementById("search-panel"), input = document.getElementById("search-input");
    panel.hidden = false; input.value = ""; document.getElementById("search-results").innerHTML = "";
    searchResults = []; searchActiveIndex = -1;
    setTimeout(()=> input.focus(), 10);
  }
  function closeSearch(){
    const panel = document.getElementById("search-panel");
    if(panel.hidden) return;
    panel.hidden = true; document.getElementById("search-trigger").focus();
  }
  function isSearchOpen(){ return !document.getElementById("search-panel").hidden; }
  function runSearch(q){
    const resultsEl = document.getElementById("search-results"), input = document.getElementById("search-input");
    resultsEl.innerHTML = ""; searchActiveIndex = -1;
    const query = normalize(q.trim());
    if(!query){ searchResults = []; input.setAttribute("aria-expanded","false"); return; }
    searchResults = SEARCH_INDEX.filter(e=> normalize(e.label).indexOf(query)>=0 || normalize(e.detail).indexOf(query)>=0 || normalize(e.type).indexOf(query)>=0).slice(0,40);
    input.setAttribute("aria-expanded", searchResults.length ? "true":"false");
    if(!searchResults.length){ resultsEl.appendChild(el("li",{class:"search-empty"},['Sin resultados para «'+q+'»'])); return; }
    searchResults.forEach((r,i)=>{
      const a = el("a",{class:"search-result", href:"#", role:"option", id:"sr-"+i},[ el("div",{class:"sr-type"},[r.type]), el("div",{class:"sr-label"},[r.label]), el("div",{class:"sr-detail"},[clip(r.detail||"")]) ]);
      a.addEventListener("click",(e)=>{ e.preventDefault(); goToSearchResult(r); });
      resultsEl.appendChild(el("li",{role:"presentation"},[a]));
    });
  }
  function goToSearchResult(r){ closeSearch(); if(r.action) r.action(); else goTo(r.sectionId, r.anchorId); }
  function moveSearchActive(delta){
    if(!searchResults.length) return;
    searchActiveIndex = Math.max(0, Math.min(searchResults.length-1, searchActiveIndex+delta));
    document.querySelectorAll(".search-result").forEach((a,i)=> a.classList.toggle("active", i===searchActiveIndex));
    const active = document.querySelectorAll(".search-result")[searchActiveIndex];
    if(active) active.scrollIntoView({block:"nearest"});
  }
  function initSearch(){
    SEARCH_INDEX = buildSearchIndex();
    const input = document.getElementById("search-input");
    document.getElementById("search-trigger").addEventListener("click", openSearch);
    document.getElementById("search-close").addEventListener("click", closeSearch);
    document.getElementById("search-panel").addEventListener("click",(e)=>{ if(e.target.id==="search-panel") closeSearch(); });
    input.addEventListener("input", ()=> runSearch(input.value));
    input.addEventListener("keydown",(e)=>{
      if(e.key==="ArrowDown"){ e.preventDefault(); moveSearchActive(1); }
      else if(e.key==="ArrowUp"){ e.preventDefault(); moveSearchActive(-1); }
      else if(e.key==="Enter"){ e.preventDefault(); if(searchActiveIndex>=0) goToSearchResult(searchResults[searchActiveIndex]); else if(searchResults.length) goToSearchResult(searchResults[0]); }
    });
  }

  /* ============================================================
     SHORTCUTS / FOCUS / SCROLL TOP
     ============================================================ */
  function openShortcuts(){ document.getElementById("shortcuts-panel").hidden = false; }
  function closeShortcuts(){ document.getElementById("shortcuts-panel").hidden = true; document.getElementById("help-toggle").focus(); }
  function isShortcutsOpen(){ return !document.getElementById("shortcuts-panel").hidden; }
  function initShortcutsPanel(){
    document.getElementById("help-toggle").addEventListener("click", ()=> isShortcutsOpen()?closeShortcuts():openShortcuts());
    document.getElementById("shortcuts-close").addEventListener("click", closeShortcuts);
    document.getElementById("shortcuts-panel").addEventListener("click",(e)=>{ if(e.target.id==="shortcuts-panel") closeShortcuts(); });
  }
  function initKeyboardShortcuts(){
    document.addEventListener("keydown",(e)=>{
      const tag = (e.target && e.target.tagName || "").toLowerCase();
      const typing = tag==="input" || tag==="textarea" || (e.target && e.target.isContentEditable);
      if(e.key==="/" && !typing){ e.preventDefault(); openSearch(); return; }
      if(e.key==="?" && !typing){ e.preventDefault(); isShortcutsOpen() ? closeShortcuts() : openShortcuts(); return; }
      if(e.key==="Escape"){
        if(isSearchOpen()) closeSearch();
        else if(isShortcutsOpen()) closeShortcuts();
        else { const sb = document.getElementById("sidebar"); if(sb && sb.classList.contains("open")) closeMobileSidebar(); else hideDiagramTooltip(); }
      }
    });
  }
  function initFocusMode(){
    const btn = document.getElementById("focus-toggle");
    btn.addEventListener("click", ()=>{
      const on = !document.body.classList.contains("focus-mode");
      document.body.classList.toggle("focus-mode", on);
      btn.setAttribute("aria-pressed", on?"true":"false");
    });
  }
  function initScrollTop(){
    const btn = document.getElementById("scroll-top");
    window.addEventListener("scroll", ()=>{ btn.hidden = window.scrollY < 600; }, {passive:true});
    btn.addEventListener("click", ()=> window.scrollTo({top:0, behavior:"smooth"}));
  }

  /* ============================================================
     SOURCES PANEL — agrega todas las URL públicas citadas
     ============================================================ */
  function renderSourcesPanel(){
    const body = document.getElementById("sources-panel-body");
    const co = DATA.colombia.examples;
    const groups = [
      { title:"Documentos de la revisión citados en la app ("+DATA.studies.length+")", items: DATA.studies.slice().sort((a,b)=>a.key.localeCompare(b.key,"es")).map(s=>({ label:s.key+": "+s.title, url:s.url })) },
      { title:"Normas y programas colombianos", items: co.map(x=>({ label:x.source.label, url:x.source.url })).concat(co.filter(x=>x.extra).map(x=>({ label:x.extra.label, url:x.extra.url }))) },
      { title:"Referencias metodológicas", items: DATA.methods.methodRefs },
      { title:"Trabajo relacionado del autor", items: DATA.meta.relatedWorks.map(r=>({ label:r.title, url:r.url })) },
    ];
    groups.forEach(g=>{
      const seen = {}; const items = g.items.filter(i=> i.url && !seen[i.url] && (seen[i.url]=1));
      if(!items.length) return;
      const ul = el("ul",{class:"sources-panel-list"});
      items.forEach(it=> ul.appendChild(el("li",{},[ extLink(it.label, it.url) ])));
      body.appendChild(el("div",{class:"sources-panel-group"},[ el("h3",{},[g.title]), ul ]));
    });
  }
  function initSourcesPanelToggle(){
    const btn = document.getElementById("sources-panel-btn"), panel = document.getElementById("sources-panel");
    btn.addEventListener("click", ()=>{
      panel.hidden = !panel.hidden; closeMobileSidebar();
      if(!panel.hidden) panel.scrollIntoView({behavior:"smooth", block:"start"});
    });
  }
  function initGlobalExport(){
    document.querySelectorAll(".js-export-pdf").forEach(btn=> btn.addEventListener("click", ()=> window.print()));
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot(){
    renderHero();
    renderSummaryPanel();
    buildAccordionShell();
    renderResumen();
    renderDiferencia();
    renderEvidencia();
    renderCalculadora();
    renderColombia();
    renderEtica();
    renderGlosario();
    renderMetodos();
    renderConclusion();

    renderSidebarTOC();
    renderSourcesPanel();
    initGlobalExport();

    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
    document.getElementById("expand-all").addEventListener("click", ()=> setAllSections(true));
    document.getElementById("collapse-all").addEventListener("click", ()=> setAllSections(false));
    document.getElementById("section-count-hint").textContent = SECTIONS.length+" secciones · el resumen está abierto; el resto se expande a tu ritmo";
    document.addEventListener("click", (e)=>{
      if(!e.target.closest || !e.target.closest(".node-box, .diagram-tooltip")) hideDiagramTooltip();
    });

    initMobileSidebar();
    initSearch();
    initShortcutsPanel();
    initKeyboardShortcuts();
    initFocusMode();
    initSummaryMode();
    initScrollTop();
    initSourcesPanelToggle();
    initScrollspy();
    loadCalcFromHash();
    window.addEventListener("hashchange", loadCalcFromHash);
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
