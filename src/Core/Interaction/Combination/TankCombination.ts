import { InteractionKind } from './../IInteractionContext';
import { InfluenceField } from '../../Items/Cell/Field/InfluenceField';
import { PersistentOrder } from '../../Ia/Order/PersistentOrder';
import { ICombination } from './ICombination';
import { TargetOrder } from '../../Ia/Order/TargetOrder';
import { Tank } from '../../Items/Unit/Tank';
import { Cell } from '../../Items/Cell/Cell';
import { CombinationContext } from './CombinationContext';
import { CellState } from '../../Items/Cell/CellState';
import { InteractionMode } from '../InteractionMode';

export class TankCombination implements ICombination {
	constructor() {}
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length >= 2 &&
			context.Items[0] instanceof Tank &&
			(context.Items[1] instanceof Cell || context.Items[1] instanceof InfluenceField)
		);
	}

	private IsNormalMode(context: CombinationContext) {
		return (
			context.ContextMode === InteractionMode.SingleSelection && context.InteractionKind === InteractionKind.Up
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const tank = <Tank>context.Items[0];

			var cell: Cell = null;
			if (context.Items[1] instanceof InfluenceField) {
				var cell = (context.Items[1] as InfluenceField).GetCell();
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

	Clear(): void {}
}
