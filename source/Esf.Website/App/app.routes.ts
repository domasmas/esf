import { provideRouter, RouterConfig } from '@angular/router';
import { PageNotFoundComponent } from './common/components/pageNotFound.component';
import { EsFiddlerComponent } from './esfState/esfState.component';

const routes: RouterConfig = [
    { path: '', component: EsFiddlerComponent, pathMatch: 'full' },
    { path: 'state/:id', component: EsFiddlerComponent },
    { path: '**', component: PageNotFoundComponent }
];

export const appRouterProviders = [
    provideRouter(routes)
];