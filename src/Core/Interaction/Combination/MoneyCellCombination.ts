import { isNullOrUndefined } from 'util';
import { ICombination } from './ICombination';
import { Cell } from '../../Items/Cell/Cell';
import { MoneyMenuItem } from '../../Menu/Buttons/MoneyMenuItem';
import { BasicField } from '../../Items/Cell/Field/BasicField';
import { GameHelper } from '../../Framework/GameHelper';
import { MoneyField } from '../../Items/Cell/Field/MoneyField';
import { PeerHandler } from '../../../Components/Network/Host/On/PeerHandler';
import { PacketKind } from '../../../Components/Network/PacketKind';
import { CombinationContext } from './CombinationContext';
import { InteractionMode } from '../InteractionMode';
import { InteractionKind } from '../IInteractionContext';
import { GameSettings } from '../../Framework/GameSettings';

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
		return (
			context.ContextMode === InteractionMode.SingleSelection && context.InteractionKind === InteractionKind.Up
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let cell = <Cell>context.Items[0];
			if (!isNullOrUndefined(cell)) {
				if (cell.GetField() instanceof BasicField) {
					if (GameHelper.PlayerHeadquarter.HasMoney(GameSettings.FieldPrice)) {
						GameHelper.PlayerHeadquarter.Buy(GameSettings.FieldPrice);
						PeerHandler.SendMessage(PacketKind.Field, {
							Hq: GameHelper.PlayerHeadquarter.GetCurrentCell().GetCoordinate(),
							cell: cell.GetCoordinate(),
							Type: 'Money'
						});
						let field = new MoneyField(cell);
						GameHelper.Playground.Items.push(field);
					}
				}
			}
			context.Items.splice(0, 2);
			cell.SetSelected(false);
			return true;
		}
		return false;
	}
}
