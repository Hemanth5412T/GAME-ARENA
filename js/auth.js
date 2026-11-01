(() => {
    const page = document.body;
    const forms = [...document.querySelectorAll(".auth-form")];
    const heading = document.querySelector("#auth-heading");
    const emblem = document.querySelector(".auth-brand img");
    const duration = 800;

    if (!page.classList.contains("au") || forms.length !== 2 || !heading || !emblem) return;

    const path = window.location.pathname.toLowerCase();
    const entryMode = path.endsWith("login.html")
        ? "login"
        : path.endsWith("register.html")
            ? "register"
            : page.dataset.mode;
    let mode = entryMode === "login" ? "login" : "register";
    let transitioning = false;
    let unlockTimer;
    let patternTimer;
    let rotationTimer;

    const headingCopy = {
        login: "Back in the arena.",
        register: "Your squad is waiting."
    };

    function render(nextMode) {
        mode = nextMode;
        page.dataset.mode = mode;
        heading.textContent = headingCopy[mode];

        forms.forEach((form) => {
            const active = form.dataset.form === mode;
            form.classList.toggle("is-active", active);
            form.setAttribute("aria-hidden", String(!active));
            form.inert = !active;
        });
    }

    render(mode);
    patternTimer = window.setTimeout(() => page.classList.add("pattern-visible"), 80);

    document.querySelectorAll("[data-switch]").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const nextMode = link.dataset.switch;
            if (transitioning || nextMode === mode) return;

            transitioning = true;
            page.dataset.transitioning = "true";
            page.classList.remove("pattern-visible");
            window.clearTimeout(patternTimer);
            page.classList.remove("spin-clockwise", "spin-counterclockwise");
            void emblem.offsetWidth;
            page.classList.add(nextMode === "login" ? "spin-counterclockwise" : "spin-clockwise");
            render(nextMode);
            window.clearTimeout(unlockTimer);
            window.clearTimeout(rotationTimer);
            rotationTimer = window.setTimeout(() => {
                page.classList.remove("spin-clockwise", "spin-counterclockwise");
            }, duration);
            unlockTimer = window.setTimeout(() => {
                transitioning = false;
                delete page.dataset.transitioning;
                page.classList.add("pattern-visible");
            }, duration);
        });
    });
})();
