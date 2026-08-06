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
            console.log(localStorage.getItem("token"));
        } else {
            console.log("Invalid credentials");
        }
    });
}

renderLogin();