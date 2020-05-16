import { BouncingScaleAnimator } from '../../../Animator/BouncingScaleAnimator';
import { IAnimator } from '../../../Animator/IAnimator';
import { Cell } from '../../Cell';
import { Field } from '../Field';
import { CellState } from '../../CellState';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../../../../Interaction/InteractionContext';
import { Vehicle } from '../../../Unit/Vehicle';
import { GameSettings } from '../../../../Framework/GameSettings';

export class HealField extends Field {
	private _isIncreasingOpacity: boolean = false;
	private _animator: IAnimator;

	constructor(cell: Cell, private _light: string) {
		super(cell);
		this.GetCell().SetField(this);
		this.Z = 1;
		this.GenerateSprite(Archive.bonus.coverBottom);
		this.GenerateSprite(Archive.bonus.health);
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
	Support(vehicule: Vehicle): void {
		const sum = this.GetInfluenceSum(vehicule);
		vehicule.SetDamage(-(0.1 + sum));
		vehicule.TranslationSpeed = GameSettings.TranslationSpeed;
		vehicule.RotationSpeed = GameSettings.RotationSpeed;
		vehicule.Attack = GameSettings.Attack;
	}

	public Update(viewX: number, viewY: number): void {
		if (!this._animator.IsDone) {
			this._animator.Update(viewX, viewY);
		} else {
			super.Update(viewX, viewY);
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

	IsDesctrutible(): boolean {
		return false;
	}

	IsBlocking(): boolean {
		return false;
	}
}
