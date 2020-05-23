import { GameHelper } from '../../Framework/GameHelper';
import { Reactor } from '../../Items/Cell/Field/Bonus/Reactor';
import { InfluenceMenuItem } from '../../Menu/Buttons/InfluenceMenuItem';
import { isNullOrUndefined } from 'util';
import { Cell } from '../../Items/Cell/Cell';
import { BasicField } from '../../Items/Cell/Field/BasicField';
import { PeerHandler } from '../../../Components/Network/Host/On/PeerHandler';
import { PacketKind } from '../../../Components/Network/PacketKind';
import { CombinationContext } from './CombinationContext';
import { GameSettings } from '../../Framework/GameSettings';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { GameContext } from '../../Framework/GameContext';

export class InfluenceCombination extends AbstractSingleCombination {
	constructor(private _gameContext: GameContext) {
		super();
	}

	IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length >= 2 &&
			context.Items[0] instanceof Cell &&
			context.Items[1] instanceof InfluenceMenuItem
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let cell = <Cell>context.Items[0];
			if (!isNullOrUndefined(cell)) {
				if (cell.GetField() instanceof BasicField) {
					if (
						this._gameContext.MainHq.Buy(
							GameSettings.TruckPrice * this._gameContext.MainHq.GetInfluenceCount()
						)
					) {
						PeerHandler.SendMessage(PacketKind.Field, {
							Hq: this._gameContext.MainHq.GetCurrentCell().GetCoordinate(),
							cell: cell.GetCoordinate(),
							Type: 'Influence'
						});
						new Reactor(
							cell,
							this._gameContext.MainHq,
							this._gameContext,
							this._gameContext.MainHq.GetSkin().GetLight()
						);
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
