import { SmartSimpleOrder } from '../SmartSimpleOrder';
import { Cell } from '../../../../Items/Cell/Cell';
import { Diamond } from '../../../../Items/Cell/Field/Diamond';
import { Vehicle } from '../../../../Items/Unit/Vehicle';
import { isNullOrUndefined } from '../../../../Utils/ToolBox';
import { AStarEngine } from '../../../AStarEngine';
import { AStarHelper } from '../../../AStarHelper';
import { ShieldField } from '../../../../Items/Cell/Field/Bonus/ShieldField';

export class DiamondFieldOrder extends SmartSimpleOrder {
	constructor(public Diamond: Diamond, vehicle: Vehicle) {
		super(Diamond.GetCell(), vehicle);
	}

	protected GetClosestCell(): Cell {
		let cells = this.GetDiamondPath(this.Diamond);
		if (1 < cells.length && cells[cells.length - 1].GetField() instanceof Diamond) {
			const lastCell = cells[cells.length - 2];
			this.FinalOriginalGoal = lastCell;
			return lastCell;
		} else {
			return null;
		}
	}

	public GetGoals(): Cell[] {
		return [ this.Diamond.GetCell() ];
	}

	private GetDiamondPath(diamond: Diamond): Array<Cell> {
		const filter = (c: Cell) => !isNullOrUndefined(c) && this.IsDiamondAccessible(c);
		const cost = (c: Cell) => AStarHelper.GetBasicCost(c);
		const cells = new AStarEngine<Cell>(filter, cost).GetPath(
			this.Vehicle.GetCurrentCell(),
			diamond.GetCell(),
			true
		);

		return cells;
	}

	private IsDiamondAccessible(c: Cell): boolean {
		const field = c.GetField();
		if (field instanceof ShieldField) {
			const shield = field as ShieldField;
			return !shield.IsEnemy(this.Vehicle);
		}
		if (field === this.Diamond) {
			return true;
		}
		return !c.IsBlocked();
	}
}
