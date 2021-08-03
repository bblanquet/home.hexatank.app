import { Identity } from './../../Items/Identity';
import { IHeadquarter } from './../../Items/Cell/Field/Hq/IHeadquarter';
import { IGameContext } from './IGameContext';
export interface IHqGameContext extends IGameContext {
	GetPlayerHq(): IHeadquarter;
	GetHqFromId(identity: Identity): IHeadquarter;
	GetHqs(): IHeadquarter[];
}
