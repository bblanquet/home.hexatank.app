import { GameSettings } from './../../../Framework/GameSettings';
import { Cell } from '../Cell';
import { AliveField } from './AliveField';
import { CellState } from '../CellState';
import { Vehicle } from '../../Unit/Vehicle';
import { AliveItem } from '../../AliveItem';
import { BoundingBox } from '../../../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../../../Interaction/InteractionContext';

export class BlockingField extends AliveField {
	constructor(ceil: Cell, sprite: string) {
		super(ceil);
		this.TotalLife = GameSettings.GeneralLife;
		this.Life = GameSettings.GeneralLife;
		this.GetCell().SetField(this);
		this.Z = 1;
		this.GenerateSprite(sprite);
		this.InitPosition(ceil.GetBoundingBox());
		this.GetCurrentSprites().Values().forEach((obj) => {
			obj.visible = this.GetCell().IsVisible();
		});
	}

	protected OnCellStateChanged(ceilState: CellState): void {
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

	public IsEnemy(item: AliveItem): boolean {
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
		super.Destroy();
		this.GetCell().DestroyField();
		this.IsUpdatable = false;
	}
}
