const URL = "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql";

export async function login(data) {
    try {
        const credentials = `${data.identifier}:${data.password}`;
        const utf8Credentials = unescape(encodeURIComponent(credentials));
        const response = await fetch(
            "https://learn.zone01oujda.ma/api/auth/signin",
            {
                method: "POST",
                headers: {
                    Authorization:
                        'Basic ' + btoa(utf8Credentials),
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
        return { status: 500, token: null };
    }
}

// Verification asynchrone m3a l-server bach n-t2kdo wach l-token valid bssih
export async function isAuthenticated() {
    const token = localStorage.getItem("token");
    if (!token) {
        return false;
    }

    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                query: `{
                    user {
                        id
                        login
                    }
                }`
            }),
        });

        const result = await response.json();
        
        // Ila kan response ok w kayn data d user, ra l-token valid
        if (response.ok && result.data && result.data.user && result.data.user.length > 0) {
            return true;
        } else {
            // Ila kan invalid wla expired, n-ms7oh mn localStorage
            localStorage.removeItem("token");
            return false;
        }
    } catch (error) {
        console.error("Error validating token:", error);
        return false;
    }
}