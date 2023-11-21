import { serverSupabaseClient } from "#supabase/server"

const ensureAvailableUsername = async (username) => {

    // use the PUT /users/check endpoint to fetch data that we need to know in order to validate user creation
    const { usernameAvailable } = await $fetch("/api/users/check", { method: "put", body: { username: username } });

    return usernameAvailable; // should return a true or false value

}

export default defineEventHandler(
    async (event) => {

        // Init the supa!
        const supa = await serverSupabaseClient(event);

        const body = await readBody(event);

        // Ensure that the username is available
        const validateUsername = await ensureAvailableUsername(body.username);
        if (!validateUsername)
        {
            return createError({
                statusCode: 400,
                statusMessage: "Username already taken"
            })
        }

        // Sign the user up for the service
        const {data : authUserData, error : authUserErr} = await supa.auth.signUp(
            {
                email: body.email,
                password: body.password
            }
        );

        if(authUserErr)
        {
            return createError({
                statusCode: 400,
                statusMessage: authUserErr.message
            })
        }

        const { error : profileCreationError } = await supa.from('profiles')
            .insert({ id : authUserData.user.id, username : body.username });

    }
)