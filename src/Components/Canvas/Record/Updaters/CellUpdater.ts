import { FieldTypeHelper } from '../../../../Core/Framework/Packets/FieldTypeHelper';
import { RecordKind } from '../../../../Core/Framework/Record/RecordKind';
import { RecordData } from '../../../../Core/Framework/Record/RecordData';
import { GameContext } from '../../../../Core/Framework/GameContext';
import { HexAxial } from '../../../../Core/Utils/Geometry/HexAxial';
import { Dictionnary } from '../../../../Core/Utils/Collections/Dictionnary';
import { IField } from '../../../../Core/Items/Cell/Field/IField';
import { IndexFinder } from './IndexFinder';
import { isNullOrUndefined } from '../../../../Core/Utils/ToolBox';

export class CellUpdater {
	private _displayedFields: Dictionnary<IField>;
	private _indexFinder: IndexFinder;

	constructor(private _ref: RecordData, private _gameContext: GameContext) {
		this._indexFinder = new IndexFinder();
		this._displayedFields = new Dictionnary<IField>();
		this._gameContext.GetCells().forEach((c) => {
			this._displayedFields.Add(c.Coo(), c.GetField());
		});
	}

	public Update(date: number) {
		const coos = this.GetActiveFields(date);
		this.UpdateActiveField(coos);
	}

	private GetActiveFields(date: number) {
		const coos = new Dictionnary<{ Axial: HexAxial; Action: RecordKind }>();
		this._ref.Cells.Keys().forEach((coo) => {
			const cell = this._ref.Cells.Get(coo);
			const dates = cell.Actions.map((a) => a.X);
			const dateIndex = this._indexFinder.GetIndex(date, dates);
			if (!isNullOrUndefined(dateIndex)) {
				const action = cell.Actions[dateIndex];
				coos.Add(coo, {
					Axial: this._gameContext.GetCell(coo).GetCoordinate(),
					Action: action.kind
				});
			}
		});
		return coos;
	}

	private UpdateActiveField(coos: Dictionnary<{ Axial: HexAxial; Action: RecordKind }>) {
		coos.Keys().forEach((key) => {
			const fieldAction = FieldTypeHelper.GetTrackingDescription(this._displayedFields.Get(key));
			if (fieldAction !== coos.Get(key).Action) {
				const field = FieldTypeHelper.CreateTrackingField(
					coos.Get(key).Action,
					this._gameContext.GetCell(key),
					this._gameContext.GetMainHq(),
					this._gameContext
				);
				this._displayedFields.Add(key, field);
			}
		});
	}
}
