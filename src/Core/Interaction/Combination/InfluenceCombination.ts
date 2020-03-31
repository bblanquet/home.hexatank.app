import { GameHelper } from '../../Framework/GameHelper';
import { InfluenceField } from '../../Items/Cell/Field/InfluenceField';
import { InfluenceMenuItem } from '../../Menu/Buttons/InfluenceMenuItem';
import { isNullOrUndefined } from 'util';
import { ICombination } from './ICombination';
import { Cell } from '../../Items/Cell/Cell';
import { BasicField } from '../../Items/Cell/Field/BasicField';
import { PeerHandler } from '../../../Components/Network/Host/On/PeerHandler';
import { PacketKind } from '../../../Components/Network/PacketKind';
import { CombinationContext } from './CombinationContext';
import { InteractionMode } from '../InteractionMode';
import { InteractionKind } from '../IInteractionContext';
import { GameSettings } from '../../Framework/GameSettings';

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
		return (
			context.ContextMode === InteractionMode.SingleSelection && context.InteractionKind === InteractionKind.Up
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let cell = <Cell>context.Items[0];
			if (!isNullOrUndefined(cell)) {
				if (cell.GetField() instanceof BasicField) {
					if (
						GameHelper.PlayerHeadquarter.Buy(
							GameSettings.TruckPrice * GameHelper.PlayerHeadquarter.GetInfluenceCount()
						)
					) {
						PeerHandler.SendMessage(PacketKind.Field, {
							Hq: GameHelper.PlayerHeadquarter.GetCurrentCell().GetCoordinate(),
							cell: cell.GetCoordinate(),
							Type: 'Influence'
						});
						let field = new InfluenceField(cell, GameHelper.PlayerHeadquarter);
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
