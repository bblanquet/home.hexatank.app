import { SmartSimpleOrder } from './../../Order/SmartSimpleOrder';
import { Tank } from './../../../Items/Unit/Tank';
import { AliveItem } from '../../../Items/AliveItem';
export class RaidTroopDecisionMaker {
	private _tanks: Tank[] = new Array<Tank>();
	private _target: AliveItem;

	public AddTarget(item: AliveItem) {
		this._target = item;
	}

	GetTankCount(): number {
		return this._tanks.length;
	}
	public AddTank(tank: Tank): void {
		this._tanks.push(tank);
	}

	public Start(): void {
		this._tanks.forEach((t) => t.SetMainTarget(this._target));
		this._tanks.forEach((t) => t.SetOrder(new SmartSimpleOrder(this._target.GetCurrentCell(), t)));
	}
}
