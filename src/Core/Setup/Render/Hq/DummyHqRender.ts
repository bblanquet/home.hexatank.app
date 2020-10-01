import { Dictionnary } from '../../../Utils/Collections/Dictionnary';
import { GameContext } from '../../../Framework/GameContext';
import { AreaSearch } from '../../../Ia/Decision/Utils/AreaSearch';
import { CellContext } from '../../../Items/Cell/CellContext';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { Item } from '../../../Items/Item';
import { Headquarter } from '../../../Items/Cell/Field/Hq/Headquarter';
import { ItemSkin } from '../../../Items/ItemSkin';
import { Diamond } from '../../../Items/Cell/Field/Diamond';
import { Cell } from '../../../Items/Cell/Cell';
import { Area } from '../../../Ia/Decision/Utils/Area';
import { HqRender } from './HqRender';

export class DummyHqRender extends HqRender {
	protected CreateIaHq(
		context: GameContext,
		cells: CellContext<Cell>,
		hqcell: HexAxial,
		diamondcell: HexAxial,
		items: Item[],
		skin: ItemSkin
	): Headquarter {
		const cell = cells.Get(hqcell);
		const diamond = new Diamond(cells.Get(diamondcell));
		const areaSearch = new AreaSearch(cells.Keys());

		const areas = areaSearch.GetAreas(cell.GetCoordinate()).map((coo) => new Area(cells.Get(coo)));
		const areaByCoo = Dictionnary.To((e: Area) => e.GetCentralCell().Coo(), areas);

		areas.forEach((a) => {
			const around = areaSearch
				.GetAreaRange(a.GetCentralCell().GetCoordinate(), 1)
				.map((coo) => areaByCoo.Get(coo.ToString()));
			a.SetAround(around);
		});

		const hq = new Headquarter(skin, cell, context);
		items.push(diamond);
		items.push(hq);
		return hq;
	}
}
