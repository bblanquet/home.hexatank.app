import { StrongBrain } from '../Brains/StrongBrain';
import { NormalBrain } from '../Brains/NormalBrain';
import { WeakBrain } from '../Brains/WeakBrain';
import { TruckBrain } from '../Brains/TruckBrain';
import { KamikazeBrain } from '../Brains/KamikazeBrain';
import { DummyBrain } from './../Brains/DummyBrain';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { HexAxial } from './../../../Utils/Geometry/HexAxial';
import { Area } from './Utils/Area';
import { AreaSearch } from './Utils/AreaSearch';
import { Cell } from '../../Items/Cell/Cell';
import { DiamondHq } from '../../Framework/Blueprint/Game/DiamondHq';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { PlayerBlueprint } from '../../Framework/Blueprint/Game/HqBlueprint';
import { BrainKind } from './BrainKind';
import { IHeadquarter } from '../../Items/Cell/Field/Hq/IHeadquarter';
import { ErrorCat, ErrorHandler } from '../../../Utils/Exceptions/ErrorHandler';

export class BrainInjecter {
	public Inject(hqs: Headquarter[], map: Cell[], hqPrints: Array<DiamondHq>): void {
		const coos = Dictionary.To<HexAxial>((e) => e.ToString(), map.map((e) => e.GetHexCoo()));
		const cells = Dictionary.To<Cell>((e) => e.Coo(), map.map((e) => e));
		hqs.forEach((hq) => {
			const detail = this.GetDetail(hqPrints, hq.Identity.Name);
			const areaSearch = new AreaSearch(coos);
			const areas = this.GetAreas(areaSearch, hq, cells);
			const diamondCell = cells.Get(this.GetDiamondHex(hqPrints, hq.GetCell().GetHexCoo()));
			this.Set(detail, hq, hqs, areas, areaSearch, diamondCell);
		});
	}

	private Set(
		detail: PlayerBlueprint,
		hq: Headquarter,
		hqs: Headquarter[],
		areas: Area[],
		areaSearch: AreaSearch,
		diamondCell: Cell
	) {
		if (detail.IA === BrainKind.Strong) {
			hq.Inject(new StrongBrain().GetBrain(hq, hqs, areas, areaSearch, diamondCell.GetField() as Diamond));
		} else if (detail.IA === BrainKind.Normal) {
			hq.Inject(new NormalBrain().GetBrain(hq, hqs, areas, areaSearch, diamondCell.GetField() as Diamond));
		} else if (detail.IA === BrainKind.Weak) {
			hq.Inject(new WeakBrain().GetBrain(hq, hqs, areas, areaSearch, diamondCell.GetField() as Diamond));
		} else if (detail.IA === BrainKind.Dummy) {
			hq.Inject(new DummyBrain().GetBrain(hq, hqs, areas, areaSearch, diamondCell.GetField() as Diamond));
		} else if (detail.IA === BrainKind.Kamikaze) {
			hq.Inject(new KamikazeBrain().GetBrain(hq, hqs, areas, areaSearch, diamondCell.GetField() as Diamond));
		} else if (detail.IA === BrainKind.Truck) {
			hq.Inject(new TruckBrain().GetBrain(hq, hqs, areas, areaSearch, diamondCell.GetField() as Diamond));
		} else {
			ErrorHandler.Throw(ErrorCat.null, `undefined AI`);
		}
	}

	private GetAreas(areaSearch: AreaSearch, hq: IHeadquarter, cells: Dictionary<Cell>) {
		const areas = areaSearch.GetAreas(hq.GetCell().GetHexCoo()).map((coo) => new Area(cells.Get(coo.ToString())));
		const areaByCoo = Dictionary.To((e: Area) => e.GetCentralCell().Coo(), areas);
		areas.forEach((a) => {
			const around = areaSearch
				.GetAreaRange(a.GetCentralCell().GetHexCoo(), 1)
				.map((coo) => areaByCoo.Get(coo.ToString()));
			a.SetAround(around);
		});
		return areas;
	}

	private GetDiamondHex(diamondHqs: DiamondHq[], coo: HexAxial): string {
		const diamondPosition = diamondHqs.find((d) => d.Cell.Coo.Q == coo.Q && d.Cell.Coo.R == coo.R).DiamondCell.Coo;
		return new HexAxial(diamondPosition.Q, diamondPosition.R).ToString();
	}

	private GetDetail(diamondHqs: DiamondHq[], name: string): PlayerBlueprint {
		return diamondHqs.find((d) => d.Player.Name === name).Player;
	}
}
