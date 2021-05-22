import { Cell } from '../../Items/Cell/Cell';
import { FlagCell } from '../../Items/Cell/FlagCell';
import { CombinationContext } from './CombinationContext';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { GameContext } from '../../Framework/GameContext';
import { isNullOrUndefined } from '../../Utils/ToolBox';

export class FlagCellCombination extends AbstractSingleCombination {
	constructor(private _gameContext: GameContext) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return this.IsNormalMode(context) && context.Items.length === 1 && context.Items[0] instanceof Cell;
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let cell = <Cell>context.Items[0];
			if (!isNullOrUndefined(cell) && this._gameContext.IsFlagingMode) {
				if (!this._gameContext.GetPlayerHq().Flagcell) {
					this._gameContext.GetPlayerHq().Flagcell = new FlagCell(cell);
				} else {
					this._gameContext.GetPlayerHq().Flagcell.SetCell(cell);
				}
				this._gameContext.IsFlagingMode = false;
			}
		}
		return false;
	}
}
