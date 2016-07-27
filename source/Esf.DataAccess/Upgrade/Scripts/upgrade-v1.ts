/// <reference path='../Framework/mongodb.d.ts' />
/// <reference path='../Framework/upgradeFramework.ts' />

//upgrade-v1
db = db.getSiblingDB(upgradeFramework.DbName);
var auditor = new upgradeFramework.UpgradeScriptAuditor(db, 'upgrade-v1', '1.0');
auditor.beginAudit();

db.esStates.insert({ StateUrl: upgradeFramework.EmptyGuid, Documents: ["Sample doc1", "Sample doc2"], Mapping: "Sample mapping", Query: "Sample query" });
auditor.auditAction('populated initial esState');

auditor.endAudit();