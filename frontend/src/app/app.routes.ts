import { Routes } from '@angular/router';
import { Feed } from './pages/feed/feed';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { authorizedGuard } from './common/guards/authorized-guard';
import { unauthorizedGuard } from './common/guards/unauthorized-guard';

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
        path: "watchlist",
        loadChildren: () => import('./pages/watchlist/watchlist.routes').then((watchlist) => watchlist.routes),
        canActivate: [unauthorizedGuard]
    },
    {
        path: "**",
        redirectTo: "feed"
    }
];
