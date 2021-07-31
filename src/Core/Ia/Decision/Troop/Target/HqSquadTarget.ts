import { ISquadTarget } from './ISquadTarget';
import { Cell } from '../../../../Items/Cell/Cell';
import { AliveItem } from '../../../../Items/AliveItem';
import { Tank } from '../../../../Items/Unit/Tank';
import { ErrorCat, ErrorHandler } from '../../../../../Utils/Exceptions/ErrorHandler';
import { TargetMonitoredOrder } from '../../../Order/TargetMonitoredOrder';

export class AliveSquadTarget implements ISquadTarget {
	constructor(private _item: AliveItem) {
		if (!(this._item instanceof AliveItem)) {
			ErrorHandler.Throw(ErrorCat.invalidType, `target is already destroyed`);
		}
	}
	Attack(tank: Tank): void {
		tank.GiveOrder(new TargetMonitoredOrder(this._item.GetCurrentCell(), tank));
	}

	GetCell(): Cell {
		return this._item.GetCurrentCell();
	}
	IsDone(): boolean {
		return !this._item.IsAlive();
	}
}
