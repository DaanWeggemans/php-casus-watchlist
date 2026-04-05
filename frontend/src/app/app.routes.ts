import { Routes } from '@angular/router';
import { Feed } from './pages/feed/feed';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { authorizedGuard } from './common/guards/authorized-guard';

export const routes: Routes = [
    {
        path: "feed",
        component: Feed
    },
    {
        path: "login",
        component: Login,
        canActivate: [authorizedGuard]
    },
    {
        path: "register",
        component: Register,
        canActivate: [authorizedGuard]
    },
    {
        path: "**",
        redirectTo: "feed"
    }
];
