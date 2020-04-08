import { isNullOrUndefined } from 'util';
import { TroopDecisionMaker } from './TroopDecisionMaker';
import { TroopDestination } from '../Utils/TroopDestination';
import { Cell } from '../../../Items/Cell/Cell';

export class TroopSituation {
	public Troop: TroopDecisionMaker;
	public Destinations: { [Danger: number]: Array<TroopDestination> };
	public CurrentDestination: TroopDestination;
	public PotentialNextDestination: TroopDestination;

	constructor() {
		this.Destinations = {};
	}

	public GetPotentialCost(): number {
		if (isNullOrUndefined(this.PotentialNextDestination)) {
			return 1000;
		}
		return this.PotentialNextDestination.GetCost();
	}

	public GetBestDestination(excludedArea: Array<Cell>): TroopDestination {
		const dangerLevels = this.GetDangerLevels();
		let currentIndex = 0;
		var candidates = new Array<TroopDestination>();
		while (candidates.length === 0) {
			if (currentIndex >= dangerLevels.length) {
				return null;
			}

			candidates = this.Destinations[dangerLevels[currentIndex]].filter(
				(dest) => !excludedArea.some((e) => e === dest.Destination)
			);
			currentIndex++;
		}

		const orderedCandidates = candidates.sort(this.IsFarther);

		return orderedCandidates[0];
	}

	public GetClosestAndSafestPath(): TroopDestination {
		return this.Destinations[this.GetDangerLevels()[0]].sort(this.IsFarther)[0];
	}

	private IsFarther(ta: TroopDestination, tb: TroopDestination): number {
		if (ta.GetCost() < tb.GetCost()) {
			return -1;
		}

		if (ta.GetCost() > tb.GetCost()) {
			return 1;
		}

		return 0;
	}

	private GetDangerLevels(): Array<number> {
		var dangers = new Array<number>();

		for (let dangerLevel in this.Destinations) {
			dangers.push(+dangerLevel);
		}

		return dangers.sort();
	}
}
