import { ISquadTarget } from './Target/ISquadTarget';
import { Tank } from './../../../Items/Unit/Tank';
import { ShieldField } from './../../../Items/Cell/Field/Bonus/ShieldField';
import { Headquarter } from './../../../Items/Cell/Field/Hq/Headquarter';
import { AStarHelper } from './../../AStarHelper';
import { AStarEngine } from '../../AStarEngine';
import { Cell } from '../../../Items/Cell/Cell';
import { AliveSquadTarget } from './Target/HqSquadTarget';
import { isNullOrUndefined } from '../../../Utils/ToolBox';

export class SquadRoad {
	constructor(private _hq: Headquarter) {}

	private GetRoad(central: Cell, target: Cell) {
		const filter = (c: Cell) =>
			!isNullOrUndefined(c) &&
			(c.GetField() instanceof Headquarter || !c.HasBlockingField() || c.GetField() instanceof ShieldField);
		const cost = (c: Cell) => AStarHelper.GetSquadCost(c);
		return new AStarEngine<Cell>(filter, cost).GetPath(central, target);
	}

	public GetTargets(tanks: Array<Tank>, mainTarget: ISquadTarget): Array<ISquadTarget> {
		const road = this.GetRoad(tanks[0].GetCurrentCell(), mainTarget.GetCell());
		const condition = (c: Cell) =>
			c.GetField() instanceof ShieldField && (c.GetField() as ShieldField).IsEnemy(this._hq.Identity);
		const targets = road.filter(condition);
		let allTargets: ISquadTarget[] = targets.map((c) => new AliveSquadTarget(c.GetField() as ShieldField));
		allTargets.push(mainTarget);
		return allTargets;
	}
}
