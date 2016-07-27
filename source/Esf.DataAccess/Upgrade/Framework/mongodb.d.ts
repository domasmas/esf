declare var db: IEsFiddleDatabase;

declare interface IEsFiddleDatabase extends IMongoDb {
    esStates: IMongoCollection;
    upgradeScriptsAudits: IMongoCollection;
}
declare interface IMongoDb {
    getSiblingDB(database: string): IEsFiddleDatabase;
}
declare interface IMongoCollection {
    insert(obj: Object);
}