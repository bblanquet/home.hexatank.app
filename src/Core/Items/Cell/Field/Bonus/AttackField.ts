import { ISelectable } from './../../../../ISelectable';
import { Cell } from '../../Cell';
import { BonusField } from './BonusField';
import { Vehicle } from '../../../Unit/Vehicle';
import { GameSettings } from '../../../../Framework/GameSettings';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Headquarter } from '../Hq/Headquarter';
import { LiteEvent } from '../../../../Utils/Events/LiteEvent';

export class AttackField extends BonusField implements ISelectable {
	SelectionChanged: LiteEvent<ISelectable> = new LiteEvent<ISelectable>();

	constructor(cell: Cell, hq: Headquarter) {
		super(cell, [ Archive.bonus.strength ], hq, false);
		this.GenerateSprite(Archive.selectionCell, (e) => {
			e.alpha = 0;
		});
		this.InitPosition(cell.GetBoundingBox());
	}

	Support(vehicule: Vehicle): void {
		if (0 < this.Energy) {
			const sum = this.GetReactorsPower(this.hq) * 0.1;
			vehicule.TranslationSpeed = GameSettings.TranslationSpeed;
			vehicule.RotationSpeed = GameSettings.RotationSpeed;
			vehicule.Attack = GameSettings.Attack + 2 + sum;
		}
	}

	SetSelected(isSelected: boolean): void {
		this.SetProperty(Archive.selectionCell, (e) => (e.alpha = isSelected ? 1 : 0));
		this.SelectionChanged.Invoke(this, this);
	}
	IsSelected(): boolean {
		return this.GetCurrentSprites().Get(Archive.selectionCell).alpha === 1;
	}
}
