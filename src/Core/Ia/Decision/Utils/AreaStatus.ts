import { TypeTranslator } from './../../../Items/Cell/Field/TypeTranslator';
import { Identity } from './../../../Items/Identity';
import { IField } from './../../../Items/Cell/Field/IField';
import { Dictionnary } from '../../../Utils/Collections/Dictionnary';
import { Area } from './Area';
import { Vehicle } from '../../../Items/Unit/Vehicle';
import { Cell } from '../../../Items/Cell/Cell';
import { AliveItem } from '../../../Items/AliveItem';

export class AreaStatus {
	private _fields: Dictionnary<Array<Cell>>;
	private _units: Dictionnary<Vehicle>;
	private _hqFields: Dictionnary<Array<Cell>>;

	constructor(private _area: Area) {
		this._area.GetCells().forEach((c) => {
			c.OnFieldChanged.On(this.FieldChanged.bind(this));
			c.OnVehicleChanged.On(this.UnitChanged.bind(this));
		});
		this.Refresh();
	}

	public Refresh(): void {
		this._fields = new Dictionnary<Array<Cell>>();
		this._units = new Dictionnary<Vehicle>();
		this._hqFields = new Dictionnary<Array<Cell>>();

		this._area.GetCells().forEach((c) => {
			this.Update(c, true);
			if (c.HasOccupier()) {
				const vehicule = c.GetOccupier() as Vehicle;
				this._units.Add(vehicule.Id, vehicule);
			}
		});
	}

	public IsNeutral(): boolean {
		return this._units.IsEmpty() && this._hqFields.IsEmpty();
	}

	HasUnit(item: AliveItem): boolean {
		return this._units.Values().some((c) => !c.IsEnemy(item.Identity));
	}

	public HasFoesOf(item: AliveItem): boolean {
		const hasUnitFoes = this._units.Values().some((c) => c.IsEnemy(item.Identity));
		if (hasUnitFoes) {
			return true;
		}

		if (this._hqFields.IsEmpty()) {
			return false;
		}

		const fields = this._hqFields.Values().reduce((e, x) => e.concat(x)).map((c) => c.GetField());
		const hasFoeCell = fields
			.filter((e: IField) => TypeTranslator.IsSpecialField(e))
			.some((e) => item.Identity.IsEnemy(e.GetIdentity()));
		return hasFoeCell;
	}

	private FieldChanged(obj: any, field: Cell): void {
		this.Update(field, true);
	}

	private RemoveCellFromFields(cell: Cell): void {
		this._fields.Keys().forEach((k) => {
			const cells = this._fields.Get(k);
			if (cells.some((c) => c === cell)) {
				this._fields.Remove(k);
				const newCells = cells.filter((c) => c !== cell);
				if (0 < newCells.length) {
					this._fields.Add(k, newCells);
				}
			}
		});
	}

	private Update(cell: Cell, isNew: boolean): void {
		const key = cell.GetField().constructor.name;

		this.RemoveCellFromFields(cell);
		this.RemoveNewBonusField(cell);

		if (!this._fields.Exist(key)) {
			this._fields.Add(key, []);
		}

		this._fields.Get(key).push(cell);
		this.AddSpecialField(cell);

		if (7 < this.GetCellCount()) {
			throw 'it should not happen';
		}
	}

	public GetCellCount(): number {
		const fields = this._fields.Values();
		if (fields.length === 0) {
			return 0;
		}
		return fields.reduce((e, x) => e.concat(x)).length;
	}

	private RemoveNewBonusField(cell: Cell) {
		if (TypeTranslator.IsSpecialField(cell.GetField())) {
			const idName = cell.GetField().GetIdentity().Name;
			if (this._hqFields.Exist(idName)) {
				const newHqList = this._hqFields.Get(idName).filter((c) => c !== cell);
				this._hqFields.Remove(idName);
				if (0 < newHqList.length) {
					this._hqFields.Add(idName, newHqList);
				}
			}
		}
	}

	private AddSpecialField(cell: Cell) {
		if (TypeTranslator.IsSpecialField(cell.GetField())) {
			const idName = cell.GetField().GetIdentity().Name;
			if (this._hqFields.Exist(idName)) {
				this._hqFields.Get(idName).push(cell);
			} else {
				this._hqFields.Add(idName, [ cell ]);
			}
		}
	}

	private UnitChanged(obj: any, vehicule: Vehicle): void {
		if (vehicule !== null) {
			const cell = vehicule.GetNextCell();
			this._units.Remove(vehicule.Id);
			if (this._area.Contains(cell)) {
				this._units.Add(vehicule.Id, vehicule);
			}
		}
	}

	public HasField(field: string): boolean {
		return this._fields.Exist(field);
	}

	public HasFields(fields: string[]): boolean {
		return fields.some((field) => this._fields.Exist(field));
	}

	public HasFoeFields(fields: string[], identity: Identity): boolean {
		return fields.some((field) => {
			return (
				this._fields.Exist(field) &&
				this._fields.Get(field).some((e) => identity.IsEnemy(e.GetField().GetIdentity()))
			);
		});
	}

	public ClearDestroyedVehicle(): void {
		this._units.Values().forEach((u) => {
			if (!u.IsUpdatable) {
				this._units.Remove(u.Id);
			}
		});
	}

	public HasFoeVehicle(item: AliveItem): boolean {
		this.ClearDestroyedVehicle();
		return this._units.Values().some((e) => e.IsEnemy(item.Identity));
	}

	public GetFoeVehicleCount(item: AliveItem): number {
		this.ClearDestroyedVehicle();
		return this._units.Values().filter((e) => e.IsEnemy(item.Identity)).length;
	}

	public GetCells(field: string): Cell[] {
		if (!this._fields.Exist(field)) {
			return [];
		}
		return this._fields.Get(field);
	}

	public GetKindCells(fields: string[]): Cell[] {
		var result = new Array<Cell>();
		fields.forEach((f) => {
			result = result.concat(this.GetCells(f));
		});
		return result;
	}

	public Destroy(): void {}
}
