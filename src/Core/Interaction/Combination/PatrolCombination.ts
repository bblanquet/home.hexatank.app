import { PatrolMenuItem } from '../../Menu/Buttons/PatrolMenuItem';
import { PatrolOrder } from '../../Ia/Order/Composite/PatrolOrder';
import { BasicItem } from '../../Items/BasicItem';
import { SvgArchive } from '../../Framework/SvgArchiver';
import { Item } from '../../Items/Item';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { Cell } from '../../Items/Cell/Cell';
import { CombinationContext } from './CombinationContext';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { ZKind } from '../../Items/ZKind';
import { GameContext } from '../../Setup/Context/GameContext';

export class PatrolCombination extends AbstractSingleCombination {
	private _indicators: Array<BasicItem> = [];

	constructor(private _gameContext: GameContext) {
		super();
	}

	public IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length >= 5 &&
			context.Items[0] instanceof Vehicle &&
			context.Items[1] instanceof PatrolMenuItem &&
			this.IsLastPatrolItem(context.Items)
		);
	}

	public IsCorrupted(context: CombinationContext): boolean {
		return (
			this.ContainsVehicleePatrol(context) &&
			context.Items.some((i, index) => 1 < index && !(i instanceof Cell || i instanceof PatrolMenuItem))
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
		if (this.IsCorrupted(context)) {
			context.Items.splice(1, context.Items.length - 1);
			this._gameContext.OnPatrolSetting.Invoke(this, false);
			this.ClearIndicators();
			return;
		}

		if (this.ContainsVehicleePatrol(context)) {
			this._gameContext.OnPatrolSetting.Invoke(this, true);
			if (context.Items[context.Items.length - 1] instanceof Cell) {
				const indicator = new BasicItem(
					context.Items[context.Items.length - 1].GetBoundingBox(),
					SvgArchive.direction.moving,
					ZKind.AboveCell
				);
				indicator.SetVisible(() => true);
				indicator.SetAlive(() => true);
				this._indicators.push(indicator);
			}
		}

		if (this.IsMatching(context)) {
			this._gameContext.OnPatrolSetting.Invoke(this, false);
			this.ClearIndicators();
			const vehicle = context.Items[0] as Vehicle;
			vehicle.SetOrder(new PatrolOrder(this.GetCells(context.Items), vehicle));
			context.Items.splice(1, 1);
			return true;
		}
		return false;
	}

	ClearIndicators(): void {
		this._indicators.forEach((indicator) => {
			indicator.Destroy();
		});
		this._indicators = [];
	}
}
