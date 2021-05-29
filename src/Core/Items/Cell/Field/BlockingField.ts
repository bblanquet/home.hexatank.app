import { Identity } from './../../Identity';
import { GameSettings } from '../../../Framework/GameSettings';
import { Cell } from '../Cell';
import { AliveField } from './AliveField';
import { CellState } from '../CellState';
import { Vehicle } from '../../Unit/Vehicle';
import { AliveItem } from '../../AliveItem';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../../../Interaction/InteractionContext';
import { ZKind } from '../../ZKind';

export class BlockingField extends AliveField {
	constructor(cell: Cell, sprite: string) {
		super(cell);
		this.TotalLife = GameSettings.NatureLife;
		this.Life = GameSettings.NatureLife;
		this.GetCell().SetField(this);
		this.Z = ZKind.Field;
		this.GenerateSprite(sprite);
		this.InitPosition(cell.GetBoundingBox());
		this.GetCurrentSprites().Values().forEach((obj) => {
			obj.visible = this.GetCell().IsVisible();
		});
	}

	protected HandleCellStateChanged(ceilState: CellState): void {
		this.GetCurrentSprites().Values().forEach((s) => {
			s.visible = ceilState !== CellState.Hidden;
		});
	}

	Support(vehicule: Vehicle): void {
		//nothing
	}
	IsDesctrutible(): boolean {
		return true;
	}

	IsBlocking(): boolean {
		return true;
	}

	public IsEnemy(item: Identity): boolean {
		return true;
	}

	public GetBoundingBox(): BoundingBox {
		return this.GetCell().GetBoundingBox();
	}
	public Select(context: InteractionContext): boolean {
		//nothing
		return false;
	}

	public Update(viewX: number, viewY: number): void {
		if (!this.IsAlive()) {
			this.Destroy();
			return;
		}
		super.Update(viewX, viewY);
	}

	public Destroy(): void {
		this.GetCell().DestroyField();
		super.Destroy();
		this.IsUpdatable = false;
	}
}
