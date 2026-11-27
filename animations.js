/* =====================================
   SUGO KNOTS - SUBTLE PREMIUM ANIMATIONS
   Shared JavaScript
===================================== */

(() => {
    const REVEAL_SELECTORS = [
        ".catalog-header",
        ".stats",
        ".stat-box",
        ".catalog-tools",
        ".card",
        ".gallery figure",
        ".contact-container",
        ".order-section",
        "footer"
    ].join(", ");

    const prefersReducedMotion = () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function initSugoAnimations() {
        if (prefersReducedMotion()) return;

        const supportsObserver = "IntersectionObserver" in window;

        const observer = supportsObserver
            ? new IntersectionObserver(
                  (entries, obs) => {
                      entries.forEach((entry) => {
                          if (!entry.isIntersecting) return;
                          entry.target.classList.add("sugo-visible");
                          obs.unobserve(entry.target);
                      });
                  },
                  {
                      threshold: 0.05,
                      rootMargin: "0px 0px -12px 0px"
                  }
              )
            : null;

        // Track sibling index per parent container so stagger delays reset cleanly per grid/section
        const parentCounters = new WeakMap();

        const registerElements = (root = document) => {
            const candidates = root.matches?.(REVEAL_SELECTORS)
                ? [root, ...root.querySelectorAll(REVEAL_SELECTORS)]
                : [...root.querySelectorAll(REVEAL_SELECTORS)];

            candidates.forEach((el) => {
                // Skip already initialized elements
                if (el.dataset.sugoInitialized) return;
                el.dataset.sugoInitialized = "true";

                const parent = el.parentElement || document.body;
                const siblingIndex = parentCounters.get(parent) || 0;
                parentCounters.set(parent, siblingIndex + 1);

                el.classList.add("sugo-reveal");
                el.setAttribute("data-sugo-delay", String(Math.min(siblingIndex % 4, 3)));

                if (!observer) {
                    el.classList.add("sugo-visible");
                    return;
                }

                // Immediately reveal above-the-fold elements on next paint
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
                    requestAnimationFrame(() => el.classList.add("sugo-visible"));
                } else {
                    observer.observe(el);
                }
            });
        };

        // Initial scan
        registerElements();

        // Watch for dynamically injected cards (e.g., search/category filters or async catalog loads)
        if (observer && "MutationObserver" in window) {
            const mutationObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            registerElements(node);
                        }
                    });
                });
            });

            mutationObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSugoAnimations, { once: true });
    } else {
        initSugoAnimations();
    }
})();
