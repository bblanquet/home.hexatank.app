import { Cell } from '../Cell';
import { Field } from './Field';
import { CellState } from '../CellState';
import { Archive } from '../../../Framework/ResourceArchiver';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../../../Interaction/InteractionContext';
import { Vehicle } from '../../Unit/Vehicle';
import { GameSettings } from '../../../Framework/GameSettings';
import { BouncingScaleAnimator } from '../../Animator/BouncingScaleAnimator';
import { IAnimator } from '../../Animator/IAnimator';

export class AttackField extends Field {
	private _animator: IAnimator;
	private _isIncreasingOpacity: boolean = false;

	constructor(cell: Cell) {
		super(cell);
		this.GetCell().SetField(this);
		this.Z = 1;

		this.GenerateSprite(Archive.bonus.coverBottom);
		this.GenerateSprite(Archive.bonus.strength);
		this.GenerateSprite(Archive.bonus.light.blue);
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
		vehicule.TranslationSpeed = GameSettings.TranslationSpeed;
		vehicule.RotationSpeed = GameSettings.RotationSpeed;
		vehicule.Attack = GameSettings.Attack * (2 + sum);
	}

	public Update(viewX: number, viewY: number): void {
		if (!this._animator.IsDone) {
			this._animator.Update(viewX, viewY);
		} else {
			super.Update(viewX, viewY);
		}
		this.SetProperty(Archive.bonus.light.blue, (s) => {
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
