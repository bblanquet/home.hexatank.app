import { StrongBrain } from '../Brains/StrongBrain';
import { NormalBrain } from '../Brains/NormalBrain';
import { WeakBrain } from '../Brains/WeakBrain';
import { KamikazeBrain } from '../Brains/KamikazeBrain';
import { DummyBrain } from './../Brains/DummyBrain';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { HexAxial } from './../../../Utils/Geometry/HexAxial';
import { GameBlueprint } from '../../Framework/Blueprint/Game/GameBlueprint';
import { GameContext } from '../../Framework/Context/GameContext';
import { Area } from './Utils/Area';
import { AreaSearch } from './Utils/AreaSearch';
import { Cell } from '../../Items/Cell/Cell';
import { DiamondHq } from '../../Framework/Blueprint/Game/DiamondHq';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { PlayerBlueprint } from '../../Framework/Blueprint/Game/HqBlueprint';
import { BrainKind } from './BrainKind';
import { isNullOrUndefined } from '../../../Utils/ToolBox';

export class BrainInjecter {
	public Inject(gameContext: GameContext, blueprint: GameBlueprint): void {
		const coos = Dictionary.To<HexAxial>((e) => e.ToString(), gameContext.GetCells().map((e) => e.GetHexCoo()));
		const cells = Dictionary.To<Cell>((e) => e.Coo(), gameContext.GetCells().map((e) => e));
		gameContext.GetHqs().forEach((hq) => {
			const detail = this.GetDetail(blueprint.Hqs, hq.Identity.Name);
			if (!isNullOrUndefined(detail.IA)) {
				const areaSearch = new AreaSearch(coos);
				const areas = this.GetAreas(areaSearch, hq, cells);
				const diamondCell = cells.Get(this.GetDiamondHex(blueprint.Hqs, hq.GetCell().GetHexCoo()));

				if (detail.IA === BrainKind.Strong) {
					hq.Inject(
						new StrongBrain().GetBrain(
							hq,
							gameContext,
							areas,
							areaSearch,
							diamondCell.GetField() as Diamond
						)
					);
				} else if (detail.IA === BrainKind.Normal) {
					hq.Inject(
						new NormalBrain().GetBrain(
							hq,
							gameContext,
							areas,
							areaSearch,
							diamondCell.GetField() as Diamond
						)
					);
				} else if (detail.IA === BrainKind.Weak) {
					hq.Inject(
						new WeakBrain().GetBrain(hq, gameContext, areas, areaSearch, diamondCell.GetField() as Diamond)
					);
				} else if (detail.IA === BrainKind.Dummy) {
					hq.Inject(
						new DummyBrain().GetBrain(hq, gameContext, areas, areaSearch, diamondCell.GetField() as Diamond)
					);
				} else if (detail.IA === BrainKind.Kamikaze) {
					hq.Inject(
						new KamikazeBrain().GetBrain(
							hq,
							gameContext,
							areas,
							areaSearch,
							diamondCell.GetField() as Diamond
						)
					);
				}
			}
		});
	}

	private GetAreas(areaSearch: AreaSearch, hq: Headquarter, cells: Dictionary<Cell>) {
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
