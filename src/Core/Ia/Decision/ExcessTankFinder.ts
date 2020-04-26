import { KingdomArea } from './Utils/KingdomArea';
import { Tank } from '../../Items/Unit/Tank';

export class ExcessTankFinder {
	private _excessAreas: Array<KingdomArea>;

	constructor() {}

	public CalculateExcess(areas: Array<KingdomArea>): void {
		this._excessAreas = areas.filter((area) => 0 < this.GetExcess(area));
	}

	private GetExcess(area: KingdomArea): number {
		if (
			area.GetFoesCount() == 0 &&
			!area.IsBorder() &&
			!(area.IsTroopFighting() || area.IsTroopHealing() || area.HasNature())
		) {
			return area.Troops.length;
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
		return this._excessAreas[0].DropTroop();
	}
}
