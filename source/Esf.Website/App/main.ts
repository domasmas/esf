import { bootstrap }    from '@angular/platform-browser-dynamic';
import { AppComponent } from './common/components/app.component';

import { enableProdMode } from '@angular/core';
import { appRouterProviders } from './app.routes';

enableProdMode();

bootstrap(AppComponent, [
    appRouterProviders
]).catch(err => console.log(err));