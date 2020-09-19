import { CellGroup } from './../../../Items/CellGroup';
import { CombinationContext } from '../CombinationContext';
import { MultiSelectionContext } from '../../../Menu/Smart/MultiSelectionContext';
import { AppHandler } from '../../../../Components/Canvas/AppHandler';
import { AbstractSingleCombination } from '../AbstractSingleCombination';
import { GameContext } from '../../../Framework/GameContext';

export class MultiCellSelectionCombination extends AbstractSingleCombination {
	constructor(
		private _multiSelectionContext: MultiSelectionContext,
		private _appHandler: AppHandler,
		private _gameContext: GameContext
	) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return this._multiSelectionContext.IsListeningCell() && context.Items.length === 0;
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const cells = this._multiSelectionContext.GetCells();
			if (0 < cells.length) {
				const cellGroup = new CellGroup();
				cellGroup.SetCells(cells);
				cellGroup.SetSelected(true);
				this.ForcingSelectedItem.Invoke(this, { item: cellGroup, isForced: true });
				this._gameContext.OnItemSelected.Invoke(this, cellGroup);
			}
			this._multiSelectionContext.Close();
			this._appHandler.RestartNavigation();
			return true;
		}
		return false;
	}
}
