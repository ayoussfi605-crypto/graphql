import { login } from "./auth.js";

export function renderLogin() {
    const form = document.getElementById("login-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            identifier: document.getElementById("identifier").value.trim(),
            password: document.getElementById("password").value,
        };

        const result = await login(data);

        if (result.status === 200) {
            localStorage.setItem("token", result.token);

            console.log("Login successful");
            console.log("locl",localStorage.getItem("token"));
            window.location.href = "profile.html";

        } else {
            const errBox = document.getElementById("error-message");

            errBox.textContent = "Invalid credentials";

            setTimeout(() => {
                errBox.textContent = "";
            }, 2000);
        }
    });
}

renderLogin();
//