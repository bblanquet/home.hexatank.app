import { SmartSimpleOrder } from './../../Order/SmartSimpleOrder';
import { Tank } from './../../../Items/Unit/Tank';
import { AliveItem } from '../../../Items/AliveItem';
import { Area } from '../Utils/Area';

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

	private HasAccess(): boolean {
		return false;
	}

	private FindShort(): Area {
		return null;
	}

	public Start(): void {
		this._tanks.forEach((t) => t.SetMainTarget(this._target));
		this._tanks.forEach((t) => t.SetOrder(new SmartSimpleOrder(this._target.GetCurrentCell(), t)));
	}
}
