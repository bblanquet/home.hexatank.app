import { GameSettings } from '../../../Core/Framework/GameSettings';
import { IHeadquarter } from '../../../Core/Items/Cell/Field/Hq/IHeadquarter';
import { Item } from '../../../Core/Items/Item';
import { AttackMenuItem } from '../../../Core/Menu/Buttons/AttackMenuItem';
import { HealMenuItem } from '../../../Core/Menu/Buttons/HealMenuItem';
import { MoneyMenuItem } from '../../../Core/Menu/Buttons/MoneyMenuItem';
import { PoisonMenuItem } from '../../../Core/Menu/Buttons/PoisonMenuItem';
import { ReactorMenuItem } from '../../../Core/Menu/Buttons/ReactorMenuItem';
import { ShieldMenuItem } from '../../../Core/Menu/Buttons/ShieldMenuItem';
import { SpeedFieldMenuItem } from '../../../Core/Menu/Buttons/SpeedFieldMenuItem';
import { ThunderMenuItem } from '../../../Core/Menu/Buttons/ThunderMenuItem';

export class CircleBtnProps {
	constructor(
		public Icon: string,
		public Amount: number,
		public OnCLick: () => void,
		public isBlink: boolean = false
	) {}

	public static All(hq: IHeadquarter, callback: (e: Item) => void): CircleBtnProps[] {
		return [
			new CircleBtnProps('fill-reactor', (hq.GetReactorsCount() + 1) * GameSettings.FieldPrice, () =>
				callback(new ReactorMenuItem())
			),
			new CircleBtnProps('fill-thunder', GameSettings.FieldPrice, () => callback(new ThunderMenuItem())),
			new CircleBtnProps('fill-shield', GameSettings.FieldPrice, () => callback(new ShieldMenuItem())),
			new CircleBtnProps('fill-money', GameSettings.FieldPrice, () => callback(new MoneyMenuItem())),
			new CircleBtnProps('fill-power', GameSettings.FieldPrice, () => callback(new AttackMenuItem())),
			new CircleBtnProps('fill-poison', GameSettings.FieldPrice, () => callback(new PoisonMenuItem())),
			new CircleBtnProps('fill-speed', GameSettings.FieldPrice, () => callback(new SpeedFieldMenuItem())),
			new CircleBtnProps('fill-medic', GameSettings.FieldPrice, () => callback(new HealMenuItem()))
		];
	}
	public static OnlyReactor(hq: IHeadquarter, callback: (e: Item) => void): CircleBtnProps[] {
		return [
			new CircleBtnProps('fill-reactor', (hq.GetReactorsCount() + 1) * GameSettings.FieldPrice, () =>
				callback(new ReactorMenuItem())
			)
		];
	}

	public static AllExceptReactor(callback: (e: Item) => void): CircleBtnProps[] {
		return [
			new CircleBtnProps('fill-thunder', GameSettings.FieldPrice, () => callback(new ThunderMenuItem())),
			new CircleBtnProps('fill-shield', GameSettings.FieldPrice, () => callback(new ShieldMenuItem())),
			new CircleBtnProps('fill-money', GameSettings.FieldPrice, () => callback(new MoneyMenuItem())),
			new CircleBtnProps('fill-power', GameSettings.FieldPrice, () => callback(new AttackMenuItem())),
			new CircleBtnProps('fill-poison', GameSettings.FieldPrice, () => callback(new PoisonMenuItem())),
			new CircleBtnProps('fill-speed', GameSettings.FieldPrice, () => callback(new SpeedFieldMenuItem())),
			new CircleBtnProps('fill-medic', GameSettings.FieldPrice, () => callback(new HealMenuItem()))
		];
	}
}
