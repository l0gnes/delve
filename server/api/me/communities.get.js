import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(
    async (event) => {

        const supa = await serverSupabaseClient(event);
        const { data: authData } = await supa.auth.getSession();

        if(!authData.session || !authData.session.user)
        {
            return createError({
                statusCode: 401,
                message: "You are not logged in"
            })
        }

        const {data : commData, error : commFetchErr} = await supa.from('community_members')
            .select("communities ( name, id, icon )")
            .eq('user_id', authData.session.user.id);

        return commData.map((c) => ({ id: c.communities.id, name : c.communities.name, icon: c.communities.icon }));

    }
)