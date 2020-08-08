import { ReactorAppearance } from '../../../Items/Cell/Field/Bonus/ReactorAppearance';
import { GameContext } from './../../../Framework/GameContext';
import { Dictionnary } from '../../../Utils/Collections/Dictionnary';
import { Area } from './Area';
import { Vehicle } from '../../../Items/Unit/Vehicle';
import { Cell } from '../../../Items/Cell/Cell';
import { AliveItem } from '../../../Items/AliveItem';
import { BonusField } from '../../../Items/Cell/Field/Bonus/BonusField';
import { ReactorField } from '../../../Items/Cell/Field/Bonus/ReactorField';

export class AreaStatus {
	private _fields: Dictionnary<Array<Cell>>;
	private _units: Dictionnary<Vehicle>;
	private _hqFields: Dictionnary<Array<Cell>>;
	private _gameContext: GameContext;

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

	public HasFoesOf(item: AliveItem): boolean {
		const hasUnitFoes = this._units.Values().some((c) => c.IsEnemy(item));
		if (hasUnitFoes) {
			return true;
		}

		if (this._hqFields.IsEmpty()) {
			return false;
		}

		const hasCellFoes = this._hqFields
			.Values()
			.reduce((e, x) => e.concat(x))
			.some(
				(c) =>
					(c.GetField() instanceof BonusField || c.GetField() instanceof ReactorField) &&
					(c.GetField() as BonusField).GetHq().IsEnemy(item)
			);
		return hasCellFoes;
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
		this.AddNewBonusField(cell);

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
		if (cell.GetField() instanceof BonusField) {
			const hq = (cell.GetField() as BonusField).GetHq();
			let hqCo = hq.GetCell().GetCoordinate().ToString();
			if (this._hqFields.Exist(hqCo)) {
				const newHqList = this._hqFields.Get(hqCo).filter((c) => c !== cell);
				this._hqFields.Remove(hqCo);
				if (0 < newHqList.length) {
					this._hqFields.Add(hqCo, newHqList);
				}
			}
		}
	}

	private AddNewBonusField(cell: Cell) {
		if (cell.GetField() instanceof BonusField) {
			const hq = (cell.GetField() as BonusField).GetHq();
			let co = hq.GetCell().GetCoordinate().ToString();
			if (this._hqFields.Exist(co)) {
				this._hqFields.Get(co).push(cell);
			} else {
				this._hqFields.Add(co, [ cell ]);
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

	public HasFoeField(item: AliveItem): boolean {
		const hqsCells = this._hqFields.Keys();
		return 0 < hqsCells.length && hqsCells.some((e) => item.IsEnemy(this._gameContext.GetHq(e)));
	}

	public HasFoeReactor(item: AliveItem): boolean {
		if (this.HasFoeField(item)) {
			if (this.HasField(ReactorAppearance.name)) {
				return this.GetCells(ReactorAppearance.name)
					.map((c) => (c.GetField() as any) as ReactorAppearance)
					.some((e) => e.IsEnemy(item));
			}
		}
		return false;
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
		return this._units.Values().some((e) => e.IsEnemy(item));
	}

	public GetFoeVehicleCount(item: AliveItem): number {
		this.CleanDeadUnits();
		return this._units.Values().filter((e) => e.IsEnemy(item)).length;
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
