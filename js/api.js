const URL = "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql";

export async function graphqlRequest(query) {

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },

            body: JSON.stringify({
                query,
            }),
        });
        return await response.json();
    } catch (error) {

        console.error(error);

    }

}