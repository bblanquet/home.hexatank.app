import { IRecordState } from './State/IRecordState';

export interface IRecordItem<T extends IRecordState> {
	States: T[];
}
