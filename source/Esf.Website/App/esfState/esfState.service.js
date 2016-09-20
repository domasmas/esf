System.register(['rxjs/Rx', '@angular/http', '@angular/core'], function(exports_1, context_1) {
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
    var http_1, core_1;
    var EsfStateService, EsfStateDto;
    return {
        setters:[
            function (_1) {},
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            EsfStateService = (function () {
                function EsfStateService(http) {
                    this.http = http;
                }
                EsfStateService.prototype.getInitialState = function () {
                    var url = EsfStateService.serviceUrl + "/states/new";
                    return this.http.get(url).map(function (res) {
                        var result = res.json();
                        return result;
                    }, function (error) {
                        return error;
                    });
                };
                EsfStateService.prototype.createNewVersion = function (state) {
                    var url = EsfStateService.serviceUrl + "/states";
                    var body = JSON.stringify(state);
                    var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_1.RequestOptions({ headers: headers });
                    return this.http.put(url, body, options).map(function (res) {
                        var result = res.json();
                        return result;
                    }, function (error) {
                        return error;
                    });
                };
                EsfStateService.prototype.getState = function (id) {
                    var url = EsfStateService.serviceUrl + "/states/?id=" + id;
                    return this.http.get(url).map(function (res) {
                        var result = res.json();
                        return result;
                    }, function (error) {
                        return error;
                    });
                };
                EsfStateService.serviceUrl = 'http://localhost:40081';
                EsfStateService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], EsfStateService);
                return EsfStateService;
            }());
            exports_1("EsfStateService", EsfStateService);
            EsfStateDto = (function () {
                function EsfStateDto() {
                }
                return EsfStateDto;
            }());
            exports_1("EsfStateDto", EsfStateDto);
        }
    }
});
//# sourceMappingURL=esfState.service.js.map