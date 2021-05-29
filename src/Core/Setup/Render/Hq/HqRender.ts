import { Identity } from './../../../Items/Identity';
import { Dictionnary } from './../../../Utils/Collections/Dictionnary';
import { HqSkinHelper } from './HqSkinHelper';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { Item } from '../../../Items/Item';
import { Headquarter } from '../../../Items/Cell/Field/Hq/Headquarter';
import { Diamond } from '../../../Items/Cell/Field/Diamond';
import { DiamondHq } from '../../Blueprint/Game/DiamondHq';
import { Cell } from '../../../Items/Cell/Cell';

export class HqRender {
	public Render(cells: Dictionnary<Cell>, blueprint: DiamondHq, items: Item[], index: number): Headquarter {
		const diamond = new Diamond(cells.Get(this.DiamondCoo(blueprint)));
		const id = new Identity(blueprint.PlayerName, new HqSkinHelper().GetSkin(index), !blueprint.isIa);
		const hq = new Headquarter(id, cells.Get(this.HqCoo(blueprint)));
		items.push(diamond);
		items.push(hq);
		return hq;
	}

	private HqCoo(hqDefinition: DiamondHq): string {
		return new HexAxial(hqDefinition.Hq.Position.Q, hqDefinition.Hq.Position.R).ToString();
	}

	private DiamondCoo(hqDefinition: DiamondHq): string {
		return new HexAxial(hqDefinition.Diamond.Position.Q, hqDefinition.Diamond.Position.R).ToString();
	}
}
