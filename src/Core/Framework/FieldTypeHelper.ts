import { IHeadquarter } from './../Items/Cell/Field/Hq/IHeadquarter';
import { SvgArchive } from './SvgArchiver';
import { DiamondField } from './../Items/Cell/Field/DiamondField';
import { BlockingField } from './../Items/Cell/Field/BlockingField';
import { BasicField } from './../Items/Cell/Field/BasicField';
import { GameContext } from '../Framework/Context/GameContext';
import { IField } from './../Items/Cell/Field/IField';
import { FarmField } from './../Items/Cell/Field/Bonus/FarmField';
import { MedicField } from './../Items/Cell/Field/Bonus/MedicField';
import { NetworkField } from './../Items/Cell/Field/Bonus/NetworkField';
import { PoisonField } from './../Items/Cell/Field/Bonus/PoisonField';
import { FireField } from '../Items/Cell/Field/Bonus/FireField';
import { BatteryField } from '../Items/Cell/Field/Bonus/BatteryField';
import { ReactorField } from '../Items/Cell/Field/Bonus/ReactorField';
import { RoadField } from '../Items/Cell/Field/Bonus/RoadField';
import { ShieldField } from '../Items/Cell/Field/Bonus/ShieldField';
import { Cell } from '../Items/Cell/Cell';
import { RecordKind } from './Record/Model/Item/State/RecordKind';
import { Diamond } from '../Items/Cell/Field/Diamond';
import { ErrorCat, ErrorHandler } from '../../Utils/Exceptions/ErrorHandler';
import { VolcanoField } from '../Items/Cell/Field/VolcanoField';
import { WaterField } from '../Items/Cell/Field/WaterField';
import { Headquarter } from '../Items/Cell/Field/Hq/Headquarter';
import { HeadquarterField } from '../Items/Cell/Field/Hq/HeadquarterField';
export class FieldHelper {
	//has to use it because of ofuscator
	public static GetName(obj: IField): string {
		ErrorHandler.ThrowNull(obj);
		if (obj instanceof FireField) {
			return 'FireField';
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
		} else if (obj instanceof VolcanoField) {
			return 'VolcanoField';
		} else if (obj instanceof Diamond) {
			return 'Diamond';
		} else if (obj instanceof DiamondField) {
			return 'DiamondField';
		} else if (obj instanceof WaterField) {
			return 'WaterField';
		} else if (obj instanceof Headquarter) {
			return 'Headquarter';
		} else if (obj instanceof HeadquarterField) {
			return 'HeadquarterField';
		}
		ErrorHandler.Throw(ErrorCat.outOfRange, obj.constructor.name);
	}

	public static GetRecordName(obj: IField): RecordKind {
		if (obj instanceof FireField) {
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

	public static NewFieldFromRecord(action: RecordKind, cell: Cell, hq: IHeadquarter, context: GameContext): IField {
		if (action === RecordKind.Attack) {
			return cell.SetField(new FireField(cell, hq));
		} else if (action === RecordKind.Battery) {
			return cell.SetField(new BatteryField(cell, hq));
		} else if (action === RecordKind.Basic) {
			return cell.SetField(new BasicField(cell));
		} else if (action === RecordKind.Farm) {
			return cell.SetField(new FarmField(cell, hq));
		} else if (action === RecordKind.Medic) {
			return cell.SetField(new MedicField(cell, hq));
		} else if (action === RecordKind.Network) {
			return cell.SetField(new NetworkField(cell, hq));
		} else if (action === RecordKind.Poison) {
			return cell.SetField(new PoisonField(cell, hq));
		} else if (action === RecordKind.Reactor) {
			return cell.SetField(new ReactorField(cell, hq, context.GetHqs(), hq.Identity.Skin.GetLight(), true));
		} else if (action === RecordKind.Road) {
			return cell.SetField(new RoadField(cell, hq));
		} else if (action === RecordKind.Shield) {
			return cell.SetField(new ShieldField(cell, hq.Identity, hq));
		} else if (action === RecordKind.DiamondField) {
			return cell.SetField(new DiamondField(cell));
		} else if (action === RecordKind.Diamond) {
			return cell.SetField(new Diamond(cell));
		} else if (action === RecordKind.Blocking) {
			return cell.SetField(new BlockingField(cell, SvgArchive.nature.forest.darkTree));
		}
		ErrorHandler.Throw(ErrorCat.outOfRange, action.constructor.name);
	}

	public static NewField(name: string, cell: Cell, hq: IHeadquarter, context: GameContext): IField {
		if (name === 'FireField') {
			return cell.SetField(new FireField(cell, hq));
		} else if (name === 'BatteryField') {
			return cell.SetField(new BatteryField(cell, hq));
		} else if (name === 'BasicField') {
			return cell.SetField(new BasicField(cell));
		} else if (name === 'FarmField') {
			return cell.SetField(new FarmField(cell, hq));
		} else if (name === 'MedicField') {
			return cell.SetField(new MedicField(cell, hq));
		} else if (name === 'NetworkField') {
			return cell.SetField(new NetworkField(cell, hq));
		} else if (name === 'PoisonField') {
			return cell.SetField(new PoisonField(cell, hq));
		} else if (name === 'ReactorField') {
			return cell.SetField(new ReactorField(cell, hq, context.GetHqs(), hq.Identity.Skin.GetLight()));
		} else if (name === 'RoadField') {
			return cell.SetField(new RoadField(cell, hq));
		} else if (name === 'ShieldField') {
			return cell.SetField(new ShieldField(cell, hq.Identity, hq));
		} else if (name === 'VolcanoField') {
			return cell.SetField(new VolcanoField(cell));
		} else if (name === 'Diamond') {
			return cell.SetField(new Diamond(cell));
		} else if (name === 'DiamondField') {
			return cell.SetField(new DiamondField(cell));
		} else if (name === 'WaterField') {
			return cell.SetField(new WaterField(cell));
		} else if (name === 'BlockingField') {
			return cell.SetField(new BlockingField(cell, SvgArchive.nature.forest.darkTree));
		}
		ErrorHandler.Throw(ErrorCat.outOfRange, name);
	}
}
