import { ItemSkin } from '../../../Items/ItemSkin';
import { SvgArchive } from '../../../Framework/SvgArchiver';
export class HqSkinHelper {
	private _skins: ItemSkin[] = [
		new ItemSkin(
			SvgArchive.team.yellow.tank,
			SvgArchive.team.yellow.turrel,
			SvgArchive.team.yellow.truck,
			SvgArchive.team.yellow.hq,
			SvgArchive.building.hq.yellow.field,
			SvgArchive.team.yellow.area,
			SvgArchive.bonus.light.yellow,
			SvgArchive.bonus.reactor.yellow,
			'#C5B798'
		),
		new ItemSkin(
			SvgArchive.team.red.tank,
			SvgArchive.team.red.turrel,
			SvgArchive.team.red.truck,
			SvgArchive.team.red.hq,
			SvgArchive.building.hq.red.field,
			SvgArchive.team.red.area,
			SvgArchive.bonus.light.red,
			SvgArchive.bonus.reactor.red,
			'#941E1E'
		),
		new ItemSkin(
			SvgArchive.team.blue.tank,
			SvgArchive.team.blue.turrel,
			SvgArchive.team.blue.truck,
			SvgArchive.team.blue.hq,
			SvgArchive.building.hq.blue.field,
			SvgArchive.team.blue.area,
			SvgArchive.bonus.light.blue,
			SvgArchive.bonus.reactor.blue,
			'#1D4F93'
		),
		new ItemSkin(
			SvgArchive.team.purple.tank,
			SvgArchive.team.purple.turrel,
			SvgArchive.team.purple.truck,
			SvgArchive.team.purple.hq,
			SvgArchive.building.hq.purple.field,
			SvgArchive.team.purple.area,
			SvgArchive.bonus.light.purple,
			SvgArchive.bonus.reactor.purple,
			'#51385E'
		)
	];

	public GetSkins(): ItemSkin[] {
		return this._skins;
	}

	public GetSkin(index: number): ItemSkin {
		return this._skins[index];
	}
}
