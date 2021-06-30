import { TypeTranslator } from './../../../Items/Cell/Field/TypeTranslator';
import { Identity, Relationship } from './../../../Items/Identity';
import { IField } from './../../../Items/Cell/Field/IField';
import { Dictionary } from '../../../../Utils/Collections/Dictionary';
import { Area } from './Area';
import { Vehicle } from '../../../Items/Unit/Vehicle';
import { Cell } from '../../../Items/Cell/Cell';
import { AliveItem } from '../../../Items/AliveItem';
import { ErrorCat, ErrorHandler } from '../../../../Utils/Exceptions/ErrorHandler';

export class AreaStatus {
	private _fields: Dictionary<Array<Cell>>;
	private _units: Dictionary<Vehicle>;
	private _hqFields: Dictionary<Array<Cell>>;

	constructor(private _area: Area) {
		this._area.GetCells().forEach((c) => {
			c.OnFieldChanged.On(this.FieldChanged.bind(this));
			c.OnVehicleChanged.On(this.UnitChanged.bind(this));
		});
		this.Snapshot();
	}

	private Snapshot(): void {
		this._fields = new Dictionary<Array<Cell>>();
		this._units = new Dictionary<Vehicle>();
		this._hqFields = new Dictionary<Array<Cell>>();

		this._area.GetCells().forEach((c) => {
			this.Update(c);
			if (c.HasOccupier()) {
				const vehicule = c.GetOccupier() as Vehicle;
				this._units.Add(vehicule.Id, vehicule);
			}
		});
	}

	private FieldChanged(obj: any, cell: Cell): void {
		this.Update(cell);
	}

	private DetachFromFields(cell: Cell): void {
		this._fields.Keys().forEach((key) => {
			let cells = this._fields.Get(key);
			if (cells.some((c) => c === cell)) {
				this._fields.Remove(key);
				cells = cells.filter((c) => c !== cell);
				if (0 < cells.length) {
					this._fields.Add(key, cells);
				}
			}
		});
	}

	private Update(cell: Cell): void {
		const key = cell.GetField().constructor.name;

		this.DetachFromFields(cell);
		this.DetachFromHqField(cell);

		this.AttachField(key, cell);
		this.AttachHqField(cell);

		if (7 < this.GetCellCount()) {
			ErrorHandler.Throw(new Error(ErrorHandler.Cat.Get(ErrorCat[ErrorCat.invalidType])));
		}
	}

	private AttachField(key: string, cell: Cell) {
		if (!this._fields.Exist(key)) {
			this._fields.Add(key, []);
		}

		this._fields.Get(key).push(cell);
	}

	private DetachFromHqField(cell: Cell) {
		if (TypeTranslator.IsSpecialField(cell.GetField())) {
			const name = cell.GetField().GetIdentity().Name;
			if (this._hqFields.Exist(name)) {
				const cells = this._hqFields.Get(name).filter((c) => c !== cell);
				this._hqFields.Remove(name);
				if (0 < cells.length) {
					this._hqFields.Add(name, cells);
				}
			}
		}
	}

	private AttachHqField(cell: Cell) {
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

	public IsNeutral(): boolean {
		return this._units.IsEmpty() && this._hqFields.IsEmpty();
	}

	public HasUnit(item: AliveItem): boolean {
		return this._units.Values().some((c) => c.GetRelation(item.Identity) === Relationship.Ally);
	}

	public HasFoesOf(item: AliveItem): boolean {
		const hasUnitFoes = this._units.Values().some((c) => c.GetRelation(item.Identity) == Relationship.Enemy);
		if (hasUnitFoes) {
			return true;
		}

		if (this._hqFields.IsEmpty()) {
			return false;
		}

		const fields = this._hqFields.Values().reduce((e, x) => e.concat(x)).map((c) => c.GetField());
		const hasFoeCell = fields
			.filter((e: IField) => TypeTranslator.IsSpecialField(e))
			.some((e) => item.Identity.GetRelation(e.GetIdentity()) === Relationship.Enemy);
		return hasFoeCell;
	}

	public GetCellCount(): number {
		const fields = this._fields.Values();
		if (fields.length === 0) {
			return 0;
		}
		return fields.reduce((e, x) => e.concat(x)).length;
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
				this._fields
					.Get(field)
					.some((e) => identity.GetRelation(e.GetField().GetIdentity()) === Relationship.Enemy)
			);
		});
	}

	private ClearDestroyedVehicle(): void {
		this._units.Values().forEach((u) => {
			if (!u.IsUpdatable) {
				this._units.Remove(u.Id);
			}
		});
	}

	public HasFoeVehicle(item: AliveItem): boolean {
		this.ClearDestroyedVehicle();
		return this._units.Values().some((e) => e.GetRelation(item.Identity) === Relationship.Enemy);
	}

	public GetFoeVehicleCount(item: AliveItem): number {
		this.ClearDestroyedVehicle();
		return this._units.Values().filter((e) => e.GetRelation(item.Identity) === Relationship.Enemy).length;
	}

	private GetCellsFromField(field: string): Cell[] {
		if (!this._fields.Exist(field)) {
			return [];
		}
		return this._fields.Get(field);
	}

	public GetCells(fields: string[]): Cell[] {
		var result = new Array<Cell>();
		fields.forEach((f) => {
			result = result.concat(this.GetCellsFromField(f));
		});
		return result;
	}

	public Destroy(): void {}
}
