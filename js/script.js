const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const osShell = $("#osShell");
const desktopIcons = $("#desktopIcons");
const windowLayer = $("#windowLayer");
const windowTemplate = $("#windowTemplate");
const dock = $("#dock");
const startButton = $("#startButton");
const startMenu = $("#startMenu");
const startActions = $("#startActions");
const notifications = $("#notifications");
const globalSearch = $("#globalSearch");
const searchInput = $("#searchInput");
const clockDisplay = $("#clockDisplay");
const bootScreen = $("#bootScreen");
const bootLog = $("#bootLog");
const bootProgress = $("#bootProgress");
const skipBoot = $("#skipBoot");
const lockScreen = $("#lockScreen");
const lockDate = $("#lockDate");
const matrixMode = $("#matrixMode");
const matrixCanvas = $("#matrixCanvas");

const store = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch (error) {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const state = {
  zIndex: 100,
  windows: new Map(),
  openedApps: new Set(),
  commandCount: 0,
  selectedIcon: null,
  matrixTimer: null,
  cyberTimer: null,
  monitorTimer: null,
  browser: { history: ["frank.local/about"], index: 0 },
  settings: {
    theme: "dark",
    wallpaper: "aurora",
    animations: true,
    sound: false,
    clockFormat: "24"
  },
  achievements: {},
  gameIntervals: {}
};

const apps = [
  { id: "about", name: "About Me", icon: "about", width: 920, height: 620 },
  { id: "projects", name: "Projects", icon: "projects", width: 1080, height: 700 },
  { id: "skills", name: "Skills", icon: "skills", width: 880, height: 660 },
  { id: "cyber", name: "Cyber Lab", icon: "cyber", width: 1060, height: 720 },
  { id: "games", name: "Game Center", icon: "games", width: 1050, height: 720 },
  { id: "files", name: "File Explorer", icon: "files", width: 880, height: 620 },
  { id: "terminal", name: "Terminal", icon: "terminal", width: 780, height: 560 },
  { id: "browser", name: "Browser", icon: "browser", width: 900, height: 640 },
  { id: "education", name: "Education", icon: "education", width: 760, height: 560 },
  { id: "experience", name: "Journey", icon: "network", width: 820, height: 620 },
  { id: "notes", name: "Notes", icon: "notes", width: 840, height: 620 },
  { id: "calculator", name: "Calculator", icon: "calculator", width: 380, height: 580 },
  { id: "music", name: "Music", icon: "music", width: 680, height: 520 },
  { id: "monitor", name: "System Monitor", icon: "monitor", width: 760, height: 540 },
  { id: "contact", name: "Contact", icon: "contact", width: 820, height: 620 },
  { id: "resume", name: "Resume", icon: "resume", width: 780, height: 640 },
  { id: "achievements", name: "Achievements", icon: "github", width: 720, height: 560 },
  { id: "settings", name: "Settings", icon: "settings", width: 780, height: 620 },
  { id: "trash", name: "Trash", icon: "trash", width: 560, height: 420 }
];

const projects = [
  {
    id: "camplink",
    name: "Camplink",
    image: "assets/images/camplink.svg",
    description: "A campus marketplace concept designed to connect students and suppliers.",
    problem: "Students need easier access to campus products, trusted suppliers, and local deals without scattered chats.",
    solution: "A student-first marketplace concept with searchable products, supplier profiles, and clean purchase flows.",
    technologies: ["HTML", "CSS", "JavaScript", "Supabase", "Next.js"],
    features: ["Marketplace layout", "Supplier discovery", "Student-focused browsing", "Product cards"],
    status: "Concept build",
    github: "#",
    live: "#"
  },
  {
    id: "frank-os",
    name: "Frank OS",
    image: "assets/images/frank-os.svg",
    description: "An operating-system-inspired portfolio with apps, games, labs, and local data.",
    problem: "Most portfolios feel like static resumes and do not show interaction design or JavaScript ability.",
    solution: "A static browser OS that turns portfolio sections into draggable apps and playful tools.",
    technologies: ["HTML", "CSS", "JavaScript", "SVG", "Canvas", "LocalStorage"],
    features: ["Window manager", "Terminal", "Game Center", "Cyber Lab", "Achievements"],
    status: "Live portfolio",
    github: "#",
    live: "#"
  },
  {
    id: "dynamflow",
    name: "Dynamflow",
    image: "assets/images/dynamflow.svg",
    description: "A technology and digital product brand focused on useful digital solutions.",
    problem: "Small ideas need a clear place to grow into polished, useful products.",
    solution: "A product-minded brand space for experiments, web tools, and digital services.",
    technologies: ["Brand", "Web", "Products"],
    features: ["Brand identity", "Product concepts", "Digital solution focus"],
    status: "In progress",
    github: "#",
    live: "#"
  }
];

const skills = [
  skillGroup("Programming", [
    skill("C++", 58, "Core programming, logic, and problem solving.", "Data structures, memory concepts, and algorithms.", ["Education"]),
    skill("JavaScript", 68, "Browser interaction and application logic.", "Canvas, modular code, and richer UI state.", ["Frank OS", "Camplink"]),
    skill("Python", 52, "Scripting, automation, and general problem solving.", "Clean scripting and practical projects.", ["Learning labs"])
  ]),
  skillGroup("Web", [
    skill("HTML", 76, "Semantic structure for accessible interfaces.", "Better document architecture.", ["Frank OS"]),
    skill("CSS", 72, "Responsive layouts, themes, and interface polish.", "Animation restraint and design systems.", ["Frank OS"]),
    skill("JavaScript", 68, "Interactive front-end features.", "Games, app state, and browser APIs.", ["Frank OS"])
  ]),
  skillGroup("Frameworks", [
    skill("React", 48, "Component-based UI development.", "State patterns and reusable components.", ["Camplink"]),
    skill("Next.js", 45, "Full-stack web framework concepts.", "Routing, data loading, and deployment basics.", ["Camplink"])
  ]),
  skillGroup("Tools", [
    skill("Git", 58, "Version control for project history.", "Branch discipline and collaboration flows.", ["All projects"]),
    skill("GitHub", 62, "Hosting code and tracking work.", "Project documentation and issue workflows.", ["All projects"]),
    skill("Linux", 54, "Command line workflow and development environment.", "Shell fluency and system basics.", ["Terminal"]),
    skill("VS Code", 74, "Daily code editing and debugging.", "Extensions, shortcuts, and workspace habits.", ["All projects"])
  ]),
  skillGroup("Interests", [
    skill("Cybersecurity", 42, "Learning security fundamentals through educational simulations.", "Networking, defensive concepts, and secure habits.", ["Cyber Lab"]),
    skill("Artificial Intelligence", 35, "Exploring useful AI-assisted software workflows.", "Prompting, automation, and practical integrations.", ["Future labs"]),
    skill("Cloud Computing", 34, "Understanding deployment and scalable infrastructure.", "Hosting, monitoring, and service basics.", ["Future projects"]),
    skill("Software Engineering", 58, "Building maintainable, useful software.", "Architecture, testing, and product thinking.", ["Frank OS", "Dynamflow"])
  ])
];

const educationItems = [
  { date: "2026 - Present", title: "Copperbelt University", text: "Bachelor of Computer Science, building foundations in programming, systems thinking, algorithms, and software development." }
];

const journeyItems = [
  { date: "2026", title: "Started Computer Science", text: "Began formal study and built discipline around computing fundamentals." },
  { date: "2026", title: "Started Learning Programming", text: "Focused on C++, JavaScript, Python, and practical problem solving." },
  { date: "2026", title: "Started Building Web Projects", text: "Moved from exercises into portfolio-ready front-end projects." },
  { date: "2026", title: "Started Larger Software Projects", text: "Began designing products with data, user flows, and maintainable structure." },
  { date: "Future", title: "Mobile Development", text: "Extend products into mobile-first experiences." },
  { date: "Future", title: "Artificial Intelligence", text: "Apply AI to useful software workflows and learning tools." },
  { date: "Future", title: "Cloud Computing", text: "Deploy scalable applications and services with reliable infrastructure." }
];

const fileTree = {
  "Documents/About.txt": "Frank Banda\nComputer Science Student | Software Developer | Builder | Cybersecurity Enthusiast\n\nI am passionate about software development, technology, cybersecurity, and building digital products that solve real problems.",
  "Documents/Education.txt": "Copperbelt University\nBachelor of Computer Science\n2026 - Present",
  "Documents/Goals.txt": "Build useful products.\nGrow as a software developer.\nKeep learning cybersecurity responsibly.\nImprove engineering discipline.",
  "Projects/Camplink": projects[0].description,
  "Projects/Frank OS": projects[1].description,
  "Projects/Dynamflow": projects[2].description,
  "Cybersecurity/Learning.txt": "Cybersecurity is presented here as a learning interest. Cyber Lab contains educational simulations only.",
  "Cybersecurity/CyberLab": "Open Cyber Lab for simulated network status, password checks, and educational encoding demos.",
  "Games/Snake": "Playable Snake is available in Game Center.",
  "Games/Memory": "Playable Memory is available in Game Center.",
  "Games/Cyber Defender": "Cyber Defender is a fictional defensive decision game."
};

const audioPlaylist = [
  // Add local files here after placing them in assets/audio/.
  // Example: { title: "My Track", artist: "Frank Banda", src: "assets/audio/my-track.mp3" }
];

const appContent = {
  about: renderAbout,
  projects: renderProjects,
  skills: renderSkills,
  cyber: renderCyberLab,
  games: renderGameCenter,
  files: renderFileExplorer,
  education: () => renderTimeline("Education Timeline", educationItems),
  experience: () => renderTimeline("Developer Journey", journeyItems),
  terminal: renderTerminal,
  browser: renderBrowser,
  notes: renderNotes,
  calculator: renderCalculator,
  music: renderMusic,
  monitor: renderSystemMonitor,
  contact: renderContact,
  resume: renderResume,
  achievements: renderAchievements,
  settings: renderSettings,
  trash: () => `<section class="empty-state"><h2>Trash</h2><p>No deleted files. Frank OS keeps this portfolio tidy.</p><button class="button button-primary" data-open="files" type="button">Open File Explorer</button></section>`
};

document.addEventListener("DOMContentLoaded", init);

function skillGroup(category, items) {
  return { category, items };
}

function skill(name, level, description, learning, related) {
  return { name, level, description, learning, related };
}

function init() {
  state.settings = { ...state.settings, ...store.get("frank-os-settings", {}) };
  state.achievements = store.get("frank-os-achievements", {});
  if (localStorage.getItem("frank-os-returned")) unlockAchievement("Persistent", "Returned to Frank OS.");
  localStorage.setItem("frank-os-returned", "true");
  applySettings();
  renderDesktop();
  renderStartMenu();
  bindShellEvents();
  runBoot();
  updateClock();
  updateLockDate();
  setInterval(updateClock, 1000);
}

function iconSvg(name) {
  const paths = {
    about: `<circle cx="24" cy="19" r="8"/><path d="M10 42c2-10 26-10 28 0"/>`,
    projects: `<rect x="8" y="10" width="32" height="26" rx="4"/><path d="M14 18h20M14 26h12"/>`,
    skills: `<path d="M10 36l10-24 8 18 5-10 5 16"/><path d="M8 40h32"/>`,
    terminal: `<path d="M10 16l8 8-8 8M22 34h16"/>`,
    cyber: `<path d="M24 7l16 7v11c0 10-7 16-16 20-9-4-16-10-16-20V14z"/><path d="M17 25l5 5 10-11"/>`,
    games: `<rect x="8" y="16" width="32" height="20" rx="8"/><path d="M17 22v8M13 26h8M31 24h.1M35 29h.1"/>`,
    files: `<path d="M7 15h14l4 5h16v20H7z"/><path d="M7 20h34"/>`,
    browser: `<circle cx="24" cy="24" r="16"/><path d="M8 24h32M24 8c5 5 5 27 0 32M24 8c-5 5-5 27 0 32"/>`,
    network: `<circle cx="24" cy="14" r="4"/><circle cx="12" cy="35" r="4"/><circle cx="36" cy="35" r="4"/><path d="M22 18l-8 13M26 18l8 13M16 35h16"/>`,
    education: `<path d="M5 18l19-9 19 9-19 9z"/><path d="M13 23v9c7 5 15 5 22 0v-9"/>`,
    contact: `<rect x="7" y="12" width="34" height="26" rx="4"/><path d="M8 16l16 12 16-12"/>`,
    settings: `<circle cx="24" cy="24" r="6"/><path d="M24 6v6M24 36v6M6 24h6M36 24h6M11 11l4 4M33 33l4 4M37 11l-4 4M15 33l-4 4"/>`,
    trash: `<path d="M14 16h20l-2 25H16z"/><path d="M12 16h24M19 16l2-6h6l2 6"/>`,
    github: `<circle cx="24" cy="24" r="16"/><path d="M19 36v-5c-5 1-6-2-7-4M29 36v-7c0-2-1-3-2-4 6-1 10-4 10-11 0-3-1-5-3-7 0-2 0-4-1-5-3 0-5 2-6 3-2-.5-4-.5-6 0-1-1-3-3-6-3-1 1-1 3-1 5-2 2-3 4-3 7 0 7 4 10 10 11-1 1-2 2-2 4v7"/>`,
    resume: `<path d="M13 6h14l8 8v28H13z"/><path d="M27 6v9h8M18 23h12M18 30h12M18 37h8"/>`,
    music: `<path d="M30 10v22a6 6 0 1 1-4-6V14l12-3v18a6 6 0 1 1-4-6V9z"/>`,
    calculator: `<rect x="12" y="7" width="24" height="34" rx="4"/><path d="M17 14h14M17 23h.1M24 23h.1M31 23h.1M17 30h.1M24 30h.1M31 30h.1M17 37h14"/>`,
    notes: `<path d="M12 8h24v32H12z"/><path d="M18 17h12M18 24h12M18 31h8"/>`,
    monitor: `<rect x="8" y="10" width="32" height="24" rx="4"/><path d="M18 40h12M24 34v6M14 27l5-6 5 4 5-9 5 11"/>`
  };
  return `<svg class="os-icon" viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.about}</g></svg>`;
}

function renderDesktop() {
  const saved = store.get("frank-os-icon-positions", {});
  desktopIcons.innerHTML = apps.map((app, index) => {
    const pos = saved[app.id];
    const style = pos ? `style="left:${pos.x}px;top:${pos.y}px;"` : `style="left:${18 + (index % 2) * 104}px;top:${index * 16 + Math.floor(index / 2) * 98}px;"`;
    return `<button class="desktop-icon" ${style} type="button" data-app="${app.id}" aria-label="Open ${app.name}">${iconSvg(app.icon)}<span>${app.name}</span></button>`;
  }).join("");
  bindDesktopIcons();
}

function renderStartMenu() {
  startMenu.innerHTML = `
    <div class="start-profile">
      <div class="avatar">FB</div>
      <div><strong>FRANK OS</strong><span>Frank Banda</span></div>
    </div>
    <input class="start-search" id="startSearch" placeholder="Search..." aria-label="Search applications">
    <strong class="start-section-title">Applications</strong>
    <div class="start-actions" id="startActions"></div>
    <strong class="start-section-title">Power</strong>
    <div class="start-power">
      <button class="button button-ghost" data-power="restart" type="button">Restart Interface</button>
      <button class="button button-ghost" data-power="lock" type="button">Lock Screen</button>
      <button class="button button-ghost" data-power="off" type="button">Power Off</button>
    </div>`;
  $("#startActions").innerHTML = apps.map((app) => `<button class="start-app" type="button" data-app="${app.id}">${iconSvg(app.icon)}<span>${app.name}</span></button>`).join("");
}

function bindShellEvents() {
  startButton.addEventListener("click", () => { startMenu.hidden = !startMenu.hidden; });
  dock.addEventListener("click", (event) => {
    const button = event.target.closest("[data-app]");
    if (button) openApp(button.dataset.app);
  });
  startMenu.addEventListener("click", (event) => {
    const appButton = event.target.closest("[data-app]");
    if (appButton) {
      openApp(appButton.dataset.app);
      startMenu.hidden = true;
      return;
    }
    const power = event.target.closest("[data-power]");
    if (power) handlePower(power.dataset.power);
  });
  startMenu.addEventListener("input", (event) => {
    if (event.target.id !== "startSearch") return;
    const q = event.target.value.toLowerCase();
    $$(".start-app", startMenu).forEach((button) => {
      button.hidden = !button.textContent.toLowerCase().includes(q);
    });
  });
  document.addEventListener("click", (event) => {
    if (!startMenu.hidden && !event.target.closest("#startMenu") && !event.target.closest("#startButton")) startMenu.hidden = true;
  });
  globalSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    handleSearch(searchInput.value);
  });
  windowLayer.addEventListener("click", handleWindowClick);
  window.addEventListener("resize", normalizeWindowsForViewport);
  skipBoot.addEventListener("click", finishBoot);
  lockScreen.addEventListener("click", () => lockScreen.classList.add("unlocked"));
  document.addEventListener("keydown", handleShortcuts);
}

