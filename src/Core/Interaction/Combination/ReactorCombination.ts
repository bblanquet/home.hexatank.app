import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { InfluenceMenuItem } from '../../Menu/Buttons/InfluenceMenuItem';
import { Cell } from '../../Items/Cell/Cell';
import { BasicField } from '../../Items/Cell/Field/BasicField';
import { CombinationContext } from './CombinationContext';
import { GameSettings } from '../../Framework/GameSettings';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { isNullOrUndefined } from '../../Utils/ToolBox';
import { IHqGameContext } from '../../Setup/Context/IHqGameContext';

export class ReactorCombination extends AbstractSingleCombination {
	constructor(private _gameContext: IHqGameContext) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length >= 2 &&
			context.Items[0] instanceof Cell &&
			context.Items[1] instanceof InfluenceMenuItem
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let cell = <Cell>context.Items[0];
			if (!isNullOrUndefined(cell)) {
				if (cell.GetField() instanceof BasicField) {
					if (
						this._gameContext
							.GetPlayerHq()
							.Buy(GameSettings.TruckPrice * this._gameContext.GetPlayerHq().GetReactorsCount())
					) {
						cell.SetField(
							new ReactorField(
								cell,
								this._gameContext.GetPlayerHq(),
								this._gameContext,
								this._gameContext.GetPlayerHq().Identity.Skin.GetLight()
							)
						);
					}
				}
			}
			context.Items.splice(0, 2);
			cell.SetSelected(false);
			return true;
		}
		return false;
	}
}
