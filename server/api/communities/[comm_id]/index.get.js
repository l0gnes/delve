import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(
    async (event) => {

        const supa = await serverSupabaseClient(event);

        // Read the event body
        const id = await getRouterParam(event, "comm_id");

        const { data: commData, error: commDataFetchErr } = await supa.from("communities")
            .select("*, community_members (*, profile : profiles (*, badges : user_badges (*, meta : badges (*)))), community_channels ( channel_id : id, name )")
            .eq("id", id)
            .maybeSingle();

        return commData;

    }
)