function bindDesktopIcons() {
  let drag = null;
  desktopIcons.addEventListener("dblclick", (event) => {
    const icon = event.target.closest(".desktop-icon");
    if (icon) openApp(icon.dataset.app);
  });
  desktopIcons.addEventListener("click", (event) => {
    const icon = event.target.closest(".desktop-icon");
    if (!icon) return;
    $$(".desktop-icon").forEach((item) => item.classList.toggle("selected", item === icon));
    state.selectedIcon = icon.dataset.app;
    if (isMobile()) openApp(icon.dataset.app);
  });
  desktopIcons.addEventListener("keydown", (event) => {
    const icon = event.target.closest(".desktop-icon");
    if (icon && (event.key === "Enter" || event.key === " ")) openApp(icon.dataset.app);
  });
  desktopIcons.addEventListener("pointerdown", (event) => {
    const icon = event.target.closest(".desktop-icon");
    if (!icon || isMobile()) return;
    drag = { icon, x: event.clientX, y: event.clientY, left: icon.offsetLeft, top: icon.offsetTop, moved: false };
    icon.setPointerCapture(event.pointerId);
  });
  desktopIcons.addEventListener("pointermove", (event) => {
    if (!drag) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
    drag.icon.style.left = `${clamp(drag.left + dx, 0, desktopIcons.clientWidth - 92)}px`;
    drag.icon.style.top = `${clamp(drag.top + dy, 0, desktopIcons.clientHeight - 90)}px`;
  });
  desktopIcons.addEventListener("pointerup", () => {
    if (!drag) return;
    const positions = store.get("frank-os-icon-positions", {});
    positions[drag.icon.dataset.app] = { x: drag.icon.offsetLeft, y: drag.icon.offsetTop };
    store.set("frank-os-icon-positions", positions);
    drag = null;
  });
}

