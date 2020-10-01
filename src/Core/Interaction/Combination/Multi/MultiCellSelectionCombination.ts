import { CellGroup } from './../../../Items/CellGroup';
import { CombinationContext } from '../CombinationContext';
import { MultiSelectionContext } from '../../../Menu/Smart/MultiSelectionContext';
import { AbstractSingleCombination } from '../AbstractSingleCombination';
import { GameContext } from '../../../Framework/GameContext';
import { ILayerService } from '../../../../Services/Layer/ILayerService';
import { Factory, FactoryKey } from '../../../../Factory';

export class MultiCellSelectionCombination extends AbstractSingleCombination {
	private _layerService: ILayerService;

	constructor(private _multiSelectionContext: MultiSelectionContext, private _gameContext: GameContext) {
		super();
		this._layerService = Factory.Load<ILayerService>(FactoryKey.Layer);
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
			this._layerService.StartNavigation();
			return true;
		}
		return false;
	}
}
