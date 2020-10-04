import { PatrolMenuItem } from '../../Menu/Buttons/PatrolMenuItem';
import { PatrolOrder } from '../../Ia/Order/Composite/PatrolOrder';
import { BasicItem } from '../../Items/BasicItem';
import { Archive } from '../../Framework/ResourceArchiver';
import { Item } from '../../Items/Item';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { Cell } from '../../Items/Cell/Cell';
import { CombinationContext } from './CombinationContext';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { ZKind } from '../../Items/ZKind';

export class PatrolCombination extends AbstractSingleCombination {
	private _indicators: Array<BasicItem> = [];

	public IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length >= 5 &&
			context.Items[0] instanceof Vehicle &&
			context.Items[1] instanceof PatrolMenuItem &&
			this.IsLastPatrolItem(context.Items)
		);
	}

	public ContainsVehicleePatrol(context: CombinationContext): boolean {
		return (
			context.Items.length >= 2 &&
			context.Items[0] instanceof Vehicle &&
			context.Items[1] instanceof PatrolMenuItem
		);
	}

	public GetCells(items: Item[]): Array<Cell> {
		return items.filter((item) => item instanceof Cell).map((item) => <Cell>item);
	}

	private IsLastPatrolItem(items: Item[]): boolean {
		return items[items.length - 1] instanceof PatrolMenuItem;
	}

	public Combine(context: CombinationContext): boolean {
		if (this.ContainsVehicleePatrol(context)) {
			if (context.Items[context.Items.length - 1] instanceof Cell) {
				const element = new BasicItem(
					context.Items[context.Items.length - 1].GetBoundingBox(),
					Archive.direction.patrol,
					ZKind.Cell
				);
				element.SetVisible(() => true);
				element.SetAlive(() => true);
				this._indicators.push(element);
			}
		}

		if (this.IsMatching(context)) {
			console.log(`%c PATROL MATCH`, 'font-weight:bold;color:blue;');
			var vehicle = <Vehicle>context.Items[0];
			var patrol = new PatrolOrder(this.GetCells(context.Items), vehicle);
			vehicle.SetOrder(patrol);
			context.Items.splice(1, 1);
			return true;
		}
		return false;
	}

	Clear(): void {
		this._indicators.forEach((indicator) => {
			indicator.Destroy();
		});
		this._indicators = [];
	}
}
