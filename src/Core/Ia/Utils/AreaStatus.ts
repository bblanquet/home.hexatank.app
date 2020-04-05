import { KingdomArea } from './KingdomArea';

export class AreaStatus {
	public constructor(
		public OuterFoes: number,
		public InnerFoes: number,
		public InnerTroops: number,
		public OuterTrrops: number,
		public Area: KingdomArea
	) {}

	public GetTotalEnemies(): number {
		return this.OuterFoes + this.InnerFoes;
	}

	public HasOverTroops(): boolean {
		return (
			(this.GetTotalEnemies() == 0 && this.InnerTroops > 1) ||
			(this.InnerFoes == 0 && this.OuterFoes < this.InnerTroops + 2)
		);
	}

	public GetExcessTroops(): number {
		if (this.GetTotalEnemies() == 0 && this.InnerTroops > 1) {
			return this.InnerTroops - 1;
		} else if (this.InnerFoes == 0 && this.OuterFoes < this.InnerTroops + 2) {
			return this.InnerTroops - 2;
		}
		return 0;
	}
}
