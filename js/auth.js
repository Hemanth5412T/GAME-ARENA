(() => {
    const page = document.body;
    const forms = [...document.querySelectorAll(".auth-form")];
    const heading = document.querySelector("#auth-heading");
    const emblem = document.querySelector(".auth-brand img");
    const homeFrame = document.querySelector(".home-underlay");
    const duration = 800;
    const homeRevealDuration = 1050;

    if (!page.classList.contains("au") || forms.length !== 2 || !heading || !emblem || !homeFrame) return;

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
    let successDelayTimer;
    let registrationInProgress = false;
    let registrationSubmitButton;
    let registrationSuccess;
    let registrationSuccessCopy;
    let loginProcessing = false;
    let loginAckTimer;
    let homeRevealTimer;
    let homeReady = false;

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

    function switchMode(nextMode, isRegistrationAutoSwitch = false) {
        if (transitioning || loginProcessing || nextMode === mode || (registrationInProgress && !isRegistrationAutoSwitch)) return false;

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
            if (isRegistrationAutoSwitch) {
                registrationInProgress = false;
                registrationSubmitButton.disabled = false;
                registrationSuccess.classList.remove("is-visible");
                registrationSuccessCopy.textContent = "";
            }
        }, duration);
        return true;
    }

    render(mode);
    patternTimer = window.setTimeout(() => page.classList.add("pattern-visible"), 80);

    function prepareHomeFrame() {
        homeReady = true;
        try {
            const frameDocument = homeFrame.contentDocument;
            if (frameDocument?.head && !frameDocument.querySelector("base[data-auth-home-target]")) {
                const base = frameDocument.createElement("base");
                base.target = "_top";
                base.dataset.authHomeTarget = "true";
                frameDocument.head.prepend(base);
            }
        } catch {
            // The frame still displays the Home page; this only preserves top-level link navigation.
        }
    }

    try {
        if (homeFrame.dataset.ready === "true" || homeFrame.contentDocument?.readyState === "complete") prepareHomeFrame();
    } catch {
        // The load event below is sufficient when local-file origins are isolated by the browser.
    }
    homeFrame.addEventListener("load", prepareHomeFrame);

    function revealHome() {
        if (!homeReady) {
            homeFrame.addEventListener("load", revealHome, { once: true });
            return;
        }
        page.classList.remove("pattern-visible");
        page.classList.add("auth-home-reveal");
        window.clearTimeout(homeRevealTimer);
        homeRevealTimer = window.setTimeout(() => {
            page.classList.add("auth-home-active");
            homeFrame.removeAttribute("aria-hidden");
            homeFrame.removeAttribute("tabindex");
            try {
                window.history.replaceState({ gameArenaHome: true }, "", "index.html");
            } catch {
                // file:// contexts may not permit changing the top-level URL with History API.
            }
            document.querySelectorAll(".login-success").forEach((feedback) => feedback.classList.remove("is-visible"));
            loginProcessing = false;
        }, homeRevealDuration);
    }

    document.querySelectorAll('form[data-form="login"]').forEach((form) => {
        const identifier = form.querySelector('[name="username"]');
        const password = form.querySelector('[name="password"]');
        const submitButton = form.querySelector('button[type="submit"]');
        const feedback = form.querySelector(".login-success");
        const idError = form.querySelector("#login-identifier-error");
        const passwordError = form.querySelector("#login-password-error");

        function showFieldError(input, errorElement, message) {
            input.closest(".fld").classList.toggle("has-error", Boolean(message));
            input.setAttribute("aria-invalid", String(Boolean(message)));
            errorElement.textContent = message;
        }

        [identifier, password].forEach((input) => {
            input.addEventListener("input", () => {
                if (loginProcessing) return;
                feedback.classList.remove("is-visible");
                showFieldError(input, input === identifier ? idError : passwordError, "");
            });
        });

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            if (loginProcessing) return;

            feedback.classList.remove("is-visible");
            identifier.value = identifier.value.trim();
            const accountKnown = ["demo@gamearena.gg", "shadowkira"].includes(identifier.value.toLowerCase());
            const idMessage = !identifier.value
                ? "Enter your email or username."
                : !accountKnown
                    ? "No demo account matches this email or username."
                    : "";
            const passwordMessage = !password.value
                ? "Enter your password."
                : accountKnown && password.value !== "Arena@2026"
                    ? "The password does not match the demo account."
                    : "";

            showFieldError(identifier, idError, idMessage);
            showFieldError(password, passwordError, passwordMessage);
            if (idMessage || passwordMessage) {
                (idMessage ? identifier : password).focus();
                return;
            }

            if (!window.GameArenaData?.setCurrentUser({ id: "demo@gamearena.gg", username: "ShadowKira" })) {
                showFieldError(identifier, idError, "Could not save the demo login in this browser. Enable local storage and try again.");
                identifier.focus();
                return;
            }

            loginProcessing = true;
            submitButton.disabled = true;
            feedback.classList.add("is-visible");
            window.clearTimeout(loginAckTimer);
            loginAckTimer = window.setTimeout(revealHome, 300);
        });
    });

    document.querySelectorAll("[data-switch]").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            switchMode(link.dataset.switch);
        });
    });

    document.querySelectorAll("[data-password-toggle]").forEach((button) => {
        button.addEventListener("click", () => {
            const input = document.getElementById(button.getAttribute("aria-controls"));
            if (!input) return;
            const showPassword = input.type === "password";
            input.type = showPassword ? "text" : "password";
            button.setAttribute("aria-pressed", String(showPassword));
            button.setAttribute("aria-label", showPassword ? "Hide password" : "Show password");
        });
    });

    const emailSyntax = /^[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,}$/i;
    const commonProviderTypos = new Set(["googl.com", "gmial.com", "gmai.com", "outlok.com", "yaho.com"]);

    document.querySelectorAll('form[data-form="register"]').forEach((form) => {
        const username = form.querySelector('[name="username"]');
        const email = form.querySelector('[name="email"]');
        const password = form.querySelector('[name="password"]');
        const confirmation = form.querySelector('[name="confirm-password"]');
        const game = form.querySelector('[name="game"]');
        const terms = form.querySelector('[name="terms"]');
        const success = form.querySelector(".form-success");
        const successCopy = form.querySelector("[data-success-copy]");
        const submitButton = form.querySelector('button[type="submit"]');
        let attempted = false;

        registrationSubmitButton = submitButton;
        registrationSuccess = success;
        registrationSuccessCopy = successCopy;

        const controls = {
            username: { input: username, error: "reg-username-error", wrapper: ".fld" },
            email: { input: email, error: "reg-email-error", wrapper: ".fld" },
            password: { input: password, error: "reg-password-error", wrapper: ".fld" },
            confirmation: { input: confirmation, error: "reg-confirm-password-error", wrapper: ".fld" },
            game: { input: game, error: "reg-game-error", wrapper: ".fld" },
            terms: { input: terms, error: "reg-terms-error", wrapper: ".terms-field" }
        };

        function setError(key, message) {
            const field = controls[key];
            const wrapper = field.input.closest(field.wrapper);
            const error = form.querySelector(`#${field.error}`);
            wrapper.classList.toggle("has-error", Boolean(message));
            field.input.setAttribute("aria-invalid", String(Boolean(message)));
            error.textContent = message;
        }

        function validate(key) {
            let message = "";
            switch (key) {
                case "username": {
                    username.value = username.value.trim();
                    if (!username.value) message = "Enter a username.";
                    else if ([...username.value].length < 3) message = "Username must be at least 3 characters.";
                    break;
                }
                case "email":
                    if (!email.value.trim()) message = "Enter your email address.";
                    else if (!emailSyntax.test(email.value)) message = "Enter a valid email address with a complete domain and TLD.";
                    else if (commonProviderTypos.has(email.value.slice(email.value.lastIndexOf("@") + 1).toLowerCase())) message = "Check the spelling of this email provider domain.";
                    break;
                case "password":
                    if (!password.value) message = "Enter a password.";
                    else if (password.value.length < 8) message = "Password must be at least 8 characters.";
                    else if (!/[A-Z]/.test(password.value)) message = "Add at least one uppercase letter.";
                    else if (!/[a-z]/.test(password.value)) message = "Add at least one lowercase letter.";
                    else if (!/[0-9]/.test(password.value)) message = "Add at least one number.";
                    break;
                case "confirmation":
                    if (!confirmation.value) message = "Confirm your password.";
                    else if (confirmation.value !== password.value) message = "Passwords do not match.";
                    break;
                case "game":
                    if (!game.value) message = "Choose a preferred game.";
                    break;
                case "terms":
                    if (!terms.checked) message = "Accept the terms and conditions to continue.";
                    break;
            }
            setError(key, message);
            return !message;
        }

        function validateConfirmationWhenRelevant() {
            if (attempted || password.value || confirmation.value || controls.confirmation.input.closest(".fld").classList.contains("has-error")) {
                validate("confirmation");
            }
        }

        [username, email, password, confirmation].forEach((input) => {
            input.addEventListener("input", () => {
                if (registrationInProgress) return;
                success.classList.remove("is-visible");
                const key = input === username ? "username" : input === email ? "email" : input === password ? "password" : "confirmation";
                if (attempted || input.closest(".fld").classList.contains("has-error")) validate(key);
                if (input === password || input === confirmation) validateConfirmationWhenRelevant();
            });
            input.addEventListener("blur", () => {
                if (registrationInProgress) return;
                if (input === username) username.value = username.value.trim();
                if (attempted || input === email && email.value || input.closest(".fld").classList.contains("has-error")) {
                    validate(input === username ? "username" : input === email ? "email" : input === password ? "password" : "confirmation");
                }
                if (input === password || input === confirmation) validateConfirmationWhenRelevant();
            });
        });

        game.addEventListener("change", () => {
            if (registrationInProgress) return;
            success.classList.remove("is-visible");
            if (attempted || game.closest(".fld").classList.contains("has-error")) validate("game");
        });
        terms.addEventListener("change", () => {
            if (registrationInProgress) return;
            success.classList.remove("is-visible");
            if (attempted || terms.closest(".terms-field").classList.contains("has-error")) validate("terms");
        });

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            if (registrationInProgress) return;
            attempted = true;
            success.classList.remove("is-visible");
            username.value = username.value.trim();
            const valid = Object.keys(controls).map(validate).every(Boolean);
            if (!valid) {
                const firstInvalid = Object.values(controls).find(({ input }) => input.getAttribute("aria-invalid") === "true");
                firstInvalid?.input.focus();
                return;
            }
            registrationInProgress = true;
            submitButton.disabled = true;
            successCopy.textContent = "Account created successfully! You can now log in to GAME ARENA.";
            success.classList.add("is-visible");
            window.clearTimeout(successDelayTimer);
            successDelayTimer = window.setTimeout(() => switchMode("login", true), 600);
        });
    });
})();
