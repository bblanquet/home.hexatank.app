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

	constructor(cell: Cell, hq: Headquarter) {
		super(cell, [ Archive.bonus.strength ], hq, false);
		this.GenerateSprite(Archive.selectionCell, (e) => {
			e.alpha = 0;
		});
		this.InitPosition(cell.GetBoundingBox());
	}

	Support(vehicule: Vehicle): void {}

	public SetPowerUp(vehicule: Vehicle): void {
		if (!(vehicule.PowerUps instanceof AttackUp) && vehicule instanceof Tank) {
			const sum = this.GetReactorsPower(this.hq) * 5;
			const up = new AttackUp(vehicule, new CellUpCondition(vehicule), sum);
			vehicule.SetPowerUp(up);
		}
	}
}
