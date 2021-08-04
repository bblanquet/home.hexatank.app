import { Cell } from '../../Items/Cell/Cell';
import { BasicField } from '../../Items/Cell/Field/BasicField';
import { CombinationContext } from './CombinationContext';
import { GameSettings } from '../../Framework/GameSettings';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { isNullOrUndefined } from '../../../Utils/ToolBox';
import { IHqGameworld } from '../../Framework/World/IHqGameworld';

export class GenericCellCombination extends AbstractSingleCombination {
	constructor(
		private _gameworld: IHqGameworld,
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
					if (this._gameworld.GetPlayerHq().Buy(GameSettings.FieldPrice)) {
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
