import { FieldTypeHelper } from '../../../../Core/Framework/FieldTypeHelper';
import { RecordKind } from '../../../../Core/Framework/Record/Model/Item/State/RecordKind';
import { RecordContent } from '../../../../Core/Framework/Record/Model/RecordContent';
import { GameContext } from '../../../../Core/Framework/Context/GameContext';
import { HexAxial } from '../../../../Core/Utils/Geometry/HexAxial';
import { Dictionary } from '../../../../Core/Utils/Collections/Dictionary';
import { IField } from '../../../../Core/Items/Cell/Field/IField';
import { IndexFinder } from './IndexFinder';
import { isNullOrUndefined } from '../../../../Core/Utils/ToolBox';

export class CellUpdater {
	private _displayedFields: Dictionary<IField>;
	private _indexFinder: IndexFinder;

	constructor(private _ref: RecordContent, private _gameContext: GameContext) {
		this._indexFinder = new IndexFinder();
		this._displayedFields = new Dictionary<IField>();
		this._gameContext.GetCells().forEach((c) => {
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
					Axial: this._gameContext.GetCell(coo).GetHexCoo(),
					Action: action.kind
				});
			}
		});
		return coos;
	}

	private UpdateActiveField(coos: Dictionary<{ Axial: HexAxial; Action: RecordKind }>) {
		coos.Keys().forEach((key) => {
			const fieldAction = FieldTypeHelper.GetRecordDescription(this._displayedFields.Get(key));
			if (fieldAction !== coos.Get(key).Action) {
				const field = FieldTypeHelper.CreateRecordField(
					coos.Get(key).Action,
					this._gameContext.GetCell(key),
					this._gameContext.GetPlayerHq(),
					this._gameContext
				);
				this._displayedFields.Add(key, field);
			}
		});
	}
}
