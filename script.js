const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");
const siteHeader = document.querySelector(".site-header");
const themeToggle = document.querySelector(".theme-toggle");
const themeStorageKey = "moon-notes-theme";
const headerDockThreshold = 92;

function getStoredTheme() {
  try {
    return localStorage.getItem(themeStorageKey);
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Some private browsing modes block localStorage.
  }
}

function getPreferredTheme() {
  const storedTheme = getStoredTheme();

  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;

  const isDark = theme === "dark";
  themeToggle?.setAttribute("aria-label", isDark ? "切换浅色主题" : "切换深色主题");
  themeToggle?.setAttribute("title", isDark ? "切换浅色主题" : "切换深色主题");
}

function withThemeTransition(callback) {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    callback();
    return;
  }

  document.documentElement.classList.add("theme-switching");
  document.documentElement.offsetHeight;
  callback();

  window.clearTimeout(withThemeTransition.timeoutId);
  withThemeTransition.timeoutId = window.setTimeout(() => {
    document.documentElement.classList.remove("theme-switching");
  }, 520);
}

applyTheme(getPreferredTheme());

let headerTicking = false;

function updateHeaderDocking() {
  if (!siteHeader) return;

  siteHeader.classList.toggle("is-docked", window.scrollY > headerDockThreshold);
}

updateHeaderDocking();

window.addEventListener(
  "scroll",
  () => {
    if (headerTicking) return;

    headerTicking = true;
    window.requestAnimationFrame(() => {
      updateHeaderDocking();
      headerTicking = false;
    });
  },
  { passive: true },
);

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "关闭导航" : "打开导航");
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "打开导航");
    }
  });
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  withThemeTransition(() => {
    applyTheme(nextTheme);
    storeTheme(nextTheme);
  });
});

const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const postCards = Array.from(document.querySelectorAll(".post-card"));
const searchInput = document.querySelector("#post-search");
const emptyState = document.querySelector("#empty-state");

let activeFilter = "all";

function normalizeText(value) {
  return value.trim().toLowerCase();
}

function matchesPost(card, query) {
  const tags = card.dataset.tags || "";
  const title = card.dataset.title || "";
  const excerpt = card.dataset.excerpt || "";
  const searchableText = normalizeText(`${tags} ${title} ${excerpt}`);
  const matchesFilter = activeFilter === "all" || tags.includes(activeFilter);
  const matchesSearch = !query || searchableText.includes(query);
  return matchesFilter && matchesSearch;
}

function renderPosts() {
  if (!postCards.length) return;

  const query = normalizeText(searchInput?.value || "");
  let visibleCount = 0;

  postCards.forEach((card) => {
    const isVisible = matchesPost(card, query);
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  if (emptyState) {
    emptyState.hidden = visibleCount > 0;
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter || "all";

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    renderPosts();
  });
});

searchInput?.addEventListener("input", renderPosts);
