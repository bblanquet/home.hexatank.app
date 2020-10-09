import { Headquarter } from '../../../../Items/Cell/Field/Hq/Headquarter';
import { SmartSimpleOrder } from '../SmartSimpleOrder';
import { Cell } from '../../../../Items/Cell/Cell';
import { Vehicle } from '../../../../Items/Unit/Vehicle';
import { isNullOrUndefined } from '../../../../Utils/ToolBox';
import { ShieldField } from '../../../../Items/Cell/Field/Bonus/ShieldField';
import { AStarEngine } from '../../../AStarEngine';
import { AStarHelper } from '../../../AStarHelper';

export class HqFieldOrder extends SmartSimpleOrder {
	constructor(public Hq: Headquarter, vehicle: Vehicle) {
		super(Hq.GetCell(), vehicle);
	}

	protected GetClosestCell(): Cell {
		let cells = this.GetHqPath(this.Hq);
		if (cells && 1 < cells.length && cells[cells.length - 1].GetField() instanceof Headquarter) {
			const lastCell = cells[cells.length - 2];
			this.FinalOriginalGoal = lastCell;
			return lastCell;
		} else {
			return null;
		}
	}

	private GetHqPath(hq: Headquarter): Array<Cell> {
		const filter = (c: Cell) => !isNullOrUndefined(c) && this.IsHqAccessible(c);
		const cost = (c: Cell) => AStarHelper.GetBasicCost(c);
		const cells = new AStarEngine<Cell>(filter, cost).GetPath(this.Vehicle.GetCurrentCell(), hq.GetCell(), true);

		return cells;
	}

	private IsHqAccessible(c: Cell): boolean {
		const field = c.GetField();
		if (field instanceof ShieldField) {
			const shield = field as ShieldField;
			return !shield.IsEnemy(this.Vehicle);
		}
		if (field === this.Hq) {
			return true;
		}
		return !c.IsBlocked();
	}
}
