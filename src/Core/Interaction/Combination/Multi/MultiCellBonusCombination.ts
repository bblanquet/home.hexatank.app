import { IHqGameContext } from './../../../Framework/Context/IHqGameContext';
import { CellGroup } from './../../../Items/CellGroup';
import { NetworkMenuItem } from './../../../Menu/Buttons/NetworkMenuItem';
import { NetworkField } from './../../../Items/Cell/Field/Bonus/NetworkField';
import { ShieldMenuItem } from './../../../Menu/Buttons/ShieldMenuItem';
import { ShieldField } from './../../../Items/Cell/Field/Bonus/ShieldField';
import { BatteryField } from './../../../Items/Cell/Field/Bonus/BatteryField';
import { ThunderMenuItem } from './../../../Menu/Buttons/ThunderMenuItem';
import { BasicField } from './../../../Items/Cell/Field/BasicField';
import { SlowField } from '../../../Items/Cell/Field/Bonus/SlowField';
import { SlowMenuItem } from '../../../Menu/Buttons/SlowMenuItem';
import { PoisonMenuItem } from '../../../Menu/Buttons/PoisonMenuItem';
import { Cell } from '../../../Items/Cell/Cell';
import { CombinationContext } from '../CombinationContext';
import { HealMenuItem } from '../../../Menu/Buttons/HealMenuItem';
import { MedicField } from '../../../Items/Cell/Field/Bonus/MedicField';
import { AttackMenuItem } from '../../../Menu/Buttons/AttackMenuItem';
import { FireField } from '../../../Items/Cell/Field/Bonus/FireField';
import { SpeedFieldMenuItem } from '../../../Menu/Buttons/SpeedFieldMenuItem';
import { FarmField } from '../../../Items/Cell/Field/Bonus/FarmField';
import { MoneyMenuItem } from '../../../Menu/Buttons/MoneyMenuItem';
import { RoadField } from '../../../Items/Cell/Field/Bonus/RoadField';
import { PoisonField } from '../../../Items/Cell/Field/Bonus/PoisonField';
import { GameSettings } from '../../../Framework/GameSettings';
import { AbstractSingleCombination } from '../AbstractSingleCombination';
import { IField } from '../../../Items/Cell/Field/IField';
import { ILayerService } from '../../../../Services/Layer/ILayerService';
import { Singletons, SingletonKey } from '../../../../Singletons';

export class MultiCellBonusCombination extends AbstractSingleCombination {
	private _layerService: ILayerService;

	constructor(private _gameContext: IHqGameContext) {
		super();
		this._layerService = Singletons.Load<ILayerService>(SingletonKey.Layer);
	}

	IsMatching(context: CombinationContext): boolean {
		return context.Items.length === 2 && context.Items[0] instanceof CellGroup;
	}

	private SetMenuItem(cells: CellGroup, getField: (e: Cell) => IField) {
		cells.GetCells().forEach((c) => {
			if (c.GetField() instanceof BasicField) {
				getField(c);
			}
		});
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let cells = context.Items[0] as CellGroup;
			let menuItem = context.Items[1];
			const cost = GameSettings.FieldPrice * cells.GetCells().length;
			if (menuItem && this._gameContext.GetPlayerHq().Buy(cost)) {
				const hq = this._gameContext.GetPlayerHq();
				if (menuItem instanceof HealMenuItem) {
					this.SetMenuItem(cells, (c) => c.SetField(new MedicField(c, hq)));
				} else if (menuItem instanceof AttackMenuItem) {
					this.SetMenuItem(cells, (c) => c.SetField(new FireField(c, hq)));
				} else if (menuItem instanceof ShieldMenuItem) {
					this.SetMenuItem(cells, (c) => c.SetField(new ShieldField(c, hq.Identity, hq)));
				} else if (menuItem instanceof SpeedFieldMenuItem) {
					this.SetMenuItem(cells, (c) => c.SetField(new RoadField(c, hq)));
				} else if (menuItem instanceof PoisonMenuItem) {
					this.SetMenuItem(cells, (c) => c.SetField(new PoisonField(c, hq)));
				} else if (menuItem instanceof ThunderMenuItem) {
					this.SetMenuItem(cells, (c) => c.SetField(new BatteryField(c, hq)));
				} else if (menuItem instanceof NetworkMenuItem) {
					this.SetMenuItem(cells, (c) => c.SetField(new NetworkField(c, hq)));
				} else if (menuItem instanceof SlowMenuItem) {
					this.SetMenuItem(cells, (c) => c.SetField(new SlowField(c)));
				} else if (menuItem instanceof MoneyMenuItem) {
					this.SetMenuItem(cells, (c) => c.SetField(new FarmField(c, hq)));
				}
				cells.SetSelected(false);
				this.ClearContext.Invoke();
				this._layerService.StartNavigation();
				return true;
			} else {
				cells.SetSelected(false);
				this.ClearContext.Invoke();
				this._layerService.StartNavigation();
			}
			return false;
		}
	}
}