function runBoot() {
  const messages = ["Initializing system...", "Loading desktop...", "Loading Cyber Lab...", "Loading games...", "System ready."];
  let index = 0;
  const timer = setInterval(() => {
    if (index >= messages.length) {
      clearInterval(timer);
      setTimeout(finishBoot, 450);
      return;
    }
    const item = document.createElement("li");
    item.textContent = messages[index];
    bootLog.appendChild(item);
    bootProgress.style.width = `${((index + 1) / messages.length) * 100}%`;
    index += 1;
  }, 430);
}

function finishBoot() {
  bootScreen.classList.add("hidden");
  if (!state.windows.has("about")) {
    setTimeout(() => {
      openApp("about");
      notify("Welcome to Frank OS.", "Explore apps, games, labs, and project files.");
    }, 280);
  }
}

function openApp(appId) {
  const app = apps.find((item) => item.id === appId);
  if (!app) return;
  const existing = state.windows.get(appId);
  if (existing) {
    existing.hidden = false;
    existing.classList.remove("minimizing");
    bringToFront(existing);
    setDockState(appId, true);
    return;
  }
  const appWindow = windowTemplate.content.firstElementChild.cloneNode(true);
  appWindow.dataset.app = app.id;
  appWindow.style.width = `${app.width}px`;
  appWindow.style.height = `${app.height}px`;
  $(".window-icon", appWindow).innerHTML = iconSvg(app.icon);
  $(".window-name", appWindow).textContent = app.name;
  $(".window-content", appWindow).innerHTML = appContent[app.id]();
  positionWindow(appWindow);
  windowLayer.appendChild(appWindow);
  state.windows.set(app.id, appWindow);
  state.openedApps.add(app.id);
  if (state.openedApps.size >= 5) unlockAchievement("Explorer", "Opened 5 applications.");
  if (app.id === "cyber") unlockAchievement("Cyber Explorer", "Opened Cyber Lab.");
  if (app.id === "games") unlockAchievement("Gamer", "Opened Game Center.");
  bringToFront(appWindow);
  bindDrag(appWindow);
  bindResize(appWindow);
  initApp(app.id, appWindow);
  setDockState(app.id, true);
  playTone(520);
}

function openUtilityWindow(id, title, icon, html, width = 720, height = 560) {
  const existing = state.windows.get(id);
  if (existing) {
    $(".window-content", existing).innerHTML = html;
    bringToFront(existing);
    return existing;
  }
  const appWindow = windowTemplate.content.firstElementChild.cloneNode(true);
  appWindow.dataset.app = id;
  appWindow.style.width = `${width}px`;
  appWindow.style.height = `${height}px`;
  $(".window-icon", appWindow).innerHTML = iconSvg(icon);
  $(".window-name", appWindow).textContent = title;
  $(".window-content", appWindow).innerHTML = html;
  positionWindow(appWindow);
  windowLayer.appendChild(appWindow);
  state.windows.set(id, appWindow);
  bringToFront(appWindow);
  bindDrag(appWindow);
  bindResize(appWindow);
  return appWindow;
}

function positionWindow(appWindow) {
  if (isMobile()) {
    appWindow.style.left = "0px";
    appWindow.style.top = "0px";
    return;
  }
  const offset = (state.windows.size % 7) * 24;
  appWindow.style.left = `${120 + offset}px`;
  appWindow.style.top = `${28 + offset}px`;
}

function bringToFront(appWindow) {
  state.zIndex += 1;
  appWindow.style.zIndex = state.zIndex;
  $$(".app-window").forEach((windowElement) => windowElement.classList.toggle("active", windowElement === appWindow));
}

function handleWindowClick(event) {
  const appWindow = event.target.closest(".app-window");
  if (!appWindow) return;
  bringToFront(appWindow);
  const control = event.target.closest("[data-action]");
  if (control) return handleWindowAction(appWindow, control.dataset.action);
  const opener = event.target.closest("[data-open]");
  if (opener) openApp(opener.dataset.open);
  const localAction = event.target.closest("[data-local-action]");
  if (localAction) notify(localAction.dataset.localAction, "Placeholder ready to replace with a real link.");
}

function handleWindowAction(appWindow, action) {
  const appId = appWindow.dataset.app;
  if (action === "close") {
    appWindow.classList.add("closing");
    state.windows.delete(appId);
    setDockState(appId, false);
    playTone(250);
    setTimeout(() => appWindow.remove(), 180);
    return;
  }
  if (action === "minimize") {
    appWindow.classList.add("minimizing");
    setTimeout(() => {
      appWindow.hidden = true;
      appWindow.classList.remove("minimizing");
    }, 180);
    return;
  }
  if (action === "maximize") appWindow.classList.toggle("maximized");
}

function bindDrag(appWindow) {
  const titlebar = $(".window-titlebar", appWindow);
  let drag = null;
  titlebar.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".window-controls") || appWindow.classList.contains("maximized") || isMobile()) return;
    drag = { x: event.clientX, y: event.clientY, left: appWindow.offsetLeft, top: appWindow.offsetTop };
    bringToFront(appWindow);
    titlebar.setPointerCapture(event.pointerId);
  });
  titlebar.addEventListener("pointermove", (event) => {
    if (!drag) return;
    const rect = windowLayer.getBoundingClientRect();
    appWindow.style.left = `${clamp(drag.left + event.clientX - drag.x, 0, Math.max(0, rect.width - appWindow.offsetWidth))}px`;
    appWindow.style.top = `${clamp(drag.top + event.clientY - drag.y, 0, Math.max(0, rect.height - 56))}px`;
  });
  titlebar.addEventListener("pointerup", () => { drag = null; });
  titlebar.addEventListener("pointercancel", () => { drag = null; });
}

