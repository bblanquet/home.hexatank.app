import { Groups } from './Core/Utils/Collections/Groups';
import { Curve } from './Core/Utils/Stats/Curve';
import { StatsKind } from './Core/Utils/Stats/StatsKind';
import { DateValue } from './Core/Utils/Stats/DateValue';
import { RecordData } from './Core/Framework/Record/RecordData';
import { RecordHq } from './Core/Framework/Record/RecordHq';
import { RecordUnit } from './Core/Framework/Record/RecordUnit';
import { RecordAction } from './Core/Framework/Record/RecordAction';
import { HexAxial } from './Core/Utils/Geometry/HexAxial';
import { RecordKind } from './Core/Framework/Record/RecordKind';

export function Context() {
	const c = new Groups<Curve>();
	c.Add(
		StatsKind[StatsKind.Cell],
		new Curve(
			[
				new DateValue(GetDuration(0), 1),
				new DateValue(GetDuration(3), 2),
				new DateValue(GetDuration(5), 5),
				new DateValue(GetDuration(7), 1)
			],
			'#4287f5'
		)
	);
	c.Add(
		StatsKind[StatsKind.Cell],
		new Curve(
			[
				new DateValue(GetDuration(0), 0),
				new DateValue(GetDuration(2), 2),
				new DateValue(GetDuration(6), 5),
				new DateValue(GetDuration(8), 3)
			],
			'#f54242'
		)
	);

	c.Add(
		StatsKind[StatsKind.Diamond],
		new Curve(
			[
				new DateValue(GetDuration(0), 1),
				new DateValue(GetDuration(3), 2),
				new DateValue(GetDuration(5), 5),
				new DateValue(GetDuration(7), 1)
			],
			'#f54293'
		)
	);
	c.Add(
		StatsKind[StatsKind.Energy],
		new Curve(
			[
				new DateValue(GetDuration(0), 0),
				new DateValue(GetDuration(2), 2),
				new DateValue(GetDuration(6), 5),
				new DateValue(GetDuration(8), 3)
			],
			'#f542f5'
		)
	);
	c.Add(
		StatsKind[StatsKind.Unit],
		new Curve(
			[
				new DateValue(GetDuration(0), 0),
				new DateValue(GetDuration(2), 2),
				new DateValue(GetDuration(6), 5),
				new DateValue(GetDuration(8), 3)
			],
			'#42f545'
		)
	);
	return c;
}
function GetD1(): RecordData {
	const d1 = new RecordData();
	const hq = new RecordHq('IA1', '#FA2525');
	hq.Units.Add('IA1-1', GetUnitDelta());
	hq.Units.Add('IA1-2', GetUnit2());
	d1.Hqs.Add('IA1', hq);
	return d1;
}
function GetD2(): RecordData {
	const d1 = new RecordData();
	const hq = new RecordHq('IA1', '#FA2525');
	hq.Units.Add('IA1-1', GetUnit());
	hq.Units.Add('IA1-2', GetUnit2());
	d1.Hqs.Add('IA1', hq);
	return d1;
}
function GetUnit() {
	const unit = new RecordUnit();
	unit.Id = 'IA1-1';
	unit.IsTank = false;
	unit.Actions = [
		new RecordAction(1074, new HexAxial(0, 18), RecordKind.Moved, 40),
		new RecordAction(1994, new HexAxial(1, 18), RecordKind.Moved, 40),
		new RecordAction(2270, new HexAxial(2, 16), RecordKind.Moved, 40),
		new RecordAction(2450, new HexAxial(4, 15), RecordKind.Moved, 40)
	];
	return unit;
}
function GetUnitDelta() {
	const unit = new RecordUnit();
	unit.Id = 'IA1-1';
	unit.IsTank = false;
	unit.Actions = [
		new RecordAction(1074, new HexAxial(0, 17), RecordKind.Moved, 40),
		new RecordAction(2200, new HexAxial(1, 18), RecordKind.Moved, 40),
		new RecordAction(2270, new HexAxial(2, 16), RecordKind.Moved, 40),
		new RecordAction(2450, new HexAxial(4, 15), RecordKind.Moved, 40)
	];
	return unit;
}
function GetUnit2() {
	const unit = new RecordUnit();
	unit.Id = 'IA1-2';
	unit.IsTank = false;
	unit.Actions = [
		new RecordAction(12088, new HexAxial(0, 18), RecordKind.Moved, 40),
		new RecordAction(12852, new HexAxial(1, 18), RecordKind.Moved, 40),
		new RecordAction(13685, new HexAxial(2, 16), RecordKind.Moved, 40),
		new RecordAction(14768, new HexAxial(4, 15), RecordKind.Moved, 40)
	];
	return unit;
}
function GetDuration(seconds: number): number {
	return new Date(new Date().getTime()).setSeconds(seconds) - new Date().getTime();
}
