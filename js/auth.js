export async function login(data) {
    try {
        const response = await fetch(
            "https://learn.zone01oujda.ma/api/auth/signin",
            {
                method: "POST",
                headers: {
                    Authorization:
                        "Basic " + btoa(`${data.identifier}:${data.password}`),
                },
            }
        );

        const token = await response.json();
        
        return {
            status: response.status,
            token,
        };

    } catch (error) {
        console.error("Error trying to login:", error);
    }
}

export function isAuthenticated() {

    return localStorage.getItem("token") !== null;

}