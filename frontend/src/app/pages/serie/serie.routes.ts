import { Routes } from "@angular/router";
import { NewSerie } from "./new-serie/new-serie";

export const routes: Routes = [
    {
        path: "new/:franchise_id",
        component: NewSerie
    },
];