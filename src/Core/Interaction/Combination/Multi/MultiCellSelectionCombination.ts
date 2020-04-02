import { SlowField } from '../../../Items/Cell/Field/SlowField';
import { SlowMenuItem } from '../../../Menu/Buttons/SlowMenuItem';
import { PoisonMenuItem } from '../../../Menu/Buttons/PoisonMenuItem';
import { Cell } from '../../../Items/Cell/Cell';
import { MultiSelectionMenu } from '../../../Menu/Smart/MultiSelectionMenu';
import { CombinationContext } from '../CombinationContext';
import { MovingInteractionContext } from '../../../Menu/Smart/MovingInteractionContext';
import { SelectionMode } from '../../../Menu/Smart/SelectionMode';
import { GameHelper } from '../../../Framework/GameHelper';
import { HealMenuItem } from '../../../Menu/Buttons/HealMenuItem';
import { PeerHandler } from '../../../../Components/Network/Host/On/PeerHandler';
import { PacketKind } from '../../../../Components/Network/PacketKind';
import { HealField } from '../../../Items/Cell/Field/HealField';
import { AttackMenuItem } from '../../../Menu/Buttons/AttackMenuItem';
import { AttackField } from '../../../Items/Cell/Field/AttackField';
import { SpeedFieldMenuItem } from '../../../Menu/Buttons/SpeedFieldMenuItem';
import { MoneyField } from '../../../Items/Cell/Field/MoneyField';
import { MoneyMenuItem } from '../../../Menu/Buttons/MoneyMenuItem';
import { FastField } from '../../../Items/Cell/Field/FastField';
import { InteractionKind } from '../../IInteractionContext';
import { Field } from '../../../Items/Cell/Field/Field';
import { PoisonField } from '../../../Items/Cell/Field/PoisonField';
import { GameSettings } from '../../../Framework/GameSettings';
import { InteractionMode } from '../../InteractionMode';
import { AppHandler } from '../../../../Components/Canvas/AppHandler';
import { AbstractSingleCombination } from '../AbstractSingleCombination';
import { GameContext } from '../../../Framework/GameContext';

export class MultiCellSelectionCombination extends AbstractSingleCombination {
	private _cells: Cell[];

	constructor(
		private _multiselection: MultiSelectionMenu,
		private _multiSelectionContext: MovingInteractionContext,
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
				this._multiSelectionContext.Stop();
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
				if (menuItem && GameHelper.PlayerHeadquarter.HasMoney(cost)) {
					if (menuItem instanceof HealMenuItem) {
						this.SetMenuItem((c) => new HealField(c), 'Heal');
					} else if (menuItem instanceof AttackMenuItem) {
						this.SetMenuItem((c) => new AttackField(c), 'Attack');
					} else if (menuItem instanceof SpeedFieldMenuItem) {
						this.SetMenuItem((c) => new FastField(c), 'Fast');
					} else if (menuItem instanceof PoisonMenuItem) {
						this.SetMenuItem((c) => new PoisonField(c), 'Poison');
					} else if (menuItem instanceof SlowMenuItem) {
						this.SetMenuItem((c) => new SlowField(c), 'Slow');
					} else if (menuItem instanceof MoneyMenuItem) {
						this.SetMenuItem((c) => new MoneyField(c), 'Money');
					}
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
	private SetMenuItem(getField: (e: Cell) => Field, fieldType: string) {
		this._cells.forEach((c) => {
			PeerHandler.SendMessage(PacketKind.Field, {
				Hq: GameHelper.PlayerHeadquarter.GetCurrentCell().GetCoordinate(),
				cell: c.GetCoordinate(),
				Type: fieldType
			});
			GameHelper.Playground.Items.push(getField(c));
		});
	}
}
