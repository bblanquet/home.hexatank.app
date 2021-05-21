import { Cell } from '../../Cell';
import { Field } from '../Field';
import { CellState } from '../../CellState';
import { BoundingBox } from '../../../../Utils/Geometry/BoundingBox';
import { InteractionContext } from '../../../../Interaction/InteractionContext';
import { Vehicle } from '../../../Unit/Vehicle';
import { GameSettings } from '../../../../Framework/GameSettings';
import { ZKind } from '../../../ZKind';

export class SlowField extends Field {
	constructor(ceil: Cell, private _light: string) {
		super(ceil);
		this.GetCell().SetField(this);
		this.Z = ZKind.Field;

		this.GenerateSprite('');
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

	public GetBoundingBox(): BoundingBox {
		return this.GetCell().GetBoundingBox();
	}
	public Select(context: InteractionContext): boolean {
		return false;
	}
	Support(vehicule: Vehicle): void {
		const sum = this.GetReactorsPower(null);
	}

	IsDesctrutible(): boolean {
		return false;
	}
	IsBlocking(): boolean {
		return false;
	}
}
