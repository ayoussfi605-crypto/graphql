import { isAuthenticated } from "./auth.js";
import { renderLogin } from "./login.js";
import { renderProfile } from "./profile.js";

export function showPage(pageId) {
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("profile-section").classList.add("hidden");
    
    document.getElementById(pageId).classList.remove("hidden");
}

export function checkAuth() {
    if (isAuthenticated()) {
        showPage("profile-section");
        renderProfile(); 
    } else {
        showPage("login-section");
    }
}

checkAuth();
renderLogin(); 