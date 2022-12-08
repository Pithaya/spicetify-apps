export type Message = {
    appName: string;
    command: string;
    direction: 'incoming' | 'outgoing';
    payload: string;
    time: number;
};

export type ParsedMessage = {
    appName: string;
    command: string;
    direction: 'incoming' | 'outgoing';
    payload: IncomingPayload | OutgoingPayload;
    time: number;
};

export type IncomingPayload = {
    body: string | any;
    headers: {
        [key: string]: string;
    };
    method: number;
    uri: string;
};

export type OutgoingPayload = {
    body: string | any;
    headers: {
        [key: string]: string;
    };
    status: number;
};
