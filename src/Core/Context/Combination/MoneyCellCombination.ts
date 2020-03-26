import { isNullOrUndefined } from 'util';
import { ICombination } from './ICombination';
import { Cell } from '../../Cell/Cell';
import { MoneyMenuItem } from '../../Menu/Buttons/MoneyMenuItem';
import { BasicField } from '../../Cell/Field/BasicField';
import { PlaygroundHelper } from '../../Utils/PlaygroundHelper';
import { MoneyField } from '../../Cell/Field/MoneyField';
import { PeerHandler } from '../../../Components/Network/Host/On/PeerHandler';
import { PacketKind } from '../../../Components/Network/PacketKind';
import { CombinationContext } from './CombinationContext';
import { ContextMode } from '../../Utils/ContextMode';
import { InteractionKind } from '../IInteractionContext';
import { GameSettings } from '../../Utils/GameSettings';

export class MoneyCellCombination implements ICombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length >= 2 &&
			context.Items[0] instanceof Cell &&
			context.Items[1] instanceof MoneyMenuItem
		);
	}

	private IsNormalMode(context: CombinationContext) {
		return context.ContextMode === ContextMode.SingleSelection && context.InteractionKind === InteractionKind.Up;
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let cell = <Cell>context.Items[0];
			if (!isNullOrUndefined(cell)) {
				if (cell.GetField() instanceof BasicField) {
					if (PlaygroundHelper.PlayerHeadquarter.HasMoney(GameSettings.FieldPrice)) {
						PlaygroundHelper.PlayerHeadquarter.Buy(GameSettings.FieldPrice);
						PeerHandler.SendMessage(PacketKind.Field, {
							Hq: PlaygroundHelper.PlayerHeadquarter.GetCurrentCell().GetCoordinate(),
							cell: cell.GetCoordinate(),
							Type: 'Money'
						});
						let field = new MoneyField(cell);
						PlaygroundHelper.Playground.Items.push(field);
					}
				}
			}
			context.Items.splice(0, 2);
			cell.SetSelected(false);
			return true;
		}
		return false;
	}

	Clear(): void {}
}
