import { GameSettings } from '../../../../Framework/GameSettings';
import { Cell } from '../../Cell';
import { Field } from '../Field';
import { CellState } from '../../CellState';
import { TickTimer } from '../../../../Utils/Timer/TickTimer';
import { Light } from '../../../Environment/Light';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../../../../Interaction/InteractionContext';
import { Vehicle } from '../../../Unit/Vehicle';
import { Truck } from '../../../Unit/Truck';
import { IAnimator } from '../../../Animator/IAnimator';
import { BouncingScaleAnimator } from '../../../Animator/BouncingScaleAnimator';

export class MoneyField extends Field {
	private _timer: TickTimer;
	private _lightItem: Light;
	private _animator: IAnimator;
	private _isIncreasingOpacity: boolean = false;

	constructor(cell: Cell, private _light: string) {
		super(cell);
		this.GetCell().SetField(this);
		this.Z = 1;
		this._timer = new TickTimer(GameSettings.MoneyLoadingSpeed);
		this._lightItem = new Light(cell.GetBoundingBox());
		this._lightItem.Hide();
		this.GenerateSprite(Archive.bonus.coverBottom);
		this.GenerateSprite(Archive.bonus.emptyMoney);
		this.GenerateSprite(Archive.bonus.fullMoney, (s) => (s.alpha = 0));
		this.GenerateSprite(this._light);
		this.GenerateSprite(Archive.bonus.coverTop);

		this.InitPosition(cell.GetBoundingBox());
		this.GetDisplayObjects().forEach((obj) => {
			obj.visible = this.GetCell().IsVisible();
		});
		this._animator = new BouncingScaleAnimator(this);
	}

	protected OnCellStateChanged(cellState: CellState): void {
		this.GetDisplayObjects().forEach((s) => {
			s.visible = cellState !== CellState.Hidden;
		});
	}

	public IsFull(): boolean {
		return this.GetCurrentSprites()[Archive.bonus.fullMoney].alpha >= 1;
	}

	private SetEmpty(): void {
		this.SetProperty(Archive.bonus.fullMoney, (s) => (s.alpha = 0));
	}

	public GetBoundingBox(): BoundingBox {
		return this.GetCell().GetBoundingBox();
	}
	public Select(context: InteractionContext): boolean {
		return false;
	}
	Support(vehicule: Vehicle): void {
		if (this.IsFull()) {
			if (vehicule instanceof Truck) {
				let truck = vehicule as Truck;
				const sum = this.GetInfluenceSum(vehicule);
				truck.Hq.Earn(1 + sum);
				this.SetEmpty();
				this._lightItem.Hide();
			}
		}

		vehicule.TranslationSpeed = GameSettings.TranslationSpeed;
		vehicule.RotationSpeed = GameSettings.RotationSpeed;
		vehicule.Attack = GameSettings.Attack;
	}

	IsDesctrutible(): boolean {
		return false;
	}

	IsBlocking(): boolean {
		return false;
	}

	public Update(viewX: number, viewY: number): void {
		if (!this._animator.IsDone) {
			this._animator.Update(viewX, viewY);
		} else {
			super.Update(viewX, viewY);
		}

		if (this.IsFull()) {
			this._lightItem.Update(viewX, viewY);
		}

		if (!this.IsFull()) {
			if (this._timer.IsElapsed()) {
				this.SetProperty(Archive.bonus.fullMoney, (s) => (s.alpha += 0.02));
				if (this.GetCurrentSprites()[Archive.bonus.fullMoney].alpha >= 1) {
					this._lightItem.Display();
				}
			}
		}

		this.SetProperty(this._light, (s) => {
			if (s.alpha < 0.1) {
				this._isIncreasingOpacity = true;
			}

			if (1 <= s.alpha) {
				this._isIncreasingOpacity = false;
			}

			s.alpha += this._isIncreasingOpacity ? 0.01 : -0.01;
		});
	}
}
