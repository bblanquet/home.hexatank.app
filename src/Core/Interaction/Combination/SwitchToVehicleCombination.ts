import { GameHelper } from '../../Framework/GameHelper';
import { ICombination } from './ICombination';
import { ISelectable } from '../../ISelectable';
import { Cell } from '../../Items/Cell/Cell';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { CombinationContext } from './CombinationContext';
import { InteractionMode } from '../InteractionMode';
import { InteractionKind } from '../IInteractionContext';
import { InfluenceField } from '../../Items/Cell/Field/InfluenceField';
import { Headquarter } from '../../Items/Cell/Field/Headquarter';

export class SwitchToVehicleCombination implements ICombination {
	constructor() {}

	public IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			(context.Items[0] instanceof Cell ||
				context.Items[0] instanceof InfluenceField ||
				context.Items[0] instanceof Headquarter) &&
			context.Items[1] instanceof Vehicle
		);
	}

	private IsNormalMode(context: CombinationContext) {
		return (
			context.ContextMode === InteractionMode.SingleSelection && context.InteractionKind === InteractionKind.Up
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const hq = (context.Items[0] as any) as ISelectable;
			hq.SetSelected(false);
			const vehicle = context.Items[1] as Vehicle;
			vehicle.SetSelected(true);
			GameHelper.SelectedItem.Invoke(this, vehicle);
			context.Items.splice(0, 1);
			return true;
		}
		return false;
	}

	Clear(): void {}
}
