(() => {
    const storageKey = "gameArena.pageTransition";
    const lastPageKey = "gameArena.lastPage";
    const desktopDuration = 560;
    const mobileDuration = 480;
    const pageOrder = {
        "login.html": -1,
        "register.html": -1,
        "index.html": 0,
        "live.html": 1,
        "leaderboard.html": 2,
        "search-events.html": 3,
        "tournament-details.html": 3.5,
        "profile.html": 4,
        "activities.html": 5
    };

    function pageName(path) {
        const segments = path.split("/").filter(Boolean);
        if (!segments.length) return "index.html";
        try {
            return decodeURIComponent(segments[segments.length - 1]).toLowerCase();
        } catch {
            return segments[segments.length - 1].toLowerCase();
        }
    }

    function directionBetween(from, to) {
        const fromOrder = pageOrder[from] ?? 0;
        const toOrder = pageOrder[to] ?? fromOrder + 1;
        return toOrder < fromOrder ? "backward" : "forward";
    }

    function transitionDuration() {
        return window.matchMedia?.("(max-width: 700px)").matches ? mobileDuration : desktopDuration;
    }

    function clearEnterClass() {
        document.documentElement.classList.remove("page-enter-forward", "page-enter-backward");
    }

    function animateIncoming(direction) {
        const root = document.documentElement;
        clearEnterClass();
        void root.offsetWidth;
        root.classList.add(`page-enter-${direction}`);
        window.setTimeout(clearEnterClass, transitionDuration() + 80);
    }

    function takePendingTransition() {
        let pending;
        try {
            pending = JSON.parse(sessionStorage.getItem(storageKey) || "null");
            sessionStorage.removeItem(storageKey);
        } catch {
            return false;
        }
        if (!pending || pending.to !== pageName(location.pathname) || Date.now() - pending.createdAt > 15000) return false;
        animateIncoming(pending.direction);
        return true;
    }

    function navigationType() {
        return performance.getEntriesByType?.("navigation")?.[0]?.type || "navigate";
    }

    function animateFromHistory() {
        let previousPage;
        try {
            previousPage = sessionStorage.getItem(lastPageKey);
        } catch {
            return;
        }
        if (!previousPage || previousPage === pageName(location.pathname)) return;
        animateIncoming(directionBetween(previousPage, pageName(location.pathname)));
    }

    const isTopDocument = window.top === window;
    const hasPending = isTopDocument ? takePendingTransition() : false;

    if (isTopDocument && !hasPending && navigationType() === "back_forward") animateFromHistory();

    if (isTopDocument) {
        window.addEventListener("pagehide", () => {
            try {
                sessionStorage.setItem(lastPageKey, pageName(location.pathname));
            } catch {
                // Navigation still works if session storage is unavailable.
            }
        });

        window.addEventListener("pageshow", (event) => {
            if (event.persisted) animateFromHistory();
        });

        window.addEventListener("message", (event) => {
            const frame = document.querySelector("iframe.home-underlay");
            if (!frame || event.source !== frame.contentWindow || !document.body.classList.contains("auth-home-active")) return;
            if (event.data?.type !== "gamearena:navigate") return;

            let destination;
            try {
                destination = new URL(event.data.href, location.href);
            } catch {
                return;
            }
            if (destination.origin !== location.origin || isLeaving) return;
            beginNavigation(destination.href, "index.html", true);
        });
    }

    let isLeaving = false;

    function beginNavigation(href, fromPage, fromHomeFrame = false) {
        if (isLeaving) return;
        let destination;
        try {
            destination = new URL(href, location.href);
        } catch {
            return;
        }
        if (destination.origin !== location.origin) return;

        const toPage = pageName(destination.pathname);
        const currentPage = fromPage || pageName(location.pathname);
        if (!fromHomeFrame && destination.pathname === location.pathname && destination.search === location.search) return;

        const direction = directionBetween(currentPage, toPage);
        const transition = {
            from: currentPage,
            to: toPage,
            direction,
            createdAt: Date.now()
        };
        try {
            sessionStorage.setItem(storageKey, JSON.stringify(transition));
        } catch {
            // Directional transitions are progressive enhancement; continue navigation either way.
        }

        isLeaving = true;
        const root = document.documentElement;
        root.classList.add(fromHomeFrame ? `page-home-leave-${direction}` : `page-leave-${direction}`);
        const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        window.setTimeout(() => location.assign(destination.href), reducedMotion ? 0 : transitionDuration());
    }

    document.addEventListener("click", (event) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const anchor = event.target.closest?.("a[href]");
        if (!anchor || anchor.hasAttribute("download")) return;

        let destination;
        try {
            destination = new URL(anchor.href, location.href);
        } catch {
            return;
        }
        if (!["http:", "https:", "file:"].includes(destination.protocol)) return;
        if (destination.origin !== location.origin) return;
        if (destination.pathname === location.pathname && destination.search === location.search && destination.hash) return;

        const target = (anchor.target || document.querySelector("base[target]")?.target || "_self").toLowerCase();
        if (target !== "_self" && target !== "_top") return;

        if (!isTopDocument && target === "_top") {
            let isAuthHomeFrame = false;
            try {
                isAuthHomeFrame = window.frameElement?.classList.contains("home-underlay") && window.parent.document.body.classList.contains("auth-home-active");
            } catch {
                return;
            }
            if (!isAuthHomeFrame) return;
            event.preventDefault();
            window.parent.postMessage({ type: "gamearena:navigate", href: destination.href }, "*");
            return;
        }

        if (!isTopDocument || target !== "_self") return;
        event.preventDefault();
        beginNavigation(destination.href);
    });
})();
