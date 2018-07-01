import { AuthConfig } from "angular-oauth2-oidc";

export function authConfig(url: string): AuthConfig {
    return new AuthConfig({
        issuer: url,
        redirectUri: url,
        clientId: '',
        tokenEndpoint: url + '/connect/token',
        requireHttps: false,
        scope: 'openid profile email offline_access client_id roles'
    });
}
