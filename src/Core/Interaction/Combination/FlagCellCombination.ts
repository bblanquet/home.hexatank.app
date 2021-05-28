import { Cell } from '../../Items/Cell/Cell';
import { FlagCell } from '../../Items/Cell/FlagCell';
import { CombinationContext } from './CombinationContext';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { GameContext } from '../../Setup/Context/GameContext';
import { isNullOrUndefined } from '../../Utils/ToolBox';

export class FlagCellCombination extends AbstractSingleCombination {
	//don't have better option
	public static IsFlagingMode: boolean = false;
	constructor(private _gameContext: GameContext) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return this.IsNormalMode(context) && context.Items.length === 1 && context.Items[0] instanceof Cell;
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let cell = <Cell>context.Items[0];
			if (!isNullOrUndefined(cell) && FlagCellCombination.IsFlagingMode) {
				if (!this._gameContext.GetPlayerHq().Flagcell) {
					this._gameContext.GetPlayerHq().Flagcell = new FlagCell(cell);
				} else {
					this._gameContext.GetPlayerHq().Flagcell.SetCell(cell);
				}
				FlagCellCombination.IsFlagingMode = false;
			}
		}
		return false;
	}
}