function bindResize(appWindow) {
  const handle = $(".resize-handle", appWindow);
  let resize = null;
  handle.addEventListener("pointerdown", (event) => {
    if (appWindow.classList.contains("maximized") || isMobile()) return;
    resize = { x: event.clientX, y: event.clientY, width: appWindow.offsetWidth, height: appWindow.offsetHeight };
    handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener("pointermove", (event) => {
    if (!resize) return;
    appWindow.style.width = `${clamp(resize.width + event.clientX - resize.x, 320, window.innerWidth - 36)}px`;
    appWindow.style.height = `${clamp(resize.height + event.clientY - resize.y, 300, window.innerHeight - 118)}px`;
  });
  handle.addEventListener("pointerup", () => { resize = null; });
  handle.addEventListener("pointercancel", () => { resize = null; });
}

function normalizeWindowsForViewport() {
  if (isMobile()) return;
  const rect = windowLayer.getBoundingClientRect();
  state.windows.forEach((appWindow) => {
    if (appWindow.classList.contains("maximized")) return;
    appWindow.style.left = `${clamp(appWindow.offsetLeft, 0, Math.max(0, rect.width - appWindow.offsetWidth))}px`;
    appWindow.style.top = `${clamp(appWindow.offsetTop, 0, Math.max(0, rect.height - 56))}px`;
  });
}

function setDockState(appId, isRunning) {
  $$(`.dock-button[data-app="${appId}"]`).forEach((button) => button.classList.toggle("running", isRunning));
}

function renderAbout() {
  return `
    <section class="hero-panel">
      <div class="profile-card">
        <span class="eyebrow">Personal Computer Environment</span>
        <h1>FRANK BANDA</h1>
        <div class="role-stack">
          <span class="chip">Computer Science Student</span><span class="chip">Software Developer</span><span class="chip">Builder</span><span class="chip">Cybersecurity Enthusiast</span>
        </div>
        <p>I am a Computer Science student passionate about software development, technology, cybersecurity, and building digital products that solve real problems.</p>
        <p>Cybersecurity is an important area of learning and interest for me. The security tools in Frank OS are educational simulations, not real hacking utilities.</p>
        <div class="button-row">
          <button class="button button-primary" type="button" data-open="projects">View Projects</button>
          <button class="button button-ghost" type="button" data-open="cyber">Open Cyber Lab</button>
          <button class="button button-ghost" type="button" data-open="games">Play Games</button>
          <a class="button button-ghost" href="assets/Frank-Banda-CV.pdf" download>Download CV</a>
        </div>
      </div>
      <aside>
        <div class="profile-orbit"><div class="profile-core">${iconSvg("about")}<span>FB</span></div></div>
        <div class="stats-grid">
          <div class="stat-card"><strong>2026</strong><span>Computer Science</span></div>
          <div class="stat-card"><strong>3+</strong><span>Featured Projects</span></div>
          <div class="stat-card"><strong>5</strong><span>Playable Games</span></div>
        </div>
      </aside>
    </section>`;
}

function renderProjects() {
  return `
    <section>
      <div class="project-toolbar"><span class="eyebrow">Project Center</span><p style="margin:0;">Click a project to open its detailed project file.</p></div>
      <div class="project-grid">
        ${projects.map((project) => `
          <button class="project-card project-open-card" data-project="${project.id}" type="button">
            <img src="${project.image}" alt="${project.name} project thumbnail">
            <span class="project-preview-bars"><i></i><i></i><i></i></span>
            <span class="project-body">
              <span class="status-badge">${project.status}</span>
              <strong>${project.name}</strong>
              <span>${project.description}</span>
              <span class="tech-list">${project.technologies.map((tech) => `<em>${tech}</em>`).join("")}</span>
            </span>
          </button>`).join("")}
      </div>
      <div class="project-detail-panel" id="projectDetailPanel">Select a project to inspect problem, solution, features, and links.</div>
    </section>`;
}

function projectDetailHtml(project) {
  return `
    <section class="project-file">
      <div class="project-toolbar"><span class="eyebrow">${project.status}</span><h2 style="margin:0;">${project.name}</h2></div>
      <img class="project-hero-image" src="${project.image}" alt="${project.name} preview">
      <div class="resume-grid">
        <article class="resume-section"><h3>Description</h3><p>${project.description}</p></article>
        <article class="resume-section"><h3>Problem</h3><p>${project.problem}</p></article>
        <article class="resume-section"><h3>Solution</h3><p>${project.solution}</p></article>
        <article class="resume-section"><h3>Features</h3><ul>${project.features.map((item) => `<li>${item}</li>`).join("")}</ul></article>
      </div>
      <div class="tech-list">${project.technologies.map((tech) => `<span>${tech}</span>`).join("")}</div>
      <div class="button-row"><button class="button button-ghost" data-local-action="${project.name} GitHub" type="button">GitHub</button><button class="button button-primary" data-local-action="${project.name} Live Demo" type="button">Live Demo</button></div>
    </section>`;
}

function renderSkills() {
  const first = skills[0].items[0];
  return `
    <section class="skill-lab">
      <aside class="skill-map">
        ${skills.map((group) => `<article class="skill-group"><h3>${group.category}</h3>${group.items.map((item) => `<button class="skill-pill" data-skill="${item.name}" type="button"><span>${item.name}</span><meter min="0" max="100" value="${item.level}"></meter></button>`).join("")}</article>`).join("")}
      </aside>
      <article class="skill-detail" id="skillDetail">${skillDetailHtml(first)}</article>
    </section>`;
}

function skillDetailHtml(item) {
  return `<span class="eyebrow">Current level ${item.level}%</span><h2>${item.name}</h2><p>${item.description}</p><h3>What I am learning</h3><p>${item.learning}</p><h3>Related projects</h3><div class="tech-list">${item.related.map((related) => `<span>${related}</span>`).join("")}</div><div class="progress"><span style="width:${item.level}%"></span></div>`;
}

function renderTimeline(title, items) {
  return `<section><span class="eyebrow">${title}</span><h2>${title === "Education Timeline" ? "Academic development" : "Developer growth path"}</h2><div class="timeline">${items.map((item) => `<article class="timeline-card"><time>${item.date}</time><h3>${item.title}</h3><p>${item.text}</p></article>`).join("")}</div></section>`;
}

function renderCyberLab() {
  return `
    <section class="cyber-grid">
      <article class="cyber-panel">
        <h2>Network Monitor</h2><p>Simulated values for portfolio visuals only.</p>
        <div id="networkStats" class="stat-stack"></div>
      </article>
      <article class="cyber-panel">
        <h2>Security Terminal</h2>
        <div class="mini-terminal" id="cyberOutput">Cyber Lab Terminal\nType help.</div>
        <form class="terminal-input-line" id="cyberForm"><span>&gt;</span><input class="terminal-input" id="cyberInput" autocomplete="off"></form>
      </article>
      <article class="cyber-panel">
        <h2>Password Strength Checker</h2><p>Runs locally. Passwords are never sent anywhere.</p>
        <input class="browser-address" id="passwordInput" type="password" placeholder="Type a password locally">
        <div id="passwordReport" class="check-list"></div>
      </article>
      <article class="cyber-panel">
        <h2>Encryption Demo</h2><p>Educational Caesar and Base64 demonstrations, not real security systems.</p>
        <textarea id="cipherInput" class="cipher-input" placeholder="Enter demo text"></textarea>
        <div class="button-row"><button class="button button-primary" data-cipher="caesar" type="button">Caesar +3</button><button class="button button-ghost" data-cipher="b64e" type="button">Base64 Encode</button><button class="button button-ghost" data-cipher="b64d" type="button">Base64 Decode</button></div>
        <pre id="cipherOutput" class="cipher-output"></pre>
      </article>
    </section>`;
}

function renderTerminal() {
  return `<section class="terminal" aria-label="Frank OS Terminal"><div class="terminal-output" id="terminalOutput">Frank OS Terminal\nType "help" to view commands.</div><form class="terminal-input-line" id="terminalForm"><span>&gt;</span><input class="terminal-input" id="terminalInput" autocomplete="off" spellcheck="false" aria-label="Terminal command"></form></section>`;
}

function renderGameCenter() {
  return `
    <section class="game-center">
      <div class="tabs" id="gameTabs">
        ${["snake", "memory", "tictactoe", "reaction", "defender"].map((game) => `<button class="chip ${game === "snake" ? "active" : ""}" data-game="${game}" type="button">${gameLabel(game)}</button>`).join("")}
      </div>
      <div id="gameStage" class="game-stage">${renderSnake()}</div>
    </section>`;
}

function gameLabel(game) {
  return { snake: "Snake", memory: "Memory", tictactoe: "Tic-Tac-Toe", reaction: "Reaction Test", defender: "Cyber Defender" }[game];
}

function renderSnake() {
  return `<section><div class="game-head"><strong>Snake</strong><span>Score: <b id="snakeScore">0</b> | High: <b id="snakeHigh">${store.get("snake-high", 0)}</b></span></div><canvas id="snakeCanvas" width="360" height="360" class="game-canvas"></canvas><div class="button-row"><button class="button button-primary" id="snakeStart" type="button">Restart</button></div></section>`;
}

function renderMemory() {
  return `<section><div class="game-head"><strong>Memory</strong><span>Moves: <b id="memoryMoves">0</b> | Time: <b id="memoryTime">0</b>s | Best: <b>${store.get("memory-best", "-")}</b></span></div><div class="segmented"><button class="chip active" data-memory-size="4" type="button">Easy</button><button class="chip" data-memory-size="6" type="button">Hard</button></div><div id="memoryBoard" class="memory-board"></div><button class="button button-primary" id="memoryRestart" type="button">Restart</button></section>`;
}

function renderTicTacToe() {
  return `<section><div class="game-head"><strong>Tic-Tac-Toe</strong><span id="tttStatus">Your turn</span></div><div class="segmented"><button class="chip active" data-ttt-mode="cpu" type="button">Vs Computer</button><button class="chip" data-ttt-mode="pvp" type="button">Vs Player</button></div><div id="tttBoard" class="ttt-board"></div><div class="game-head"><span>X: <b id="scoreX">0</b></span><span>O: <b id="scoreO">0</b></span></div><button class="button button-primary" id="tttRestart" type="button">Restart</button></section>`;
}

function renderReaction() {
  return `<section><div class="game-head"><strong>Reaction Time</strong><span>Best: <b id="reactionBest">${store.get("reaction-best", "-")}</b> ms</span></div><button id="reactionPad" class="reaction-pad" type="button">Click to start</button><p id="reactionResult"></p></section>`;
}

function renderDefender() {
  return `<section><div class="game-head"><strong>Cyber Defender</strong><span>Score: <b id="defScore">0</b> | Health: <b id="defHealth">100</b>%</span></div><div class="server-health"><span id="defHealthBar"></span></div><div class="defender-threat" id="defThreat">Incoming Threat: MALWARE</div><div class="button-row"><button class="button button-primary" data-defender="block" type="button">Block</button><button class="button button-ghost" data-defender="allow" type="button">Allow</button><button class="button button-ghost" id="defRestart" type="button">Restart</button></div><p>Fictional decision game. No real network activity occurs.</p></section>`;
}

function renderFileExplorer() {
  const folders = {
    Documents: ["About.txt", "Education.txt", "Goals.txt"],
    Projects: ["Camplink", "Frank OS", "Dynamflow"],
    Cybersecurity: ["Learning.txt", "CyberLab"],
    Games: ["Snake", "Memory", "Cyber Defender"]
  };
  return `<section class="file-explorer"><aside class="file-tree"><strong>FRANK OS</strong>${Object.entries(folders).map(([folder, files]) => `<details open><summary>${folder}</summary>${files.map((file) => `<button data-file="${folder}/${file}" type="button">${file}</button>`).join("")}</details>`).join("")}</aside><article class="file-content" id="fileContent"><h2>File Preview</h2><p>Select a file to display its contents.</p></article></section>`;
}

function renderNotes() {
  const notes = store.get("frank-os-notes", []);
  return `<section class="notes-app"><aside><div class="button-row"><button class="button button-primary" id="newNote" type="button">New Note</button></div><input class="browser-address" id="noteSearch" placeholder="Search local notes"><div id="noteList" class="note-list">${notes.map((note) => `<button data-note="${note.id}" type="button">${note.title || "Untitled"}</button>`).join("")}</div><p>Notes are stored locally in this browser.</p></aside><article class="note-editor"><input id="noteTitle" class="browser-address" placeholder="Title"><textarea id="noteBody" class="cipher-input" placeholder="Write a note"></textarea><div class="button-row"><button class="button button-primary" id="saveNote" type="button">Save</button><button class="button button-ghost" id="deleteNote" type="button">Delete</button></div></article></section>`;
}

function renderCalculator() {
  const keys = ["C", "DEL", "%", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "="];
  return `<section class="calculator"><output id="calcDisplay">0</output><div class="calc-keys">${keys.map((key) => `<button type="button" data-calc="${key}" class="${key === "=" ? "equals" : ""}">${key}</button>`).join("")}</div></section>`;
}

function renderMusic() {
  if (!audioPlaylist.length) return `<section class="empty-state"><h2>No music files installed.</h2><p>Add your own audio files inside <code>assets/audio/</code> and list them in <code>audioPlaylist</code> inside <code>js/script.js</code>.</p></section>`;
  return `<section class="music-player"><audio id="musicAudio"></audio><div class="music-now"><strong id="musicTitle">${audioPlaylist[0].title}</strong><span id="musicArtist">${audioPlaylist[0].artist || "Local audio"}</span></div><input id="musicProgress" type="range" min="0" max="100" value="0" aria-label="Track progress"><div class="button-row"><button class="button button-ghost" id="musicPrev" type="button">Previous</button><button class="button button-primary" id="musicPlay" type="button">Play</button><button class="button button-ghost" id="musicNext" type="button">Next</button></div><label class="toggle-row">Volume <input id="musicVolume" type="range" min="0" max="1" step="0.05" value="0.8"></label><div class="note-list">${audioPlaylist.map((track, index) => `<button data-track="${index}" type="button">${track.title}<br><small>${track.artist || "Local audio"}</small></button>`).join("")}</div></section>`;
}

function renderSystemMonitor() {
  return `<section><span class="eyebrow">Visual Simulation</span><h2>System Monitor</h2><p>These animated values are simulated and do not read the visitor's actual hardware.</p><div class="monitor-grid" id="monitorGrid"></div></section>`;
}

function renderBrowser() {
  return `<section><form class="browser-toolbar" id="browserForm"><button class="browser-control" type="button" data-browser="back" aria-label="Back">&lt;</button><button class="browser-control" type="button" data-browser="forward" aria-label="Forward">&gt;</button><button class="browser-control" type="button" data-browser="refresh" aria-label="Refresh">R</button><input class="browser-address" id="browserAddress" value="${state.browser.history[state.browser.index]}" aria-label="Browser address"><button class="button button-primary" type="submit">Search</button></form><div class="browser-page" id="browserPage"></div></section>`;
}

function renderContact() {
  return `<section class="contact-layout"><div class="contact-panel"><span class="eyebrow">Contact</span><h2>Prepare a message</h2><form class="contact-form" id="contactForm" novalidate><div class="field"><label for="contactName">Name</label><input id="contactName" name="name" autocomplete="name" required></div><div class="field"><label for="contactEmail">Email</label><input id="contactEmail" name="email" type="email" autocomplete="email" required></div><div class="field"><label for="contactSubject">Subject</label><input id="contactSubject" name="subject" required></div><div class="field"><label for="contactMessage">Message</label><textarea id="contactMessage" name="message" required></textarea></div><button class="button button-primary" type="submit">Send Message</button><div class="form-message" id="contactMessageStatus" role="status"></div></form></div><aside class="contact-panel"><h3>Direct links</h3><p>Replace these placeholders with Frank's real profiles when ready.</p><div class="link-stack"><a class="button button-ghost" href="mailto:frank@example.com">Email</a><button class="button button-ghost" data-local-action="GitHub profile" type="button">GitHub</button><button class="button button-ghost" data-local-action="LinkedIn profile" type="button">LinkedIn</button><button class="button button-ghost" data-local-action="WhatsApp contact" type="button">WhatsApp</button></div></aside></section>`;
}

function renderResume() {
  return `<section><div class="project-toolbar"><span class="eyebrow">CV Viewer</span><a class="button button-primary" href="assets/Frank-Banda-CV.pdf" download>Download CV</a></div><div class="resume-grid"><article class="resume-section"><h3>Profile</h3><p>Computer Science student and software developer focused on web development, cybersecurity learning, useful digital products, and technology-driven problem solving.</p></article><article class="resume-section"><h3>Education</h3><p>Copperbelt University - Bachelor of Computer Science, 2026 to Present.</p></article><article class="resume-section"><h3>Skills</h3><ul><li>C++, JavaScript, Python</li><li>HTML, CSS, Responsive Design</li><li>React, Next.js</li><li>Git, GitHub, Linux, VS Code</li></ul></article><article class="resume-section"><h3>Projects</h3><ul><li>Camplink</li><li>Frank OS</li><li>Dynamflow</li></ul></article><article class="resume-section"><h3>Experience</h3><p>Founder and builder developing practical software concepts, portfolio projects, and larger product ideas.</p></article><article class="resume-section"><h3>Contact</h3><p>Email, GitHub, LinkedIn, and WhatsApp links are prepared as placeholders for final profile details.</p></article></div></section>`;
}

function renderAchievements() {
  const names = ["Explorer", "Gamer", "Terminal User", "Cyber Explorer", "Hacker...", "Persistent", "Matrix", "File Reader", "Note Taker", "Project Inspector"];
  return `<section><span class="eyebrow">Achievements</span><h2>Unlocked locally</h2><div class="achievement-grid">${names.map((name) => `<article class="achievement ${state.achievements[name] ? "unlocked" : ""}"><strong>${state.achievements[name] ? "✓" : "🔒"} ${name}</strong><p>${state.achievements[name] || "Keep exploring Frank OS."}</p></article>`).join("")}</div></section>`;
}

function renderSettings() {
  const wallpapers = ["aurora", "carbon", "sunrise", "cybergrid", "rain", "minimal", "workspace", "blue", "terminal"];
  return `<section class="settings-grid"><article class="setting-group"><h3>Theme</h3><div class="segmented" data-setting="theme">${["dark", "light", "cyber"].map((theme) => `<button class="chip ${state.settings.theme === theme ? "active" : ""}" type="button" data-value="${theme}">${theme}</button>`).join("")}</div></article><article class="setting-group"><h3>Wallpaper</h3><div class="wallpaper-options" data-setting="wallpaper">${wallpapers.map((wallpaper) => `<button class="wallpaper-swatch swatch-${wallpaper} ${state.settings.wallpaper === wallpaper ? "active" : ""}" type="button" data-value="${wallpaper}" aria-label="${wallpaper} wallpaper"></button>`).join("")}</div></article><article class="setting-group"><h3>Interface</h3><label class="toggle-row">Enable animations <input id="animationsToggle" type="checkbox" ${state.settings.animations ? "checked" : ""}></label><label class="toggle-row">Interface Sound <input id="soundToggle" type="checkbox" ${state.settings.sound ? "checked" : ""}></label></article><article class="setting-group"><h3>Clock</h3><div class="segmented" data-setting="clockFormat"><button class="chip ${state.settings.clockFormat === "12" ? "active" : ""}" type="button" data-value="12">12-hour</button><button class="chip ${state.settings.clockFormat === "24" ? "active" : ""}" type="button" data-value="24">24-hour</button></div></article></section>`;
}

function initApp(appId, appWindow) {
  const initMap = {
    projects: initProjects,
    skills: initSkills,
    cyber: initCyberLab,
    games: initGameCenter,
    files: initFileExplorer,
    terminal: initTerminal,
    browser: initBrowser,
    notes: initNotes,
    calculator: initCalculator,
    music: initMusic,
    monitor: initSystemMonitor,
    contact: initContact,
    settings: initSettings
  };
  if (initMap[appId]) initMap[appId](appWindow);
}

function initProjects(appWindow) {
  appWindow.addEventListener("click", (event) => {
    const card = event.target.closest("[data-project]");
    if (!card) return;
    const project = projects.find((item) => item.id === card.dataset.project);
    $("#projectDetailPanel", appWindow).innerHTML = projectDetailHtml(project);
    openUtilityWindow(`project-${project.id}`, `${project.name} Project`, "projects", projectDetailHtml(project), 760, 640);
    unlockAchievement("Project Inspector", `Opened ${project.name}.`);
  });
}

function initSkills(appWindow) {
  appWindow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-skill]");
    if (!button) return;
    const item = skills.flatMap((group) => group.items).find((entry) => entry.name === button.dataset.skill);
    $("#skillDetail", appWindow).innerHTML = skillDetailHtml(item);
  });
}

