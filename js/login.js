import { login } from "./auth.js";
import { checkAuth } from "./main.js"; 

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
            
            checkAuth(); 

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
