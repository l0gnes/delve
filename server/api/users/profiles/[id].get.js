import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server"
import { toValue } from "vue";

export default defineEventHandler(
    async (event) => {
     
        const supa = await serverSupabaseClient(event);

        const user_id = getRouterParam(event, "id")

        const {data, error} = await supa.from("profiles")
            .select("*")
            .eq("id", user_id)
            .maybeSingle();

        if(!error)
        {
            return data;
        }
        else
        {
            return createError({
                message: error,
                statusCode: 500
            })
        }

    }
)