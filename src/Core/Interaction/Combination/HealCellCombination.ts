import { HealMenuItem } from '../../Menu/Buttons/HealMenuItem';
import { isNullOrUndefined } from 'util';
import { Cell } from '../../Items/Cell/Cell';
import { BasicField } from '../../Items/Cell/Field/BasicField';
import { GameHelper } from '../../Framework/GameHelper';
import { HealField } from '../../Items/Cell/Field/HealField';
import { PeerHandler } from '../../../Components/Network/Host/On/PeerHandler';
import { PacketKind } from '../../../Components/Network/PacketKind';
import { CombinationContext } from './CombinationContext';
import { GameSettings } from '../../Framework/GameSettings';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { GameContext } from '../../Framework/GameContext';

export class HealCellCombination extends AbstractSingleCombination {
	constructor(private _gameContext: GameContext) {
		super();
	}

	public IsMatching(context: CombinationContext): boolean {
		return (
			this.IsNormalMode(context) &&
			context.Items.length >= 2 &&
			context.Items[0] instanceof Cell &&
			context.Items[1] instanceof HealMenuItem
		);
	}

	Combine(context: CombinationContext): boolean {
		if (this.IsMatching(context)) {
			let cell = <Cell>context.Items[0];
			if (!isNullOrUndefined(cell)) {
				if (cell.GetField() instanceof BasicField) {
					if (this._gameContext.MainHq.HasMoney(GameSettings.FieldPrice)) {
						this._gameContext.MainHq.Buy(GameSettings.FieldPrice);
						PeerHandler.SendMessage(PacketKind.Field, {
							Hq: this._gameContext.MainHq.GetCurrentCell().GetCoordinate(),
							cell: cell.GetCoordinate(),
							Type: 'Heal'
						});
						let field = new HealField(cell);
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
