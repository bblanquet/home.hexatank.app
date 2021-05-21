import { BonusValueProvider } from './BonusValueProvider';
import { TimeTimer } from './../../../../Utils/Timer/TimeTimer';
import { GameSettings } from '../../../../Framework/GameSettings';
import { Cell } from '../../Cell';
import { Light } from '../../../Environment/Light';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { Truck } from '../../../Unit/Truck';
import { Headquarter } from '../Hq/Headquarter';
import { BonusField } from './BonusField';
import { CellState } from '../../CellState';

export class FarmField extends BonusField {
	private _timer: TimeTimer;
	private _lightItem: Light;
	private _bonusProvider: BonusValueProvider = new BonusValueProvider();

	constructor(cell: Cell, protected hq: Headquarter) {
		super(cell, [ Archive.bonus.emptyMoney, Archive.bonus.fullMoney ], hq);
		this._timer = new TimeTimer(GameSettings.FarmLoading);
		this._lightItem = new Light(cell.GetBoundingBox());
		this._lightItem.Hide();

		this.SetProperty(Archive.bonus.fullMoney, (e) => (e.alpha = 0));
		this.GetCell().OnCellStateChanged.On(this.HandleCellStateChanged.bind(this));
		this._lightItem.GetCurrentSprites().Values().forEach((s) => {
			s.visible = cell.GetState() !== CellState.Hidden;
		});
	}

	protected HandleCellStateChanged(source: any, cellState: CellState): void {
		this._lightItem.GetCurrentSprites().Values().forEach((s) => {
			s.visible = cellState !== CellState.Hidden;
		});
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
				const energy = this.GetReactorsPower(this.hq);
				this.SetEmpty();
				this._lightItem.Hide();
				truck.Hq.Earn(this._bonusProvider.GetDiamondValue(energy));
			}
		}

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
