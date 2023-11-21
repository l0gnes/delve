import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";


// To join a community via an invite link or an invite string
export default defineEventHandler(
    async (event) => {

        // RESOLVING INVITE ---- 

        // all of our wacky supabase stuff we might need
        const user = await serverSupabaseUser(event);
        const supa = await serverSupabaseClient(event);

        // getting the event body
        const event_body = await readBody(event);

        // get the invite link from the request body
        const invite_link = event_body.invite_link;

        // CAST THE REGEX ON THE PUNY LITTLE INVITE LINK RAAAH
        const regex_response = invite_link.match(/^https:\/\/delve\.lognes\.lol\/(\w+)$|^(\w+)$/)

        // if no match was found raise an error
        if(!regex_response)
        {
            return createError({
                statusCode: 400,
                message: 'Invalid Invite Link'
            })
        }
        
        // get the invite string
        const invite_string = regex_response[1];

        const {data, error} = await supa.from("community_invites")
            .select("for_community")
            .eq("id", invite_string)
            .maybeSingle();

        if(error || !data)
        {
            return createError({
                statusCode: 404,
                message: "Failed to find community"
            })
        }

        // JOIN COMMUNITY
        
        const { error : joinError } = await supa.from("community_members")
            .upsert(
                {
                    community_id: data.for_community,
                    user_id: user.id
                }
            );

        if(error)
        {
            return createError({
                statusCode: 400,
                message: error.message
            });
        }

        return {statusCode: 200, message: "Community Joined!", comm : data.for_community}
        
    }
)