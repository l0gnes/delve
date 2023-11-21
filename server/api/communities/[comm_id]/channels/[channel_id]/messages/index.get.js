import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server"

export default defineEventHandler(
    async (event) => {

        const user = await serverSupabaseUser(event);
        const supa = await serverSupabaseClient(event);

        // Read the event body
        const community_id = getRouterParam(event, "comm_id");
        const channel_id = getRouterParam(event, "channel_id");

        // const req_body = await readBody(event);

        const {data, error} = await supa.from("community_messages")
            .select("*")
            .eq('channel_id', channel_id)
            // .order('sent_at', { ascending: true })
            // .limit(req_body.limit | 50)
            // .offset((req_body.offset | 0) * (req_body.limit | 50));

        return data;
    }
)