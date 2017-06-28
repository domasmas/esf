import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { CommandStateType } from './commandStateType';

export class EsfCommand<TCommandState extends EsfCommandState> {
    protected commandStateStream: Subject<TCommandState>;

    constructor() {
        this.commandStateStream = new Subject<TCommandState>();
    }

    public getCommandState(): Observable<TCommandState> {
        return this.commandStateStream.asObservable();
    }
}

export interface EsfCommandState {
    commandState: CommandStateType;
    error?: Error;
}