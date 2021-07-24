import { IHqGameContext } from './../../../Framework/Context/IHqGameContext';
import { ILayerService } from './../../../../Services/Layer/ILayerService';
import { UnitGroup } from '../../../Items/UnitGroup';
import { CombinationContext } from '../CombinationContext';
import { Cell } from '../../../Items/Cell/Cell';
import { Vehicle } from '../../../Items/Unit/Vehicle';
import { MultiSelectionContext } from '../../../Menu/Smart/MultiSelectionContext';
import { AbstractSingleCombination } from '../AbstractSingleCombination';
import { Singletons, SingletonKey } from '../../../../Singletons';
import { Relationship } from '../../../Items/Identity';

export class MultiUnitSelectionCombination extends AbstractSingleCombination {
	private _group: UnitGroup;
	private _layerService: ILayerService;

	constructor(private _multiContext: MultiSelectionContext, private _gameContext: IHqGameContext) {
		super();
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
		this._group = new UnitGroup(this._multiContext);
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
			(<Cell>(<unknown>c)).GetOccupiers().forEach((occupier) => {
				if (this._gameContext.GetPlayerHq().GetRelation(occupier.Identity) === Relationship.Ally) {
					vehicles.push(occupier);
				}
			});
		});
		this._group.SetUnits(vehicles);
		if (this._group.Any()) {
			this._group.SetSelected(true);
			this._gameContext.OnItemSelected.Invoke(this, this._group);
			this.ForcingSelectedItem.Invoke(null, { item: this._group, isForced: true });
			this._group.IsListeningOrder = false;
		}

		this._multiContext.Close();
		this._layerService.StartNavigation();
	}
}