function initTerminal(appWindow) {
  const form = $("#terminalForm", appWindow);
  const input = $("#terminalInput", appWindow);
  const output = $("#terminalOutput", appWindow);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const command = input.value.trim();
    if (!command) return;
    input.value = "";
    runTerminalCommand(command, output);
  });
  input.focus();
}

function runTerminalCommand(command, output) {
  const normalized = command.toLowerCase();
  state.commandCount += 1;
  if (state.commandCount >= 10) unlockAchievement("Terminal User", "Executed 10 terminal commands.");
  const responses = {
    help: "Commands: help, about, projects, skills, education, cyber, games, contact, date, time, clear, neofetch, matrix",
    about: "Frank Banda - Computer Science Student | Software Developer | Builder | Cybersecurity Enthusiast.",
    projects: projects.map((project) => project.name).join("\n"),
    skills: skills.flatMap((group) => group.items.map((item) => item.name)).filter(unique).join("\n"),
    education: "2026 - Present\nCopperbelt University\nBachelor of Computer Science",
    cyber: "Opening Cyber Lab...",
    games: "Opening Game Center...",
    contact: "Email: frank@example.com\nUse the Contact app to prepare a message.",
    date: new Date().toDateString(),
    time: new Date().toLocaleTimeString(),
    neofetch: "FRANK OS\n\nUser: Frank Banda\nSystem: Frank OS\nRole: Computer Science Student\nInterests: Software Development / Cybersecurity\nProjects: 3+\nStatus: Learning & Building",
    "sudo frank": "Nice try.\n\nThis is a portfolio, not a Linux server.",
    hack: "ACCESS DENIED\n\nTry learning cybersecurity instead.",
    konami: "Visual effect unlocked. Try the arrow-key sequence too.",
    coffee: "Coffee mode unavailable. Hydration mode recommended.",
    "open sesame": "A hidden achievements panel appears.",
    "rm -rf /": "Command refused. Frank OS protects portfolios from dramatic mistakes.",
    ping: "pong from frank.local"
  };
  if (normalized === "clear") {
    output.textContent = "Frank OS Terminal\n";
    return;
  }
  if (normalized === "cyber") openApp("cyber");
  if (normalized === "games") openApp("games");
  if (normalized === "matrix") startMatrixMode();
  if (normalized === "hack") unlockAchievement("Hacker...", "Entered the fictional hack command.");
  if (normalized === "open sesame") openApp("achievements");
  typeTerminal(output, `\n> ${command}\n${responses[normalized] || `Command not found: ${command}`}\n`);
}

