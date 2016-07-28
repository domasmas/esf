﻿/// <reference path='./mongodb.d.ts' />
module upgradeFramework {
    export const EmptyGuid: string = '00000000-0000-0000-0000-000000000000';
    export const DbName: string = 'esFiddle';

    export class UpgradeScriptAuditor {
        private _scriptName: string;
        private _db: IEsFiddleDatabase;
        private _version: string;

        constructor(db: IEsFiddleDatabase, scriptName: string, version: string) {
            this._db = db;
            this._scriptName = scriptName;
            this._version = version;
        }

        beginAudit(): void {
            this._db.upgradeScriptsAudit.insert({ ScriptName: this._scriptName, Version: this._version, Action: 'begin upgrade audit'});
        }
        endAudit(): void {
            this._db.upgradeScriptsAudit.insert({ ScriptName: this._scriptName, Version: this._version, Action: 'end upgrade audit' });
        }

        auditAction(action: string): void {
            this._db.upgradeScriptsAudit.insert({ ScriptName: this._scriptName, Version: this._version, Action: action });
        }
    }
}
