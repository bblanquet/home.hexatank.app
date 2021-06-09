import { SimpleBrain } from './../Brains/SimpleBrain';
import { Dictionnary } from './../../Utils/Collections/Dictionnary';
import { HexAxial } from './../../Utils/Geometry/HexAxial';
import { GameBlueprint } from '../../Setup/Blueprint/Game/GameBlueprint';
import { GameContext } from '../../Setup/Context/GameContext';
import { BobBrain } from '../Brains/BobBrain';
import { Area } from './Utils/Area';
import { AreaSearch } from './Utils/AreaSearch';
import { Cell } from '../../Items/Cell/Cell';
import { DiamondHq } from '../../Setup/Blueprint/Game/DiamondHq';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
export class BrainInjecter {
	public Inject(gameContext: GameContext, mapContext: GameBlueprint): void {
		const coos = Dictionnary.To<HexAxial>((e) => e.ToString(), gameContext.GetCells().map((e) => e.GetHexCoo()));
		const cells = Dictionnary.To<Cell>((e) => e.Coo(), gameContext.GetCells().map((e) => e));
		gameContext.GetHqs().forEach((hq, index) => {
			if (this.IsIa(mapContext.Hqs, hq.GetCell().GetHexCoo())) {
				const areaSearch = new AreaSearch(coos);
				const areas = this.GetAreas(areaSearch, hq, cells);
				const diamondCell = cells.Get(this.GetDiamondHex(mapContext.Hqs, hq.GetCell().GetHexCoo()));
				if (index === 0) {
					hq.Inject(
						new BobBrain().GetBrain(hq, gameContext, areas, areaSearch, diamondCell.GetField() as Diamond)
					);
				} else {
					hq.Inject(
						new SimpleBrain().GetBrain(
							hq,
							gameContext,
							areas,
							areaSearch,
							diamondCell.GetField() as Diamond
						)
					);
				}
			} else if (hq.Identity.Name === mapContext.PlayerName) {
				hq.IsPlayer = true;
			}
		});
	}

	private GetAreas(areaSearch: AreaSearch, hq: Headquarter, cells: Dictionnary<Cell>) {
		const areas = areaSearch.GetAreas(hq.GetCell().GetHexCoo()).map((coo) => new Area(cells.Get(coo.ToString())));
		const areaByCoo = Dictionnary.To((e: Area) => e.GetCentralCell().Coo(), areas);
		areas.forEach((a) => {
			const around = areaSearch
				.GetAreaRange(a.GetCentralCell().GetHexCoo(), 1)
				.map((coo) => areaByCoo.Get(coo.ToString()));
			a.SetAround(around);
		});
		return areas;
	}

	private GetDiamondHex(diamondHqs: DiamondHq[], coo: HexAxial): string {
		const diamondPosition = diamondHqs.find((d) => d.Hq.Position.Q == coo.Q && d.Hq.Position.R == coo.R).Diamond
			.Position;
		return new HexAxial(diamondPosition.Q, diamondPosition.R).ToString();
	}

	private IsIa(diamondHqs: DiamondHq[], coo: HexAxial): boolean {
		return diamondHqs.find((d) => d.Hq.Position.Q == coo.Q && d.Hq.Position.R == coo.R).isIa;
	}
}
