/* EDITE AQUI. As fotos, o logo e a fonte estão na pasta assets.
   Para trocar: substitua o src dos elementos ou os endereços abaixo. Textos são editáveis no HTML.
   heroVideoSrc: caminho/URL do vídeo definitivo. heroPosterSrc: opcional.
   Os tempos das cenas abaixo são DEMONSTRATIVOS e precisam ser calibrados ao vídeo definitivo. */
window.SALES_BLACK_CONFIG = {
  // ===== ADICIONE SEU VÍDEO AQUI =====
  // 1. Copie seu arquivo para assets/video.mp4 e preencha a linha abaixo.

  // Exemplo local: heroVideoSrc: "assets/video.mp4",
  // Exemplo online: heroVideoSrc: "https://seu-dominio.com/video.mp4",
  // Use URL direta de MP4/H.264 para ampla compatibilidade, não link de página.
  heroVideoSrc: "./assets/videobarber.mp4",
  // OPCIONAL: vídeo vertical mais leve para telas menores que 900px.
  // Se vazio, o celular usa o mesmo vídeo acima, recortado para preencher a capa.
  heroVideoMobileSrc: "",
  // OPCIONAL: imagem exibida antes de carregar ou se o autoplay for bloqueado.
  // Exemplo: heroPosterSrc: "assets/capa.jpg",
  heroPosterSrc: "",
  // Ponto do recorte: ajuste se o rosto/ação não estiver no centro do vídeo.
  // Estes valores aceitam a sintaxe CSS object-position: horizontal vertical.
  heroVideoPositionDesktop: "50% 45%",
  heroVideoPositionMobile: "50% 45%",
  bookingUrl: "",
  servicesUrl: "#servicos",
  // Dados finais da barbearia: preencha depois de confirmar.
  visit: {
    address: "", // Ex.: rua, número, bairro e cidade. Não publica dados presumidos.
    hours: "", // Use \n para separar dias/horários.
    directionsUrl: "", // URL exata do Maps, depois de confirmar.
    contactUrl: "", // WhatsApp, telefone ou e-mail confirmado.
    instagramUrl: "https://www.instagram.com/barbeariasalesblack/",
    photoSrc: "assets/visita-ilustrativa.png",
    photoAlt: "Cadeira de barbearia em um ambiente ilustrativo",
    photoCaption: "Imagem ilustrativa",
  },
  scenes: [
  { start: 0, end: Infinity, left: "0%", top: "32%" },
],
};
(() => {
  "use strict";
  const CONFIG = window.SALES_BLACK_CONFIG;
  const $ = (id) => document.getElementById(id),
    black = document.querySelector(".black-word"),
    section = $("sobre"),
    stage = $("stage"),
    cover = $("cover"),
    title = $("coverTitle"),
    text = $("coverText"),
    primary = $("primary"),
    shared = $("shared"),
    sharedImg = $("sharedImage"),
    caption = $("caption"),
    info = $("info"),
    content = $("infoContent");
  const reduced = matchMedia("(prefers-reduced-motion:reduce)"),
    desktop = matchMedia("(min-width:900px) and (min-height:560px)");
  const clamp = (x) => Math.max(0, Math.min(1, x)),
    range = (p, a, b) => clamp((p - a) / (b - a)),
    ease = (x) => x * x * (3 - 2 * x),
    lerp = (a, b, t) => a + (b - a) * t;
  let animated = false,
    queued = false,
    geometry = null;
  function state(el, visible) {
    el.inert = !visible;
    el.setAttribute("aria-hidden", String(!visible));
  }
  function render() {
    queued = false;
    if (!animated) return;
    const scrollRoom = section.offsetHeight - stage.clientHeight,
      p = clamp(-section.getBoundingClientRect().top / Math.max(1, scrollRoom));
    const exit = ease(range(p, 0.18, 0.44)),
      move = ease(range(p, 0.24, 0.69)),
      enter = ease(range(p, 0.47, 0.73));
    // O segundo capítulo escurece junto com a transição, sem corte de fundo.
    const atmosphere = ease(range(p, 0.32, 0.60));
    const tone = Math.round(lerp(244, 17, atmosphere));
    const blue = Math.round(lerp(242, 17, atmosphere));
    section.querySelector(".about-pin").style.backgroundColor = `rgb(${tone},${tone},${blue})`;
    const stroke = Math.round(lerp(37, 102, atmosphere));
    black.style.webkitTextStrokeColor = `rgb(${stroke},${stroke},${stroke})`;
    title.style.opacity = 1 - exit;
    title.style.transform = `translateY(${-36 * exit}px)`;
    text.style.opacity = 1 - exit;
    text.style.transform = `translateY(${-22 * exit}px)`;
    primary.style.opacity = 1 - ease(range(p, 0.22, 0.55));
    primary.style.transform = `translateY(${-24 * exit}px) scale(${1 + 0.025 * exit})`;
    if (geometry) {
      shared.style.transform = `translate(${lerp(0, geometry.dx, move)}px,${lerp(0, geometry.dy, move)}px)`;
      shared.style.width = lerp(geometry.w0, geometry.w1, move) + "px";
      shared.style.height = lerp(geometry.h0, geometry.h1, move) + "px";
    }
    black.style.transform = `translateY(${stage.clientHeight * 0.12 * move}px)`;
    sharedImg.style.filter = `grayscale(${move})`;
    info.style.visibility = enter > 0 ? "visible" : "hidden";
    info.style.opacity = enter;
    content.style.transform = `translateY(${20 * (1 - enter)}px)`;
    caption.style.opacity = ease(range(p, 0.63, 0.76));
    state(cover, p < 0.44);
    state(info, p >= 0.65);
    state(shared, true);
    shared.setAttribute("aria-hidden", String(p >= 0.65));
  }
  function schedule() {
    if (!queued) {
      queued = true;
      requestAnimationFrame(render);
    }
  }
  function measure() {
    animated = desktop.matches && !reduced.matches;
    document.body.classList.toggle("animated", animated);
    [title, text, primary, shared, sharedImg, info, content, caption].forEach(
      (el) => {
        el.style.transform = "";
        el.style.opacity = "";
        el.style.visibility = "";
      },
    );
    sharedImg.style.filter = "";
    black.style.transform = "";
    black.style.webkitTextStrokeColor = "";
    section.querySelector(".about-pin").style.backgroundColor = "";
    shared.style.width = "";
    shared.style.height = "";
    state(cover, true);
    state(info, true);
    shared.inert = false;
    shared.removeAttribute("aria-hidden");
    if (animated) {
      const w = stage.clientWidth,
        h = stage.clientHeight;
      geometry = {
        dx: (0.055 - 0.33) * w,
        dy: (0.105 - 0.4) * h,
        w0: 0.2 * w,
        w1: 0.275 * w,
        h0: 0.47 * h,
        h1: 0.625 * h,
      };
      render();
    } else {
      geometry = null;
      info.removeAttribute("aria-hidden");
      cover.removeAttribute("aria-hidden");
    }
  }
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", measure);
  addEventListener("pageshow", measure);
  reduced.addEventListener("change", measure);
  desktop.addEventListener("change", measure);
  document.fonts.ready.then(measure);
  document
    .querySelectorAll("img")
    .forEach((img) => img.addEventListener("load", measure));
  measure();
  const booking = $("booking");
  if (CONFIG.bookingUrl) {
    booking.href = CONFIG.bookingUrl;
    booking.target = "_blank";
    booking.rel = "noopener noreferrer";
    booking.removeAttribute("aria-disabled");
  } else booking.removeAttribute("href");
  if (CONFIG.servicesUrl) {
    $("services").disabled = false;
    $("services").onclick = () => {
      location.href = CONFIG.servicesUrl;
    };
  }
  const video = $("heroVideo"),
    poster = $("heroPoster"),
    controls = $("videoControls"),
    toggle = $("videoToggle"),
    headline = $("heroTitle");
  let scene = -1;
  if (CONFIG.heroPosterSrc) poster.src = CONFIG.heroPosterSrc;
  function mediaState() {
    const playing = !video.paused && !video.ended;
    toggle.textContent = playing ? "Ⅱ" : "▶";
    toggle.setAttribute(
      "aria-label",
      playing ? "Pausar vídeo" : "Reproduzir vídeo",
    );
  }
  function fallback() {
    poster.hidden = false;
    video.hidden = true;
    controls.hidden = true;
    headline.style.left = "";
    headline.style.top = "";
  }
  function syncScene() {
    if (!Number.isFinite(video.duration)) return;
    $("videoProgress").style.width =
      (video.currentTime / video.duration) * 100 + "%";
    if (reduced.matches) return;
    const i = CONFIG.scenes.findIndex(
      (s) => video.currentTime >= s.start && video.currentTime < s.end,
    );
    if (i < 0 || scene === i) return;
    scene = i;
    const s = CONFIG.scenes[i];
    headline.style.left = innerWidth < 900 ? "0%" : s.left;
    headline.style.top = innerWidth < 900 ? (i === 1 ? "27%" : "32%") : s.top;
    headline.style.fontSize =
      innerWidth < 900 ? "" : i === 1 ? "clamp(58px,5.2vw,96px)" : "";
  }
  video.addEventListener("playing", () => {
    video.hidden = false;
    poster.hidden = true;
    controls.hidden = false;
    mediaState();
  });
  video.addEventListener("pause", mediaState);
  video.addEventListener("play", mediaState);
  video.addEventListener("error", fallback);
  video.addEventListener("timeupdate", syncScene);
  video.addEventListener("seeked", syncScene);
  toggle.onclick = () =>
    video.paused ? video.play().catch(fallback) : video.pause();
  // A tag HTML também pode receber src ou <source>; a configuração tem prioridade.
  const htmlVideoSrc = video.getAttribute("src") || video.querySelector("source")?.getAttribute("src") || "";
  const mobileVideo = matchMedia("(max-width:899px)");
  const media = document.querySelector(".hero-media");
  media.style.setProperty("--video-position-desktop", CONFIG.heroVideoPositionDesktop || "50% 45%");
  media.style.setProperty("--video-position-mobile", CONFIG.heroVideoPositionMobile || "50% 45%");
  function selectedVideo() {
    return (mobileVideo.matches && CONFIG.heroVideoMobileSrc) || CONFIG.heroVideoSrc || htmlVideoSrc;
  }
function loadHeroVideo() {
  const src = selectedVideo();
  if (!src) return;

  video.muted = true;
  video.defaultMuted = true;
  video.autoplay = !reduced.matches;
  video.src = src;
  video.poster = poster.src;
  controls.hidden = false;

  video.hidden = false; // Linha adicionada
  video.load();

  if (!reduced.matches)
    video.play().catch(() => {
      poster.hidden = false;
      controls.hidden = false;
      mediaState();
    });

  }
  loadHeroVideo();
  mobileVideo.addEventListener("change", () => {
    // Troca de orientação só recarrega se houver um arquivo mobile diferente.
    if (selectedVideo() && video.getAttribute("src") !== selectedVideo()) loadHeroVideo();
    scene = -1;
    syncScene();
  });
  reduced.addEventListener("change", () => {
    if (reduced.matches) {
      video.pause();
      headline.style.left = "";
      headline.style.top = "";
      headline.style.fontSize = "";
    }
  });
})();

