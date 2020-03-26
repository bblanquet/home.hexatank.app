import { isNullOrUndefined } from 'util';
import { ICombination } from './ICombination';
import { AttackMenuItem } from '../../Menu/Buttons/AttackMenuItem';
import { Cell } from '../../Cell/Cell';
import { BasicField } from '../../Cell/Field/BasicField';
import { PlaygroundHelper } from '../../Utils/PlaygroundHelper';
import { AttackField } from '../../Cell/Field/AttackField';
import { PacketKind } from '../../../Components/Network/PacketKind';
import { PeerHandler } from '../../../Components/Network/Host/On/PeerHandler';
import { CombinationContext } from './CombinationContext';
import { ContextMode } from '../../Utils/ContextMode';
import { InteractionKind } from '../IInteractionContext';
import { GameSettings } from '../../Utils/GameSettings';

export class AttackCellCombination implements ICombination {
	IsMatching(combination: CombinationContext): boolean {
		return (
			this.IsNormalMode(combination) &&
			combination.Items.length >= 2 &&
			combination.Items[0] instanceof Cell &&
			combination.Items[1] instanceof AttackMenuItem
		);
	}

	private IsNormalMode(context: CombinationContext) {
		return context.ContextMode === ContextMode.SingleSelection && context.InteractionKind === InteractionKind.Up;
	}

	Combine(combination: CombinationContext): boolean {
		if (this.IsMatching(combination)) {
			let cell = <Cell>combination.Items[0];
			if (!isNullOrUndefined(cell)) {
				if (cell.GetField() instanceof BasicField) {
					if (PlaygroundHelper.PlayerHeadquarter.HasMoney(GameSettings.FieldPrice)) {
						PlaygroundHelper.PlayerHeadquarter.Buy(GameSettings.FieldPrice);
						PeerHandler.SendMessage(PacketKind.Field, {
							Hq: PlaygroundHelper.PlayerHeadquarter.GetCurrentCell().GetCoordinate(),
							cell: cell.GetCoordinate(),
							Type: 'Attack'
						});
						let field = new AttackField(cell);
						PlaygroundHelper.Playground.Items.push(field);
					}
				}
			}
			combination.Items.splice(0, 2);
			cell.SetSelected(false);
			return true;
		}
		return false;
	}

	Clear(): void {}
}
