import { DiamondFieldOrder } from '../../Ia/Order/DiamondFieldOrder';
import { TruckPatrolOrder } from '../../Ia/Order/TruckPatrolOrder';
import { ICombination } from './ICombination';
import { Item } from '../../Items/Item';
import { Truck } from '../../Items/Unit/Truck';
import { Cell } from '../../Items/Cell/Cell';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { HqFieldOrder } from '../../Ia/Order/HqFieldOrder';
import { IContextContainer } from '../IContextContainer';
import { ISelectable } from '../../ISelectable';
import { CombinationContext } from './CombinationContext';

export class TruckDiamondCombination implements ICombination {
	private _interactionContext: IContextContainer;

	constructor(interactionContext: IContextContainer) {
		this._interactionContext = interactionContext;
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			context.Items.length >= 2 &&
			context.Items[0].constructor.name === Truck.name &&
			context.Items[1].constructor.name === Cell.name &&
			(context.Items[1] as Cell).GetField().constructor.name == Diamond.name
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let truck = <Truck>context.Items[0];
			let diamond = <Diamond>(context.Items[1] as Cell).GetField();
			let order = new TruckPatrolOrder(
				truck,
				new HqFieldOrder(truck.Hq, truck),
				new DiamondFieldOrder(diamond, truck)
			);
			truck.SetOrder(order);
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
