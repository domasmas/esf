/// <reference path='../Scripts/typings/mongodb/mongodb.d.ts' />

import mongoDb = require('mongodb');

module upgradeModule {
    class Upgrader {
        upgrade(): void {
            console.log('upgraded');
        }
    }

    export var upgradeInstance = new Upgrader();
}




upgradeModule.upgradeInstance.upgrade();