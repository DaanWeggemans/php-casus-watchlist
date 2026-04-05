import { inject, Injectable } from "@angular/core";
import { AuthClient } from "../clients/clients";
import { User } from "../interfaces/user";
import { LoginBody, RegisterBody } from "../interfaces/auth";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private authClient = inject(AuthClient);
    private _user?: User;
    isAuthorized?: boolean;

    async login(body: LoginBody) {
        let result = await this.authClient.login(body);
        if (result.succeeded)
            /* set */ this.user();

        return result;
    }

    async register(body: RegisterBody) {
        let result = await this.authClient.register(body);
        if (result.succeeded)
            await this.login(body);

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
        if (this.isAuthorized === true)
            await this.authClient.logout();
        this.isAuthorized = false;
        this._user = undefined;
    }
}