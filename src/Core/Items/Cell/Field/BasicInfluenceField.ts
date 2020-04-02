import { InfluenceField } from './InfluenceField';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { Item } from '../../Item';
import { IInteractionContext } from '../../../Interaction/IInteractionContext';
import { CellState } from '../CellState';
import { GameHelper } from '../../../Framework/GameHelper';

export class BasicInfluenceField extends Item {
	private _isIncreasingOpacity: boolean = false;
	private _onCellStateChanged: { (obj: any, cellState: CellState): void };

	constructor(public InfluenceField: InfluenceField) {
		super();
		this.Z = 1;
		this.GenerateSprite(this.InfluenceField.Hq.GetSkin().GetBaseEnergy(), (s) => (s.alpha = 1));
		this.GenerateSprite(this.InfluenceField.Hq.GetSkin().GetEnergy(), (s) => (s.alpha = 1));
		this.GetSprites().forEach((sprite) => {
			(sprite.width = this.InfluenceField.GetCell().GetBoundingBox().Width),
				(sprite.height = this.InfluenceField.GetCell().GetBoundingBox().Height);
			sprite.anchor.set(0.5);
		});

		this.IsCentralRef = true;
		this.InitPosition(this.InfluenceField.GetCell().GetBoundingBox());
		this.GetDisplayObjects().forEach((obj) => {
			obj.visible = this.InfluenceField.GetCell().IsVisible();
		});
		this._onCellStateChanged = this.OnCellStateChanged.bind(this);
		this.InfluenceField.GetCell().CellStateChanged.On(this._onCellStateChanged);
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
		super.Update(viewX, viewY);

		this.SetBothProperty(
			this.InfluenceField.Hq.GetSkin().GetEnergy(),
			(s) => (s.rotation += 0.01 * this.InfluenceField.GetPower())
		);

		this.SetProperty(this.InfluenceField.Hq.GetSkin().GetBaseEnergy(), (s) => {
			if (s.alpha < 0.4) {
				this._isIncreasingOpacity = true;
			}

			if (1 <= s.alpha) {
				this._isIncreasingOpacity = false;
			}

			s.alpha += this._isIncreasingOpacity ? 0.01 : -0.01;
		});
	}
}
