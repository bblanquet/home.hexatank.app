import { Component, h } from 'preact';
import { Item } from '../../../Core/Items/Item';
import { GameContext } from '../../../Core/Framework/GameContext';
import { Tank } from '../../../Core/Items/Unit/Tank';
import { Truck } from '../../../Core/Items/Unit/Truck';
import { Cell } from '../../../Core/Items/Cell/Cell';
import { ISelectable } from '../../../Core/ISelectable';
import { ReactorField } from '../../../Core/Items/Cell/Field/Bonus/ReactorField';
import { GameSettings } from '../../../Core/Framework/GameSettings';
import { Headquarter } from '../../../Core/Items/Cell/Field/Hq/Headquarter';
import HqMenuComponent from './Parts/HqMenuComponent';
import CanvasComponent from '../CanvasComponent';
import TankMenuComponent from './Parts/TankMenuComponent';
import MultiTankMenuComponent from './Parts/MultiTankMenuComponent';
import CellMenuComponent from './Parts/CellMenuComponent';
import MultiMenuComponent from './Parts/MultiMenuComponent';
import TruckMenuComponent from './Parts/TruckMenuComponent';
import ReactorMenuComponent from './Parts/ReactorMenuComponent';
import PopupMenuComponent from '../../PopupMenu/PopupMenuComponent';
import { UnitGroup } from '../../../Core/Items/UnitGroup';
import { GameStatus } from '../../../Core/Framework/GameStatus';
import { Player } from '../../../Network/Player';
import { CellGroup } from '../../../Core/Items/CellGroup';
import PopupComponent from '../../Popup/PopupComponent';
import { IGameContextService } from '../../../Services/GameContext/IGameContextService';
import { INetworkService } from '../../../Services/Network/INetworkService';
import { IInteractionService } from '../../../Services/Interaction/IInteractionService';
import { Factory, FactoryKey } from '../../../Factory';
import Redirect from '../../Redirect/RedirectComponent';

export default class GameCanvasComponent extends Component<
	any,
	{
		HasMenu: boolean;
		HasMultiMenu: boolean;
		HasFlag: boolean;
		HasWarning: boolean;
		TankRequestCount: number;
		TruckRequestCount: number;
		Amount: number;
		Item: Item;
		Players: Player[];
		GameStatus: GameStatus;
		IsSettingPatrol: boolean;
	}