function typeTerminal(output, text) {
  let i = 0;
  const timer = setInterval(() => {
    output.textContent += text[i] || "";
    output.scrollTop = output.scrollHeight;
    i += 1;
    if (i >= text.length) clearInterval(timer);
  }, state.settings.animations ? 8 : 0);
}

function initCyberLab(appWindow) {
  const stats = $("#networkStats", appWindow);
  const renderStats = () => {
    const packets = 12000 + Math.floor(Math.random() * 9000);
    const latency = 18 + Math.floor(Math.random() * 28);
    const threat = Math.random() > 0.82 ? "MEDIUM" : "LOW";
    stats.innerHTML = [["Connection", "SECURE"], ["Packets", packets.toLocaleString()], ["Latency", `${latency}ms`], ["Threat Level", threat], ["Firewall", "ACTIVE"]].map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join("");
  };
  renderStats();
  clearInterval(state.cyberTimer);
  state.cyberTimer = setInterval(renderStats, 1800);
  $("#cyberForm", appWindow).addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("#cyberInput", appWindow);
    runCyberCommand(input.value.trim(), $("#cyberOutput", appWindow));
    input.value = "";
  });
  $("#passwordInput", appWindow).addEventListener("input", (event) => updatePasswordReport(event.target.value, $("#passwordReport", appWindow)));
  appWindow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cipher]");
    if (!button) return;
    const text = $("#cipherInput", appWindow).value;
    $("#cipherOutput", appWindow).textContent = runCipher(text, button.dataset.cipher);
  });
}

function runCyberCommand(command, output) {
  const responses = {
    help: "Commands: help, whoami, scan, network, security, projects, skills, clear",
    whoami: "Frank Banda - learning cybersecurity responsibly.",
    scan: "Starting simulated security scan...\n[████████████████] 100%\nNo threats detected.\nThis is a portfolio simulation.",
    network: "Connection: SECURE\nLatency: 24ms\nFirewall: ACTIVE\nSimulated dashboard only.",
    security: "Cybersecurity learning area: defensive thinking, networks, strong passwords, and safe habits.",
    projects: projects.map((project) => project.name).join("\n"),
    skills: "Cybersecurity, JavaScript, Linux, Git, Web Development"
  };
  if (command.toLowerCase() === "clear") {
    output.textContent = "Cyber Lab Terminal\n";
    return;
  }
  output.textContent += `\n> ${command}\n${responses[command.toLowerCase()] || "Unknown Cyber Lab command."}\n`;
  output.scrollTop = output.scrollHeight;
}

function updatePasswordReport(password, target) {
  const checks = [
    ["Length 8+", password.length >= 8],
    ["Uppercase", /[A-Z]/.test(password)],
    ["Lowercase", /[a-z]/.test(password)],
    ["Numbers", /\d/.test(password)],
    ["Symbols", /[^A-Za-z0-9]/.test(password)]
  ];
  const score = checks.filter(([, ok]) => ok).length;
  const label = ["Very weak", "Weak", "Fair", "Good", "Strong", "Excellent"][score];
  target.innerHTML = checks.map(([name, ok]) => `<span class="${ok ? "ok" : ""}">${ok ? "✓" : "×"} ${name}</span>`).join("") + `<strong>Estimated strength: ${label}</strong>`;
}

function runCipher(text, mode) {
  try {
    if (mode === "b64e") return btoa(unescape(encodeURIComponent(text)));
    if (mode === "b64d") return decodeURIComponent(escape(atob(text)));
    return text.replace(/[a-z]/gi, (char) => {
      const base = char <= "Z" ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - base + 3) % 26) + base);
    });
  } catch (error) {
    return "Unable to decode this text.";
  }
}

function initGameCenter(appWindow) {
  initSnake(appWindow);
  appWindow.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-game]");
    if (tab) {
      $$(".tabs .chip", appWindow).forEach((item) => item.classList.toggle("active", item === tab));
      const stage = $("#gameStage", appWindow);
      stage.innerHTML = { snake: renderSnake, memory: renderMemory, tictactoe: renderTicTacToe, reaction: renderReaction, defender: renderDefender }[tab.dataset.game]();
      ({ snake: initSnake, memory: initMemory, tictactoe: initTicTacToe, reaction: initReaction, defender: initDefender }[tab.dataset.game])(appWindow);
      unlockAchievement("Gamer", `Played ${gameLabel(tab.dataset.game)}.`);
      notify("Game started.", gameLabel(tab.dataset.game));
    }
  });
}

function initSnake(root) {
  const canvas = $("#snakeCanvas", root);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let snake, food, dir, score, speed, timer;
  const size = 18;
  const reset = () => {
    snake = [{ x: 9, y: 9 }];
    food = { x: 4, y: 4 };
    dir = { x: 1, y: 0 };
    score = 0;
    speed = 150;
    clearInterval(timer);
    timer = setInterval(tick, speed);
    state.gameIntervals.snake = timer;
  };
  const tick = () => {
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x < 0 || head.y < 0 || head.x >= 20 || head.y >= 20 || snake.some((part) => part.x === head.x && part.y === head.y)) {
      clearInterval(timer);
      const high = Math.max(store.get("snake-high", 0), score);
      store.set("snake-high", high);
      $("#snakeHigh", root).textContent = high;
      notify("Game over", `Snake score: ${score}`);
      return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 1;
      $("#snakeScore", root).textContent = score;
      food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
      if (speed > 65) {
        speed -= 5;
        clearInterval(timer);
        timer = setInterval(tick, speed);
      }
    } else {
      snake.pop();
    }
    draw();
  };
  const draw = () => {
    ctx.fillStyle = "#071015";
    ctx.fillRect(0, 0, 360, 360);
    ctx.fillStyle = "#29d3a1";
    snake.forEach((part) => ctx.fillRect(part.x * size + 1, part.y * size + 1, size - 2, size - 2));
    ctx.fillStyle = "#ff647c";
    ctx.fillRect(food.x * size + 1, food.y * size + 1, size - 2, size - 2);
  };
  const keyHandler = (event) => {
    const keys = { ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1], ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0] };
    if (!keys[event.key]) return;
    const [x, y] = keys[event.key];
    if (x !== -dir.x || y !== -dir.y) dir = { x, y };
  };
  document.addEventListener("keydown", keyHandler);
  $("#snakeStart", root).addEventListener("click", reset);
  reset();
}

function initMemory(root) {
  const board = $("#memoryBoard", root);
  let size = 4, cards = [], first = null, lock = false, moves = 0, start = Date.now(), timer;
  const build = () => {
    clearInterval(timer);
    moves = 0;
    first = null;
    start = Date.now();
    $("#memoryMoves", root).textContent = 0;
    timer = setInterval(() => { $("#memoryTime", root).textContent = Math.floor((Date.now() - start) / 1000); }, 1000);
    const count = size === 4 ? 8 : 12;
    cards = shuffle([...Array(count).keys(), ...Array(count).keys()]);
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    board.innerHTML = cards.map((value, index) => `<button data-card="${index}" data-value="${value}" type="button">?</button>`).join("");
  };
  root.addEventListener("click", (event) => {
    const sizeButton = event.target.closest("[data-memory-size]");
    if (sizeButton) {
      size = Number(sizeButton.dataset.memorySize);
      build();
    }
    if (event.target.id === "memoryRestart") build();
    const card = event.target.closest("[data-card]");
    if (!card || lock || card.classList.contains("matched") || card.classList.contains("flipped")) return;
    card.textContent = card.dataset.value;
    card.classList.add("flipped");
    if (!first) {
      first = card;
      return;
    }
    moves += 1;
    $("#memoryMoves", root).textContent = moves;
    if (first.dataset.value === card.dataset.value) {
      first.classList.add("matched");
      card.classList.add("matched");
      first = null;
      if ($$(".matched", board).length === cards.length) {
        const seconds = Math.floor((Date.now() - start) / 1000);
        const best = store.get("memory-best", null);
        if (!best || seconds < best) store.set("memory-best", seconds);
        clearInterval(timer);
        notify("Memory complete", `${seconds}s, ${moves} moves`);
      }
      return;
    }
    lock = true;
    setTimeout(() => {
      first.textContent = "?";
      card.textContent = "?";
      first.classList.remove("flipped");
      card.classList.remove("flipped");
      first = null;
      lock = false;
    }, 650);
  });
  build();
}

