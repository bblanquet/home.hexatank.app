import { ICombination } from './ICombination';
import { TargetMenuItem } from '../../Menu/Buttons/TargetMenuItem';
import { TargetOrder } from '../../Ia/Order/TargetOrder';
import { Item } from '../../Items/Item';
import { Tank } from '../../Items/Unit/Tank';
import { Cell } from '../../Items/Cell/Cell';
import { IContextContainer } from '../IContextContainer';
import { ISelectable } from '../../ISelectable';
import { CombinationContext } from './CombinationContext';
import { InteractionMode } from '../InteractionMode';
import { InteractionKind } from '../IInteractionContext';

export class TargetCombination implements ICombination {
	private _interactionContext: IContextContainer;

	constructor(interactionContext: IContextContainer) {
		this._interactionContext = interactionContext;
	}

	IsMatching(combination: CombinationContext): boolean {
		return (
			this.IsNormalMode(combination) &&
			combination.Items.length === 3 &&
			combination.Items[0] instanceof Tank &&
			combination.Items[1] instanceof TargetMenuItem &&
			combination.Items[2] instanceof Cell &&
			(combination.Items[2] as Cell).IsShootable()
		);
	}

	private IsNormalMode(context: CombinationContext) {
		return (
			context.ContextMode === InteractionMode.SingleSelection && context.InteractionKind === InteractionKind.Up
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let tank = <Tank>context.Items[0];
			let cell = context.Items[2] as Cell;
			let order = new TargetOrder(tank, cell.GetShootableEntity());
			tank.SetOrder(order);
			this.UnSelectItem(context.Items[0]);
			this._interactionContext.ClearContext();
			return true;
		}
		return false;
	}

	Clear(): void {}

	private UnSelectItem(item: Item) {
		var selectable = <ISelectable>(<any>item);
		selectable.SetSelected(false);
	}
}
