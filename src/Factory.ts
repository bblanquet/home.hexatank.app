import { Dictionnary } from './Core/Utils/Collections/Dictionnary';

export class Factory {
	private static _objects: Dictionnary<any> = new Dictionnary<any>();
	public static Register(key: FactoryKey, obj: any): void {
		console.log(`register ${FactoryKey[key]}`);
		this._objects.Add(key.toString(), obj);
	}
	public static Load<T>(key: FactoryKey): T {
		return (this._objects.Get(key.toString()) as any) as T;
	}
}

export enum FactoryKey {
	None,
	Key,
	Hosting,
	RecordApp,
	Compare,
	GameContext,
	CamouflageGameContext,
	Layer,
	Network,
	Update,
	Campaign,
	PlayerProfil,
	Sound,
	Record,
	App,
	Interaction,
	RecordInteraction,
	CamouflageApp,
	CamouflageInteraction
}

export interface IFactorisable {
	Key(): FactoryKey;
}
