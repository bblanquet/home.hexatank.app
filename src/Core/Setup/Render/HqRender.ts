import { Archive } from '../../Framework/ResourceArchiver';
import { IaHeadquarter } from '../../Ia/Hq/IaHeadquarter';
import { HexAxial } from '../../Utils/Geometry/HexAxial';
import { PlaygroundHelper } from '../../Framework/PlaygroundHelper';
import { Item } from '../../Items/Item';
import { Headquarter } from '../../Items/Cell/Field/Headquarter';
import { ItemSkin } from '../../Items/ItemSkin';
import { Diamond } from '../../Items/Cell/Field/Diamond';
import { DiamondHq } from '../Generator/DiamondHq';

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

	public GetHq(hqDefinitions: Array<DiamondHq>, playgroundItems: Item[]): Array<Headquarter> {
		var hqs = new Array<Headquarter>();

		hqDefinitions.forEach((hqDefinition) => {
			let index = hqDefinitions.indexOf(hqDefinition);
			let hq = {};

			if (hqDefinition.isIa) {
				hq = this.CreateIaHq(
					hqDefinition.Hq.Position,
					hqDefinition.Diamond.Position,
					playgroundItems,
					this._skins[index]
				);
			} else {
				hq = this.CreateHq(
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

	private CreateHq(hqcell: HexAxial, diamondcell: HexAxial, items: Item[], skin: ItemSkin): Headquarter {
		const diamond = new Diamond(PlaygroundHelper.CellsContainer.Get(diamondcell));
		const hq = new Headquarter(skin, PlaygroundHelper.CellsContainer.Get(hqcell));
		items.push(diamond);
		items.push(hq);
		return hq;
	}

	private CreateIaHq(hqcell: HexAxial, diamondcell: HexAxial, items: Item[], skin: ItemSkin): Headquarter {
		const cell = PlaygroundHelper.CellsContainer.Get(hqcell);
		const diamond = new Diamond(PlaygroundHelper.CellsContainer.Get(diamondcell));
		const hq = new IaHeadquarter(PlaygroundHelper.GetAreas(cell), skin, cell);
		hq.Diamond = diamond;
		items.push(diamond);
		items.push(hq);
		return hq;
	}
}
