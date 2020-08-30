import { Group } from './../../../Items/Group';
import { InteractionKind } from './../../IInteractionContext';
import { MultiSelectionHelper } from './MultiSelectionHelper';
import { MultiSelectionMenu } from '../../../Menu/Smart/MultiSelectionMenu';
import { CombinationContext } from '../CombinationContext';
import { SelectionMode } from '../../../Menu/Smart/SelectionMode';
import { Cell } from '../../../Items/Cell/Cell';
import { Vehicle } from '../../../Items/Unit/Vehicle';
import { MultiSelectionContext } from '../../../Menu/Smart/MultiSelectionContext';
import { InteractionMode } from '../../InteractionMode';
import { AppHandler } from '../../../../Components/Canvas/AppHandler';
import { AbstractSingleCombination } from '../AbstractSingleCombination';
import { GameContext } from '../../../Framework/GameContext';

export class MultiUnitSelectionCombination extends AbstractSingleCombination {
	private _group: Group;

	constructor(
		private _multiselection: MultiSelectionMenu,
		private _multiContext: MultiSelectionContext,
		private _appHandler: AppHandler,
		private _gameContext: GameContext
	) {
		super();
		this._group = new Group(this._appHandler, this._multiContext);
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
			if (!this._group.Any()) {
				this.Init();
				return true;
			} else {
				if (this._appHandler.IsOrderMode) {
					if (0 < this._multiContext.GetCells().length) {
						this._group.SetOrder(this._multiContext.GetCells());
					}
					this._multiContext.Close();
					this._appHandler.RestartNavigation();
					this._appHandler.IsOrderMode = false;
					this.OnChangedMode.Invoke(this, InteractionMode.SingleSelection);
				}
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
			this.OnChangedMode.Invoke(this, InteractionMode.SingleSelection);
			this._appHandler.RestartNavigation();
		} else {
			this._group.SetSelected(true);
			this._gameContext.OnItemSelected.Invoke(this, this._group);
			this.OnPushedItem.Invoke(null, { item: this._group, isForced: true });
			this._appHandler.IsOrderMode = true;
		}
	}
}
