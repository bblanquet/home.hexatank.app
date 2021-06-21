import { IHeadquarter } from './Hq/IHeadquarter';
import { Identity } from './../../Identity';
import { DiamondField } from './DiamondField';
import { BlockingField } from './BlockingField';
import { Headquarter } from './Hq/Headquarter';
import { IField } from './IField';
import { BonusField } from './Bonus/BonusField';
import { ReactorField } from './Bonus/ReactorField';
import { ShieldField } from './Bonus/ShieldField';
import { AliveItem } from '../../AliveItem';
import { AttackMenuItem } from '../../../Menu/Buttons/AttackMenuItem';
import { HealMenuItem } from '../../../Menu/Buttons/HealMenuItem';
import { SpeedFieldMenuItem } from '../../../Menu/Buttons/SpeedFieldMenuItem';
import { Cell } from '../Cell';

export class TypeTranslator {
	public static IsSpecialField(cell: IField): boolean {
		return (
			cell instanceof BonusField ||
			cell instanceof Headquarter ||
			cell instanceof ReactorField ||
			cell instanceof ShieldField
		);
	}

	public static IsReactorField(field: IField): boolean {
		return field instanceof ReactorField;
	}

	public static IsBonusField(cell: IField): boolean {
		return cell instanceof BonusField || cell instanceof ReactorField || cell instanceof ShieldField;
	}

	public static IsNatureField(e: IField): boolean {
		return e instanceof BlockingField;
	}

	public static IsDiamond(e: IField): boolean {
		return e instanceof DiamondField;
	}

	public static HasEnemy(cell: Cell, identity: Identity): boolean {
		if (cell.HasOccupier()) {
			return ((cell.GetOccupier() as any) as AliveItem).IsEnemy(identity);
		}
		return identity.IsEnemy(cell.GetField().GetIdentity());
	}

	public static GetHq(e: IField): IHeadquarter {
		if (e instanceof BonusField) {
			return (e as BonusField).GetHq();
		} else if (e instanceof ShieldField) {
			return (e as ShieldField).GetHq();
		} else if (e instanceof ReactorField) {
			return (e as ReactorField).GetHq();
		} else if (e instanceof Headquarter) {
			return e as Headquarter;
		}
		throw `TypeTranslator not supposed to be there`;
	}

	public static IsAccessible(c: Cell, id: Identity): boolean {
		const field = c.GetField();
		if (field instanceof ShieldField) {
			const shield = field as ShieldField;
			return !shield.IsEnemy(id) && !c.HasOccupier();
		}
		return !c.IsBlocked();
	}

	public static GetPowerUp(type: string): any {
		if (type === 'AttackMenuItem') {
			return new AttackMenuItem();
		} else if (type === 'HealMenuItem') {
			return new HealMenuItem();
		} else if (type === 'SpeedFieldMenuItem') {
			return new SpeedFieldMenuItem();
		}
		throw 'TypeTranslator not supposed to be there';
	}
}
