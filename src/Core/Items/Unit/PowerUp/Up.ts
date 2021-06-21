import { LiteEvent } from '../../../Utils/Events/LiteEvent';
import { Item } from '../../Item';
import { Vehicle } from '../Vehicle';
import { UpCondition } from './Condition/UpCondition';
import { UpAnimation } from './UpAnimation';

export abstract class Up {
	private _handleEnergyChanged: any = this.EnergyChanged.bind(this);
	private _handleStop: any = this.OnStop.bind(this);
	public Animation: UpAnimation;
	protected isDone: boolean = false;

	constructor(
		protected Vehicle: Vehicle,
		private _condition: UpCondition,
		private _currentEnergy: number,
		private _energyChanged: LiteEvent<number> = null
	) {
		this._condition.Done.On(this._handleStop);
		this.Vehicle.OnDestroyed.On(this._handleStop);

		if (this._energyChanged) {
			this._energyChanged.On(this._handleEnergyChanged);
		}

		if (0 < this._currentEnergy) {
			this.OnEnergyChanged(0, this._currentEnergy);
		}
	}

	public Update(viewX: number, viewY: number): void {
		if (this.Animation) {
			this.Animation.Update(viewX, viewY);
		}
	}

	protected abstract OnEnergyChanged(previousEnery: number, energy: number): void;
	public GetCurrentEnergy(): number {
		return this._currentEnergy;
	}
	private EnergyChanged(src: any, nextEnergy: number): void {
		this.OnEnergyChanged(this._currentEnergy, nextEnergy);
		this._currentEnergy = nextEnergy;
	}

	private OnStop(src: any, item: Item): void {
		this.isDone = true;
		this._condition.Done.Off(this._handleStop);
		this.Vehicle.OnDestroyed.Off(this._handleStop);
		this.Vehicle.DeletePowerUp(this);
		if (this._energyChanged) {
			this._energyChanged.Off(this._handleEnergyChanged);
		}
		this._condition.Done.Clear();
		this.OnEnergyChanged(this._currentEnergy, 0);
	}
}