// SERVIÇOS. Painéis acessíveis sem seleção automática por hover.
(() => {
  const panels = [...document.querySelectorAll(".service-panel")];
  const buttons = panels.map((p) => p.querySelector(".service-select"));
  function select(index, announce = true) {
    panels.forEach((panel, i) => {
      const active = i === index,
        readable = active || matchMedia("(max-width:899px)").matches,
        button = buttons[i],
        details = panel.querySelector(".service-details");
      // Retira foco de um acesso que será ocultado antes de tornar o bloco inert.
      if (!active && details.contains(document.activeElement))
        buttons[index].focus();
      panel.classList.toggle("is-active", active);
      button.setAttribute("aria-expanded", String(readable));
      panel.querySelector(".service-symbol").textContent = active ? "−" : "+";
      details.inert = !readable;
      details.setAttribute("aria-hidden", String(!readable));
    });
    if (announce)
      document.getElementById("service-status").textContent =
        buttons[index].textContent.replace(/[+−]/g, "").trim() +
        ": detalhes abertos.";
  }
  panels.forEach((panel, index) => {
    panel.addEventListener("click", (e) => {
      if (e.target.closest(".service-booking")) return;
      select(index);
    });
    buttons[index].addEventListener("keydown", (e) => {
      let next = index;
      if (e.key === "ArrowRight" || e.key === "ArrowDown")
        next = (index + 1) % panels.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
        next = (index - 1 + panels.length) % panels.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = panels.length - 1;
      else return;
      e.preventDefault();
      select(next);
      buttons[next].focus();
    });
  });
  document.querySelectorAll(".service-booking").forEach((link) => {
    const url = window.SALES_BLACK_CONFIG.bookingUrl;
    if (url) {
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.removeAttribute("aria-disabled");
    } else {
      link.removeAttribute("href");
      link.addEventListener("click", (e) => e.preventDefault());
    }
  });
  select(0, false);
  matchMedia("(max-width:899px)").addEventListener("change", () => {
    select(Math.max(0, panels.findIndex(p => p.classList.contains("is-active"))), false);
  });
})();

