import { UpCalculator } from './UpCalculator';
import { TimeTimer } from './../../../../Utils/Timer/TimeTimer';
import { GameSettings } from '../../../../Framework/GameSettings';
import { Cell } from '../../Cell';
import { Light } from '../../../Environment/Light';
import { SvgArchive } from '../../../../Framework/SvgArchiver';
import { Vehicle } from '../../../Unit/Vehicle';
import { Truck } from '../../../Unit/Truck';
import { Headquarter } from '../Hq/Headquarter';
import { BonusField } from './BonusField';
import { CellState } from '../../CellState';
import { IHeadquarter } from '../Hq/IHeadquarter';

export class FarmField extends BonusField {
	private _timer: TimeTimer;
	private _lightItem: Light;
	private _bonusProvider: UpCalculator = new UpCalculator();

	constructor(cell: Cell, protected hq: IHeadquarter) {
		super(cell, [ SvgArchive.bonus.emptyMoney, SvgArchive.bonus.fullMoney ], hq);
		this._timer = new TimeTimer(GameSettings.FarmLoading);
		this._lightItem = new Light(cell.GetBoundingBox());
		this._lightItem.Hide();

		this.SetProperty(SvgArchive.bonus.fullMoney, (e) => (e.alpha = 0));
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
		return this.GetCurrentSprites().Get(SvgArchive.bonus.fullMoney).alpha >= 1;
	}

	private SetEmpty(): void {
		this.SetProperty(SvgArchive.bonus.fullMoney, (s) => (s.alpha = 0));
	}

	Support(vehicule: Vehicle): void {
		if (this.IsFull()) {
			if (vehicule instanceof Truck) {
				let truck = vehicule as Truck;
				const energy = this.GetReactorsPower(this.hq);
				this.SetEmpty();
				this._lightItem.Hide();
				if (truck.IsEnemy(this.hq.Identity)) {
					this.hq.Earn(this._bonusProvider.GetDiamondValue(energy));
				}
			}
		}
	}

	public Update(viewX: number, viewY: number): void {
		super.Update(viewX, viewY);

		if (this.IsFull() && this.GetCell().GetState() === CellState.Visible) {
			this._lightItem.Update(viewX, viewY);
		}

		if (!this.IsFull() && this.Energy > 0) {
			if (this._timer.IsElapsed()) {
				this.SetProperty(SvgArchive.bonus.fullMoney, (s) => (s.alpha += 0.1));
				if (this.GetCurrentSprites().Get(SvgArchive.bonus.fullMoney).alpha >= 1) {
					this._lightItem.Display();
				}
			}
		}
	}
}
