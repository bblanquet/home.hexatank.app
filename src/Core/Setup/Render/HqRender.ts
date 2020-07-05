import { Dictionnary } from './../../Utils/Collections/Dictionnary';
import { GeneralRequester } from './../../Ia/Decision/RequestMaker/GeneralRequester/GeneralRequester';
import { AreaRequestMaker } from '../../Ia/Decision/RequestMaker/AreaRequestMaker';
import { ExpansionMaker } from './../../Ia/Decision/ExpansionMaker/ExpansionMaker';
import { RequestHandler } from '../../Ia/Decision/RequestHandler/RequestHandler';
import { Kingdom } from '../../Ia/Decision/Kingdom';
import { GameContext } from './../../Framework/GameContext';
import { AreaSearch } from '../../Ia/Decision/Utils/AreaSearch';
import { CellContext } from './../../Items/Cell/CellContext';
import { Archive } from '../../Framework/ResourceArchiver';
import { IaHeadquarter } from '../../Ia/IaHeadquarter';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { Item } from '../../Items/Item';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { ItemSkin } from '../../Items/ItemSkin';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { DiamondHq } from '../Generator/DiamondHq';
import { Cell } from '../../Items/Cell/Cell';
import { Area } from '../../Ia/Decision/Utils/Area';

export class HqRender {
	_skins: ItemSkin[] = [
		new ItemSkin(
			Archive.team.red.tank,
			Archive.team.red.turrel,
			Archive.team.red.truck,
			Archive.team.red.hq,
			Archive.building.hq.red.field,
			Archive.team.red.area,
			Archive.bonus.light.red
		),
		new ItemSkin(
			Archive.team.blue.tank,
			Archive.team.blue.turrel,
			Archive.team.blue.truck,
			Archive.team.blue.hq,
			Archive.building.hq.blue.field,
			Archive.team.blue.area,
			Archive.bonus.light.blue
		),
		new ItemSkin(
			Archive.team.purple.tank,
			Archive.team.purple.turrel,
			Archive.team.purple.truck,
			Archive.team.purple.hq,
			Archive.building.hq.purple.field,
			Archive.team.purple.area,
			Archive.bonus.light.blue
		),
		new ItemSkin(
			Archive.team.yellow.tank,
			Archive.team.yellow.turrel,
			Archive.team.yellow.truck,
			Archive.team.yellow.hq,
			Archive.building.hq.yellow.field,
			Archive.team.yellow.area,
			Archive.bonus.light.blue
		)
	];

	public GetHq(
		context: GameContext,
		cells: CellContext<Cell>,
		hqDefinitions: Array<DiamondHq>,
		playgroundItems: Item[]
	): Array<Headquarter> {
		var hqs = new Array<Headquarter>();

		hqDefinitions.forEach((hqDefinition) => {
			let index = hqDefinitions.indexOf(hqDefinition);
			let hq = {};

			if (hqDefinition.isIa) {
				hq = this.CreateIaHq(
					context,
					cells,
					hqDefinition.Hq.Position,
					hqDefinition.Diamond.Position,
					playgroundItems,
					this._skins[index]
				);
			} else {
				hq = this.CreateHq(
					context,
					cells,
					hqDefinition.Hq.Position,
					hqDefinition.Diamond.Position,
					playgroundItems,
					this._skins[index]
				);
			}

			if (hqDefinition.PlayerName) {
				(<Headquarter>hq).PlayerName = hqDefinition.PlayerName;
			}

			hqs.push(<Headquarter>hq);
		});

		return hqs;
	}

	private CreateHq(
		context: GameContext,
		cells: CellContext<Cell>,
		hqcell: HexAxial,
		diamondcell: HexAxial,
		items: Item[],
		skin: ItemSkin
	): Headquarter {
		const diamond = new Diamond(cells.Get(diamondcell));
		const hq = new Headquarter(skin, cells.Get(hqcell), context);
		items.push(diamond);
		items.push(hq);
		return hq;
	}

	private CreateIaHq(
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
		const areaByCoo = Dictionnary.To((e: Area) => e.GetCentralCell().GetCoordinate().ToString(), areas);

		areas.forEach((a) => {
			const around = areaSearch
				.GetAreaRange(a.GetCentralCell().GetCoordinate(), 1)
				.map((coo) => areaByCoo.Get(coo.ToString()));
			a.SetAround(around);
		});

		const hq = new IaHeadquarter(skin, cell, context);
		const kingdom = new Kingdom(hq, areas, areaSearch);

		kingdom.Setup(
			new AreaRequestMaker(kingdom),
			new RequestHandler(hq, kingdom, context),
			new ExpansionMaker(hq, kingdom, areas, areaSearch),
			new GeneralRequester()
		);

		kingdom.SetDiamond(diamond);
		hq.SetDoable(kingdom);

		items.push(diamond);
		items.push(hq);
		return hq;
	}
}
