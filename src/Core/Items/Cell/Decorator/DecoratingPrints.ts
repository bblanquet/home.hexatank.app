import { DecoratingElement } from './DecoratingElement';
import { CellType } from '../../../Framework/Blueprint/Items/CellType';

export class DecoratingPrints {
	public constructor(public Obstacles: Array<DecoratingElement>, public Decorations: Array<DecoratingElement>) {}

	public GetDecoration(): CellType {
		var random = Math.random();
		if (random <= 0.25) {
			const bc = this.Obstacles.filter((i) => i.IsUnderLimit());
			var element = bc.find((i) => i.Count === Math.min(...bc.map((c) => c.Count)));
			element.Count += 1;
			return element.Type;
		} else {
			const bc = this.Decorations.filter((i) => i.IsUnderLimit());
			var element = bc.find((i) => i.Count === Math.min(...bc.map((c) => c.Count)));
			element.Count += 1;
			return element.Type;
		}
	}
}
