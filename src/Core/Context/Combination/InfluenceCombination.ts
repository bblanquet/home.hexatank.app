import { PlaygroundHelper } from './../../Utils/PlaygroundHelper';
import { InfluenceField } from '../../Cell/Field/InfluenceField';
import { InfluenceMenuItem } from '../../Menu/Buttons/InfluenceMenuItem';
import { isNullOrUndefined } from 'util';
import { ICombination } from './ICombination';
import { Cell } from '../../Cell/Cell';
import { BasicField } from '../../Cell/Field/BasicField';
import { PeerHandler } from '../../../Components/Network/Host/On/PeerHandler';
import { PacketKind } from '../../../Components/Network/PacketKind';
import { CombinationContext } from './CombinationContext';
import { ContextMode } from '../../Utils/ContextMode';
import { InteractionKind } from '../IInteractionContext';
import { GameSettings } from '../../Utils/GameSettings';

export class InfluenceCombination implements ICombination {
	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length >= 2 &&
			context.Items[0] instanceof Cell &&
			context.Items[1] instanceof InfluenceMenuItem
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
					if (
						PlaygroundHelper.PlayerHeadquarter.Buy(
							GameSettings.TruckPrice * PlaygroundHelper.PlayerHeadquarter.GetInfluenceCount()
						)
					) {
						PeerHandler.SendMessage(PacketKind.Field, {
							Hq: PlaygroundHelper.PlayerHeadquarter.GetCurrentCell().GetCoordinate(),
							cell: cell.GetCoordinate(),
							Type: 'Influence'
						});
						let field = new InfluenceField(cell, PlaygroundHelper.PlayerHeadquarter);
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
