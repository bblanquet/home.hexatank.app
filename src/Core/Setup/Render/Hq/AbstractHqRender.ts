import { HqSkinHelper } from './HqSkinHelper';
import { GameContext } from '../../../Framework/GameContext';
import { CellContext } from '../../../Items/Cell/CellContext';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { Item } from '../../../Items/Item';
import { Headquarter } from '../../../Items/Cell/Field/Hq/Headquarter';
import { ItemSkin } from '../../../Items/ItemSkin';
import { Diamond } from '../../../Items/Cell/Field/Diamond';
import { DiamondHq } from '../../Generator/DiamondHq';
import { Cell } from '../../../Items/Cell/Cell';

export abstract class AbstractHqRender {
	private _skins: HqSkinHelper = new HqSkinHelper();
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
					new HexAxial(hqDefinition.Hq.Position.Q, hqDefinition.Hq.Position.R),
					new HexAxial(hqDefinition.Diamond.Position.Q, hqDefinition.Diamond.Position.R),
					playgroundItems,
					this._skins.GetSkin(index)
				);
			} else {
				hq = this.CreateHq(
					context,
					cells,
					new HexAxial(hqDefinition.Hq.Position.Q, hqDefinition.Hq.Position.R),
					new HexAxial(hqDefinition.Diamond.Position.Q, hqDefinition.Diamond.Position.R),
					playgroundItems,
					this._skins.GetSkin(index)
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

	protected abstract CreateIaHq(
		context: GameContext,
		cells: CellContext<Cell>,
		hqcell: HexAxial,
		diamondcell: HexAxial,
		items: Item[],
		skin: ItemSkin
	): Headquarter;
}
