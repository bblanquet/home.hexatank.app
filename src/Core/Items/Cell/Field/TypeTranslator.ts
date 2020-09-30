import { TargetOrder } from './../../../Ia/Order/TargetOrder';
import { PatrolOrder } from './../../../Ia/Order/PatrolOrder';
import { TruckPatrolOrder } from './../../../Ia/Order/TruckPatrolOrder';
import { SmartPreciseOrder } from './../../../Ia/Order/SmartPreciseOrder';
import { MoneyOrder } from './../../../Ia/Order/MoneyOrder';
import { PersistentOrder } from '../../../Ia/Order/PersistentOrder';
import { SimpleOrder } from '../../../Ia/Order/SimpleOrder';
import { Headquarter } from './Hq/Headquarter';
import { IField } from './IField';
import { BonusField } from './Bonus/BonusField';
import { ReactorField } from './Bonus/ReactorField';
import { ShieldField } from './Bonus/ShieldField';
import { AliveItem } from '../../AliveItem';
import { AttackMenuItem } from '../../../Menu/Buttons/AttackMenuItem';
import { HealMenuItem } from '../../../Menu/Buttons/HealMenuItem';
import { SpeedFieldMenuItem } from '../../../Menu/Buttons/SpeedFieldMenuItem';
import { OrderKind } from '../../../Ia/Order/OrderKind';
import { Vehicle } from '../../Unit/Vehicle';
import { Cell } from '../Cell';
import { SmartSimpleOrder } from '../../../Ia/Order/SmartSimpleOrder';
import { Truck } from '../../Unit/Truck';
import { HqFieldOrder } from '../../../Ia/Order/HqFieldOrder';
import { DiamondFieldOrder } from '../../../Ia/Order/DiamondFieldOrder';
import { Diamond } from './Diamond';
import { Tank } from '../../Unit/Tank';

export class TypeTranslator {
	public static IsSpecialField(cell: IField): boolean {
		return (
			cell instanceof BonusField ||
			cell instanceof Headquarter ||
			cell instanceof ReactorField ||
			cell instanceof ShieldField
		);
	}

	public static IsBonusField(cell: IField): boolean {
		return cell instanceof BonusField || cell instanceof ReactorField || cell instanceof ShieldField;
	}

	public static SetOrder(v: Vehicle, dest: Cell[], kind: OrderKind): void {
		if (kind === OrderKind.Simple) {
			v.SetOrder(new SimpleOrder(dest[0], v));
		} else if (kind === OrderKind.Persistent) {
			v.SetOrder(new PersistentOrder(dest[0], v));
		} else if (kind === OrderKind.Smart) {
			v.SetOrder(new SmartPreciseOrder(dest[0], v));
		} else if (kind === OrderKind.SimpleSmart) {
			v.SetOrder(new SmartSimpleOrder(dest[0], v));
		} else if (kind === OrderKind.Target) {
			v.SetOrder(new TargetOrder(v as Tank, (dest[0].GetOccupier() as any) as AliveItem));
		} else if (kind === OrderKind.Patrol) {
			v.SetOrder(new PatrolOrder(dest, v));
		} else if (kind === OrderKind.Truck) {
			v.SetOrder(
				new TruckPatrolOrder(
					v as Truck,
					new HqFieldOrder(dest[0].GetField() as Headquarter, v),
					new DiamondFieldOrder(dest[1].GetField() as Diamond, v)
				)
			);
		} else if (kind === OrderKind.Money) {
			v.SetOrder(new MoneyOrder(v));
		}
	}

	public static IsEnemy(e: IField, item: AliveItem): boolean {
		if (e instanceof BonusField) {
			return (e as BonusField).GetHq().IsEnemy(item);
		} else if (e instanceof ShieldField) {
			return (e as ShieldField).GetHq().IsEnemy(item);
		} else if (e instanceof ReactorField) {
			return (e as ReactorField).GetHq().IsEnemy(item);
		} else if (e instanceof Headquarter) {
			return (e as Headquarter).IsEnemy(item);
		}
		throw 'not supposed to be there';
	}

	public static GetHq(e: IField): Headquarter {
		if (e instanceof BonusField) {
			return (e as BonusField).GetHq();
		} else if (e instanceof ShieldField) {
			return (e as ShieldField).GetHq();
		} else if (e instanceof ReactorField) {
			return (e as ReactorField).GetHq();
		} else if (e instanceof Headquarter) {
			return e as Headquarter;
		}
		throw 'not supposed to be there';
	}

	public static GetPowerUp(type: string): any {
		if (type === 'AttackMenuItem') {
			return new AttackMenuItem();
		} else if (type === 'HealMenuItem') {
			return new HealMenuItem();
		} else if (type === 'SpeedFieldMenuItem') {
			return new SpeedFieldMenuItem();
		}
		throw 'not supposed to be there';
	}
}
