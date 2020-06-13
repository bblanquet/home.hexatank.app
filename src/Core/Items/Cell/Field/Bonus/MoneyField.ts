import { GameSettings } from '../../../../Framework/GameSettings';
import { Cell } from '../../Cell';
import { TickTimer } from '../../../../Utils/Timer/TickTimer';
import { Light } from '../../../Environment/Light';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { Truck } from '../../../Unit/Truck';
import { Headquarter } from '../Hq/Headquarter';
import { BonusField } from './BonusField';
import { CellState } from '../../CellState';

export class MoneyField extends BonusField {
	private _timer: TickTimer;
	private _lightItem: Light;

	constructor(cell: Cell, protected hq: Headquarter) {
		super(cell, [ Archive.bonus.emptyMoney, Archive.bonus.fullMoney ], hq);
		this._timer = new TickTimer(GameSettings.MoneyLoadingSpeed);
		this._lightItem = new Light(cell.GetBoundingBox());
		this._lightItem.Hide();

		this.SetProperty(Archive.bonus.fullMoney, (e) => (e.alpha = 0));
	}

	public IsFull(): boolean {
		return this.GetCurrentSprites().Get(Archive.bonus.fullMoney).alpha >= 1;
	}

	private SetEmpty(): void {
		this.SetProperty(Archive.bonus.fullMoney, (s) => (s.alpha = 0));
	}

	Support(vehicule: Vehicle): void {
		if (this.IsFull()) {
			if (vehicule instanceof Truck) {
				let truck = vehicule as Truck;
				const sum = this.GetReactorsPower(this.hq) * 0.3;
				truck.Hq.Earn(1 + sum);
				this.SetEmpty();
				this._lightItem.Hide();
			}
		}

		vehicule.TranslationSpeed = GameSettings.TranslationSpeed;
		vehicule.RotationSpeed = GameSettings.RotationSpeed;
		vehicule.Attack = GameSettings.Attack;
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);

		if (this.IsFull() && this.GetCell().GetState() === CellState.Visible) {
			this._lightItem.Update(viewX, viewY);
		}

		if (!this.IsFull() && this.Energy > 0) {
			if (this._timer.IsElapsed()) {
				this.SetProperty(Archive.bonus.fullMoney, (s) => (s.alpha += 0.02));
				if (this.GetCurrentSprites().Get(Archive.bonus.fullMoney).alpha >= 1) {
					this._lightItem.Display();
				}
			}
		}
	}
}
