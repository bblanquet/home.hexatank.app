import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { Item } from '../../Item';
import { IInteractionContext } from '../../../Interaction/IInteractionContext';
import { CellState } from '../CellState';
import { IAnimator } from '../../Animator/IAnimator';
import { Archive } from '../../../Framework/ResourceArchiver';
import { BouncingScaleAnimator } from '../../Animator/BouncingScaleAnimator';
import { InfluenceField } from './Bonus/InfluenceField';

export class BasicInfluenceField extends Item {
	private _isIncreasingOpacity: boolean = false;
	private _onCellStateChanged: (obj: any, cellState: CellState) => void;
	private _animator: IAnimator;

	constructor(public InfluenceField: InfluenceField, private _light: string) {
		super();
		this.Z = 1;
		this.GenerateSprite(Archive.bonus.coverBottom);
		this.GenerateSprite(Archive.bonus.factory.bottom);
		this.GenerateSprite(Archive.bonus.factory.middle);
		this.GenerateSprite(Archive.bonus.factory.top);
		this.GenerateSprite(this._light);
		this.GenerateSprite(Archive.bonus.coverTop);
		this.InitPosition(this.InfluenceField.GetCell().GetBoundingBox());

		this._onCellStateChanged = this.OnCellStateChanged.bind(this);
		this.InfluenceField.GetCell().CellStateChanged.On(this._onCellStateChanged);
		this._animator = new BouncingScaleAnimator(this);
	}

	protected OnCellStateChanged(obj: any, cellState: CellState): void {
		this.GetDisplayObjects().forEach((s) => {
			s.visible = cellState !== CellState.Hidden;
		});
	}

	public Destroy(): void {
		super.Destroy();
		this.InfluenceField.GetCell().CellStateChanged.Off(this._onCellStateChanged);
	}

	public GetBoundingBox(): BoundingBox {
		return this.InfluenceField.GetCell().GetBoundingBox();
	}
	public Select(context: IInteractionContext): boolean {
		return false;
	}

	public Update(viewX: number, viewY: number): void {
		if (!this._animator.IsDone) {
			this._animator.Update(viewX, viewY);
			if (this._animator.IsDone) {
				this.ChangeReferential(viewX, viewY);
			}
		} else {
			super.Update(viewX, viewY);
		}

		this.SetBothProperty(
			Archive.bonus.factory.middle,
			(s) => (s.rotation += 0.01 * this.InfluenceField.GetPower())
		);

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

	private ChangeReferential(viewX: number, viewY: number) {
		this.GetSprites().forEach((sprite) => {
			(sprite.width = this.InfluenceField.GetCell().GetBoundingBox().Width),
				(sprite.height = this.InfluenceField.GetCell().GetBoundingBox().Height);
			sprite.anchor.set(0.5);
		});
		this.IsCentralRef = true;
		super.Update(viewX, viewY);
	}
}
