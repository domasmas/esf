declare var db: IEsFiddleDatabase;

declare interface IEsFiddleDatabase extends IMongoDb {
    esStates: IMongoCollection;
    upgradeScriptsAudit: IMongoCollection;
}
declare interface IMongoDb {
    getSiblingDB(database: string): IEsFiddleDatabase;
}
declare interface IMongoCollection {
    insert(obj: Object);
    find(query: Object): IMongoCursor;
    find(query: Object, projection: Object): IMongoCursor;
}

declare interface IMongoCursor {
    hasNext(): boolean;
    next(): Object;
    toArray(): Object[];
}

declare var UUID: (val: string) => any;