import { BigMenuItem } from './../../Menu/Buttons/BigMenuItem';
import { CombinationContext } from './CombinationContext';
import { GameHelper } from '../../Framework/GameHelper';
import { InfluenceField } from '../../Items/Cell/Field/InfluenceField';
import { GameSettings } from '../../Framework/GameSettings';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { GameContext } from '../../Framework/GameContext';

export class RangeUpCombination extends AbstractSingleCombination {
	constructor(private _gameContext: GameContext) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length == 2 &&
			context.Items[0] instanceof InfluenceField &&
			context.Items[1] instanceof BigMenuItem
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let field = <InfluenceField>context.Items[0];
			if (
				field.HasStock() ||
				this._gameContext.MainHq.Buy(GameSettings.TruckPrice * this._gameContext.MainHq.GetTotalEnergy())
			) {
				field.RangeUp();
			}
			context.Items.splice(1, 1);
			return true;
		}
		return false;
	}
}
