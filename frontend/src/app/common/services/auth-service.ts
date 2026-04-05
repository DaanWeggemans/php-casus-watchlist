import { inject, Injectable } from "@angular/core";
import { AuthClient } from "../clients/clients";
import { User } from "../interfaces/user";
import { LoginBody } from "../interfaces/auth";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private authClient = inject(AuthClient);
    private _user?: User;
    isAuthorized?: boolean;

    async login(body: LoginBody) {
        let result = await this.authClient.login(body);
        if (result.succeeded) {
            result = await this.authClient.user();
            if (result.succeeded) {
                const user = result.result;
                this._user = {
                    id: user.id,
                    username: user.username,
                    email: user.email
                };
            } else {
                await this.logout();
            }
        }

        return result;
    }

    async user() {
        if (this._user) {
            return this._user;
        } else {
            const result = await this.authClient.user();
            if (result.succeeded) {
                this.isAuthorized = true;
                const user = result.result;
                this._user = {
                    id: user.id,
                    username: user.username,
                    email: user.email
                };
            } else {
                await this.logout();
            }
            return this._user;
        }
    }

    async logout() {
        await this.authClient.logout();
        this.isAuthorized = false;
        this._user = undefined;
    }
}