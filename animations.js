/* =====================================
   SUGO KNOTS - SUBTLE PREMIUM ANIMATIONS
   Shared JavaScript
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    const elements = document.querySelectorAll(`
        .catalog-header,
        .stats,
        .stat-box,
        .catalog-tools,
        .card,
        .gallery figure,
        .contact-container,
        .order-section,
        footer
    `);

    elements.forEach((element, index) => {

        element.classList.add("sugo-reveal");

        element.setAttribute(
            "data-sugo-delay",
            Math.min(index % 4, 3)
        );
    });

    if (!("IntersectionObserver" in window)) {

        document
            .querySelectorAll(".sugo-reveal")
            .forEach(el => el.classList.add("sugo-visible"));

        return;
    }

    const observer = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "sugo-visible"
                    );

                    observer.unobserve(
                        entry.target
                    );
                }
            });

        },

        {
            threshold: 0.10,
            rootMargin: "0px 0px -20px 0px"
        }

    );

    document
        .querySelectorAll(".sugo-reveal")
        .forEach(element => {
            observer.observe(element);
        });

});
