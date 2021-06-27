import { CellUpCondition } from '../../../Unit/PowerUp/Condition/CellUpCondition';
import { Tank } from '../../../Unit/Tank';
import { FireUp } from '../../../Unit/PowerUp/FireUp';
import { ISelectable } from '../../../../ISelectable';
import { Cell } from '../../Cell';
import { BonusField } from './BonusField';
import { Vehicle } from '../../../Unit/Vehicle';
import { SvgArchive } from '../../../../Framework/SvgArchiver';
import { LiteEvent } from '../../../../Utils/Events/LiteEvent';
import { IHeadquarter } from '../Hq/IHeadquarter';

export class FireField extends BonusField {
	SelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();
	constructor(cell: Cell, hq: IHeadquarter) {
		super(cell, [ SvgArchive.bonus.strength ], hq, false);
		this.GenerateSprite(SvgArchive.selectionCell, (e) => {
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
			const up = new FireUp(vehicule, new CellUpCondition(vehicule), energy, this.OnEnergyChanged);
			vehicule.AddPowerUp(up);
		}
	}
}
