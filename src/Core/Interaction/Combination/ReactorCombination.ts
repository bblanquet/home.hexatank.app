import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { ReactorMenuItem } from '../../Menu/Buttons/ReactorMenuItem';
import { Cell } from '../../Items/Cell/Cell';
import { BasicField } from '../../Items/Cell/Field/BasicField';
import { CombinationContext } from './CombinationContext';
import { GameSettings } from '../../Framework/GameSettings';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { isNullOrUndefined } from '../../../Utils/ToolBox';
import { IHqGameworld } from '../../Framework/World/IHqGameworld';

export class ReactorCombination extends AbstractSingleCombination {
	constructor(private _gameworld: IHqGameworld) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length >= 2 &&
			context.Items[0] instanceof Cell &&
			context.Items[1] instanceof ReactorMenuItem
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let cell = <Cell>context.Items[0];
			if (!isNullOrUndefined(cell)) {
				if (cell.GetField() instanceof BasicField) {
					if (
						this._gameworld
							.GetPlayerHq()
							.Buy(GameSettings.TruckPrice * this._gameworld.GetPlayerHq().GetReactorsCount())
					) {
						cell.SetField(
							new ReactorField(
								cell,
								this._gameworld.GetPlayerHq(),
								this._gameworld.GetHqs(),
								this._gameworld.GetPlayerHq().Identity.Skin.GetLight()
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
