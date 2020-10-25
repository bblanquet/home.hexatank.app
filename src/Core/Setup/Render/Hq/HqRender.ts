import { GeneralRequestProvider } from './../../../Ia/Decision/Providers/GeneralRequestProvider';
import { RequestHandlerProvider } from './../../../Ia/Decision/Providers/RequestHandlerProvider';
import { RequestMakerProvider } from './../../../Ia/Decision/Providers/RequestMakerProvider';
import { Item } from '../../../Items/Item';
import { Dictionnary } from '../../../Utils/Collections/Dictionnary';
import { GeneralRequester } from '../../../Ia/Decision/RequestMaker/GeneralRequester/GeneralRequester';
import { AreaRequestMaker } from '../../../Ia/Decision/RequestMaker/AreaRequestMaker';
import { ExpansionMaker } from '../../../Ia/Decision/ExpansionMaker/ExpansionMaker';
import { RequestHandler } from '../../../Ia/Decision/RequestHandler/RequestHandler';
import { Kingdom } from '../../../Ia/Decision/Kingdom';
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
		skin: ItemSkin
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
		const kingdom = new Kingdom(hq, areas);

		kingdom.Setup(
			new AreaRequestMaker(new RequestMakerProvider(kingdom).Get()),
			new RequestHandler(new RequestHandlerProvider(hq, kingdom, context).Get()),
			new ExpansionMaker(hq, kingdom, areaSearch),
			new GeneralRequester(new GeneralRequestProvider().Get())
		);

		kingdom.SetDiamond(diamond);
		hq.SetDoable(kingdom);

		items.push(diamond);
		items.push(hq);
		return hq;
	}
}