function initTicTacToe(root) {
  const board = $("#tttBoard", root);
  let cells = Array(9).fill("");
  let turn = "X";
  let mode = "cpu";
  let score = { X: 0, O: 0 };
  const draw = () => { board.innerHTML = cells.map((cell, index) => `<button data-ttt="${index}" class="${cell ? "filled" : ""}" type="button">${cell}</button>`).join(""); };
  const winner = () => [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]].find((line) => line.every((i) => cells[i] && cells[i] === cells[line[0]]));
  const move = (index) => {
    if (cells[index] || winner()) return;
    cells[index] = turn;
    const win = winner();
    if (win) {
      score[turn] += 1;
      $(`#score${turn}`, root).textContent = score[turn];
      $("#tttStatus", root).textContent = `${turn} wins`;
      draw();
      win.forEach((i) => $(`[data-ttt="${i}"]`, board).classList.add("win"));
      return;
    }
    if (cells.every(Boolean)) $("#tttStatus", root).textContent = "Draw";
    turn = turn === "X" ? "O" : "X";
    $("#tttStatus", root).textContent = `${turn}'s turn`;
    draw();
    if (mode === "cpu" && turn === "O") setTimeout(() => move(cells.findIndex((cell) => !cell)), 240);
  };
  root.addEventListener("click", (event) => {
    const modeButton = event.target.closest("[data-ttt-mode]");
    if (modeButton) mode = modeButton.dataset.tttMode;
    if (event.target.id === "tttRestart") { cells = Array(9).fill(""); turn = "X"; $("#tttStatus", root).textContent = "Your turn"; draw(); }
    const button = event.target.closest("[data-ttt]");
    if (button) move(Number(button.dataset.ttt));
  });
  draw();
}

function initReaction(root) {
  const pad = $("#reactionPad", root);
  let readyAt = 0, waiting = false;
  pad.addEventListener("click", () => {
    if (!waiting && !readyAt) {
      pad.textContent = "Wait for green...";
      pad.className = "reaction-pad waiting";
      waiting = true;
      setTimeout(() => {
        readyAt = performance.now();
        waiting = false;
        pad.textContent = "CLICK";
        pad.className = "reaction-pad ready";
      }, 900 + Math.random() * 2200);
      return;
    }
    if (waiting) {
      pad.textContent = "Too soon. Click to restart.";
      pad.className = "reaction-pad";
      waiting = false;
      readyAt = 0;
      return;
    }
    const time = Math.round(performance.now() - readyAt);
    const best = store.get("reaction-best", null);
    if (!best || time < best) store.set("reaction-best", time);
    $("#reactionBest", root).textContent = store.get("reaction-best", time);
    $("#reactionResult", root).textContent = `Reaction Time: ${time} ms`;
    pad.textContent = "Click to start";
    pad.className = "reaction-pad";
    readyAt = 0;
  });
}

function initDefender(root) {
  const threats = [{ name: "MALWARE", action: "block" }, { name: "PHISHING", action: "block" }, { name: "PATCH UPDATE", action: "allow" }, { name: "TRUSTED BACKUP", action: "allow" }];
  let score = 0, health = 100, current = threats[0];
  const next = () => {
    current = threats[Math.floor(Math.random() * threats.length)];
    $("#defThreat", root).textContent = `Incoming Threat: ${current.name}`;
    $("#defHealthBar", root).style.width = `${health}%`;
  };
  root.addEventListener("click", (event) => {
    const action = event.target.closest("[data-defender]")?.dataset.defender;
    if (event.target.id === "defRestart") { score = 0; health = 100; }
    if (!action) return next();
    if (action === current.action) score += 1;
    else health = Math.max(0, health - 15);
    $("#defScore", root).textContent = score;
    $("#defHealth", root).textContent = health;
    if (health <= 0) notify("Server down", `Final score: ${score}`);
    next();
  });
  next();
}

function initFileExplorer(appWindow) {
  appWindow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-file]");
    if (!button) return;
    $("#fileContent", appWindow).innerHTML = `<h2>${button.dataset.file}</h2><pre>${fileTree[button.dataset.file]}</pre>`;
    unlockAchievement("File Reader", "Opened a file in File Explorer.");
  });
}

function initNotes(appWindow) {
  let notes = store.get("frank-os-notes", []);
  let activeId = null;
  const refresh = () => {
    const q = $("#noteSearch", appWindow).value.toLowerCase();
    $("#noteList", appWindow).innerHTML = notes.filter((note) => `${note.title} ${note.body}`.toLowerCase().includes(q)).map((note) => `<button data-note="${note.id}" type="button">${note.title || "Untitled"}</button>`).join("");
  };
  appWindow.addEventListener("input", (event) => { if (event.target.id === "noteSearch") refresh(); });
  appWindow.addEventListener("click", (event) => {
    const noteButton = event.target.closest("[data-note]");
    if (noteButton) {
      const note = notes.find((item) => item.id === noteButton.dataset.note);
      activeId = note.id;
      $("#noteTitle", appWindow).value = note.title;
      $("#noteBody", appWindow).value = note.body;
    }
    if (event.target.id === "newNote") {
      activeId = String(Date.now());
      $("#noteTitle", appWindow).value = "";
      $("#noteBody", appWindow).value = "";
    }
    if (event.target.id === "saveNote") {
      activeId ||= String(Date.now());
      const note = { id: activeId, title: $("#noteTitle", appWindow).value, body: $("#noteBody", appWindow).value };
      notes = notes.filter((item) => item.id !== activeId).concat(note);
      store.set("frank-os-notes", notes);
      refresh();
      unlockAchievement("Note Taker", "Saved a local note.");
      notify("Notes", "Saved locally in this browser.");
    }
    if (event.target.id === "deleteNote" && activeId) {
      notes = notes.filter((item) => item.id !== activeId);
      store.set("frank-os-notes", notes);
      activeId = null;
      $("#noteTitle", appWindow).value = "";
      $("#noteBody", appWindow).value = "";
      refresh();
    }
  });
}

function initCalculator(appWindow) {
  let expression = "";
  const display = $("#calcDisplay", appWindow);
  appWindow.addEventListener("click", (event) => {
    const key = event.target.closest("[data-calc]")?.dataset.calc;
    if (!key) return;
    if (key === "C") expression = "";
    else if (key === "DEL") expression = expression.slice(0, -1);
    else if (key === "=") {
      try {
        expression = String(Function(`"use strict";return (${expression.replace(/%/g, "/100")})`)());
      } catch (error) {
        expression = "Error";
      }
    } else expression = expression === "Error" ? key : expression + key;
    display.textContent = expression || "0";
  });
}

function initMusic(appWindow) {
  if (!audioPlaylist.length) return;
  const audio = $("#musicAudio", appWindow);
  const title = $("#musicTitle", appWindow);
  const artist = $("#musicArtist", appWindow);
  const play = $("#musicPlay", appWindow);
  const progress = $("#musicProgress", appWindow);
  const volume = $("#musicVolume", appWindow);
  let index = 0;
  const load = (nextIndex) => {
    index = (nextIndex + audioPlaylist.length) % audioPlaylist.length;
    const track = audioPlaylist[index];
    audio.src = track.src;
    title.textContent = track.title;
    artist.textContent = track.artist || "Local audio";
    progress.value = 0;
  };
  const start = () => {
    audio.play().then(() => {
      play.textContent = "Pause";
    }).catch(() => notify("Music", "Could not play this local file."));
  };
  appWindow.addEventListener("click", (event) => {
    if (event.target.id === "musicPlay") {
      if (audio.paused) start();
      else {
        audio.pause();
        play.textContent = "Play";
      }
    }
    if (event.target.id === "musicPrev") {
      load(index - 1);
      start();
    }
    if (event.target.id === "musicNext") {
      load(index + 1);
      start();
    }
    const track = event.target.closest("[data-track]");
    if (track) {
      load(Number(track.dataset.track));
      start();
    }
  });
  volume.addEventListener("input", () => { audio.volume = Number(volume.value); });
  progress.addEventListener("input", () => { if (audio.duration) audio.currentTime = (Number(progress.value) / 100) * audio.duration; });
  audio.addEventListener("timeupdate", () => { if (audio.duration) progress.value = (audio.currentTime / audio.duration) * 100; });
  audio.addEventListener("ended", () => {
    load(index + 1);
    start();
  });
  load(0);
}

function initSystemMonitor(appWindow) {
  const grid = $("#monitorGrid", appWindow);
  const render = () => {
    grid.innerHTML = ["CPU", "MEMORY", "NETWORK", "STORAGE"].map((label) => {
      const value = 30 + Math.floor(Math.random() * 65);
      return `<article class="monitor-card"><strong>${label}</strong><div class="monitor-bar"><span style="width:${value}%"></span></div><b>${value}%</b></article>`;
    }).join("");
  };
  render();
  clearInterval(state.monitorTimer);
  state.monitorTimer = setInterval(render, 1500);
}

