import { SlowMenuItem } from '../../Menu/Buttons/SlowMenuItem';
import { isNullOrUndefined } from 'util';
import { ICombination } from './ICombination';
import { Cell } from '../../Items/Cell/Cell';
import { BasicField } from '../../Items/Cell/Field/BasicField';
import { GameHelper } from '../../Framework/GameHelper';
import { PeerHandler } from '../../../Components/Network/Host/On/PeerHandler';
import { PacketKind } from '../../../Components/Network/PacketKind';
import { CombinationContext } from './CombinationContext';
import { InteractionMode } from '../InteractionMode';
import { InteractionKind } from '../IInteractionContext';
import { SlowField } from '../../Items/Cell/Field/SlowField';
import { GameSettings } from '../../Framework/GameSettings';

export class SlowCellCombination implements ICombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length >= 2 &&
			context.Items[0] instanceof Cell &&
			context.Items[1] instanceof SlowMenuItem
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
							Type: 'Slow'
						});
						let field = new SlowField(cell);
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
