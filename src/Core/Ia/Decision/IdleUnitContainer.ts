import { KingdomArea } from './Utils/KingdomArea';
import { Tank } from '../../Items/Unit/Tank';

export class IdleUnitContainer {
	private Areas: Array<KingdomArea>;

	constructor() {}

	public CalculateExcess(statuses: Array<KingdomArea>): void {
		this.Areas = statuses.filter((s) => s.GetExcessTroops() > 0);
	}

	public HasTank(): boolean {
		this.Cleaner();
		return this.Areas.length > 0;
	}

	private Cleaner(): void {
		this.Areas = this.Areas.filter((s) => s.GetExcessTroops() > 0);
	}

	public Pop(): Tank {
		this.Cleaner();
		return this.Areas[0].DropTroop();
	}
}
