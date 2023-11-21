import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(
    async (event) => {

        const user = await serverSupabaseUser(event);
        const supa = await serverSupabaseClient(event);

        // ensure that the user is logged in
        if(!user)
        {
            return createError({
                statusCode: 401,
                statusMessage: "You are not logged in!"
            })
        }

        // get user data
        const { data : profileData, error : profileFetchError} = await supa.from('profiles')
            .select("*, badges : user_badges ( *, meta : badges ( * ) ), memberships : community_members ( communities ( * ) )")
            .eq('id', user.id)
            .maybeSingle();

        // return that user data
        return profileData;

    }
)