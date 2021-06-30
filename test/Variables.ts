import { Groups } from '../src/Utils/Collections/Groups';
import { Curve } from '../src/Utils/Stats/Curve';
import { StatsKind } from '../src/Utils/Stats/StatsKind';
import { DateValue } from '../src/Utils/Stats/DateValue';
import { RecordContent } from '../src/Core/Framework/Record/Model/RecordContent';
import { RecordHq } from '../src/Core/Framework/Record/Model/RecordHq';
import { RecordUnit } from '../src/Core/Framework/Record/Model/Item/RecordUnit';
import { RecordVehicleState } from '../src/Core/Framework/Record/Model/Item/State/RecordVehicleState';
import { HexAxial } from '../src/Utils/Geometry/HexAxial';
import { RecordKind } from '../src/Core/Framework/Record/Model/Item/State/RecordKind';
import { LogMessage } from '../src/Utils/Logger/LogMessage';
import { LogKind } from '../src/Utils/Logger/LogKind';

export function Logs() {
	return [
		LogMessage.New(LogKind.info, Date.now(), 'defe', 'Dany'),
		LogMessage.New(LogKind.success, Date.now(), 'allo', 'Dany'),
		LogMessage.New(LogKind.dangerous, Date.now(), 'allo', 'Dany'),
		LogMessage.New(LogKind.warning, Date.now(), 'allo', 'Dany')
	];
}

export function DeltaCurves() {
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
				new DateValue(GetDuration(6), 300),
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
function GetD1(): RecordContent {
	const d1 = new RecordContent();
	const hq = new RecordHq('IA1', '#FA2525');
	hq.Units.Add('IA1-1', GetUnitDelta());
	hq.Units.Add('IA1-2', GetUnit2());
	d1.Hqs.Add('IA1', hq);
	return d1;
}
function GetD2(): RecordContent {
	const d1 = new RecordContent();
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
	unit.States = [
		new RecordVehicleState(1074, new HexAxial(0, 18), RecordKind.Moved, 40),
		new RecordVehicleState(1994, new HexAxial(1, 18), RecordKind.Moved, 40),
		new RecordVehicleState(2270, new HexAxial(2, 16), RecordKind.Moved, 40),
		new RecordVehicleState(2450, new HexAxial(4, 15), RecordKind.Moved, 40)
	];
	return unit;
}
function GetUnitDelta() {
	const unit = new RecordUnit();
	unit.Id = 'IA1-1';
	unit.IsTank = false;
	unit.States = [
		new RecordVehicleState(1074, new HexAxial(0, 17), RecordKind.Moved, 40),
		new RecordVehicleState(2200, new HexAxial(1, 18), RecordKind.Moved, 40),
		new RecordVehicleState(2270, new HexAxial(2, 16), RecordKind.Moved, 40),
		new RecordVehicleState(2450, new HexAxial(4, 15), RecordKind.Moved, 40)
	];
	return unit;
}
function GetUnit2() {
	const unit = new RecordUnit();
	unit.Id = 'IA1-2';
	unit.IsTank = false;
	unit.States = [
		new RecordVehicleState(12088, new HexAxial(0, 18), RecordKind.Moved, 40),
		new RecordVehicleState(12852, new HexAxial(1, 18), RecordKind.Moved, 40),
		new RecordVehicleState(13685, new HexAxial(2, 16), RecordKind.Moved, 40),
		new RecordVehicleState(14768, new HexAxial(4, 15), RecordKind.Moved, 40)
	];
	return unit;
}
function GetDuration(seconds: number): number {
	return new Date(new Date().getTime()).setSeconds(seconds) - new Date().getTime();
}
