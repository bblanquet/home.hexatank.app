import { AliveField } from './AliveField';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { Light } from '../../Environment/Light';
import { DiamondField } from './DiamondField';
import { Cell } from '../Cell';
import { Archive } from '../../../Framework/ResourceArchiver';
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
		super(cell);
		this.TotalLife = 150;
		this.Life = 150;
		this.Z = ZKind.Field;
		this.GetCell().SetField(this);
		this.BoundingBox = this.GetCell().GetBoundingBox();
		this.GenerateSprite(Archive.nature.diamond);

		this.Lights = new Light(this.GetBoundingBox());
		this.Lights.Display();
		this.Fields = new Array<DiamondField>();
		var neighbours = this.GetCell().GetNeighbourhood();
		neighbours.forEach((cell) => {
			const field = new DiamondField(<Cell>cell);
			this.Fields.push(field);
			field.Loaded.On(this.OnLoaded.bind(this));
		});
		this.InitPosition(cell.GetBoundingBox());
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

	public IsEnemy(item: AliveItem): boolean {
		return true;
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
		this.GetCell().DestroyField();
		this.Lights.Destroy();
	}

	public Update(viewX: number, viewY: number): void {
		if (!this.IsAlive()) {
			this.Destroy();
			new Crater(this.BoundingBox);
			return;
		}

		super.Update(viewX, viewY);
		this.Fields.forEach((field) => {
			field.Update(viewX, viewY);
		});

		this.Lights.Update(viewX, viewY);
	}

	public Select(context: InteractionContext): boolean {
		return false;
	}
}
