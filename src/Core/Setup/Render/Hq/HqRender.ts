import { StandardBain } from './../../../Ia/Brains/StandardBain';
import { BobBrain } from './../../../Ia/Brains/BobBrain';
import { Item } from '../../../Items/Item';
import { Dictionnary } from '../../../Utils/Collections/Dictionnary';
import { AreaSearch } from '../../../Ia/Decision/Utils/AreaSearch';
import { IaHeadquarter } from '../../../Ia/IaHeadquarter';
import { Diamond } from '../../../Items/Cell/Field/Diamond';
import { Area } from '../../../Ia/Decision/Utils/Area';
import { GameContext } from '../../../Framework/GameContext';
import { Cell } from '../../../Items/Cell/Cell';
import { ItemSkin } from '../../../Items/ItemSkin';
import { Headquarter } from '../../../Items/Cell/Field/Hq/Headquarter';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { CellContext } from '../../../Items/Cell/CellContext';
import { AbstractHqRender } from './AbstractHqRender';

export class HqRender extends AbstractHqRender {
	protected CreateIaHq(
		context: GameContext,
		cells: CellContext<Cell>,
		hqcell: HexAxial,
		diamondcell: HexAxial,
		items: Item[],
		skin: ItemSkin,
		e: number
	): Headquarter {
		const cell = cells.Get(hqcell);
		const diamond = new Diamond(cells.Get(diamondcell));
		const areaSearch = new AreaSearch(cells.Keys());

		const areas = areaSearch.GetAreas(cell.GetHexCoo()).map((coo) => new Area(cells.Get(coo)));
		const areaByCoo = Dictionnary.To((e: Area) => e.GetCentralCell().Coo(), areas);

		areas.forEach((a) => {
			const around = areaSearch
				.GetAreaRange(a.GetCentralCell().GetHexCoo(), 1)
				.map((coo) => areaByCoo.Get(coo.ToString()));
			a.SetAround(around);
		});
		const hq = new IaHeadquarter(skin, cell, context);

		if (e === 0) {
			hq.InjectBrain(new BobBrain().GetBrain(hq, context, areas, areaSearch, diamond));
		} else {
			hq.InjectBrain(new StandardBain().GetBrain(hq, context, areas, areaSearch, diamond));
		}

		items.push(diamond);
		items.push(hq);
		return hq;
	}
}
