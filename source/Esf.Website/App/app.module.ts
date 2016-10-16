import { NgModule } from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { AppComponent } from './common/components/app.component';
import { AppRoutes } from './app.routes';
import { HttpModule } from '@angular/http';

@NgModule({
    imports: [BrowserModule,
        AppRoutes,
        HttpModule],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }