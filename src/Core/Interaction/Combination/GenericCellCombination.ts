import { Cell } from '../../Items/Cell/Cell';
import { BasicField } from '../../Items/Cell/Field/BasicField';
import { CombinationContext } from './CombinationContext';
import { GameSettings } from '../../Framework/GameSettings';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { GameContext } from '../../Setup/Context/GameContext';
import { isNullOrUndefined } from '../../Utils/ToolBox';

export class GenericCellCombination extends AbstractSingleCombination {
	constructor(
		private _gameContext: GameContext,
		private _isType: (e: any) => boolean,
		private _create: (e: Cell) => void
	) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length >= 2 &&
			context.Items[0] instanceof Cell &&
			this._isType(context.Items[1])
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let cell = <Cell>context.Items[0];
			if (!isNullOrUndefined(cell)) {
				if (cell.GetField() instanceof BasicField) {
					if (this._gameContext.GetPlayerHq().Buy(GameSettings.FieldPrice)) {
						this._create(cell);
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
