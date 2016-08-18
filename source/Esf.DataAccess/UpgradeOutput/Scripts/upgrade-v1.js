db = db.getSiblingDB(upgradeFramework.DbName);
var auditor = new upgradeFramework.UpgradeScriptAuditor(db, 'upgrade-v1', '1.0');
if (!auditor.isUpgradePerformed()) {
    auditor.beginAudit();
    db.esStates.insert({
        StateUrl: upgradeFramework.EmptyGuid,
        Documents: '[{"prop1": "value1"}, {"prop2": "value2"}]',
        Mapping: { "mappingProperty1": "mappingValue1" },
        Query: { "queryProperty1": "queryValue1" }
    });
    auditor.auditAction('populated initial esState');
    auditor.endAudit();
}
