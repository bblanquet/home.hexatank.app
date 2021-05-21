import { BonusValueProvider } from './BonusValueProvider';
import { CellUpCondition } from './../../../Unit/PowerUp/Condition/CellUpCondition';
import { Tank } from './../../../Unit/Tank';
import { AttackUp } from './../../../Unit/PowerUp/AttackUp';
import { ISelectable } from './../../../../ISelectable';
import { Cell } from '../../Cell';
import { BonusField } from './BonusField';
import { Vehicle } from '../../../Unit/Vehicle';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Headquarter } from '../Hq/Headquarter';
import { LiteEvent } from '../../../../Utils/Events/LiteEvent';

export class AttackField extends BonusField {
	SelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();
	private _bonusValue: BonusValueProvider = new BonusValueProvider();
	constructor(cell: Cell, hq: Headquarter) {
		super(cell, [ Archive.bonus.strength ], hq, false);
		this.GenerateSprite(Archive.selectionCell, (e) => {
			e.alpha = 0;
		});
		this.InitPosition(cell.GetBoundingBox());
	}

	Support(vehicule: Vehicle): void {}

	public SetPowerUp(vehicule: Vehicle): void {
		if (vehicule instanceof Tank) {
			if (vehicule.IsPacific) {
				return;
			}
			const energy = this.GetReactorsPower(this.hq);
			const sum = this._bonusValue.GetPower(energy);
			if (0 < sum) {
				const up = new AttackUp(vehicule, new CellUpCondition(vehicule), sum);
				vehicule.SetPowerUp(up);
			}
		}
	}
}
