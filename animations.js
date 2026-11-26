
/* =====================================
   SUGO KNOTS - ELEGANT ANIMATIONS
   Shared JavaScript
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    // Respect accessibility settings
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // Elements that should appear while scrolling
    const revealSelectors = [
        "main",
        "section",
        ".contact-container",
        ".order-section",
        ".product-card",
        ".product",
        ".gallery-item",
        ".gallery",
        "footer"
    ];

    const elements = document.querySelectorAll(
        revealSelectors.join(",")
    );

    // Avoid adding reveal to nested elements twice
    const filteredElements = Array.from(elements).filter(element => {
        return !Array.from(element.parentElement?.closest(
            ".sugo-reveal"
        ) ? [element] : []).length;
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
        return;
    }

    filteredElements.forEach((element, index) => {

        element.classList.add("sugo-reveal");

        // Add a subtle stagger to nearby cards
        const delay = (index % 5);
        element.dataset.sugoDelay = delay;

    });

    const observer = new IntersectionObserver(
        function (entries, observer) {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("sugo-visible");

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    document.querySelectorAll(".sugo-reveal").forEach(element => {
        observer.observe(element);
    });

});
