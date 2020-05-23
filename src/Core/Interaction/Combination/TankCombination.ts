import { Reactor } from '../../Items/Cell/Field/Bonus/Reactor';
import { PersistentOrder } from '../../Ia/Order/PersistentOrder';
import { TargetOrder } from '../../Ia/Order/TargetOrder';
import { Tank } from '../../Items/Unit/Tank';
import { Cell } from '../../Items/Cell/Cell';
import { CombinationContext } from './CombinationContext';
import { CellState } from '../../Items/Cell/CellState';
import { AbstractSingleCombination } from './AbstractSingleCombination';

export class TankCombination extends AbstractSingleCombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length >= 2 &&
			context.Items[0] instanceof Tank &&
			(context.Items[1] instanceof Cell || context.Items[1] instanceof Reactor)
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const tank = <Tank>context.Items[0];

			var cell: Cell = null;
			if (context.Items[1] instanceof Reactor) {
				var cell = (context.Items[1] as Reactor).GetCell();
			} else {
				cell = <Cell>context.Items[1];
			}

			if (
				cell.GetShootableEntity() !== null &&
				cell.GetShootableEntity().IsEnemy(tank) &&
				cell.GetState() === CellState.Visible
			) {
				const order = new TargetOrder(tank, cell.GetShootableEntity());
				tank.SetOrder(order);
				context.Items.splice(1, 1);
			} else {
				const order = new PersistentOrder(cell, tank);
				tank.SetOrder(order);
				context.Items.splice(1, 1);
			}
			return true;
		}
		return false;
	}
}
