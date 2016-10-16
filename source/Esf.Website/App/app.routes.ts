import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './common/components/pageNotFound.component';
import { EsFiddlerComponent } from './esfState/esfState.component';
import { ModuleWithProviders } from '@angular/core';

export var AppRoutes: ModuleWithProviders = RouterModule.forRoot([
    { path: '', component: EsFiddlerComponent, pathMatch: 'full' },
    { path: 'state/:id', component: EsFiddlerComponent },
    { path: '**', component: PageNotFoundComponent }
]);