/* ===== GALERIA: 800 ms de observação, depois movimento contínuo. =====
   Velocidade: ~7,5 segundos por fotografia de 27vw. Sem prender a página.
   Não há temporizador de troca de cards: scrollLeft avança em pixels por segundo. */
(() => {
  const viewport = document.getElementById("cutsViewport"),
    track = document.getElementById("cutsTrack"),
    original = document.getElementById("cutsOriginal"),
    section = document.getElementById("cortes");
  if (!viewport) return;
  const motion = matchMedia("(prefers-reduced-motion: reduce)"),
    playback = document.getElementById("cutsPlayback"),
    dialog = document.getElementById("cutDialog");
  const cards = [...original.querySelectorAll(".cut-open")];
  const clone = original.cloneNode(true);
  clone.removeAttribute("id");
  clone.setAttribute("aria-hidden", "true");
  clone.querySelectorAll("button").forEach((b) => (b.tabIndex = -1));
  track.append(clone);
  let residual = 0;
  let period = 0,
    inView = false,
    manualPause = false,
    hover = false,
    focused = false,
    dragging = false,
    dragged = false,
    suppressClick = false,
    deadline = performance.now(),
    last = 0,
    raf = 0,
    opened = 0,
    opener = null;
  function measure() {
    period =
      original.getBoundingClientRect().width +
      parseFloat(getComputedStyle(track).gap || 0);
    if (period && viewport.scrollLeft >= period) viewport.scrollLeft %= period;
    updateCounter();
  }
  function hold(ms = 2200) {
    deadline = performance.now() + ms;
  }
  function canMove() {
    return (
      inView &&
      !manualPause &&
      !motion.matches &&
      !document.hidden &&
      !hover &&
      !(focused && viewport.matches(":focus-within") && matchMedia("(hover:hover) and (pointer:fine)").matches) &&
      !dragging &&
      !dialog.open
    );
  }
  function updateCounter() {}
  function label() {
    const paused = manualPause || motion.matches;
    document.getElementById("cutsPlaybackIcon").textContent = paused
      ? "▶"
      : "Ⅱ";
    playback.setAttribute(
      "aria-label",
      motion.matches
        ? "Movimento automático desativado pela preferência de movimento reduzido"
        : paused
          ? "Retomar movimento automático da galeria"
          : "Pausar movimento automático da galeria",
    );
    playback.setAttribute("aria-pressed", String(paused));
    playback.disabled = motion.matches;
  }
  function tick(now) {
    raf = 0;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    if (canMove() && now >= deadline && period) {
      const speed = innerWidth < 900 ? 24 : Math.min(58, Math.max(28, (innerWidth * 0.27) / 7.5));
      residual += speed * dt;
      const pixels = Math.floor(residual);
      residual -= pixels;
      viewport.scrollLeft += pixels;
      if (viewport.scrollLeft >= period) viewport.scrollLeft -= period;
      updateCounter();
    }
    if (inView && !document.hidden) raf = requestAnimationFrame(tick);
  }
  function start() {
    if (!raf) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  }
  const observer = new IntersectionObserver(
    (entries) => {
      const visible =
        entries[0].isIntersecting && entries[0].intersectionRatio >= 0.25;
      if (visible && !inView) {
        hold(0);
        inView = true;
        start();
      } else if (!visible) {
        inView = false;
        cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
      }
    },
    { threshold: [0, 0.25, 0.6] },
  );
  observer.observe(viewport);
  playback.addEventListener("click", () => {
    manualPause = !manualPause;
    hold(700);
    label();
    start();
  });
  viewport.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") hover = true;
  });
  viewport.addEventListener("pointerleave", () => {
    hover = false;
    hold();
  });
  viewport.addEventListener("focusin", () => {
    focused = true;
    hold();
  });
  viewport.addEventListener("focusout", () => {
    setTimeout(() => {
      focused = viewport.contains(document.activeElement);
      hold();
    }, 0);
  });
  viewport.addEventListener("wheel", () => hold(), { passive: true });
  viewport.addEventListener("touchstart", () => { dragging = true; hold(0); }, { passive: true });
  viewport.addEventListener("touchend", () => { dragging = false; hold(500); start(); }, { passive: true });
  viewport.addEventListener("touchcancel", () => { dragging = false; hold(500); start(); }, { passive: true });
  let downX = 0,
    initialScroll = 0,
    pointer = null;
  viewport.addEventListener("pointerdown", (e) => {
    hold();
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    dragging = true;
    dragged = false;
    pointer = e.pointerId;
    downX = e.clientX;
    initialScroll = viewport.scrollLeft;
  });
  viewport.addEventListener("pointermove", (e) => {
    if (!dragging || e.pointerId !== pointer) return;
    const dx = e.clientX - downX;
    if (Math.abs(dx) > 6 && !dragged) {
      dragged = true;
      viewport.setPointerCapture(pointer);
      viewport.classList.add("is-dragging");
    }
    if (dragged) {
      e.preventDefault();
      viewport.scrollLeft = Math.max(0, initialScroll - dx);
    }
  });
  function release() {
    if (!dragging) return;
    suppressClick = dragged;
    dragging = false;
    viewport.classList.remove("is-dragging");
    hold();
    setTimeout(() => {
      suppressClick = false;
    }, 100);
  }
  viewport.addEventListener("pointerup", release);
  viewport.addEventListener("pointercancel", release);
  addEventListener("pointerup", release);
  viewport.addEventListener(
    "scroll",
    () => {
      if (period && viewport.scrollLeft >= period)
        viewport.scrollLeft -= period;
      updateCounter();
    },
    { passive: true },
  );
  viewport.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      hold();
      viewport.scrollBy({
        left: (e.key === "ArrowRight" ? 1 : -1) * innerWidth * 0.3,
        behavior: motion.matches ? "instant" : "smooth",
      });
    }
  });
  function showPhoto(index) {
    opened = (index + cards.length) % cards.length;
    const card = cards[opened],
      figure = card.closest("figure"),
      visual = card.querySelector("svg,img").cloneNode(true);
    if (visual.tagName.toLowerCase() === "svg") {
      visual.setAttribute("preserveAspectRatio", "xMidYMid meet");
      const ns = "http://www.w3.org/2000/svg";
      const [x, y, width, height] = visual
        .getAttribute("viewBox")
        .split(/\s+/)
        .map(Number);
      const defs = document.createElementNS(ns, "defs"),
        clip = document.createElementNS(ns, "clipPath"),
        rect = document.createElementNS(ns, "rect");
      clip.id = "lightbox-clip";
      Object.entries({ x, y, width, height }).forEach(([k, v]) =>
        rect.setAttribute(k, v),
      );
      clip.append(rect);
      defs.append(clip);
      visual.prepend(defs);
      visual
        .querySelector("image")
        .setAttribute("clip-path", "url(#lightbox-clip)");
    }
    document.getElementById("cutDialogPhoto").replaceChildren(visual);
    document.getElementById("cutDialogTitle").textContent =
      figure.querySelector("figcaption").textContent;
    document.getElementById("cutDialogCount").textContent =
      String(opened + 1).padStart(2, "0") + " / " + cards.length;
  }
  viewport.addEventListener("click", (e) => {
    const target = e.target.closest(".cut-open");
    if (!target || suppressClick) return;
    opener = target;
    hold();
    showPhoto(Number(target.dataset.cut));
    dialog.showModal();
    document.getElementById("cutClose").focus();
  });
  document.getElementById("cutClose").onclick = () => dialog.close();
  document.getElementById("cutPrevious").onclick = () => showPhoto(opened - 1);
  document.getElementById("cutNext").onclick = () => showPhoto(opened + 1);
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        dialog.close();
    }
  });
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      showPhoto(opened - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      showPhoto(opened + 1);
    }
  });
  dialog.addEventListener("close", () => {
    if (matchMedia("(hover:hover) and (pointer:fine)").matches) opener?.focus({ preventScroll: true });
    focused = false;
    hold(500);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    } else {
      hold(800);
      if (inView) start();
    }
  });
  motion.addEventListener("change", () => {
    label();
    hold(800);
  });
  addEventListener("resize", measure);
  document.fonts.ready.then(measure);
  new ResizeObserver(measure).observe(original);
  measure();
  label();
})();

