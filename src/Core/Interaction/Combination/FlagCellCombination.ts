import { isNullOrUndefined } from 'util';
import { Cell } from '../../Items/Cell/Cell';
import { FlagCell } from '../../Items/Cell/FlagCell';
import { GameHelper } from '../../Framework/GameHelper';
import { CombinationContext } from './CombinationContext';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { GameContext } from '../../Framework/GameContext';

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
			if (!isNullOrUndefined(cell) && GameHelper.IsFlagingMode) {
				if (!this._gameContext.MainHq.Flagcell) {
					this._gameContext.MainHq.Flagcell = new FlagCell(cell);
					GameHelper.Playground.Items.push(this._gameContext.MainHq.Flagcell);
				} else {
					this._gameContext.MainHq.Flagcell.SetCell(cell);
				}
				GameHelper.IsFlagingMode = false;
			}
		}
		return false;
	}
}
