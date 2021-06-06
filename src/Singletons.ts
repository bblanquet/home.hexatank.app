import { Dictionnary } from './Core/Utils/Collections/Dictionnary';

export class Singletons {
	private static _singletons: Dictionnary<any> = new Dictionnary<any>();
	public static Register(key: SingletonKey, obj: any): void {
		console.log(`register ${SingletonKey[key]}`);
		if (this._singletons.Exist(SingletonKey[key])) {
			throw 'Singleton is already created';
		}
		this._singletons.Add(key.toString(), obj);
	}
	public static Load<T>(key: SingletonKey): T {
		return (this._singletons.Get(key.toString()) as any) as T;
	}
}

export enum SingletonKey {
	None,
	Key,
	Lobby,
	Compare,
	Layer,
	Update,
	Campaign,
	PlayerProfil,
	Audio,
	Record,

	Network,
	Socket,

	App,
	RecordApp,
	CamouflageApp,
	PowerApp,
	DiamondApp,

	GameContext,
	CamouflageGameContext,
	PowerGameContext,
	DiamondGameContext,

	Interaction,
	RecordInteraction,
	CamouflageInteraction,
	PowerInteraction,
	DiamondInteraction,

	Analyze
}
