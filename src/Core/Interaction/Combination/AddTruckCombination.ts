import { TruckMenuItem } from '../../Menu/Buttons/TruckMenuItem';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { CombinationContext } from './CombinationContext';
import { GameContext } from '../../Setup/Context/GameContext';

export class AddTruckCombination extends AbstractSingleCombination {
	constructor(private _gameContext: GameContext) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length >= 1 &&
			context.Items[context.Items.length - 1] instanceof TruckMenuItem
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			this._gameContext.GetPlayerHq().AddTruckRequest();
			context.Items.splice(context.Items.length - 1, 1);
			return true;
		}
		return false;
	}
}
