﻿import { EsfStateViewModel } from '../models/esfStateViewModel';

export interface EsfStateProvider {
    getState(): EsfStateViewModel;
}