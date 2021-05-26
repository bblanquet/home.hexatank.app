import { Dictionnary } from './../../../Utils/Collections/Dictionnary';
import { HqSkinHelper } from './HqSkinHelper';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { Item } from '../../../Items/Item';
import { Headquarter } from '../../../Items/Cell/Field/Hq/Headquarter';
import { Diamond } from '../../../Items/Cell/Field/Diamond';
import { DiamondHq } from '../../Generator/DiamondHq';
import { Cell } from '../../../Items/Cell/Cell';

export class HqRender {
	public Render(cells: Dictionnary<Cell>, hqDefinitions: Array<DiamondHq>, items: Item[]): Array<Headquarter> {
		var hqs = new Array<Headquarter>();

		hqDefinitions.forEach((hqDefinition, index) => {
			const diamond = new Diamond(cells.Get(this.DiamondCoo(hqDefinition)));
			const hq = new Headquarter(new HqSkinHelper().GetSkin(index), cells.Get(this.HqCoo(hqDefinition)));
			items.push(diamond);
			items.push(hq);

			if (hqDefinition.PlayerName) {
				hq.PlayerName = hqDefinition.PlayerName;
			}

			hqs.push(hq);
		});

		return hqs;
	}

	private HqCoo(hqDefinition: DiamondHq): string {
		return new HexAxial(hqDefinition.Hq.Position.Q, hqDefinition.Hq.Position.R).ToString();
	}

	private DiamondCoo(hqDefinition: DiamondHq): string {
		return new HexAxial(hqDefinition.Diamond.Position.Q, hqDefinition.Diamond.Position.R).ToString();
	}
}
