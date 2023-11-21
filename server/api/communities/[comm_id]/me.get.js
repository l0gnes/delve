import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server"
import { toValue } from "vue";

export default defineEventHandler(
    async (event) => {

        const user = await serverSupabaseUser(event);
        const supa = await serverSupabaseClient(event);

        const id = await getRouterParam(event, "comm_id");

        const { data, error } = await supa.from("community_members")
            .select("*, roles: community_member_roles( * )")
            .eq("user_id", toValue(user).id)
            .eq("community_id", id)
            .maybeSingle();

        if(!error)
        {
            return data;
        }

    }
)