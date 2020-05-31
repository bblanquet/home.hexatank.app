import { InteractionKind, IInteractionContext } from './../../IInteractionContext';
import { MultiSelectionHelper } from './MultiSelectionHelper';
import { MultiSelectionMenu } from '../../../Menu/Smart/MultiSelectionMenu';
import { CombinationContext } from '../CombinationContext';
import { SelectionMode } from '../../../Menu/Smart/SelectionMode';
import { Cell } from '../../../Items/Cell/Cell';
import { Vehicle } from '../../../Items/Unit/Vehicle';
import { GameHelper } from '../../../Framework/GameHelper';
import { MultiInteractionContext } from '../../../Menu/Smart/MultiInteractionContext';
import { InteractionMode } from '../../InteractionMode';
import { AppHandler } from '../../../../Components/Canvas/AppHandler';
import { AbstractSingleCombination } from '../AbstractSingleCombination';
import { GameContext } from '../../../Framework/GameContext';

export class MultiUnitSelectionCombination extends AbstractSingleCombination {
	private _multiHandler: MultiSelectionHelper;
	private _vehicles: Vehicle[];

	constructor(
		private _multiselection: MultiSelectionMenu,
		private _multiContext: MultiInteractionContext,
		private _appHandler: AppHandler,
		private _gameContext: GameContext
	) {
		super();
		this._multiHandler = new MultiSelectionHelper();
		this._vehicles = [];
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			this._multiselection.GetMode() === SelectionMode.unit &&
			context.ContextMode === InteractionMode.MultipleSelection &&
			(context.InteractionKind === InteractionKind.Up || context.InteractionKind === InteractionKind.MovingUp)
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			if (this._vehicles.length === 0) {
				this.SetVehicles(this._multiContext.GetCells());
				this._multiContext.Stop();
				if (this._vehicles.length === 0) {
					this.OnChangedMode.Invoke(this, InteractionMode.SingleSelection);
					this._appHandler.RestartNavigation();
				}
				return true;
			} else {
				if (this._multiContext.GetCells().length > 0) {
					this._multiHandler.GiveOrders(this._vehicles, this._multiContext.GetCells());
				}
				this._vehicles.forEach((v) => {
					v.SetSelected(false);
				});
				this._vehicles = [];
				this._multiContext.Stop();
				this.OnChangedMode.Invoke(this, InteractionMode.SingleSelection);
				this._appHandler.RestartNavigation();
			}
			return true;
		}
		return false;
	}

	private SetVehicles(cells: Cell[]): void {
		cells.forEach((c) => {
			let occupier = (<Cell>(<unknown>c)).GetOccupier();
			if (occupier && occupier instanceof Vehicle && !this._gameContext.MainHq.IsEnemy(occupier)) {
				this._vehicles.push(occupier);
			}
		});
		this._vehicles.forEach((v) => {
			v.SetSelected(true);
		});
	}
}
