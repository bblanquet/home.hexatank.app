import { UnitGroup } from '../../../Items/UnitGroup';
import { CombinationContext } from '../CombinationContext';
import { Cell } from '../../../Items/Cell/Cell';
import { Vehicle } from '../../../Items/Unit/Vehicle';
import { MultiSelectionContext } from '../../../Menu/Smart/MultiSelectionContext';
import { AppHandler } from '../../../../Components/Canvas/AppHandler';
import { AbstractSingleCombination } from '../AbstractSingleCombination';
import { GameContext } from '../../../Framework/GameContext';

export class MultiUnitSelectionCombination extends AbstractSingleCombination {
	private _group: UnitGroup;

	constructor(
		private _multiContext: MultiSelectionContext,
		private _appHandler: AppHandler,
		private _gameContext: GameContext
	) {
		super();
		this._group = new UnitGroup(this._appHandler, this._multiContext);
	}

	IsMatching(context: CombinationContext): boolean {
		return this._multiContext.IsListeningUnit() && context.Items.length === 0;
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			if (!this._group.Any()) {
				this.Init();
				return true;
			}
			return true;
		}
		return false;
	}

	private Init() {
		const vehicles = new Array<Vehicle>();
		this._multiContext.GetCells().forEach((c) => {
			let occupier = (<Cell>(<unknown>c)).GetOccupier();
			if (occupier && occupier instanceof Vehicle && !this._gameContext.GetMainHq().IsEnemy(occupier)) {
				vehicles.push(occupier);
			}
		});
		this._group.SetUnits(vehicles);
		this._multiContext.Close();

		if (!this._group.Any()) {
			this._appHandler.RestartNavigation();
		} else {
			this._multiContext.Listen(true);
			this._group.SetSelected(true);
			this._gameContext.OnItemSelected.Invoke(this, this._group);
			this.ForcingSelectedItem.Invoke(null, { item: this._group, isForced: true });
			this._group.IsListeningOrder = true;
		}
	}
}
