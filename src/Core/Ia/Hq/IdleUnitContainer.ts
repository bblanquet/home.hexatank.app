import { AreaStatus } from '../Utils/AreaStatus';
import { Tank } from '../../Items/Unit/Tank';

export class IdleUnitContainer {
	private statuses: Array<AreaStatus>;

	constructor() {}

	public CalculateExcess(statuses: Array<AreaStatus>): void {
		this.statuses = statuses.filter((s) => s.GetExcessTroops() > 0);
	}

	public HasTank(): boolean {
		this.Cleaner();
		return this.statuses.length > 0;
	}

	private Cleaner(): void {
		this.statuses = this.statuses.filter((s) => s.GetExcessTroops() > 0);
	}

	public Pop(): Tank {
		this.Cleaner();
		this.statuses[0].InnerTroops--;
		return this.statuses[0].Area.DropTroop();
	}
}
