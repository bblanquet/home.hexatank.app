import { Field } from '../Field';
import { Vehicle } from '../../../Unit/Vehicle';
import { IAnimator } from '../../../Animator/IAnimator';
import { Cell } from '../../Cell';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { BouncingScaleAnimator } from '../../../Animator/BouncingScaleAnimator';
import { CellState } from '../../CellState';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../../../../Interaction/InteractionContext';

export abstract class BonusField extends Field {
	private _animator: IAnimator;
	private _isIncreasingOpacity: boolean = false;
	public IsActive: boolean = false;

	constructor(cell: Cell, private _light: string, private _bonus: string[]) {
		super(cell);
		this.GetCell().SetField(this);
		this.Z = 1;
		this.GenerateSprite(Archive.bonus.coverBottom);
		this._bonus.forEach((b) => {
			this.GenerateSprite(b);
		});
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

	public GetBoundingBox(): BoundingBox {
		return this.GetCell().GetBoundingBox();
	}
	public Select(context: InteractionContext): boolean {
		return false;
	}

	public Update(viewX: number, viewY: number): void {
		if (!this._animator.IsDone) {
			this._animator.Update(viewX, viewY);
		} else {
			super.Update(viewX, viewY);
		}
		if (this.IsActive) {
			this.SetProperty(this._light, (s) => {
				if (s.alpha < 0.1) {
					this._isIncreasingOpacity = true;
				}

				if (1 <= s.alpha) {
					this._isIncreasingOpacity = false;
				}

				s.alpha += this._isIncreasingOpacity ? 0.01 : -0.01;
			});
		} else {
			this.SetProperty(this._light, (e) => (e.alpha = 0));
		}
	}

	abstract Support(vehicule: Vehicle): void;

	IsDesctrutible(): boolean {
		return false;
	}
	IsBlocking(): boolean {
		return false;
	}
}
