import { Identity } from '../../Items/Identity';
import { IHeadquarter } from '../../Items/Cell/Field/Hq/IHeadquarter';
import { IGameworld } from './IGameworld';
export interface IHqGameworld extends IGameworld {
	GetPlayerHq(): IHeadquarter;
	GetHqFromId(identity: Identity): IHeadquarter;
	GetHqs(): IHeadquarter[];
}
