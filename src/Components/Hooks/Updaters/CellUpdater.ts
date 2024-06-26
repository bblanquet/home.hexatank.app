import { FieldHelper } from '../../../Core/Framework/FieldTypeHelper';
import { RecordKind } from '../../../Core/Framework/Record/Model/Item/State/RecordKind';
import { RecordContent } from '../../../Core/Framework/Record/Model/RecordContent';
import { Gameworld } from '../../../Core/Framework/World/Gameworld';
import { HexAxial } from '../../../Utils/Geometry/HexAxial';
import { Dictionary } from '../../../Utils/Collections/Dictionary';
import { IField } from '../../../Core/Items/Cell/Field/IField';
import { IndexFinder } from './IndexFinder';
import { isNullOrUndefined } from '../../../Utils/ToolBox';

export class CellUpdater {
	private _displayedFields: Dictionary<IField>;
	private _indexFinder: IndexFinder;

	constructor(private _ref: RecordContent, private _gameworld: Gameworld) {
		this._indexFinder = new IndexFinder();
		this._displayedFields = new Dictionary<IField>();
		this._gameworld.GetCells().forEach((c) => {
			this._displayedFields.Add(c.Coo(), c.GetField());
		});
	}

	public Update(date: number) {
		const coos = this.GetActiveFields(date);
		this.UpdateActiveField(coos);
	}

	private GetActiveFields(date: number) {
		const coos = new Dictionary<{ Axial: HexAxial; Action: RecordKind }>();
		this._ref.Cells.Keys().forEach((coo) => {
			const cell = this._ref.Cells.Get(coo);
			const dates = cell.States.map((a) => a.X);
			const dateIndex = this._indexFinder.GetIndex(date, dates);
			if (!isNullOrUndefined(dateIndex)) {
				const action = cell.States[dateIndex];
				coos.Add(coo, {
					Axial: this._gameworld.GetCell(coo).GetHexCoo(),
					Action: action.kind
				});
			}
		});
		return coos;
	}

	private UpdateActiveField(coos: Dictionary<{ Axial: HexAxial; Action: RecordKind }>) {
		coos.Keys().forEach((key) => {
			const fieldAction = FieldHelper.GetRecordName(this._displayedFields.Get(key));
			if (fieldAction !== coos.Get(key).Action) {
				const field = FieldHelper.NewFieldFromRecord(
					coos.Get(key).Action,
					this._gameworld.GetCell(key),
					this._gameworld.GetPlayerHq(),
					this._gameworld
				);
				this._displayedFields.Add(key, field);
			}
		});
	}
}
