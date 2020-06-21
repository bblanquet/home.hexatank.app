import { BlockingField } from '../../../Items/Cell/Field/BlockingField';
import { BasicField } from '../../../Items/Cell/Field/BasicField';
import { MedicField } from '../../../Items/Cell/Field/Bonus/MedicField';
import { RoadField } from '../../../Items/Cell/Field/Bonus/RoadField';
import { Dictionnary } from '../../../Utils/Collections/Dictionnary';
import { IField } from '../../../Items/Cell/Field/IField';
import { Area } from './Area';
import { Vehicle } from '../../../Items/Unit/Vehicle';
export class AreaStatus {
	private _fields: Dictionnary<number>;
	private _units: Dictionnary<Vehicle>;

	constructor(private _area: Area) {
		this._area.GetCells().forEach((c) => {
			c.OnFieldChanged.On(this.FieldChanged.bind(this));
			c.OnFieldDestroyed.On(this.FieldDestroyed.bind(this));
			c.OnUnitChanged.On(this.UnitChanged.bind(this));
		});
		this.Refresh();
	}

	public Refresh(): void {
		this._fields = new Dictionnary<number>();
		this._units = new Dictionnary<Vehicle>();

		this._area.GetCells().forEach((c) => {
			this.Update(c.GetField(), (e) => e + 1);
			if (c.HasOccupier()) {
				const vehicule = c.GetOccupier() as Vehicle;
				this._units.Add(vehicule.Id, vehicule);
			}
		});
	}

	private FieldChanged(obj: any, field: IField): void {
		this.Update(field, (e) => e + 1);
	}

	private Update(field: IField, doer: (a: number) => number): void {
		const key = field.constructor.name;
		if (!this._fields.Exist(key)) {
			this._fields.Add(key, 0);
		}
		const value = doer(this._fields.Get(key));

		if (value < 0) {
			throw 'it should not happen';
		}

		this._fields.Remove(key);
		this._fields.Add(key, value);
	}

	private FieldDestroyed(obj: any, field: IField): void {
		this.Update(field, (e) => e - 1);
	}

	private UnitChanged(obj: any, v: Vehicle): void {
		const cell = v.GetNextCell();
		if (this._area.Contains(cell)) {
		}
	}

	public HasNature(): boolean {
		return this._fields.Get(BlockingField.name) > 0;
	}

	public HasRoadFields(): boolean {
		return this._fields.Get(RoadField.name) > 0;
	}

	public HasMedicFields(): boolean {
		return this._fields.Get(MedicField.name) > 0;
	}

	public HasFreeFields(): boolean {
		return this._fields.Get(BasicField.name) > 0;
	}

	public Destroy(): void {}
}
