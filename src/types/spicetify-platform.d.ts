declare namespace Spicetify {
    declare namespace Platform {
        type Session = {
            accessToken: string;
            accessTokenExpirationTimestampMs: number;
            isAnonymous: boolean;
            locale: string;
            market: string;
            valid: boolean;
        }
    }

}