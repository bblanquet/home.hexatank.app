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
import { MultiSelectionContext } from '../../../Menu/Smart/MultiSelectionContext';
import { HealMenuItem } from '../../../Menu/Buttons/HealMenuItem';
import { MedicField } from '../../../Items/Cell/Field/Bonus/MedicField';
import { AttackMenuItem } from '../../../Menu/Buttons/AttackMenuItem';
import { AttackField } from '../../../Items/Cell/Field/Bonus/AttackField';
import { SpeedFieldMenuItem } from '../../../Menu/Buttons/SpeedFieldMenuItem';
import { FarmField } from '../../../Items/Cell/Field/Bonus/FarmField';
import { MoneyMenuItem } from '../../../Menu/Buttons/MoneyMenuItem';
import { RoadField } from '../../../Items/Cell/Field/Bonus/RoadField';
import { PoisonField } from '../../../Items/Cell/Field/Bonus/PoisonField';
import { GameSettings } from '../../../Framework/GameSettings';
import { AppHandler } from '../../../../Components/Canvas/AppHandler';
import { AbstractSingleCombination } from '../AbstractSingleCombination';
import { GameContext } from '../../../Framework/GameContext';
import { IField } from '../../../Items/Cell/Field/IField';

export class MultiCellBonusCombination extends AbstractSingleCombination {
	constructor(private _appHandler: AppHandler, private _gameContext: GameContext) {
		super();
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
			if (menuItem && this._gameContext.GetMainHq().Buy(cost)) {
				if (menuItem instanceof HealMenuItem) {
					this.SetMenuItem(cells, (c) => new MedicField(c, this._gameContext.GetMainHq()));
				} else if (menuItem instanceof AttackMenuItem) {
					this.SetMenuItem(cells, (c) => new AttackField(c, this._gameContext.GetMainHq()));
				} else if (menuItem instanceof ShieldMenuItem) {
					this.SetMenuItem(cells, (c) => new ShieldField(c, this._gameContext.GetMainHq()));
				} else if (menuItem instanceof SpeedFieldMenuItem) {
					this.SetMenuItem(cells, (c) => new RoadField(c, this._gameContext.GetMainHq()));
				} else if (menuItem instanceof PoisonMenuItem) {
					this.SetMenuItem(cells, (c) => new PoisonField(c, this._gameContext.GetMainHq()));
				} else if (menuItem instanceof ThunderMenuItem) {
					this.SetMenuItem(cells, (c) => new BatteryField(c, this._gameContext.GetMainHq()));
				} else if (menuItem instanceof NetworkMenuItem) {
					this.SetMenuItem(cells, (c) => new NetworkField(c, this._gameContext.GetMainHq()));
				} else if (menuItem instanceof SlowMenuItem) {
					this.SetMenuItem(
						cells,
						(c) => new SlowField(c, this._gameContext.GetMainHq().GetSkin().GetLight())
					);
				} else if (menuItem instanceof MoneyMenuItem) {
					this.SetMenuItem(cells, (c) => new FarmField(c, this._gameContext.GetMainHq()));
				}
				cells.SetSelected(false);
				this.ClearContext.Invoke();
				this._appHandler.RestartNavigation();
				return true;
			} else {
				cells.SetSelected(false);
				this.ClearContext.Invoke();
				this._appHandler.RestartNavigation();
			}
			return false;
		}
	}
}
