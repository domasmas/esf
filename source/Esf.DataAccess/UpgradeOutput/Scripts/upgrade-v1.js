db = db.getSiblingDB(upgradeFramework.DbName);
var auditor = new upgradeFramework.UpgradeScriptAuditor(db, 'upgrade-v1', '1.0');
if (!auditor.isUpgradePerformed()) {
    auditor.beginAudit();
    db.esStates.insert({ StateUrl: upgradeFramework.EmptyGuid, Documents: ["Sample doc1", "Sample doc2"], Mapping: "Sample mapping", Query: "Sample query" });
    auditor.auditAction('populated initial esState');
    auditor.endAudit();
}
