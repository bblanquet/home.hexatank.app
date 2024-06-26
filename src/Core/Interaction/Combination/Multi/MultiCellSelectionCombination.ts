import { BasicField } from './../../../Items/Cell/Field/BasicField';
import { CellGroup } from './../../../Items/CellGroup';
import { CombinationContext } from '../CombinationContext';
import { MultiSelectionContext, SelectionKind } from '../../../Menu/Smart/MultiSelectionContext';
import { AbstractSingleCombination } from '../AbstractSingleCombination';
import { ILayerService } from '../../../../Services/Layer/ILayerService';
import { Singletons, SingletonKey } from '../../../../Singletons';
import { IHqGameworld } from '../../../Framework/World/IHqGameworld';

export class MultiCellSelectionCombination extends AbstractSingleCombination {
	private _layerService: ILayerService;

	constructor(private _multiSelectionContext: MultiSelectionContext, private _gameworld: IHqGameworld) {
		super();
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
	}

	IsMatching(context: CombinationContext): boolean {
		return this._multiSelectionContext.SelectionKind === SelectionKind.Cell && context.Items.length === 0;
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			const cells = this._multiSelectionContext
				.GetCells()
				.filter(
					(c) =>
						c.GetField() instanceof BasicField &&
						c.IsSelectable() &&
						this._gameworld.GetPlayerHq().IsCovered(c)
				);
			if (0 < cells.length) {
				const cellGroup = new CellGroup();
				cellGroup.SetCells(cells);
				cellGroup.SetSelected(true);
				this.ForcingSelectedItem.Invoke(this, { item: cellGroup, isForced: true });
				this._gameworld.OnItemSelected.Invoke(this, cellGroup);
			}
			this._multiSelectionContext.Close();
			this._layerService.StartNavigation();
			return true;
		}
		return false;
	}
}
