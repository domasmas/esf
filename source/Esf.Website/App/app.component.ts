import { Component } from '@angular/core';
import { EsFiddlerComponent } from './esfState/esfState.component';

@Component({
    selector: 'esf-app',
    templateUrl: 'App/app.component.html',
    entryComponents: [EsFiddlerComponent]
})
export class AppComponent {
    
}