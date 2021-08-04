import { Gameworld } from '../../Framework/World/Gameworld';
import { DiamondFieldOrder } from '../../Ia/Order/Composite/Diamond/DiamondFieldOrder';
import { TruckPatrolOrder } from '../../Ia/Order/Composite/Diamond/TruckPatrolOrder';
import { Item } from '../../Items/Item';
import { Truck } from '../../Items/Unit/Truck';
import { Cell } from '../../Items/Cell/Cell';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { HqFieldOrder } from '../../Ia/Order/Composite/Diamond/HqFieldOrder';
import { ISelectable } from '../../ISelectable';
import { CombinationContext } from './CombinationContext';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { IHqGameworld } from '../../Framework/World/IHqGameworld';

export class TruckDiamondCombination extends AbstractSingleCombination {
	constructor(public _gameContext: IHqGameworld) {
		super();
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
				new HqFieldOrder(this._gameContext.GetHqFromId(truck.Identity), truck),
				new DiamondFieldOrder(diamond, truck)
			);
			truck.GiveOrder(order);
			this.UnSelectItem(context.Items[0]);
			this.ClearContext.Invoke();
			return true;
		}
		return false;
	}

	private UnSelectItem(item: Item) {
		var selectable = <ISelectable>(<any>item);
		selectable.SetSelected(false);
	}
}
