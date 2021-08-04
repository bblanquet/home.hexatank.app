import { StateUpdater } from 'preact/hooks';
import { PlayerState } from '../Model/PlayerState';
import { Hook } from './Hook';
import { RecordCanvasUpdater } from './Updaters/RecordCanvasUpdater';
import { IRecordService } from '../../Services/Record/IRecordService';
import { Singletons, SingletonKey } from '../../Singletons';
import { route } from 'preact-router';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { Gameworld } from '../../Core/Framework/World/Gameworld';
import { RecordContent } from '../../Core/Framework/Record/Model/RecordContent';
import { Point } from '../../Utils/Geometry/Point';
import { IGameworldService } from '../../Services/World/IGameworldService';
import { ISelectable } from '../../Core/ISelectable';
import { Item } from '../../Core/Items/Item';
import { LiteEvent } from '../../Utils/Events/LiteEvent';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';

export class PlayerHook extends Hook<PlayerState> {
	private _recordService: IRecordService;
	private _gameService: IGameworldService<GameBlueprint, Gameworld>;
	private _onItemSelectionChanged: any = this.OnItemSelectionChanged.bind(this);
	private _updater: RecordCanvasUpdater;
	private _context: Gameworld;
	public OnRefresh: SimpleEvent = new SimpleEvent();

	constructor(d: [PlayerState, StateUpdater<PlayerState>]) {
		super(d[0], d[1]);
		this._gameService = Singletons.Load<IGameworldService<GameBlueprint, Gameworld>>(SingletonKey.GameContext);
		this._recordService = Singletons.Load<IRecordService>(SingletonKey.Record);
		this._context = this._gameService.Publish();
		this._updater = new RecordCanvasUpdater(this.GetRecord(), this._context);
		this._context.OnItemSelected.On(this.UpdateSelection.bind(this));
		this.OnRefresh.Invoke();
	}

	static DefaultState(): PlayerState {
		const state = new PlayerState();
		state.Item = null;
		state.IsLog = false;
		return state;
	}

	public Unmount(): void {
		this._gameService.Collect();
	}

	private OnItemSelectionChanged(obj: any, item: ISelectable): void {
		if (!item.IsSelected()) {
			item.OnSelectionChanged.Off(this._onItemSelectionChanged);
			this.Update((e) => (e.Item = null));
		}
	}

	public GetCenter(): Point {
		const player = this._context.GetPlayer();
		return player.GetBoundingBox().GetCentralPoint();
	}

	public SetMenu(): void {
		route('{{sub_path}}Profil', true);
	}

	public UpdateSelection(obj: any, selectedItem: Item): void {
		((selectedItem as unknown) as ISelectable).OnSelectionChanged.On(this._onItemSelectionChanged);
		this.Update((e) => (e.Item = selectedItem));
	}

	public HandleRangeChanged(e: number): void {
		this._updater.SetDate(e);
	}

	public GetRecord(): RecordContent {
		return this._recordService.Publish();
	}

	public ChangePage(page: boolean): void {
		this.Update((e) => (e.IsLog = page));
	}
}
