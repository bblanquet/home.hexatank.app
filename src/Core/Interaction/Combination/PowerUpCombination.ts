import { PlusMenuItem } from './../../Menu/Buttons/PlusMenuItem';
import { CombinationContext } from './CombinationContext';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { GameSettings } from '../../Framework/GameSettings';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { IHqGameContext } from '../../Setup/Context/IHqGameContext';

export class PowerUpCombination extends AbstractSingleCombination {
	constructor(private _gameContext: IHqGameContext) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			context.Items[0] instanceof ReactorField &&
			context.Items[1] instanceof PlusMenuItem
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let field = <ReactorField>context.Items[0];
			if (
				field.HasStock() ||
				this._gameContext
					.GetPlayerHq()
					.Buy(GameSettings.TruckPrice * this._gameContext.GetPlayerHq().GetTotalEnergy())
			) {
				field.EnergyUp();
			}
			context.Items.splice(1, 1);
			return true;
		}
		return false;
	}
}
