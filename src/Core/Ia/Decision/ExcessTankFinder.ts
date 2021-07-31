import { BrainArea } from './Utils/BrainArea';
import { Tank } from '../../Items/Unit/Tank';

export class ExcessTankFinder {
	private _excessAreas: Array<BrainArea>;

	constructor() {}

	public CalculateExcess(areas: Array<BrainArea>): void {
		this._excessAreas = areas.filter((area) => 0 < this.GetExcess(area));
	}

	private GetExcess(area: BrainArea): number {
		if (
			area.GetFoesCount() == 0 &&
			!area.IsBorder() &&
			!(!area.HasFreeTank() || area.IsTankDamaged() || area.HasNature())
		) {
			return area.Tanks.length;
		} else {
			return 0;
		}
	}

	public HasTank(): boolean {
		this.SetExcessAreas();
		return 0 < this._excessAreas.length;
	}

	private SetExcessAreas(): void {
		this._excessAreas = this._excessAreas.filter((s) => 0 < this.GetExcess(s));
	}

	public Pop(): Tank {
		this.SetExcessAreas();
		return this._excessAreas[0].Drop();
	}
}