function initBrowser(appWindow) {
  const form = $("#browserForm", appWindow);
  const address = $("#browserAddress", appWindow);
  const page = $("#browserPage", appWindow);
  const loadCurrent = () => {
    address.value = state.browser.history[state.browser.index];
    page.innerHTML = browserPage(address.value);
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    navigateBrowser(address.value);
    loadCurrent();
  });
  form.addEventListener("click", (event) => {
    const action = event.target.closest("[data-browser]")?.dataset.browser;
    if (action === "back" && state.browser.index > 0) state.browser.index -= 1;
    if (action === "forward" && state.browser.index < state.browser.history.length - 1) state.browser.index += 1;
    if (action === "refresh") page.innerHTML = browserPage(address.value);
    if (action) loadCurrent();
  });
  loadCurrent();
}

function navigateBrowser(url) {
  const cleaned = url.trim().replace(/^https?:\/\//, "") || "frank.local/about";
  state.browser.history = state.browser.history.slice(0, state.browser.index + 1);
  state.browser.history.push(cleaned);
  state.browser.index = state.browser.history.length - 1;
}

function browserPage(url) {
  const route = url.toLowerCase().replace(/^https?:\/\//, "");
  if (route.includes("/projects")) return `<h2>Projects</h2>${projects.map((project) => `<p><strong>${project.name}</strong><br>${project.description}</p>`).join("")}`;
  if (route.includes("/skills")) return `<h2>Skills</h2>${skills.map((group) => `<p><strong>${group.category}</strong><br>${group.items.map((item) => item.name).join(", ")}</p>`).join("")}`;
  if (route.includes("/cyber")) return `<h2>Cyber Lab</h2><p>Educational cybersecurity simulations: network monitor, password checker, and encoding demos.</p>`;
  if (route.includes("/games")) return `<h2>Game Center</h2><p>Snake, Memory, Tic-Tac-Toe, Reaction Test, and Cyber Defender.</p>`;
  if (route.includes("/contact")) return `<h2>Contact</h2><p>Email: frank@example.com</p><p>Use the Contact app to prepare a validated message.</p>`;
  if (route.includes("/about") || route === "frank.local") return `<h2>About Frank</h2><p>Frank Banda is a Computer Science student, software developer, builder, and cybersecurity enthusiast.</p>`;
  return `<h2>Local page not found</h2><p>Try frank.local/about, /projects, /skills, /cyber, /games, or /contact.</p>`;
}

function initContact(appWindow) {
  const form = $("#contactForm", appWindow);
  const status = $("#contactMessageStatus", appWindow);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name")).trim();
    const email = String(data.get("email")).trim();
    const subject = String(data.get("subject")).trim();
    const message = String(data.get("message")).trim();
    if (!name || !email || !subject || !message) {
      status.textContent = "Please complete every field.";
      status.style.color = "var(--danger)";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = "Please enter a valid email address.";
      status.style.color = "var(--danger)";
      return;
    }
    status.textContent = "Message prepared successfully.";
    status.style.color = "var(--accent)";
    notify("Contact", "Message prepared successfully.");
    form.reset();
  });
}

function initSettings(appWindow) {
  if (!appWindow.dataset.settingsBound) {
    appWindow.addEventListener("click", (event) => {
      const button = event.target.closest("[data-setting] button");
      if (!button) return;
      const group = button.closest("[data-setting]");
      state.settings[group.dataset.setting] = button.dataset.value;
      saveSettings();
      applySettings();
      $(".window-content", appWindow).innerHTML = renderSettings();
      initSettings(appWindow);
    });
    appWindow.dataset.settingsBound = "true";
  }
  $("#animationsToggle", appWindow)?.addEventListener("change", (event) => {
    state.settings.animations = event.target.checked;
    saveSettings();
    applySettings();
  });
  $("#soundToggle", appWindow)?.addEventListener("change", (event) => {
    state.settings.sound = event.target.checked;
    saveSettings();
    applySettings();
    notify("Settings", `Interface sound ${state.settings.sound ? "on" : "off"}.`);
  });
}

function handleSearch(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return;
  const aliases = {
    project: "projects", projects: "projects", skill: "skills", skills: "skills", about: "about", me: "about", contact: "contact", cv: "resume", resume: "resume", school: "education", education: "education", journey: "experience", experience: "experience", terminal: "terminal", browser: "browser", settings: "settings", cyber: "cyber", "cyber lab": "cyber", games: "games", files: "files", notes: "notes", calculator: "calculator", music: "music", monitor: "monitor", achievements: "achievements"
  };
  const direct = apps.find((app) => app.name.toLowerCase().includes(normalized) || app.id === normalized);
  const appId = direct ? direct.id : aliases[normalized];
  if (appId) {
    openApp(appId);
    searchInput.value = "";
    notify("Search", `Opened ${apps.find((app) => app.id === appId).name}.`);
  } else notify("Search", "No matching Frank OS app found.");
}

function handleShortcuts(event) {
  if (event.key === "Escape") {
    if (!matrixMode.hidden) return stopMatrixMode();
    const active = [...state.windows.values()].sort((a, b) => Number(b.style.zIndex) - Number(a.style.zIndex))[0];
    if (active) handleWindowAction(active, "close");
  }
  if (event.ctrlKey && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.ctrlKey && event.altKey && event.key.toLowerCase() === "t") {
    event.preventDefault();
    openApp("terminal");
  }
  handleKonami(event.key);
}

let konami = [];
function handleKonami(key) {
  const code = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  konami.push(key);
  konami = konami.slice(-code.length);
  if (code.every((item, index) => item === konami[index])) {
    document.body.classList.add("konami");
    unlockAchievement("Matrix", "Unlocked the secret key sequence.");
    notify("Visual effect unlocked", "Konami sequence accepted.");
    setTimeout(() => document.body.classList.remove("konami"), 5000);
  }
}

function handlePower(action) {
  startMenu.hidden = true;
  if (action === "lock") lockScreen.classList.remove("unlocked");
  if (action === "restart") {
    notify("Restart Interface", "Refreshing Frank OS windows.");
    state.windows.forEach((win) => win.remove());
    state.windows.clear();
    setTimeout(() => openApp("about"), 400);
  }
  if (action === "off") {
    bootScreen.classList.remove("hidden");
    bootLog.innerHTML = "<li>Saving local interface state...</li><li>Fictional shutdown complete.</li>";
    bootProgress.style.width = "100%";
    setTimeout(() => bootScreen.classList.add("hidden"), 1800);
  }
}

function startMatrixMode() {
  matrixMode.hidden = false;
  unlockAchievement("Matrix", "Entered Matrix Mode.");
  const ctx = matrixCanvas.getContext("2d");
  const resize = () => {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
  };
  resize();
  const columns = Math.floor(matrixCanvas.width / 16);
  const drops = Array(columns).fill(1);
  clearInterval(state.matrixTimer);
  state.matrixTimer = setInterval(() => {
    ctx.fillStyle = "rgba(2, 8, 6, 0.18)";
    ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    ctx.fillStyle = "#29d3a1";
    ctx.font = "16px monospace";
    drops.forEach((y, index) => {
      const text = String.fromCharCode(0x30A0 + Math.random() * 96);
      ctx.fillText(text, index * 16, y * 16);
      if (y * 16 > matrixCanvas.height && Math.random() > 0.975) drops[index] = 0;
      drops[index] += 1;
    });
  }, 42);
}

function stopMatrixMode() {
  matrixMode.hidden = true;
  clearInterval(state.matrixTimer);
}

function updateClock() {
  const now = new Date();
  clockDisplay.textContent = new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit", hour12: state.settings.clockFormat === "12" }).format(now);
  clockDisplay.title = now.toDateString();
}

function updateLockDate() {
  const now = new Date();
  lockDate.innerHTML = `${new Intl.DateTimeFormat([], { weekday: "long" }).format(now)}<br>${new Intl.DateTimeFormat([], { day: "2-digit", month: "long", year: "numeric" }).format(now)}`;
}

function notify(title, message) {
  const item = document.createElement("div");
  item.className = "notification";
  item.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
  notifications.appendChild(item);
  playTone(700);
  setTimeout(() => {
    item.style.opacity = "0";
    item.style.transform = "translateY(10px)";
    setTimeout(() => item.remove(), 200);
  }, 3200);
}

function unlockAchievement(name, message) {
  if (state.achievements[name]) return;
  state.achievements[name] = message;
  store.set("frank-os-achievements", state.achievements);
  notify("Achievement unlocked:", name);
}

function playTone(frequency = 520) {
  if (!state.settings.sound) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.025, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.08);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.08);
  } catch (error) {
    state.settings.sound = false;
  }
}

function saveSettings() {
  store.set("frank-os-settings", state.settings);
}

function applySettings() {
  document.body.classList.toggle("light-mode", state.settings.theme === "light");
  document.body.classList.toggle("cyber-theme", state.settings.theme === "cyber");
  document.body.classList.toggle("no-animations", !state.settings.animations);
  osShell.className = `os-shell wallpaper-${state.settings.wallpaper}`;
  updateClock();
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function isMobile() {
  return window.matchMedia("(max-width: 820px)").matches;
}

function unique(value, index, array) {
  return array.indexOf(value) === index;
}
