import { Identity } from './../../../Items/Identity';
import { Dictionary } from '../../../../Utils/Collections/Dictionary';
import { HqAppearance } from './HqSkinHelper';
import { HexAxial } from '../../../../Utils/Geometry/HexAxial';
import { Headquarter } from '../../../Items/Cell/Field/Hq/Headquarter';
import { Diamond } from '../../../Items/Cell/Field/Diamond';
import { DiamondHq } from '../../Blueprint/Game/DiamondHq';
import { Cell } from '../../../Items/Cell/Cell';
import { ColorKind } from '../../../../Components/Common/Button/Stylish/ColorKind';

export class HqRender {
	public Render(cells: Dictionary<Cell>, blueprint: DiamondHq): Headquarter {
		const diamondCell = cells.Get(this.DiamondCoo(blueprint));
		diamondCell.SetField(new Diamond(diamondCell));
		const id = new Identity(
			blueprint.PlayerName,
			HqAppearance.Skins.Get(ColorKind[blueprint.Color]),
			!blueprint.isIa
		);
		const cell = cells.Get(this.HqCoo(blueprint));
		const hq = cell.SetField(new Headquarter(id, cell));
		return hq;
	}

	private HqCoo(hqDefinition: DiamondHq): string {
		return new HexAxial(hqDefinition.Hq.Position.Q, hqDefinition.Hq.Position.R).ToString();
	}

	private DiamondCoo(hqDefinition: DiamondHq): string {
		return new HexAxial(hqDefinition.Diamond.Position.Q, hqDefinition.Diamond.Position.R).ToString();
	}
}
