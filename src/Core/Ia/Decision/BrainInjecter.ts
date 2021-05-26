import { HexAxial } from './../../Utils/Geometry/HexAxial';
import { MapContext } from './../../Setup/Generator/MapContext';
import { Headquarter } from './../../Items/Cell/Field/Hq/Headquarter';
import { GameContext } from './../../Framework/GameContext';
import { BobBrain } from '../Brains/BobBrain';
import { Dictionnary } from '../../Utils/Collections/Dictionnary';
import { Area } from './Utils/Area';
import { AreaSearch } from './Utils/AreaSearch';
import { Cell } from '../../Items/Cell/Cell';
import { CellContext } from '../../Items/Cell/CellContext';
import { DiamondHq } from '../../Setup/Generator/DiamondHq';
import { Diamond } from '../../Items/Cell/Field/Diamond';
export class BrainInjecter {
	public Inject(cells: CellContext<Cell>, gameContext: GameContext, mapContext: MapContext): void {
		gameContext.GetHqs().forEach((hq) => {
			const areaSearch = new AreaSearch(cells.Keys());
			const areas = areaSearch.GetAreas(hq.GetCell().GetHexCoo()).map((coo) => new Area(cells.Get(coo)));
			const areaByCoo = Dictionnary.To((e: Area) => e.GetCentralCell().Coo(), areas);
			areas.forEach((a) => {
				const around = areaSearch
					.GetAreaRange(a.GetCentralCell().GetHexCoo(), 1)
					.map((coo) => areaByCoo.Get(coo.ToString()));
				a.SetAround(around);
			});
			if (this.IsIa(mapContext.Hqs, hq.GetCell().GetHexCoo())) {
				const diamondCell = cells.Get(this.GetDiamondHex(mapContext.Hqs, hq.GetCell().GetHexCoo()));
				hq.Inject(
					new BobBrain().GetBrain(hq, gameContext, areas, areaSearch, diamondCell.GetField() as Diamond)
				);
			}
		});
	}

	private GetDiamondHex(diamondHqs: DiamondHq[], coo: HexAxial): HexAxial {
		const diamondPosition = diamondHqs.find((d) => d.Hq.Position.Q == coo.Q && d.Hq.Position.R == coo.R).Diamond
			.Position;
		return new HexAxial(diamondPosition.Q, diamondPosition.R);
	}

	private IsIa(diamondHqs: DiamondHq[], coo: HexAxial): boolean {
		return diamondHqs.find((d) => d.Hq.Position.Q == coo.Q && d.Hq.Position.R == coo.R).isIa;
	}
}
