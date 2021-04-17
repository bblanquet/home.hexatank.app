import { ItemSkin } from '../../../Items/ItemSkin';
import { Archive } from '../../../Framework/ResourceArchiver';
export class HqSkinHelper {
	private _skins: ItemSkin[] = [
		new ItemSkin(
			Archive.team.yellow.tank,
			Archive.team.yellow.turrel,
			Archive.team.yellow.truck,
			Archive.team.yellow.hq,
			Archive.building.hq.yellow.field,
			Archive.team.yellow.area,
			Archive.bonus.light.yellow,
			Archive.bonus.light.yellow,
			'#C5B798'
		),
		new ItemSkin(
			Archive.team.red.tank,
			Archive.team.red.turrel,
			Archive.team.red.truck,
			Archive.team.red.hq,
			Archive.building.hq.red.field,
			Archive.team.red.area,
			Archive.bonus.light.red,
			Archive.bonus.reactor.red,
			'#941E1E'
		),
		new ItemSkin(
			Archive.team.blue.tank,
			Archive.team.blue.turrel,
			Archive.team.blue.truck,
			Archive.team.blue.hq,
			Archive.building.hq.blue.field,
			Archive.team.blue.area,
			Archive.bonus.light.blue,
			Archive.bonus.reactor.blue,
			'#1D4F93'
		),
		new ItemSkin(
			Archive.team.purple.tank,
			Archive.team.purple.turrel,
			Archive.team.purple.truck,
			Archive.team.purple.hq,
			Archive.building.hq.purple.field,
			Archive.team.purple.area,
			Archive.bonus.light.purple,
			Archive.bonus.reactor.purple,
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
