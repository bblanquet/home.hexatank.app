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
			c.OnUnitChanged.On(this.UnitChanged.bind(this));
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
			.some((e) => TypeTranslator.IsEnemy(e, item.Identity));
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
			const hq = cell.GetField();
			let hqCo = hq.GetCell().Coo();
			if (this._hqFields.Exist(hqCo)) {
				const newHqList = this._hqFields.Get(hqCo).filter((c) => c !== cell);
				this._hqFields.Remove(hqCo);
				if (0 < newHqList.length) {
					this._hqFields.Add(hqCo, newHqList);
				}
			}
		}
	}

	private AddSpecialField(cell: Cell) {
		if (TypeTranslator.IsSpecialField(cell.GetField())) {
			const hq = TypeTranslator.GetHq(cell.GetField());
			let coo = hq.GetCell().Coo();
			if (this._hqFields.Exist(coo)) {
				this._hqFields.Get(coo).push(cell);
			} else {
				this._hqFields.Add(coo, [ cell ]);
			}
		}
	}

	private UnitChanged(obj: any, v: Vehicle): void {
		const cell = v.GetNextCell();
		this._units.Remove(v.Id);
		if (this._area.Contains(cell)) {
			this._units.Add(v.Id, v);
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
				this._fields.Get(field).some((e) => TypeTranslator.IsEnemy(e.GetField(), identity))
			);
		});
	}

	public CleanDeadUnits(): void {
		this._units.Values().forEach((u) => {
			if (!u.IsUpdatable) {
				this._units.Remove(u.Id);
			}
		});
	}

	public HasFoeVehicle(item: AliveItem): boolean {
		this.CleanDeadUnits();
		return this._units.Values().some((e) => e.IsEnemy(item.Identity));
	}

	public GetFoeVehicleCount(item: AliveItem): number {
		this.CleanDeadUnits();
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
