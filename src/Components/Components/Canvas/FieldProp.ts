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

export class FieldProp {
	constructor(
		public Icon: string,
		public Amount: number,
		public OnCLick: () => void,
		public isBlink: boolean = false
	) {}

	public static All(hq: IHeadquarter, callback: (e: Item) => void): FieldProp[] {
		return [
			new FieldProp('fill-reactor', (hq.GetReactorsCount() + 1) * GameSettings.FieldPrice, () =>
				callback(new ReactorMenuItem())
			),
			new FieldProp('fill-thunder', GameSettings.FieldPrice, () => callback(new ThunderMenuItem())),
			new FieldProp('fill-shield', GameSettings.FieldPrice, () => callback(new ShieldMenuItem())),
			new FieldProp('fill-money', GameSettings.FieldPrice, () => callback(new MoneyMenuItem())),
			new FieldProp('fill-power', GameSettings.FieldPrice, () => callback(new AttackMenuItem())),
			new FieldProp('fill-poison', GameSettings.FieldPrice, () => callback(new PoisonMenuItem())),
			new FieldProp('fill-speed', GameSettings.FieldPrice, () => callback(new SpeedFieldMenuItem())),
			new FieldProp('fill-medic', GameSettings.FieldPrice, () => callback(new HealMenuItem()))
		];
	}
	public static OnlyReactor(hq: IHeadquarter, callback: (e: Item) => void): FieldProp[] {
		return [
			new FieldProp('fill-reactor', (hq.GetReactorsCount() + 1) * GameSettings.FieldPrice, () =>
				callback(new ReactorMenuItem())
			)
		];
	}

	public static AllExceptReactor(callback: (e: Item) => void): FieldProp[] {
		return [
			new FieldProp('fill-thunder', GameSettings.FieldPrice, () => callback(new ThunderMenuItem())),
			new FieldProp('fill-shield', GameSettings.FieldPrice, () => callback(new ShieldMenuItem())),
			new FieldProp('fill-money', GameSettings.FieldPrice, () => callback(new MoneyMenuItem())),
			new FieldProp('fill-power', GameSettings.FieldPrice, () => callback(new AttackMenuItem())),
			new FieldProp('fill-poison', GameSettings.FieldPrice, () => callback(new PoisonMenuItem())),
			new FieldProp('fill-speed', GameSettings.FieldPrice, () => callback(new SpeedFieldMenuItem())),
			new FieldProp('fill-medic', GameSettings.FieldPrice, () => callback(new HealMenuItem()))
		];
	}
}
