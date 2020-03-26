import { SlowField } from '../../../Cell/Field/SlowField';
import { SlowMenuItem } from '../../../Menu/Buttons/SlowMenuItem';
import { PoisonMenuItem } from '../../../Menu/Buttons/PoisonMenuItem';
import { Cell } from '../../../Cell/Cell';
import { MultiSelectionMenu } from '../../../Menu/Smart/MultiSelectionMenu';
import { ICombination } from '../ICombination';
import { CombinationContext } from '../CombinationContext';
import { ContextMode } from '../../../Utils/ContextMode';
import { MovingInteractionContext } from '../../../Menu/Smart/MovingInteractionContext';
import { SelectionMode } from '../../../Menu/Smart/SelectionMode';
import { PlaygroundHelper } from '../../../Utils/PlaygroundHelper';
import { HealMenuItem } from '../../../Menu/Buttons/HealMenuItem';
import { PeerHandler } from '../../../../Components/Network/Host/On/PeerHandler';
import { PacketKind } from '../../../../Components/Network/PacketKind';
import { HealField } from '../../../Cell/Field/HealField';
import { AttackMenuItem } from '../../../Menu/Buttons/AttackMenuItem';
import { AttackField } from '../../../Cell/Field/AttackField';
import { SpeedFieldMenuItem } from '../../../Menu/Buttons/SpeedFieldMenuItem';
import { MoneyField } from '../../../Cell/Field/MoneyField';
import { MoneyMenuItem } from '../../../Menu/Buttons/MoneyMenuItem';
import { FastField } from '../../../Cell/Field/FastField';
import { InteractionContext } from '../../InteractionContext';
import { InteractionKind } from '../../IInteractionContext';
import { Field } from '../../../Cell/Field/Field';
import { PoisonField } from '../../../Cell/Field/PoisonField';
import { GameSettings } from '../../../Utils/GameSettings';

export class MultiCellSelectionCombination implements ICombination {
	private _cells: Cell[];

	constructor(
		private _multiselection: MultiSelectionMenu,
		private _multiSelectionContext: MovingInteractionContext,
		private _interactionContext: InteractionContext
	) {
		this._cells = [];
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			(context.ContextMode === ContextMode.MultipleSelection &&
				this._multiselection.GetMode() === SelectionMode.cell &&
				(context.InteractionKind === InteractionKind.Up ||
					context.InteractionKind === InteractionKind.MovingUp)) ||
			(context.ContextMode === ContextMode.SingleSelection &&
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
					this._interactionContext.Mode = ContextMode.SingleSelection;
					PlaygroundHelper.RestartNavigation();
				} else {
					PlaygroundHelper.SelectedItem.trigger(this, this._cells[0]);
					this._interactionContext.Mode = ContextMode.SingleSelection;
				}
			} else {
				let menuItem = context.Items[0];
				const cost = GameSettings.FieldPrice * this._cells.length;
				if (menuItem && PlaygroundHelper.PlayerHeadquarter.HasMoney(cost)) {
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
				PlaygroundHelper.RestartNavigation();
			}
			return true;
		}
		return false;
	}
	private SetMenuItem(getField: (e: Cell) => Field, fieldType: string) {
		this._cells.forEach((c) => {
			PeerHandler.SendMessage(PacketKind.Field, {
				Hq: PlaygroundHelper.PlayerHeadquarter.GetCurrentCell().GetCoordinate(),
				cell: c.GetCoordinate(),
				Type: fieldType
			});
			PlaygroundHelper.Playground.Items.push(getField(c));
		});
	}

	Clear(): void {}
}
