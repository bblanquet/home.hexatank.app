import { BlockingField } from '../../../Items/Cell/Field/BlockingField';
import { BasicField } from '../../../Items/Cell/Field/BasicField';
import { MedicField } from '../../../Items/Cell/Field/Bonus/MedicField';
import { RoadField } from '../../../Items/Cell/Field/Bonus/RoadField';
import { Dictionnary } from '../../../Utils/Collections/Dictionnary';
import { Area } from './Area';
import { Vehicle } from '../../../Items/Unit/Vehicle';
import { FarmField } from '../../../Items/Cell/Field/Bonus/FarmField';
import { Cell } from '../../../Items/Cell/Cell';
export class AreaStatus {
	private _fields: Dictionnary<Array<Cell>>;
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
		this._fields = new Dictionnary<Array<Cell>>();
		this._units = new Dictionnary<Vehicle>();

		this._area.GetCells().forEach((c) => {
			this.Update(c, true);
			if (c.HasOccupier()) {
				const vehicule = c.GetOccupier() as Vehicle;
				this._units.Add(vehicule.Id, vehicule);
			}
		});
	}

	private FieldChanged(obj: any, field: Cell): void {
		this.Update(field, true);
	}

	private Update(cell: Cell, isNew: boolean): void {
		const key = cell.GetField().constructor.name;
		if (!this._fields.Exist(key)) {
			this._fields.Add(key, []);
		}

		if (isNew) {
			this._fields.Get(key).push(cell);
		} else {
			if (this._fields.Get(key).length < 1) {
				throw 'it should not happen';
			}
			var newList = this._fields.Get(key).filter((c) => c !== cell);
			this._fields.Remove(key);
			if (0 < newList.length) {
				this._fields.Add(key, newList);
			}
		}
	}

	private FieldDestroyed(obj: any, field: Cell): void {
		this.Update(field, false);
	}

	private UnitChanged(obj: any, v: Vehicle): void {
		const cell = v.GetNextCell();
		if (this._area.Contains(cell)) {
		}
	}

	public HasField(field: string): boolean {
		return this._fields.Exist(field);
	}

	public GetCells(field: string): Cell[] {
		if (!this._fields.Exist(field)) {
			return [];
		}
		return this._fields.Get(field);
	}

	public Destroy(): void {}
}
