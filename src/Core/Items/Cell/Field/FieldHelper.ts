import { Headquarter } from './Hq/Headquarter';
import { IField } from './IField';
import { BonusField } from './Bonus/BonusField';
import { ReactorField } from './Bonus/ReactorField';
import { ShieldField } from './Bonus/ShieldField';
import { AliveItem } from '../../AliveItem';
import { Cell } from '../Cell';

export class FieldHelper {
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
		return false;
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
}
