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
import { ElecMenuItem } from '../../../Core/Menu/Buttons/ElecMenuItem';
import { SearchMoneyMenuItem } from '../../../Core/Menu/Buttons/SearchMoneyMenuItem';
import { SpeedFieldMenuItem } from '../../../Core/Menu/Buttons/SpeedFieldMenuItem';
import { TankMenuItem } from '../../../Core/Menu/Buttons/TankMenuItem';
import { TruckMenuItem } from '../../../Core/Menu/Buttons/TruckMenuItem';

export class BtnProps {
	constructor(
		public Icon: string,
		public Color: string,
		public Text: string,
		public OnCLick: () => void,
		public isBlink: boolean = false,
		public HasPrice: boolean = false
	) {}

	public static TankList(v: Vehicle, callback: (e: Item) => void): BtnProps[] {
		if (v) {
			return [
				new BtnProps('fill-tank', 'btn-light', `${v.Id}\n${v.GetCurrentCell().Coo()}`, () => {}),
				new BtnProps('fill-camouflage', 'btn-dark', '', () => callback(new CamouflageMenuItem())),
				new BtnProps('fill-abort', 'btn-dark', '', () => callback(new AbortMenuItem())),
				new BtnProps('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()))
			];
		} else {
			return [];
		}
	}

	public static TruckList(v: Vehicle, callback: (e: Item) => void): BtnProps[] {
		return [
			new BtnProps('fill-truck', 'btn-light', `${v.Id}\n${v.GetCurrentCell().Coo()}`, () => {}),
			new BtnProps('fill-searchMoney', 'btn-dark', '', () => callback(new SearchMoneyMenuItem())),
			new BtnProps('fill-abort', 'btn-dark', '', () => callback(new AbortMenuItem())),
			new BtnProps('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()))
		];
	}

	public static HeadquarterList(h: Headquarter, callback: (e: Item) => void): BtnProps[] {
		return [
			new BtnProps(
				'fill-tank',
				'btn-light',
				`${GameSettings.TankPrice * h.GetVehicleCount()}`,
				() => callback(new TankMenuItem()),
				false,
				true
			),
			new BtnProps(
				'fill-truck',
				'btn-light',
				`${GameSettings.TruckPrice * h.GetVehicleCount()}`,
				() => callback(new TruckMenuItem()),
				false,
				true
			),
			new BtnProps('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()))
		];
	}

	public static MultiList(item: UnitGroup, callback: (e: Item) => void): BtnProps[] {
		return [
			new BtnProps('fill-tank', 'btn-light', ``, () => {}),
			new BtnProps(
				'fill-active-order',
				item.IsListeningOrder ? 'btn-primary' : 'btn-light',
				item.IsListeningOrder ? 'ON' : 'OFF',
				() => callback(new MultiOrderMenuItem())
			),
			new BtnProps('fill-camouflage', 'btn-dark', '', () => callback(new CamouflageMenuItem())),
			new BtnProps('fill-abort', 'btn-dark', '', () => callback(new AbortMenuItem())),
			new BtnProps('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()))
		];
	}

	public static ReactorList(item: ReactorField, callback: (e: Item) => void): BtnProps[] {
		if (item.IsLocked()) {
			return [ new BtnProps('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem())) ];
		}

		if (item.Reserve.GetTotalBatteries() === 0) {
			return [
				new BtnProps(
					'fill-energy',
					'btn-secondary',
					`${item.Reserve.GetUsedPower()}/${item.Reserve.GetTotalBatteries()}`,
					() => {},
					true
				),
				new BtnProps('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()))
			];
		}

		if (item.HasEnergy()) {
			return [
				new BtnProps(
					'fill-energy',
					'btn-light',
					`${item.Reserve.GetUsedPower()}/${item.Reserve.GetTotalBatteries()}`,
					() => callback(new ElecMenuItem())
				),
				new BtnProps('fill-plus', 'btn-dark', '', () => callback(new PlusMenuItem())),
				new BtnProps('fill-minus', 'btn-dark', '', () => callback(new MinusMenuItem())),

				new BtnProps('fill-energy-power', 'btn-danger', '', () => callback(new AttackMenuItem())),
				new BtnProps('fill-energy-speed', 'btn-primary', '', () => callback(new SpeedFieldMenuItem())),
				new BtnProps('fill-energy-heal', 'btn-success', '', () => callback(new HealMenuItem())),

				new BtnProps('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()))
			];
		} else {
			return [
				new BtnProps(
					'fill-energy',
					'btn-secondary',
					`${item.Reserve.GetUsedPower()}/${item.Reserve.GetTotalBatteries()}`,
					() => callback(new ElecMenuItem())
				),

				new BtnProps('fill-plus', 'btn-dark', '', () => callback(new PlusMenuItem())),
				new BtnProps('fill-minus', 'btn-dark', '', () => callback(new MinusMenuItem())),

				new BtnProps('fill-energy-power', 'btn-secondary', '', () => {}),
				new BtnProps('fill-energy-speed', 'btn-secondary', '', () => {}),
				new BtnProps('fill-energy-heal', 'btn-secondary', '', () => {}),

				new BtnProps('fill-cancel', 'btn-dark', '', () => callback(new CancelMenuItem()))
			];
		}
	}
}
