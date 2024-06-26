import { Identity, Relationship } from './../../Identity';
import { AliveField } from './AliveField';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { Light } from '../../Environment/Light';
import { DiamondField } from './DiamondField';
import { Cell } from '../Cell';
import { SvgArchive } from '../../../Framework/SvgArchiver';
import { CellState } from '../CellState';
import { Vehicle } from '../../Unit/Vehicle';
import { AliveItem } from '../../AliveItem';
import { Crater } from '../../Environment/Crater';
import { InteractionContext } from '../../../Interaction/InteractionContext';
import { ZKind } from '../../ZKind';

export class Diamond extends AliveField {
	BoundingBox: BoundingBox;
	Lights: Light;
	Fields: Array<DiamondField>;

	constructor(cell: Cell) {
		super(cell, null);
		this.TotalLife = 150;
		this.Life = 150;
		this.Z = ZKind.Field;
		this.BoundingBox = this.GetCell().GetBoundingBox();
		this.GenerateSprite(SvgArchive.nature.diamond);

		this.Lights = new Light(this.GetBoundingBox());
		this.Lights.Display();
		this.Fields = new Array<DiamondField>();
		var nearbyCell = this.GetCell().GetUnblockedRange();
		nearbyCell.forEach((cell) => {
			const field = cell.SetField(new DiamondField(cell));
			this.Fields.push(field);
			field.Loaded.On(this.OnLoaded.bind(this));
		});
		this.InitPosition(cell.GetBoundingBox().GetPosition());
		this.GetCurrentSprites().Values().forEach((obj) => {
			obj.visible = this.GetCell().IsVisible();
		});
		this.Lights.GetCurrentSprites().Values().forEach((obj) => {
			obj.visible = this.GetCell().IsVisible();
		});
	}

	protected HandleCellStateChanged(cellState: CellState): void {
		this.GetCurrentSprites().Values().forEach((s) => {
			s.visible = cellState !== CellState.Hidden;
		});
		this.Lights.GetCurrentSprites().Values().forEach((s) => {
			s.visible = cellState !== CellState.Hidden;
		});
	}

	private OnLoaded(obj: any, e: {}): void {
		this.SetDamage(1);
	}

	Support(vehicule: Vehicle): void {}

	IsDesctrutible(): boolean {
		return true;
	}

	public GetRelation(item: Identity): Relationship {
		return Relationship.Neutral;
	}

	IsBlocking(): boolean {
		return true;
	}

	public GetBoundingBox(): BoundingBox {
		return this.BoundingBox;
	}

	public Destroy(): void {
		this.IsUpdatable = false;
		this.Fields.forEach((field) => {
			field.Loaded.Clear();
			field.Destroy();
		});
		super.Destroy();
		this.Lights.Destroy();
	}

	public Update(): void {
		if (!this.IsAlive()) {
			this.Destroy();
			new Crater(this.BoundingBox);
			return;
		}

		super.Update();
		this.Lights.Update();
	}

	public Select(context: InteractionContext): boolean {
		return false;
	}
}