/* PRODUTOS — conteúdo demonstrativo, substituível por catálogo real.
   imageSrc: foto individual opcional. url: destino comercial confirmado.
   viewBox: recorte da imagem ilustrativa, sem Base64 no código.
   Adicione aqui os preços/volumes SOMENTE depois de confirmados. */
window.SALES_BLACK_PRODUCTS = [
  {
    key: "pomada",
    name: "POMADA MODELADORA",
    category: "FINALIZAÇÃO",
    description: ["Definição e textura", "para finalizar o seu estilo."],
    viewBox: "0 420 512 480",
    imageSrc: "",
    url: "",
  },
  {
    key: "shampoo",
    name: "SHAMPOO",
    category: "CUIDADO DIÁRIO",
    description: ["Uma etapa de cuidado", "para acompanhar a sua rotina."],
    viewBox: "512 30 512 900",
    imageSrc: "",
    url: "",
  },
  {
    key: "oleo",
    name: "ÓLEO PARA BARBA",
    category: "CUIDADO COM A BARBA",
    description: ["Um cuidado a mais", "para completar o seu ritual."],
    viewBox: "1024 290 512 640",
    imageSrc: "",
    url: "",
  },
];
(() => {
  const products = window.SALES_BLACK_PRODUCTS,
    section = document.getElementById("produtos"),
    panel = document.getElementById("productPanel"),
    art = document.getElementById("productArt"),
    information = document.getElementById("productInformation"),
    tabs = [...document.querySelectorAll(".product-tab")],
    motion = matchMedia("(prefers-reduced-motion:reduce)");
  if (!section) return;
  const ns = "http://www.w3.org/2000/svg";
  let active = 0,
    token = 0,
    animations = [];
  function picture(product, id) {
    if (product.imageSrc) {
      const img = document.createElement("img");
      img.src = product.imageSrc;
      img.alt = product.name + " — imagem do produto";
      return img;
    }
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", product.viewBox);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", product.name + " — embalagem ilustrativa");
    svg.setAttribute("focusable", "false");
    const defs = document.createElementNS(ns, "defs"),
      clip = document.createElementNS(ns, "clipPath"),
      rect = document.createElementNS(ns, "rect"),
      image = document.createElementNS(ns, "image");
    clip.id = id;
    const [x, y, width, height] = product.viewBox.split(" ");
    Object.entries({ x, y, width, height }).forEach(([k, v]) =>
      rect.setAttribute(k, v),
    );
    clip.append(rect);
    defs.append(clip);
    svg.append(defs);
    image.setAttribute("href", "assets/produtos-ilustrativos.png");
    image.setAttribute("width", "1536");
    image.setAttribute("height", "1024");
    image.setAttribute("clip-path", "url(#" + id + ")");
    svg.append(image);
    return svg;
  }
  function content(index, announce) {
    const product = products[index];
    active = index;
    section.dataset.product = product.key;
    art.replaceChildren(picture(product, "main-product-clip"));
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productCategory").textContent = product.category;
    const desc = document.getElementById("productDescription");
    desc.replaceChildren();
    product.description.forEach((line, i) => {
      if (i) desc.append(document.createElement("br"));
      desc.append(document.createTextNode(line));
    });
    const link = document.getElementById("productLink");
    if (product.url) {
      link.href = product.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.removeAttribute("aria-disabled");
    } else {
      link.removeAttribute("href");
      link.removeAttribute("target");
      link.setAttribute("aria-disabled", "true");
    }
    tabs.forEach((tab, i) => {
      tab.classList.toggle("is-selected", i === index);
      tab.setAttribute("aria-selected", String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", tabs[index].id);
    if (announce)
      document.getElementById("productStatus").textContent =
        product.name + " selecionado.";
  }
  async function select(index, animate = true) {
    const current = ++token;
    animations.forEach((a) => a.cancel());
    animations = [];
    if (index === active) {
      art.style.opacity = "";
      information.style.opacity = "";
      return;
    }
    if (motion.matches || !animate) {
      content(index, true);
      return;
    }
    const opts = { duration: 150, easing: "ease-out", fill: "forwards" };
    animations = [
      art.animate(
        [
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(8px)" },
        ],
        opts,
      ),
      information.animate([{ opacity: 1 }, { opacity: 0 }], opts),
    ];
    await Promise.all(animations.map((a) => a.finished.catch(() => {})));
    if (current !== token) return;
    content(index, true);
    animations.forEach((a) => a.cancel());
    animations = [
      art.animate(
        [
          { opacity: 0, transform: "translateY(12px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 420, easing: "cubic-bezier(.2,.7,.3,1)" },
      ),
      information.animate(
        [
          { opacity: 0, transform: "translateY(6px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 300, easing: "ease-out" },
      ),
    ];
  }
  tabs.forEach((tab, index) => {
    tab
      .querySelector(".product-thumbnail")
      .replaceChildren(picture(products[index], "thumb-product-" + index));
    tab.addEventListener("click", () => select(index));
    tab.addEventListener("keydown", (e) => {
      let next = index;
      if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
      else if (e.key === "ArrowLeft")
        next = (index - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      else return;
      e.preventDefault();
      tabs[next].focus();
      select(next);
    });
  });
  motion.addEventListener("change", () => {
    ++token;
    animations.forEach((a) => a.cancel());
    animations = [];
    content(active, false);
  });
  content(0, false);
})();

// Fechamento: todos os destinos comerciais compartilham a configuração central.
(() => {
  const config = window.SALES_BLACK_CONFIG,
    visit = config.visit || {};
  function link(id, url) {
    const el = document.getElementById(id);
    if (!el) return;
    if (url && url.trim()) {
      el.href = url;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
      el.removeAttribute("aria-disabled");
    } else {
      el.removeAttribute("href");
      el.setAttribute("aria-disabled", "true");
    }
  }
  document.getElementById("visitAddress").textContent =
    visit.address || "Endereço a confirmar";
  document.getElementById("visitHours").textContent =
    visit.hours || "Horários a confirmar";
  if (visit.photoSrc)
    document.getElementById("visitPhoto").src = visit.photoSrc;
  document.getElementById("visitPhoto").alt =
    visit.photoAlt || "Ambiente da barbearia";
  const caption = document.getElementById("visitPhotoCaption");
  caption.textContent = visit.photoCaption || "";
  caption.hidden = !visit.photoCaption;
  link("visitBooking", config.bookingUrl);
  link("visitDirections", visit.directionsUrl);
  link("footerContact", visit.contactUrl);
  link("footerInstagram", visit.instagramUrl);
})();

// No celular, a narrativa entra em fluxo normal com uma revelação curta.
// Nenhum texto fica oculto caso JavaScript ou a animação não estejam disponíveis.
(() => {
  const small = matchMedia("(max-width:900px)"),
    reduce = matchMedia("(prefers-reduced-motion:reduce)");
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting && small.matches && !reduce.matches) {
          entry.target.animate(
            [
              { opacity: 0.5, transform: "translateY(16px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 450, easing: "ease-out" },
          );
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.15 },
  );
  document
    .querySelectorAll(".cover-title,#info")
    .forEach((el) => observer.observe(el));
})();


// Mobile: zoom ligado ao scroll, sem interceptar gestos ou travar a página.
(() => {
  const mobile = matchMedia("(max-width:899px)");
  const reduce = matchMedia("(prefers-reduced-motion:reduce)");
  const panels = [...document.querySelectorAll(".service-panel")];
  let pending = false;
  function render() {
    pending = false;
    panels.forEach(panel => {
      if (!mobile.matches || reduce.matches) {
        panel.style.removeProperty("--scroll-scale");
        panel.style.removeProperty("--scroll-shift");
        return;
      }
      const rect = panel.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
      panel.style.setProperty("--scroll-scale", (1.14 - progress * .14).toFixed(4));
      panel.style.setProperty("--scroll-shift", (14 - progress * 28).toFixed(2) + "px");
    });
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(render); } }
  addEventListener("scroll", schedule, { passive:true });
  addEventListener("resize", schedule);
  reduce.addEventListener("change", schedule);
  render();
})();


// Faixa no topo: movimento discreto, pausa acessível e preferência de movimento reduzido.
(() => {
  const ribbon = document.getElementById("productRibbon");
  const button = document.getElementById("ribbonToggle");
  const icon = document.getElementById("ribbonIcon");
  const reduce = matchMedia("(prefers-reduced-motion:reduce)");
  let paused = false;
  function update() {
    ribbon.classList.toggle("is-paused", paused || reduce.matches);
    button.setAttribute("aria-pressed", String(paused || reduce.matches));
    button.setAttribute("aria-label", paused ? "Retomar faixa de produtos" : "Pausar faixa de produtos");
    button.hidden = reduce.matches;
    icon.setAttribute("d", paused ? "M6 3v14l11-7z" : "M5 3h3v14H5zm7 0h3v14h-3z");
  }
  button.addEventListener("click", () => { paused = !paused; update(); });
  reduce.addEventListener("change", update);
  update();
})();
