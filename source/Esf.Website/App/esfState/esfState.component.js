System.register(['@angular/core', '@angular/router', "./esfState.service", '@angular/http'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, esfState_service_1, http_1;
    var EsFiddlerComponent, EsfState, EsfQueryRunner;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (esfState_service_1_1) {
                esfState_service_1 = esfState_service_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            EsFiddlerComponent = (function () {
                function EsFiddlerComponent(esfStateService, route, router) {
                    this.esfStateService = esfStateService;
                    this.route = route;
                    this.router = router;
                    this.state = new EsfState();
                    this.state = {
                        documents: null,
                        mapping: null,
                        query: null,
                        id: null
                    };
                    this.queryRunner = new EsfQueryRunner(null);
                }
                EsFiddlerComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.sub = this.route.params.subscribe(function (params) {
                        var id = params['id'];
                        console.log(id);
                        if (id == null) {
                            _this.esfStateService.getInitialState().subscribe(function (state) {
                                _this.state = {
                                    documents: state.documents,
                                    mapping: state.mapping,
                                    query: state.query,
                                    id: state.id
                                };
                            }, function (error) {
                                console.log(error);
                            });
                        }
                        else {
                            _this.esfStateService.getState(id)
                                .subscribe(function (state) {
                                _this.state = {
                                    documents: state.documents,
                                    mapping: state.mapping,
                                    query: state.query,
                                    id: state.id
                                };
                            });
                        }
                    });
                };
                EsFiddlerComponent.prototype.save = function () {
                    var _this = this;
                    this.esfStateService.createNewVersion(this.state).subscribe(function (state) {
                        _this.state = {
                            documents: state.documents,
                            mapping: state.mapping,
                            query: state.query,
                            id: state.id
                        };
                        console.log('After update server returned: ', state);
                        _this.router.navigate(['/state', state.id]);
                    }, function (error) {
                        console.log(error);
                    });
                };
                EsFiddlerComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        templateUrl: '/App/esfState/esfState.component.html',
                        providers: [esfState_service_1.EsfStateService, http_1.HTTP_PROVIDERS]
                    }), 
                    __metadata('design:paramtypes', [esfState_service_1.EsfStateService, router_1.ActivatedRoute, router_1.Router])
                ], EsFiddlerComponent);
                return EsFiddlerComponent;
            }());
            exports_1("EsFiddlerComponent", EsFiddlerComponent);
            EsfState = (function () {
                function EsfState() {
                }
                return EsfState;
            }());
            exports_1("EsfState", EsfState);
            EsfQueryRunner = (function () {
                function EsfQueryRunner(esfStateService) {
                    this.esfStateService = esfStateService;
                    this.queryResult = 'Query Result Value';
                }
                EsfQueryRunner.prototype.run = function () {
                    this.queryResult = 'Query was run';
                };
                return EsfQueryRunner;
            }());
            exports_1("EsfQueryRunner", EsfQueryRunner);
        }
    }
});
//# sourceMappingURL=esfState.component.js.map