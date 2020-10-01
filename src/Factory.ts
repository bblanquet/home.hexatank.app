import { Dictionnary } from './Core/Utils/Collections/Dictionnary';
import 'reflect-metadata';

export class Factory {
	private _objects: Dictionnary<any> = new Dictionnary<any>();
	public Register(key: FactoryKey, obj: any): void {
		this._objects.Add(key.toString(), obj);
	}
	public Load<T>(key: FactoryKey): T {
		return (this._objects.Get(key.toString()) as any) as T;
	}
}

export enum FactoryKey {
	App,
	Compare,
	GameContext,
	Interaction,
	RecordInteraction,
	Layer,
	Netword,
	Record,
	Update
}

export interface IFactorisable {
	Key(): FactoryKey;
}
