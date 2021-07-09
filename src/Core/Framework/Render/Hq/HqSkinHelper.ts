import { ItemSkin } from '../../../Items/ItemSkin';
import { SvgArchive } from '../../../Framework/SvgArchiver';
import { Dictionary } from '../../../../Utils/Collections/Dictionary';
import { ColorKind } from '../../../../Components/Common/Button/Stylish/ColorKind';
export class HqAppearance {
	public static Colors: ColorKind[] = [ ColorKind.Blue, ColorKind.Yellow, ColorKind.Red, ColorKind.Purple ];

	public static Skins: Dictionary<ItemSkin> = Dictionary.New([
		{
			key: ColorKind[ColorKind.Blue],
			value: new ItemSkin(
				SvgArchive.team.blue.tank,
				SvgArchive.team.blue.turrel,
				SvgArchive.team.blue.truck,
				SvgArchive.team.blue.hq,
				SvgArchive.building.hq.blue.field,
				SvgArchive.team.blue.area,
				SvgArchive.bonus.light.blue,
				SvgArchive.bonus.reactor.blue,
				'#1D4F93'
			)
		},
		{
			key: ColorKind[ColorKind.Yellow],
			value: new ItemSkin(
				SvgArchive.team.yellow.tank,
				SvgArchive.team.yellow.turrel,
				SvgArchive.team.yellow.truck,
				SvgArchive.team.yellow.hq,
				SvgArchive.building.hq.yellow.field,
				SvgArchive.team.yellow.area,
				SvgArchive.bonus.light.yellow,
				SvgArchive.bonus.reactor.yellow,
				'#C5B798'
			)
		},
		{
			key: ColorKind[ColorKind.Red],
			value: new ItemSkin(
				SvgArchive.team.red.tank,
				SvgArchive.team.red.turrel,
				SvgArchive.team.red.truck,
				SvgArchive.team.red.hq,
				SvgArchive.building.hq.red.field,
				SvgArchive.team.red.area,
				SvgArchive.bonus.light.red,
				SvgArchive.bonus.reactor.red,
				'#941E1E'
			)
		},
		{
			key: ColorKind[ColorKind.Purple],
			value: new ItemSkin(
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
		}
	]);

	public static GetSkins(): ItemSkin[] {
		return this.Skins.Values();
	}

	public static GetSkin(index: number): ItemSkin {
		return this.Skins.GetFromIndex(index);
	}
}
