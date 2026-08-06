
import { graphqlRequest } from "./api.js";


async function renderProfile() {

    const data = await graphqlRequest(`

            {
            user{
                id
                login
            }
            }
        `)
        console.log(data);
}

renderProfile();