import { NgModule } from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { AppComponent } from './common/components/app.component';
import { PageNotFoundComponent } from './common/components/pageNotFound.component';
import { EsFiddlerComponent } from './esfState/esfState.component';
import { AppRoutesModule } from './app.routes';
import { HttpModule } from '@angular/http';
import { JsonEditorDirective } from './common/components/jsonEditor.directive';

@NgModule({
    imports: [BrowserModule,
        AppRoutesModule,
        HttpModule],
    declarations: [AppComponent, PageNotFoundComponent, EsFiddlerComponent, JsonEditorDirective ],
    bootstrap: [AppComponent]
})
export class AppModule { }