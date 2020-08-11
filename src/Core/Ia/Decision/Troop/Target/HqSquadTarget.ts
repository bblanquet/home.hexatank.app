import { ISquadTarget } from './ISquadTarget';
import { Cell } from '../../../../Items/Cell/Cell';
import { AliveItem } from '../../../../Items/AliveItem';
import { Tank } from '../../../../Items/Unit/Tank';
import { SmartSimpleOrder } from '../../../Order/SmartSimpleOrder';

export class AliveSquadTarget implements ISquadTarget {
	constructor(private _item: AliveItem) {
		if (!(this._item instanceof AliveItem)) {
			throw 'not supposed to be there';
		}
	}
	Attack(tank: Tank): void {
		tank.SetOrder(new SmartSimpleOrder(this._item.GetCurrentCell(), tank));
		tank.SetMainTarget(this._item);
	}

	GetCell(): Cell {
		return this._item.GetCurrentCell();
	}
	IsDone(): boolean {
		return !this._item.IsAlive();
	}
}