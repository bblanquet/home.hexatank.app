import { Archive } from './../ResourceArchiver';
import { DiamondField } from './../../Items/Cell/Field/DiamondField';
import { BlockingField } from './../../Items/Cell/Field/BlockingField';
import { BasicField } from './../../Items/Cell/Field/BasicField';
import { GameContext } from './../GameContext';
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
import { TrackingKind } from '../Tracking/TrackingKind';
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

	public static GetTrackingDescription(obj: IField): TrackingKind {
		if (obj instanceof AttackField) {
			return TrackingKind.Attack;
		} else if (obj instanceof BatteryField) {
			return TrackingKind.Battery;
		} else if (obj instanceof FarmField) {
			return TrackingKind.Farm;
		} else if (obj instanceof MedicField) {
			return TrackingKind.Medic;
		} else if (obj instanceof NetworkField) {
			return TrackingKind.Network;
		} else if (obj instanceof PoisonField) {
			return TrackingKind.Poison;
		} else if (obj instanceof ReactorField) {
			return TrackingKind.Reactor;
		} else if (obj instanceof RoadField) {
			return TrackingKind.Road;
		} else if (obj instanceof ShieldField) {
			return TrackingKind.Shield;
		} else if (obj instanceof BasicField) {
			return TrackingKind.Basic;
		} else if (obj instanceof BlockingField) {
			return TrackingKind.Blocking;
		} else if (obj instanceof DiamondField) {
			return TrackingKind.DiamondField;
		} else if (obj instanceof Diamond) {
			return TrackingKind.Diamond;
		}
		return TrackingKind.None;
	}

	public static CreateTrackingField(action: TrackingKind, cell: Cell, hq: Headquarter, context: GameContext): IField {
		if (action === TrackingKind.Attack) {
			return new AttackField(cell, hq);
		} else if (action === TrackingKind.Battery) {
			return new BatteryField(cell, hq);
		} else if (action === TrackingKind.Basic) {
			return new BasicField(cell);
		} else if (action === TrackingKind.Farm) {
			return new FarmField(cell, hq);
		} else if (action === TrackingKind.Medic) {
			return new MedicField(cell, hq);
		} else if (action === TrackingKind.Network) {
			return new NetworkField(cell, hq);
		} else if (action === TrackingKind.Poison) {
			return new PoisonField(cell, hq);
		} else if (action === TrackingKind.Reactor) {
			return new ReactorField(cell, hq, context, hq.GetSkin().GetLight(), true);
		} else if (action === TrackingKind.Road) {
			return new RoadField(cell, hq);
		} else if (action === TrackingKind.Shield) {
			return new ShieldField(cell, hq);
		} else if (action === TrackingKind.DiamondField) {
			return new DiamondField(cell);
		} else if (action === TrackingKind.Diamond) {
			return new Diamond(cell);
		} else if (action === TrackingKind.Blocking) {
			return new BlockingField(cell, Archive.nature.tree);
		}
		throw 'not found';
	}

	public static CreateField(obj: string, cell: Cell, hq: Headquarter, context: GameContext): IField {
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
			return new ReactorField(cell, hq, context, hq.GetSkin().GetLight());
		} else if (obj === 'RoadField') {
			return new RoadField(cell, hq);
		} else if (obj === 'ShieldField') {
			return new ShieldField(cell, hq);
		}
		throw 'not found';
	}
}
