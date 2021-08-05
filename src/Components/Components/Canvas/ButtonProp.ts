import { GameSettings } from '../../../Core/Framework/GameSettings';
import { ReactorField } from '../../../Core/Items/Cell/Field/Bonus/ReactorField';
import { Headquarter } from '../../../Core/Items/Cell/Field/Hq/Headquarter';
import { Item } from '../../../Core/Items/Item';
import { Vehicle } from '../../../Core/Items/Unit/Vehicle';
import { UnitGroup } from '../../../Core/Items/UnitGroup';
import { AbortMenuItem } from '../../../Core/Menu/Buttons/AbortMenuItem';
import { AttackMenuItem } from '../../../Core/Menu/Buttons/AttackMenuItem';
import { CamouflageMenuItem } from '../../../Core/Menu/Buttons/CamouflageMenutItem';
import { CancelMenuItem } from '../../../Core/Menu/Buttons/CancelMenuItem';
import { HealMenuItem } from '../../../Core/Menu/Buttons/HealMenuItem';
import { MinusMenuItem } from '../../../Core/Menu/Buttons/MinusMenuItem';
import { MultiOrderMenuItem } from '../../../Core/Menu/Buttons/MultiOrderMenuItem';
import { PlusMenuItem } from '../../../Core/Menu/Buttons/PlusMenuItem';
import { SearchMoneyMenuItem } from '../../../Core/Menu/Buttons/SearchMoneyMenuItem';
import { SpeedFieldMenuItem } from '../../../Core/Menu/Buttons/SpeedFieldMenuItem';
import { TankMenuItem } from '../../../Core/Menu/Buttons/TankMenuItem';
import { TruckMenuItem } from '../../../Core/Menu/Buttons/TruckMenuItem';

export class ButtonProp {
	constructor(
		public Icon: string,
		public Color: string,
		public Text: string,
		public OnCLick: () => void,
		public isBlink: boolean = false
	) {}

	public static TankList(v: Vehicle, callback: (e: Item) => void): ButtonProp[] {
		if (v) {
			return [
				new ButtonProp('fill-tank', 'btn-light', `${v.Id}\n${v.GetCurrentCell().Coo()}`, () => {}, false),
				new ButtonProp('fill-camouflage', 'btn-dark', '', () => callback(new CamouflageMenuItem()), false),
				new ButtonProp('fill-abort', 'btn-dark', '', () => callback(new AbortMenuItem()), false),
				new ButtonProp('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()), false)
			];
		} else {
			return [];
		}
	}

	public static TruckList(v: Vehicle, callback: (e: Item) => void): ButtonProp[] {
		return [
			new ButtonProp('fill-truck', 'btn-light', `${v.Id}\n${v.GetCurrentCell().Coo()}`, () => {}, false),
			new ButtonProp('fill-searchMoney', 'btn-dark', '', () => callback(new SearchMoneyMenuItem()), false),
			new ButtonProp('fill-abort', 'btn-dark', '', () => callback(new AbortMenuItem()), false),
			new ButtonProp('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()), false)
		];
	}

	public static HeadquarterList(h: Headquarter, callback: (e: Item) => void): ButtonProp[] {
		return [
			new ButtonProp(
				'fill-tank',
				'btn-dark',
				`${GameSettings.TankPrice * h.GetVehicleCount()}`,
				() => callback(new TankMenuItem()),
				false
			),
			new ButtonProp(
				'fill-truck',
				'btn-dark',
				`${GameSettings.TruckPrice * h.GetVehicleCount()}`,
				() => callback(new TruckMenuItem()),
				false
			),
			new ButtonProp('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()), false)
		];
	}

	public static MultiList(item: UnitGroup, callback: (e: Item) => void): ButtonProp[] {
		return [
			new ButtonProp('fill-tank', 'btn-light', ``, () => {}, false),
			new ButtonProp(
				'fill-active-order',
				item.IsListeningOrder ? 'btn-primary' : 'btn-light',
				item.IsListeningOrder ? 'ON' : 'OFF',
				() => callback(new MultiOrderMenuItem()),
				false
			),
			new ButtonProp('fill-camouflage', 'btn-dark', '', () => callback(new CamouflageMenuItem()), false),
			new ButtonProp('fill-abort', 'btn-dark', '', () => callback(new AbortMenuItem()), false),
			new ButtonProp('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()), false)
		];
	}

	public static ReactorList(item: ReactorField, callback: (e: Item) => void): ButtonProp[] {
		if (item.IsLocked()) {
			return [ new ButtonProp('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()), false) ];
		}

		if (item.Reserve.GetTotalBatteries() === 0) {
			return [
				new ButtonProp(
					'fill-energy',
					'btn-secondary',
					`${item.Reserve.GetUsedPower()}/${item.Reserve.GetTotalBatteries()}`,
					() => {},
					true
				),
				new ButtonProp('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()), false)
			];
		}

		if (item.HasEnergy()) {
			return [
				new ButtonProp(
					'fill-energy',
					'btn-light',
					`${item.Reserve.GetUsedPower()}/${item.Reserve.GetTotalBatteries()}`,
					() => {},
					false
				),
				new ButtonProp('fill-plus', 'btn-dark', '', () => callback(new PlusMenuItem()), false),
				new ButtonProp('fill-minus', 'btn-dark', '', () => callback(new MinusMenuItem()), false),

				new ButtonProp('fill-energy-power', 'btn-danger', '', () => callback(new AttackMenuItem()), false),
				new ButtonProp('fill-energy-speed', 'btn-primary', '', () => callback(new SpeedFieldMenuItem()), false),
				new ButtonProp('fill-energy-heal', 'btn-success', '', () => callback(new HealMenuItem()), false),

				new ButtonProp('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()), false)
			];
		} else {
			return [
				new ButtonProp(
					'fill-energy',
					'btn-secondary',
					`${item.Reserve.GetUsedPower()}/${item.Reserve.GetTotalBatteries()}`,
					() => {},
					false
				),

				new ButtonProp('fill-plus', 'btn-dark', '', () => callback(new PlusMenuItem()), false),
				new ButtonProp('fill-minus', 'btn-dark', '', () => callback(new MinusMenuItem()), false),

				new ButtonProp('fill-energy-power', 'btn-secondary', '', () => {}, false),
				new ButtonProp('fill-energy-speed', 'btn-secondary', '', () => {}, false),
				new ButtonProp('fill-energy-heal', 'btn-secondary', '', () => {}, false),

				new ButtonProp('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()), false)
			];
		}
	}
}
