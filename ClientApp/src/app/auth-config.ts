import { AuthConfig } from 'angular-oauth2-oidc';

export function authConfig(url: string): AuthConfig {
    return new AuthConfig({
        issuer: url,
        redirectUri: url,
        clientId: 'botw',
        tokenEndpoint: url + '/connect/token',
        requireHttps: false,
        scope: 'openid profile email offline_access roles'
    });
}
