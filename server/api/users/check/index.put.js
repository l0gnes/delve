import { serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(
    async (event) => {

        // init the supa
        const supa = await serverSupabaseClient(event);

        // read the body and get the username the user plans to use
        const body = await readBody(event);
        const usernameToCheck = body.username;

        // check for username
        const { data: usernames } = await supa.from('profiles')
            .select('username')
            .eq('username', usernameToCheck)
            .maybeSingle();

        // check to see if the username is available
        return {
            usernameAvailable : !usernames
        };

    }
)