import { TargetMonitoredOrder } from './../../Ia/Order/TargetMonitoredOrder';
import { MonitoredOrder } from '../../Ia/Order/MonitoredOrder';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { TargetOrder } from '../../Ia/Order/Composite/TargetOrder';
import { Tank } from '../../Items/Unit/Tank';
import { Cell } from '../../Items/Cell/Cell';
import { CombinationContext } from './CombinationContext';
import { CellState } from '../../Items/Cell/CellState';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { Relationship } from '../../Items/Identity';

export class TankCombination extends AbstractSingleCombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length >= 2 &&
			context.Items[0] instanceof Tank &&
			(context.Items[1] instanceof Cell || context.Items[1] instanceof ReactorField)
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const tank = <Tank>context.Items[0];

			var cell: Cell = null;
			if (context.Items[1] instanceof ReactorField) {
				var cell = (context.Items[1] as ReactorField).GetCell();
			} else {
				cell = <Cell>context.Items[1];
			}

			if (
				cell.GetShootableEntity() !== null &&
				cell.GetShootableEntity().GetRelation(tank.Identity) !== Relationship.Ally &&
				cell.GetState() === CellState.Visible
			) {
				const order = new TargetMonitoredOrder(cell, tank);
				tank.GiveOrder(order);
				context.Items.splice(1, 1);
			} else {
				const order = new TargetMonitoredOrder(cell, tank);
				tank.GiveOrder(order);
				context.Items.splice(1, 1);
			}
			return true;
		}
		return false;
	}
}
