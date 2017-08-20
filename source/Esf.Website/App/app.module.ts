import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './pageNotFound/pageNotFound.component';
import { EsFiddlerComponent } from './esfState/esfState.component';
import { AppRoutesModule } from './app.routes';
import { HttpModule } from '@angular/http';
import { JsonEditorDirective } from './shared/jsonEditor/jsonEditor.directive';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { VerticalSplitViewComponent } from './shared/layout/verticalSplitView/verticalSplitView.component';
import { HorizontalSplitViewComponent } from './shared/layout/horizontalSplitView/horizontalSplitView.component';

@NgModule({
    imports: [BrowserModule,
        AppRoutesModule,
        HttpModule,
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule],
    declarations: [AppComponent, PageNotFoundComponent, EsFiddlerComponent, JsonEditorDirective, VerticalSplitViewComponent, HorizontalSplitViewComponent],
    bootstrap: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }