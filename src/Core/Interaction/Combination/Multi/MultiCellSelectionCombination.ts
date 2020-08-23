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
import { MultiSelectionMenu } from '../../../Menu/Smart/MultiSelectionMenu';
import { CombinationContext } from '../CombinationContext';
import { MultiSelectionContext } from '../../../Menu/Smart/MultiSelectionContext';
import { SelectionMode } from '../../../Menu/Smart/SelectionMode';
import { HealMenuItem } from '../../../Menu/Buttons/HealMenuItem';
import { MedicField } from '../../../Items/Cell/Field/Bonus/MedicField';
import { AttackMenuItem } from '../../../Menu/Buttons/AttackMenuItem';
import { AttackField } from '../../../Items/Cell/Field/Bonus/AttackField';
import { SpeedFieldMenuItem } from '../../../Menu/Buttons/SpeedFieldMenuItem';
import { FarmField } from '../../../Items/Cell/Field/Bonus/FarmField';
import { MoneyMenuItem } from '../../../Menu/Buttons/MoneyMenuItem';
import { RoadField } from '../../../Items/Cell/Field/Bonus/RoadField';
import { InteractionKind } from '../../IInteractionContext';
import { PoisonField } from '../../../Items/Cell/Field/Bonus/PoisonField';
import { GameSettings } from '../../../Framework/GameSettings';
import { InteractionMode } from '../../InteractionMode';
import { AppHandler } from '../../../../Components/Canvas/AppHandler';
import { AbstractSingleCombination } from '../AbstractSingleCombination';
import { GameContext } from '../../../Framework/GameContext';
import { IField } from '../../../Items/Cell/Field/IField';

export class MultiCellSelectionCombination extends AbstractSingleCombination {
	private _cells: Cell[];

	constructor(
		private _multiselection: MultiSelectionMenu,
		private _multiSelectionContext: MultiSelectionContext,
		private _appHandler: AppHandler,
		private _gameContext: GameContext
	) {
		super();
		this._cells = [];
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			(context.ContextMode === InteractionMode.MultipleSelection &&
				this._multiselection.GetMode() === SelectionMode.cell &&
				(context.InteractionKind === InteractionKind.Up ||
					context.InteractionKind === InteractionKind.MovingUp)) ||
			(context.ContextMode === InteractionMode.SingleSelection &&
				(context.InteractionKind === InteractionKind.Up ||
					context.InteractionKind === InteractionKind.MovingUp) &&
				this._cells.length > 0 &&
				context.Items.length > 0 &&
				!(context.Items[context.Items.length] instanceof Cell))
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			if (this._cells.length === 0) {
				this._cells = this._multiSelectionContext.GetCells();
				this._cells.forEach((c) => {
					c.SetSelected(true);
				});
				this._multiSelectionContext.Close();
				if (this._cells.length === 0) {
					this.OnChangedMode.Invoke(this, InteractionMode.SingleSelection);
					this._appHandler.RestartNavigation();
				} else {
					this._gameContext.OnItemSelected.Invoke(this, this._cells[0]);
					this.OnChangedMode.Invoke(this, InteractionMode.SingleSelection);
				}
			} else {
				let menuItem = context.Items[0];
				const cost = GameSettings.FieldPrice * this._cells.length;
				if (menuItem && this._gameContext.MainHq.HasMoney(cost)) {
					if (menuItem instanceof HealMenuItem) {
						this.SetMenuItem((c) => new MedicField(c, this._gameContext.MainHq), 'Heal');
					} else if (menuItem instanceof AttackMenuItem) {
						this.SetMenuItem((c) => new AttackField(c, this._gameContext.MainHq), 'Attack');
					} else if (menuItem instanceof ShieldMenuItem) {
						this.SetMenuItem((c) => new ShieldField(c, this._gameContext.MainHq), 'Shield');
					} else if (menuItem instanceof SpeedFieldMenuItem) {
						this.SetMenuItem((c) => new RoadField(c, this._gameContext.MainHq), 'Fast');
					} else if (menuItem instanceof PoisonMenuItem) {
						this.SetMenuItem((c) => new PoisonField(c, this._gameContext.MainHq), 'Poison');
					} else if (menuItem instanceof ThunderMenuItem) {
						this.SetMenuItem((c) => new BatteryField(c, this._gameContext.MainHq), 'Battery');
					} else if (menuItem instanceof NetworkMenuItem) {
						this.SetMenuItem((c) => new NetworkField(c, this._gameContext.MainHq), 'Network');
					} else if (menuItem instanceof SlowMenuItem) {
						this.SetMenuItem(
							(c) => new SlowField(c, this._gameContext.MainHq.GetSkin().GetLight()),
							'Slow'
						);
					} else if (menuItem instanceof MoneyMenuItem) {
						this.SetMenuItem((c) => new FarmField(c, this._gameContext.MainHq), 'Money');
					}
					this._gameContext.MainHq.Buy(cost);
				}

				this._cells.forEach((c) => {
					c.SetSelected(false);
				});
				this._cells = [];
				context.Items.splice(context.Items.length - 1, 1);
				this._appHandler.RestartNavigation();
			}
			return true;
		}
		return false;
	}
	private SetMenuItem(getField: (e: Cell) => IField, fieldType: string) {
		this._cells.forEach((c) => {
			if (c.GetField() instanceof BasicField) {
				this._cells.forEach((c) => {
					// PeerHandler.SendMessage(PacketKind.Field, {
					// 	Hq: this._gameContext.MainHq.GetCurrentCell().GetCoordinate(),
					// 	cell: c.GetCoordinate(),
					// 	Type: fieldType
					// });
				});
				getField(c);
			}
		});
	}
}
