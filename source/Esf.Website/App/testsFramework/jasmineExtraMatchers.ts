/// <reference path="./jasmineExtraMatchers.d.ts" />

var extraMatchers = {
    toEqualAsJson: function (util: jasmine.MatchersUtil, customEqualityTesters: Array<jasmine.CustomEqualityTester>) {
        return {
            compare: function (actual: Object | Object[], expected: Object | Object[]) {
                var actualJson = JSON.stringify(actual);
                var expectedJson = JSON.stringify(expected);

                var isPass: boolean = util.equals(actualJson, expectedJson, customEqualityTesters);
                var message: string = `Expected serialized as JSON ${expectedJson} to equal ${actualJson}`;
                if (isPass) {
                    message += ' failed.';
                }
                else {
                    message += ' succeeded.';
                }
                var result: any = {
                    pass: isPass,
                    message: message
                };
                return result;
            }
        }
    }
};

beforeEach(() => {
    jasmine.addMatchers(extraMatchers);
});
    
