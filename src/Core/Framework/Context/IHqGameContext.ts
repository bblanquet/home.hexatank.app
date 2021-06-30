import { Identity } from './../../Items/Identity';
import { IHeadquarter } from './../../Items/Cell/Field/Hq/IHeadquarter';
import { IGameContext } from './IGameContext';
import { LiteEvent } from '../../../Utils/Events/LiteEvent';
export interface IHqGameContext extends IGameContext {
	OnPatrolSetting: LiteEvent<Boolean>;
	GetPlayerHq(): IHeadquarter;
	GetHqFromId(identity: Identity): IHeadquarter;
}
