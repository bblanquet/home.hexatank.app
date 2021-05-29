import { GameContext } from '../../Setup/Context/GameContext';
import { TankMenuItem } from '../../Menu/Buttons/TankMenuItem';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { CombinationContext } from './CombinationContext';
import { IHqGameContext } from '../../Setup/Context/IHqGameContext';

export class AddTankCombination extends AbstractSingleCombination {
	constructor(private _gameContext: IHqGameContext) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length >= 1 &&
			context.Items[context.Items.length - 1] instanceof TankMenuItem
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			this._gameContext.GetPlayerHq().AddTankRequest();
			context.Items.splice(context.Items.length - 1, 1);
			return true;
		}
		return false;
	}
}
