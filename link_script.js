(() => {
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    );
    const glyphs = "ABEFGIJLMNPQRSTUWYZ01234789#%*+-?@$&ΓΔΘΛΞΣΦΨ";
    const MIN_DURATION_MS = 400;
    const MAX_DURATION_MS = 800;
    const MS_PER_CHARACTER = 50;
    const animations = new WeakMap();

    document.querySelectorAll("a").forEach((link) => {
        const original = link.textContent;
        if (!original.trim()) return;

        link.setAttribute("aria-label", original);

        const scramble = () => {
            if (reduceMotion.matches || animations.has(link))
                return;

            const animation = { frame: 0 };
            const duration = Math.min(
                MAX_DURATION_MS,
                Math.max(
                    MIN_DURATION_MS,
                    original.length * MS_PER_CHARACTER,
                ),
            );
            const startedAt = performance.now();
            animations.set(link, animation);

            const render = (now) => {
                if (animations.get(link) !== animation) return;

                const progress = Math.min(
                    1,
                    (now - startedAt) / duration,
                );
                const settledCharacters = Math.floor(
                    progress * original.length,
                );
                link.textContent = [...original]
                    .map((character, index) => {
                        if (
                            index < settledCharacters ||
                            !/[a-z0-9]/i.test(character)
                        ) {
                            return character;
                        }
                        return glyphs[
                            Math.floor(
                                Math.random() * glyphs.length,
                            )
                        ];
                    })
                    .join("");

                if (progress < 1) {
                    animation.frame = requestAnimationFrame(render);
                } else {
                    link.textContent = original;
                    animations.delete(link);
                }
            };

            animation.frame = requestAnimationFrame(render);
        };

        const restore = () => {
            if (link.matches(":hover, :focus")) return;
            const animation = animations.get(link);
            if (!animation) return;
            cancelAnimationFrame(animation.frame);
            link.textContent = original;
            animations.delete(link);
        };

        link.addEventListener("pointerenter", scramble);
        link.addEventListener("pointerleave", restore);
        link.addEventListener("focus", scramble);
        link.addEventListener("blur", restore);
    });
})();
