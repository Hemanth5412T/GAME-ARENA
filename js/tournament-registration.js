(() => {
    const button = document.querySelector("#register-tournament");
    const feedback = document.querySelector("#registration-feedback");
    const data = window.GameArenaData;
    if (!button || !feedback || !data) return;

    function showMessage(message, type = "") {
        feedback.className = `registration-feedback${type ? ` ${type}` : ""}`;
        feedback.textContent = message;
    }

    function updateButton() {
        const user = data.getCurrentUser();
        if (!user) return;
        const registrations = data.getRegistrationsForUser(user.id);
        if (registrations.some((registration) => registration.tournamentId === button.dataset.tournamentId)) {
            button.textContent = "Already registered";
            button.disabled = true;
            showMessage("This account is already registered for this tournament.");
        }
    }

    button.addEventListener("click", (event) => {
        event.preventDefault();
        const user = data.getCurrentUser();
        if (!user) {
            feedback.className = "registration-feedback registration-feedback-error";
            feedback.replaceChildren(document.createTextNode("Log in to register for this tournament. "));
            const loginLink = document.createElement("a");
            loginLink.href = "login.html";
            loginLink.textContent = "Log in";
            feedback.append(loginLink);
            return;
        }

        const result = data.registerTournament({
            id: button.dataset.tournamentId,
            name: button.dataset.tournamentName,
            game: button.dataset.tournamentGame,
            start: button.dataset.tournamentStart,
            end: button.dataset.tournamentEnd,
            entryFee: button.dataset.entryFee,
            status: "Upcoming",
            detailsUrl: button.dataset.detailsUrl
        });

        if (result.ok) {
            button.textContent = "Already registered";
            button.disabled = true;
            showMessage("Registration successful. ");
            const activitiesLink = document.createElement("a");
            activitiesLink.href = "activities.html";
            activitiesLink.textContent = "View activities";
            feedback.append(activitiesLink);
        } else if (result.reason === "duplicate") {
            updateButton();
        } else if (result.reason === "login-required") {
            feedback.className = "registration-feedback registration-feedback-error";
            feedback.replaceChildren(document.createTextNode("Log in to register for this tournament. "));
            const loginLink = document.createElement("a");
            loginLink.href = "login.html";
            loginLink.textContent = "Log in";
            feedback.append(loginLink);
        } else {
            showMessage("Registration could not be saved in this browser. Enable local storage and try again.", "registration-feedback-error");
        }
    });

    updateButton();
})();
