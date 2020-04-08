import { RequestMaker } from './../../Ia/Decision/RequestMaker/RequestMaker';
import { ExpansionMaker } from './../../Ia/Decision/ExpansionMaker/ExpansionMaker';
import { BasicRequestHandler } from './../../Ia/Decision/RequestHandler/BasicRequestHandler';
import { KingdomDecisionMaker } from '../../Ia/Decision/KingdomDecisionMaker';
import { GameContext } from './../../Framework/GameContext';
import { AreaSearch } from '../../Ia/Decision/Utils/AreaSearch';
import { CellContext } from './../../Items/Cell/CellContext';
import { Archive } from '../../Framework/ResourceArchiver';
import { IaHeadquarter } from '../../Ia/IaHeadquarter';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { Item } from '../../Items/Item';
import { Headquarter } from '../../Items/Cell/Field/Headquarter';
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
			Archive.team.red.baseEnergy,
			Archive.team.red.energy,
			Archive.building.hq.red.area
		),
		new ItemSkin(
			Archive.team.blue.tank,
			Archive.team.blue.turrel,
			Archive.team.blue.truck,
			Archive.team.blue.hq,
			Archive.building.hq.blue.field,
			Archive.team.blue.baseEnergy,
			Archive.team.blue.energy,
			Archive.building.hq.blue.area
		),
		new ItemSkin(
			Archive.team.purple.tank,
			Archive.team.purple.turrel,
			Archive.team.purple.truck,
			Archive.team.purple.hq,
			Archive.building.hq.purple.field,
			Archive.team.purple.baseEnergy,
			Archive.team.purple.energy,
			Archive.building.hq.purple.area
		),
		new ItemSkin(
			Archive.team.yellow.tank,
			Archive.team.yellow.turrel,
			Archive.team.yellow.truck,
			Archive.team.yellow.hq,
			Archive.building.hq.yellow.field,
			Archive.team.yellow.baseEnergy,
			Archive.team.yellow.energy,
			Archive.building.hq.yellow.area
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
		const areas = new AreaSearch(cells.Keys())
			.GetAreas(cell.GetCoordinate())
			.map((coo) => new Area(cells.Get(coo), cells));

		const hq = new IaHeadquarter(skin, cell, context);
		const decision = new KingdomDecisionMaker(hq, areas);

		decision.Setup(
			new RequestMaker(),
			new BasicRequestHandler(hq, decision),
			new ExpansionMaker(hq, decision, cells)
		);

		decision.Diamond = diamond;
		hq.SetDoable(decision);

		items.push(diamond);
		items.push(hq);
		return hq;
	}
}
