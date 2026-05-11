const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

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
