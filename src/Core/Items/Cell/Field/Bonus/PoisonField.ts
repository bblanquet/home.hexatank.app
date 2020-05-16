import { Cell } from '../../Cell';
import { Field } from '../Field';
import { CellState } from '../../CellState';
import { Archive } from '../../../../Framework/ResourceArchiver';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../../../../Interaction/InteractionContext';
import { Vehicle } from '../../../Unit/Vehicle';
import { GameSettings } from '../../../../Framework/GameSettings';
import { IAnimator } from '../../../Animator/IAnimator';
import { BouncingScaleAnimator } from '../../../Animator/BouncingScaleAnimator';

export class PoisonField extends Field {
	private _isIncreasingOpacity: boolean = false;
	private _animator: IAnimator;

	constructor(ceil: Cell, private _light: string) {
		super(ceil);
		this.GetCell().SetField(this);
		this.Z = 1;
		this.GenerateSprite(Archive.bonus.coverBottom);
		this.GenerateSprite(Archive.bonus.poison);
		this.GenerateSprite(this._light);
		this.GenerateSprite(Archive.bonus.coverTop);

		this.InitPosition(ceil.GetBoundingBox());
		this.GetDisplayObjects().forEach((obj) => {
			obj.visible = this.GetCell().IsVisible();
		});
		this._animator = new BouncingScaleAnimator(this);
	}

	protected OnCellStateChanged(ceilState: CellState): void {
		this.GetDisplayObjects().forEach((s) => {
			s.visible = ceilState !== CellState.Hidden;
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

	Support(vehicule: Vehicle): void {
		const sum = this.GetInfluenceSum(vehicule);
		vehicule.SetDamage(0.15 + sum);
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
}
