import { GameContext } from '../../Framework/Context/GameContext';
import { Groups } from '../../Utils/Collections/Groups';
import { Curve } from '../../Utils/Stats/Curve';
import { DateValue } from '../../Utils/Stats/DateValue';
import { StatsKind } from '../../Utils/Stats/StatsKind';
import { Headquarter } from '../../Items/Cell/Field/Hq/Headquarter';
import { Vehicle } from '../../Items/Unit/Vehicle';

export class StatsContext {
	private _curves: Groups<Curve> = new Groups<Curve>();
	private _refDate: number;

	public GetCurves(): Groups<Curve> {
		return this._curves;
	}

	constructor(private _gameContext: GameContext) {
		this._refDate = new Date().getTime();
		this._gameContext.GetHqs().forEach((hq) => {
			this._curves.Add(StatsKind[StatsKind.Unit], new Curve(new Array<DateValue>(), hq.Identity.Skin.GetColor()));
			this._curves.Add(
				StatsKind[StatsKind.Diamond],
				new Curve(new Array<DateValue>(), hq.Identity.Skin.GetColor())
			);
			this._curves.Add(StatsKind[StatsKind.Cell], new Curve(new Array<DateValue>(), hq.Identity.Skin.GetColor()));
			this._curves.Add(
				StatsKind[StatsKind.Energy],
				new Curve(new Array<DateValue>(), hq.Identity.Skin.GetColor())
			);
			hq.OnDiamondCountChanged.On(this.HandleDiamondChanged.bind(this));
			hq.OnVehicleCreated.On(this.HandleVehicleCreated.bind(this));
			hq.OnFieldCountchanged.On(this.HandleFieldChanged.bind(this));
			hq.OnEnergyChanged.On(this.HandleEnergyChanged.bind(this));
		});
	}

	private GetTime(): number {
		return new Date().getTime() - this._refDate;
	}

	private HandleDiamondChanged(src: Headquarter, diamond: number): void {
		const time = this.GetTime();
		this._gameContext.GetHqs().forEach((hq) => {
			const curve = this._curves
				.Get(StatsKind[StatsKind.Diamond])
				.find((c) => c.Color === hq.Identity.Skin.GetColor());
			curve.Points.push(new DateValue(time, hq.GetDiamondCount()));
		});
	}

	private HandleVehicleCreated(src: Headquarter, vehicule: Vehicle): void {
		const time = this.GetTime();
		this._gameContext.GetHqs().forEach((hq) => {
			const curve = this._curves
				.Get(StatsKind[StatsKind.Unit])
				.find((c) => c.Color === hq.Identity.Skin.GetColor());
			curve.Points.push(new DateValue(time, hq.GetVehicleCount()));
		});
	}

	private HandleFieldChanged(src: Headquarter, field: number): void {
		const time = this.GetTime();
		this._gameContext.GetHqs().forEach((hq) => {
			const curve = this._curves
				.Get(StatsKind[StatsKind.Cell])
				.find((c) => c.Color === hq.Identity.Skin.GetColor());
			curve.Points.push(new DateValue(time, hq.GetFieldCount()));
		});
	}

	private HandleEnergyChanged(src: Headquarter, energy: number): void {
		const time = this.GetTime();
		this._gameContext.GetHqs().forEach((hq) => {
			const curve = this._curves
				.Get(StatsKind[StatsKind.Energy])
				.find((c) => c.Color === hq.Identity.Skin.GetColor());
			curve.Points.push(new DateValue(time, hq.GetCellTotalEnergy()));
		});
	}
}
