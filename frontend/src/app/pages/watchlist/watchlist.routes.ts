import { Routes } from "@angular/router";
import { Watchlist } from "./watchlist";
import { NewWatchlist } from "./new-watchlist/new-watchlist";
import { DetailWatchlist } from "./detail-watchlist/detail-watchlist";

export const routes: Routes = [
    {
        path: "",
        component: Watchlist
    },
    {
        path: "new",
        component: NewWatchlist
    },
    {
        path: ":id",
        component: DetailWatchlist
    }
];
