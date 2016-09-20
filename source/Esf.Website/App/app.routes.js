System.register(['@angular/router', './common/components/pageNotFound.component', './esfState/esfState.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var router_1, pageNotFound_component_1, esfState_component_1;
    var routes, appRouterProviders;
    return {
        setters:[
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (pageNotFound_component_1_1) {
                pageNotFound_component_1 = pageNotFound_component_1_1;
            },
            function (esfState_component_1_1) {
                esfState_component_1 = esfState_component_1_1;
            }],
        execute: function() {
            routes = [
                { path: '', component: esfState_component_1.EsFiddlerComponent, pathMatch: 'full' },
                { path: 'state/:id', component: esfState_component_1.EsFiddlerComponent },
                { path: '**', component: pageNotFound_component_1.PageNotFoundComponent }
            ];
            exports_1("appRouterProviders", appRouterProviders = [
                router_1.provideRouter(routes)
            ]);
        }
    }
});
//# sourceMappingURL=app.routes.js.map