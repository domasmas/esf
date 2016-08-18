var upgradeFramework;
(function (upgradeFramework) {
    upgradeFramework.EmptyGuid = '00000000-0000-0000-0000-000000000000';
    upgradeFramework.DbName = 'esFiddle';
    var UpgradeScriptAuditor = (function () {
        function UpgradeScriptAuditor(db, scriptName, version) {
            this._db = db;
            this._scriptName = scriptName;
            this._version = version;
        }
        UpgradeScriptAuditor.prototype.beginAudit = function () {
            this.auditAction('begin upgrade audit');
        };
        UpgradeScriptAuditor.prototype.endAudit = function () {
            this.auditAction('end upgrade audit');
        };
        UpgradeScriptAuditor.prototype.isUpgradePerformed = function () {
            var result = this._db.upgradeScriptsAudit.find({ ScriptName: this._scriptName, Version: this._version });
            return result.hasNext();
        };
        UpgradeScriptAuditor.prototype.auditAction = function (action) {
            this._db.upgradeScriptsAudit.insert({ ScriptName: this._scriptName, Version: this._version, Action: action });
        };
        return UpgradeScriptAuditor;
    }());
    upgradeFramework.UpgradeScriptAuditor = UpgradeScriptAuditor;
})(upgradeFramework || (upgradeFramework = {}));
