import { Tank } from './../../../Items/Unit/Tank';
import { ShieldField } from './../../../Items/Cell/Field/Bonus/ShieldField';
import { Headquarter } from './../../../Items/Cell/Field/Hq/Headquarter';
import { AStarHelper } from './../../AStarHelper';
import { AStarEngine } from '../../AStarEngine';
import { Cell } from '../../../Items/Cell/Cell';
import { isNullOrUndefined } from 'util';

export class SquadRoad {
	constructor(private _hq: Headquarter) {}

	private GetRoad(central: Cell, target: Cell) {
		const filter = (c: Cell) =>
			!isNullOrUndefined(c) &&
			(c.GetField() instanceof Headquarter || !c.HasBlockingField() || c.GetField() instanceof ShieldField);
		const cost = (c: Cell) => AStarHelper.GetSquadCost(c);
		return new AStarEngine<Cell>(filter, cost).GetPath(central, target);
	}

	public GetTargets(tanks: Array<Tank>, target: Cell): Array<Cell> {
		const road = this.GetRoad(tanks[0].GetCurrentCell(), target);
		let result = new Array<Cell>();

		const steps = road.filter(
			(c) => c.GetField() instanceof ShieldField && (c.GetField() as ShieldField).IsEnemy(this._hq)
		);
		return result.concat(steps).concat([ road[road.length - 1] ]);
	}
}
