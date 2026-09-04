import { checkAuth } from "./main.js"; 

export function logout() {
    localStorage.removeItem("token");
    
    checkAuth(); 
}