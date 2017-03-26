import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './pageNotFound/pageNotFound.component';
import { EsFiddlerComponent } from './esfState/esfState.component';
import { ModuleWithProviders } from '@angular/core';

export const AppRoutes: Routes = [
    { path: '', component: EsFiddlerComponent, pathMatch: 'full' },
    { path: 'state/:stateUrl', component: EsFiddlerComponent },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(AppRoutes)],
    exports: [RouterModule]
})
export class AppRoutesModule { }