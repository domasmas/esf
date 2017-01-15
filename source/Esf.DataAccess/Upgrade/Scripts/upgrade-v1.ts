/// <reference path='../Framework/mongodb.d.ts' />
/// <reference path='../Framework/upgradeFramework.ts' />

//upgrade-v1
db = db.getSiblingDB(upgradeFramework.DbName);
var auditor = new upgradeFramework.UpgradeScriptAuditor(db, 'upgrade-v1', '1.0');
if (!auditor.isUpgradePerformed()) {
    auditor.beginAudit();

    db.esStates.insert({
        StateUrl: UUID(upgradeFramework.EmptyGuid),
        Documents: '[{ "message": "very good message" }, { "message": "message with fox" }]',
        Mapping: '{"properties": {"message": {"type": "string", "store": true}}}',
        Query: '{"match": {"message": "fox"}}'
    });
    auditor.auditAction('populated initial esState');

    auditor.endAudit();
}