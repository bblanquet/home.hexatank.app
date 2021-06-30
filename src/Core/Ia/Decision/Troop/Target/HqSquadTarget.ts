import { ISquadTarget } from './ISquadTarget';
import { Cell } from '../../../../Items/Cell/Cell';
import { AliveItem } from '../../../../Items/AliveItem';
import { Tank } from '../../../../Items/Unit/Tank';
import { MonitoredOrder } from '../../../Order/MonitoredOrder';
import { ErrorCat, ErrorHandler } from '../../../../../Utils/Exceptions/ErrorHandler';

export class AliveSquadTarget implements ISquadTarget {
	constructor(private _item: AliveItem) {
		if (!(this._item instanceof AliveItem)) {
			ErrorHandler.Throw(new Error(ErrorHandler.Cat.Get(ErrorCat[ErrorCat.invalidType])));
		}
	}
	Attack(tank: Tank): void {
		tank.GiveOrder(new MonitoredOrder(this._item.GetCurrentCell(), tank));
		tank.SetMainTarget(this._item);
	}

	GetCell(): Cell {
		return this._item.GetCurrentCell();
	}
	IsDone(): boolean {
		return !this._item.IsAlive();
	}
}
