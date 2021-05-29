import { IHeadquarter } from './../../Items/Cell/Field/Hq/IHeadquarter';
import { SvgArchive } from '../SvgArchiver';
import { DiamondField } from './../../Items/Cell/Field/DiamondField';
import { BlockingField } from './../../Items/Cell/Field/BlockingField';
import { BasicField } from './../../Items/Cell/Field/BasicField';
import { GameContext } from '../../Setup/Context/GameContext';
import { Headquarter } from './../../Items/Cell/Field/Hq/Headquarter';
import { IField } from './../../Items/Cell/Field/IField';
import { FarmField } from './../../Items/Cell/Field/Bonus/FarmField';
import { MedicField } from './../../Items/Cell/Field/Bonus/MedicField';
import { NetworkField } from './../../Items/Cell/Field/Bonus/NetworkField';
import { PoisonField } from './../../Items/Cell/Field/Bonus/PoisonField';
import { AttackField } from './../../Items/Cell/Field/Bonus/AttackField';
import { BatteryField } from '../../Items/Cell/Field/Bonus/BatteryField';
import { ReactorField } from '../../Items/Cell/Field/Bonus/ReactorField';
import { RoadField } from '../../Items/Cell/Field/Bonus/RoadField';
import { ShieldField } from '../../Items/Cell/Field/Bonus/ShieldField';
import { Cell } from '../../Items/Cell/Cell';
import { RecordKind } from '../Record/RecordKind';
import { Diamond } from '../../Items/Cell/Field/Diamond';
export class FieldTypeHelper {
	public static GetDescription(obj: IField): string {
		if (obj instanceof AttackField) {
			return 'AttackField';
		} else if (obj instanceof BatteryField) {
			return 'BatteryField';
		} else if (obj instanceof FarmField) {
			return 'FarmField';
		} else if (obj instanceof MedicField) {
			return 'MedicField';
		} else if (obj instanceof NetworkField) {
			return 'NetworkField';
		} else if (obj instanceof PoisonField) {
			return 'PoisonField';
		} else if (obj instanceof ReactorField) {
			return 'ReactorField';
		} else if (obj instanceof RoadField) {
			return 'RoadField';
		} else if (obj instanceof ShieldField) {
			return 'ShieldField';
		} else if (obj instanceof BasicField) {
			return 'BasicField';
		} else if (obj instanceof BlockingField) {
			return 'BlockingField';
		}
		throw 'not found';
	}

	public static GetRecordDescription(obj: IField): RecordKind {
		if (obj instanceof AttackField) {
			return RecordKind.Attack;
		} else if (obj instanceof BatteryField) {
			return RecordKind.Battery;
		} else if (obj instanceof FarmField) {
			return RecordKind.Farm;
		} else if (obj instanceof MedicField) {
			return RecordKind.Medic;
		} else if (obj instanceof NetworkField) {
			return RecordKind.Network;
		} else if (obj instanceof PoisonField) {
			return RecordKind.Poison;
		} else if (obj instanceof ReactorField) {
			return RecordKind.Reactor;
		} else if (obj instanceof RoadField) {
			return RecordKind.Road;
		} else if (obj instanceof ShieldField) {
			return RecordKind.Shield;
		} else if (obj instanceof BasicField) {
			return RecordKind.Basic;
		} else if (obj instanceof BlockingField) {
			return RecordKind.Blocking;
		} else if (obj instanceof DiamondField) {
			return RecordKind.DiamondField;
		} else if (obj instanceof Diamond) {
			return RecordKind.Diamond;
		}
		return RecordKind.None;
	}

	public static CreateRecordField(action: RecordKind, cell: Cell, hq: IHeadquarter, context: GameContext): IField {
		if (action === RecordKind.Attack) {
			return new AttackField(cell, hq);
		} else if (action === RecordKind.Battery) {
			return new BatteryField(cell, hq);
		} else if (action === RecordKind.Basic) {
			return new BasicField(cell);
		} else if (action === RecordKind.Farm) {
			return new FarmField(cell, hq);
		} else if (action === RecordKind.Medic) {
			return new MedicField(cell, hq);
		} else if (action === RecordKind.Network) {
			return new NetworkField(cell, hq);
		} else if (action === RecordKind.Poison) {
			return new PoisonField(cell, hq);
		} else if (action === RecordKind.Reactor) {
			return new ReactorField(cell, hq, context, hq.Identity.Skin.GetLight(), true);
		} else if (action === RecordKind.Road) {
			return new RoadField(cell, hq);
		} else if (action === RecordKind.Shield) {
			return new ShieldField(cell, hq.Identity, hq);
		} else if (action === RecordKind.DiamondField) {
			return new DiamondField(cell);
		} else if (action === RecordKind.Diamond) {
			return new Diamond(cell);
		} else if (action === RecordKind.Blocking) {
			return new BlockingField(cell, SvgArchive.nature.tree);
		}
		throw 'not found';
	}

	public static CreateField(obj: string, cell: Cell, hq: IHeadquarter, context: GameContext): IField {
		if (obj === 'AttackField') {
			return new AttackField(cell, hq);
		} else if (obj === 'BatteryField') {
			return new BatteryField(cell, hq);
		} else if (obj === 'BasicField') {
			return new BasicField(cell);
		} else if (obj === 'FarmField') {
			return new FarmField(cell, hq);
		} else if (obj === 'MedicField') {
			return new MedicField(cell, hq);
		} else if (obj === 'NetworkField') {
			return new NetworkField(cell, hq);
		} else if (obj === 'PoisonField') {
			return new PoisonField(cell, hq);
		} else if (obj === 'ReactorField') {
			return new ReactorField(cell, hq, context, hq.Identity.Skin.GetLight());
		} else if (obj === 'RoadField') {
			return new RoadField(cell, hq);
		} else if (obj === 'ShieldField') {
			return new ShieldField(cell, hq.Identity, hq);
		}
		throw 'not found';
	}
}
