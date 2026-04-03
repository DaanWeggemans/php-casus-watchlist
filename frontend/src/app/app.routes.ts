import { Routes } from '@angular/router';
import { Feed } from './pages/feed/feed';
import { Login } from './pages/login/login';

export const routes: Routes = [
    {
        path: "feed",
        component: Feed
    },
    {
        path: "login",
        component: Login
    },
    {
        path: "**",
        redirectTo: "feed"
    }
];
