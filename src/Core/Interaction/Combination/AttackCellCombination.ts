import { isNullOrUndefined } from 'util';
import { AttackMenuItem } from '../../Menu/Buttons/AttackMenuItem';
import { Cell } from '../../Items/Cell/Cell';
import { BasicField } from '../../Items/Cell/Field/BasicField';
import { GameHelper } from '../../Framework/GameHelper';
import { AttackField } from '../../Items/Cell/Field/AttackField';
import { PacketKind } from '../../../Components/Network/PacketKind';
import { PeerHandler } from '../../../Components/Network/Host/On/PeerHandler';
import { CombinationContext } from './CombinationContext';
import { GameSettings } from '../../Framework/GameSettings';
import { AbstractSingleCombination } from './AbstractSingleCombination';
import { GameContext } from '../../Framework/GameContext';

export class AttackCellCombination extends AbstractSingleCombination {
	constructor(private _gameContext: GameContext) {
		super();
	}

	IsMatching(combination: CombinationContext): boolean {
		return (
			this.IsNormalMode(combination) &&
			combination.Items.length >= 2 &&
			combination.Items[0] instanceof Cell &&
			combination.Items[1] instanceof AttackMenuItem
		);
	}

	Combine(combination: CombinationContext): boolean {
		if (this.IsMatching(combination)) {
			let cell = <Cell>combination.Items[0];
			if (!isNullOrUndefined(cell)) {
				if (cell.GetField() instanceof BasicField) {
					if (this._gameContext.MainHq.HasMoney(GameSettings.FieldPrice)) {
						this._gameContext.MainHq.Buy(GameSettings.FieldPrice);
						PeerHandler.SendMessage(PacketKind.Field, {
							Hq: this._gameContext.MainHq.GetCurrentCell().GetCoordinate(),
							cell: cell.GetCoordinate(),
							Type: 'Attack'
						});
						let field = new AttackField(cell);
						GameHelper.Playground.Items.push(field);
					}
				}
			}
			combination.Items.splice(0, 2);
			cell.SetSelected(false);
			return true;
		}
		return false;
	}
}
