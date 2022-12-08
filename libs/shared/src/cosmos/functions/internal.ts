import {
    IncomingPayload,
    Message,
    OutgoingPayload,
    ParsedMessage,
} from '../models/message';

export function getLatestMessages(): Promise<Message[]> {
    return Spicetify.CosmosAsync.get('sp://internal/v1/latest_messages');
}

export async function getPrettifiedLatestMessages(): Promise<
    Map<string, ParsedMessage[]>
> {
    const result = new Map<string, ParsedMessage[]>();
    const messages = await getLatestMessages();
    const keys = new Set(
        messages.map((msg) => msg.command).sort((a, b) => a.localeCompare(b))
    );

    for (let key of keys) {
        result.set(
            key,
            messages
                .filter((msg) => msg.command === key)
                .map((msg) => {
                    const payload = JSON.parse(msg.payload) as
                        | IncomingPayload
                        | OutgoingPayload;

                    if ((payload.body as string).startsWith('{')) {
                        payload.body = JSON.parse(payload.body);
                    }

                    return {
                        ...msg,
                        payload: payload,
                    } as ParsedMessage;
                })
        );
    }

    return result;
}
