import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { EsFiddlerComponent } from '../../esfState/esfState.component';

@
Component({
    selector: 'my-app',
    templateUrl: 'App/common/components/app.component.html',
    directives: [ROUTER_DIRECTIVES],
    precompile: [EsFiddlerComponent]
})
export class AppComponent {
    
} 