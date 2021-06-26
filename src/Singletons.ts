import { Dictionary } from './Core/Utils/Collections/Dictionary';
import { LogKind } from './Core/Utils/Logger/LogKind';
import { StaticLogger } from './Core/Utils/Logger/StaticLogger';
import { ErrorCat, ErrorHandler } from './Core/Utils/Exceptions/ErrorHandler';

export class Singletons {
	private static _singletons: Dictionary<any> = new Dictionary<any>();
	public static Register(key: SingletonKey, obj: any): void {
		StaticLogger.Log(LogKind.info, `${SingletonKey[key]}`);
		if (this._singletons.Exist(SingletonKey[key])) {
			ErrorHandler.Throw(new Error(ErrorHandler.Cat.Get(ErrorCat[ErrorCat.invalidParameter])));
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
	Online,
	Compare,
	Layer,
	Update,
	Campaign,
	PlayerProfil,
	Audio,
	Record,

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
