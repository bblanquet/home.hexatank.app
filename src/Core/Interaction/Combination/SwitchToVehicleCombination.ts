import { IHqGameworld } from '../../Framework/World/IHqGameworld';
import { UnitGroup } from '../../Items/UnitGroup';
import { ISelectable } from '../../ISelectable';
import { Cell } from '../../Items/Cell/Cell';
import { CombinationContext } from './CombinationContext';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { Tank } from '../../Items/Unit/Tank';
import { IGameworld } from '../../Framework/World/IGameworld';

export class SwitchToVehicleCombination extends AbstractSingleCombination {
	constructor(private _gameworld: IGameworld) {
		super();
	}

	public IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			(context.Items[0] instanceof Cell ||
				context.Items[0] instanceof ReactorField ||
				context.Items[0] instanceof UnitGroup ||
				context.Items[0] instanceof Tank ||
				context.Items[0] instanceof Headquarter) &&
			context.Items[1] instanceof Tank
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const hq = (context.Items[0] as any) as ISelectable;
			hq.SetSelected(false);
			const vehicle = context.Items[1] as Tank;
			vehicle.SetSelected(true);
			this._gameworld.OnItemSelected.Invoke(this, vehicle);
			context.Items.splice(0, 1);
			return true;
		}
		return false;
	}
}
