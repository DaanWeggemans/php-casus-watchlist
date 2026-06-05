import { Routes } from '@angular/router';
import { Feed } from './pages/feed/feed';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { unauthorizedGuard } from './common/guards/unauthorized-guard';
import { authorizedGuard } from './common/guards/authorized-guard';

export const routes: Routes = [
    {
        path: "feed",
        component: Feed
    },
    {
        path: "login",
        component: Login,
        canActivate: [unauthorizedGuard]
    },
    {
        path: "register",
        component: Register,
        canActivate: [unauthorizedGuard]
    },
    {
        path: "watchlist",
        loadChildren: () => import('./pages/watchlist/watchlist.routes').then((watchlist) => watchlist.routes),
        canActivate: [authorizedGuard]
    },
    {
        path: "**",
        redirectTo: "feed"
    }
];