> {
	private _gameContextService: IGameContextService;
	private _networkService: INetworkService;
	private _interactionService: IInteractionService;

	private _gameContext: GameContext;

	private _onItemSelectionChanged: { (obj: any, selectable: ISelectable): void };

	constructor() {
		super();
		this._gameContextService = Factory.Load<IGameContextService>(FactoryKey.GameContext);
		this._networkService = Factory.Load<INetworkService>(FactoryKey.Network);
		this._interactionService = Factory.Load<IInteractionService>(FactoryKey.Interaction);
		this._gameContext = this._gameContextService.Publish();
		this._onItemSelectionChanged = this.OnItemSelectionChanged.bind(this);
		this.setState({
			HasMenu: false,
			TankRequestCount: 0,
			TruckRequestCount: 0,
			Amount: GameSettings.PocketMoney,
			HasFlag: false,
			HasWarning: false,
			GameStatus: GameStatus.Pending,
			IsSettingPatrol: false
		});
	}
	private OnItemSelectionChanged(obj: any, item: ISelectable): void {
		if (!item.IsSelected()) {
			item.OnSelectionChanged.Off(this._onItemSelectionChanged);
			this.setState({
				...this.state,
				Item: null
			});
		}
	}

	componentDidMount() {
		this._gameContext.GetMainHq().OnTruckChanged.On(this.HandleTruckChanged.bind(this));
		this._gameContext.GetMainHq().OnTankRequestChanged.On(this.HandleTankChanged.bind(this));
		this._gameContext.GetMainHq().OnDiamondCountChanged.On(this.HandleDiamondChanged.bind(this));
		this._gameContext.OnItemSelected.On(this.HandleSelection.bind(this));
		this._gameContext.OnPatrolSetting.On(this.HandleSettingPatrol.bind(this));
		this._gameContext.GetMainHq().OnCashMissing.On(this.HandleCashMissing.bind(this));
		this._gameContext.GameStatusChanged.On(this.HandleGameStatus.bind(this));
		this._interactionService.OnMultiMenuShowed.On(this.HandleMultiMenuShowed.bind(this));
	}

	private HandleMultiMenuShowed(src: any, isDisplayed: boolean): void {
		this.setState({
			HasMultiMenu: isDisplayed
		});
	}

	private HandleTruckChanged(obj: any, request: number): void {
		this.setState({
			TruckRequestCount: request
		});
	}

	private HandleTankChanged(obj: any, request: number): void {
		this.setState({
			TankRequestCount: request
		});
	}

	private HandleDiamondChanged(obj: any, amount: number): void {
		this.setState({
			Amount: amount
		});
	}

	private HandleSelection(obj: any, selectedItem: Item): void {
		((selectedItem as unknown) as ISelectable).OnSelectionChanged.On(this._onItemSelectionChanged);
		this.setState({
			Item: selectedItem
		});
	}

	private HandleSettingPatrol(obj: any, isSettingPatrol: boolean): void {
		this.setState({
			IsSettingPatrol: isSettingPatrol
		});
	}

	private HandleCashMissing(obj: any, e: boolean): void {
		if (e !== this.state.HasWarning) {
			this.setState({
				HasWarning: e
			});
		}
	}

	private HandleGameStatus(obj: any, e: GameStatus): void {
		if (e !== this.state.GameStatus) {
			this.setState({
				GameStatus: e
			});
		}
	}

	private LeftMenuRender() {
		if (this.state.HasMultiMenu) {
			return <MultiMenuComponent Item={this.state.Item} />;
		} else if (this.state.Item) {
			if (this.state.Item instanceof Tank) {
				return <TankMenuComponent Tank={this.state.Item} isSettingPatrol={this.state.IsSettingPatrol} />;
			} else if (this.state.Item instanceof Truck) {
				return <TruckMenuComponent Truck={this.state.Item} isSettingPatrol={this.state.IsSettingPatrol} />;
			} else if (this.state.Item instanceof UnitGroup) {
				return <MultiTankMenuComponent item={this.state.Item} />;
			} else if (this.state.Item instanceof Headquarter) {
				return (
					<HqMenuComponent
						SetFlag={this.SetFlag.bind(this)}
						TankRequestCount={this.state.TankRequestCount}
						TruckRequestCount={this.state.TruckRequestCount}
						HasFlag={this.state.HasFlag}
						GameContext={this._gameContext}
					/>
				);
			} else if (this.state.Item instanceof ReactorField) {
				return <ReactorMenuComponent Item={this.state.Item} GameContext={this._gameContext} />;
			} else if (this.state.Item instanceof Cell || this.state.Item instanceof CellGroup) {
				return <CellMenuComponent Item={this.state.Item} GameContext={this._gameContext} />;
			}
		}
		return '';
	}

	componentDidUpdate() {}

	private SetMenu(): void {
		const newValue = !this.state.HasMenu;
		this.setState({
			HasMenu: newValue
		});
		if (!this._networkService.HasSocket()) {
			GameSettings.IsPause = newValue;
		}
	}

	private SetFlag(): void {
		this._gameContext.IsFlagingMode = !this._gameContext.IsFlagingMode;
		this.setState({
			...this.state,
			HasFlag: this._gameContext.IsFlagingMode
		});
	}

	render() {
		return (
			<Redirect>
				<div style="width=100%">
					{this.TopLeftInfo()}
					{this.TopMenuRender()}
					{this.state.GameStatus === GameStatus.Pending ? '' : this.GetEndMessage()}
					<CanvasComponent />
					{this.state.HasMenu && this.state.GameStatus === GameStatus.Pending ? '' : this.LeftMenuRender()}
					{this.state.HasMenu && this.state.GameStatus === GameStatus.Pending ? this.MenuRender() : ''}
				</div>
			</Redirect>
		);
	}

	private TopLeftInfo() {
		if (this._networkService.HasSocket()) {
			return (
				<div style="position: fixed;left: 0%; color:white;">
					{this._gameContext.Players.map((player) => {
						return (
							<div>
								{player.Name} <span class="badge badge-info">{player.Latency}</span>
							</div>
						);
					})}
				</div>
			);
		}
	}

	private TopMenuRender() {
		if (this.state.GameStatus !== GameStatus.Pending) {
			return '';
		}

		return (
			<div style="position: fixed;left: 50%;transform: translateX(-50%);">
				<button type="button" class="btn btn-dark space-out">
					{this.ShowNoMoney()}
					{this.state.Amount.toPrecision(2)}
					<span class="fill-diamond badge badge-secondary very-small-space middle very-small-left-margin very-small-right-margin">
						{' '}
					</span>
				</button>
				<button
					type="button"
					class="btn btn-dark small-space space-out fill-option"
					onClick={() => this.SetMenu()}
				/>
			</div>
		);
	}

	private ShowNoMoney() {
		if (this.state.HasWarning) {
			return (
				<span class="fill-noMoney badge badge-warning very-small-space middle very-small-right-margin blink_me">
					{' '}
				</span>
			);
		} else {
			return '';
		}
	}

	private MenuRender() {
		return <PopupMenuComponent status={this.state.GameStatus} callBack={() => this.SetMenu()} />;
	}

	private GetEndMessage() {
		if ([ GameStatus.Won, GameStatus.Lost ].some((e) => e === this.state.GameStatus)) {
			return (
				<PopupComponent
					status={this.state.GameStatus}
					curves={this._gameContext.StatsContext.GetCurves()}
					context={this._gameContext.TrackingContext.GetTrackingObject()}
				/>
			);
		}
		return '';
	}
}
