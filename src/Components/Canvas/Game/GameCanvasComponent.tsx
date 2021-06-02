import { Component, h } from 'preact';
import { Item } from '../../../Core/Items/Item';
import { GameContext } from '../../../Core/Setup/Context/GameContext';
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
import { OnlinePlayer } from '../../../Network/OnlinePlayer';
import { CellGroup } from '../../../Core/Items/CellGroup';
import PopupComponent from '../../Popup/PopupComponent';
import { IGameContextService } from '../../../Services/GameContext/IGameContextService';
import { INetworkService } from '../../../Services/Network/INetworkService';
import { IInteractionService } from '../../../Services/Interaction/IInteractionService';
import { Factory, FactoryKey } from '../../../Factory';
import Redirect from '../../Redirect/RedirectComponent';
import Icon from '../../Common/Icon/IconComponent';
import { AudioArchive } from '../../../Core/Framework/AudioArchiver';
import ActiveRightBottomCornerButton from './../../Common/Button/Corner/ActiveRightBottomCornerButton';
import { InteractionKind } from '../../../Core/Interaction/IInteractionContext';
import { MultiTankMenuItem } from '../../../Core/Menu/Buttons/MultiTankMenuItem';
import Visible from '../../Common/Visible/VisibleComponent';
import { isNullOrUndefined } from '../../../Core/Utils/ToolBox';
import { MultiCellMenuItem } from '../../../Core/Menu/Buttons/MultiCellMenuItem';
import { IAppService } from '../../../Services/App/IAppService';
import { FlagCellCombination } from '../../../Core/Interaction/Combination/FlagCellCombination';
import { GameBlueprint } from '../../../Core/Setup/Blueprint/Game/GameBlueprint';
import { IAudioService } from '../../../Services/Audio/IAudioService';

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
		Players: OnlinePlayer[];
		GameStatus: GameStatus;
		IsSettingPatrol: boolean;
	}
> {
	private _diamonds: number;
	private _gameContextService: IGameContextService<GameBlueprint, GameContext>;
	private _soundService: IAudioService;
	private _networkService: INetworkService;
	private _interactionService: IInteractionService<GameContext>;
	private _appService: IAppService<GameBlueprint>;
	private _gameContext: GameContext;

	private _onItemSelectionChanged: { (obj: any, selectable: ISelectable): void };

	constructor() {
		super();
		this._gameContextService = Factory.Load<IGameContextService<GameBlueprint, GameContext>>(
			FactoryKey.GameContext
		);
		this._soundService = Factory.Load<IAudioService>(FactoryKey.Audio);
		this._networkService = Factory.Load<INetworkService>(FactoryKey.Network);
		this._interactionService = Factory.Load<IInteractionService<GameContext>>(FactoryKey.Interaction);
		this._appService = Factory.Load<IAppService<GameBlueprint>>(FactoryKey.App);
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
		this._diamonds = GameSettings.PocketMoney;
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
		this._soundService.Pause(AudioArchive.loungeMusic);
		const playerHq = this._gameContext.GetPlayerHq();
		if (playerHq) {
			playerHq.OnTruckChanged.On(this.HandleTruckChanged.bind(this));
			playerHq.OnTankRequestChanged.On(this.HandleTankChanged.bind(this));
			playerHq.OnDiamondCountChanged.On(this.HandleDiamondChanged.bind(this));
			playerHq.OnCashMissing.On(this.HandleCashMissing.bind(this));
		}
		this._gameContext.OnItemSelected.On(this.HandleSelection.bind(this));
		this._gameContext.OnPatrolSetting.On(this.HandleSettingPatrol.bind(this));
		this._gameContext.OnGameStatusChanged.On(this.HandleGameStatus.bind(this));
		this._interactionService.OnMultiMenuShowed.On(this.HandleMultiMenuShowed.bind(this));
		if (this._networkService.HasSocket()) {
			this._networkService.GetOnlinePlayers().forEach((onlinePlayers) => {
				onlinePlayers.OnChanged.On(() => {
					this.setState({});
				});
			});
		}
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
		this._diamonds = amount;
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
				return (
					<TankMenuComponent
						Interaction={this._interactionService.Publish()}
						Tank={this.state.Item}
						isSettingPatrol={this.state.IsSettingPatrol}
					/>
				);
			} else if (this.state.Item instanceof Truck) {
				return (
					<TruckMenuComponent
						Interaction={this._interactionService.Publish()}
						Truck={this.state.Item}
						isSettingPatrol={this.state.IsSettingPatrol}
					/>
				);
			} else if (this.state.Item instanceof UnitGroup) {
				return (
					<MultiTankMenuComponent Interaction={this._interactionService.Publish()} item={this.state.Item} />
				);
			} else if (this.state.Item instanceof Headquarter) {
				return (
					<HqMenuComponent
						Interaction={this._interactionService.Publish()}
						SetFlag={this.SetFlag.bind(this)}
						TankRequestCount={this.state.TankRequestCount}
						TruckRequestCount={this.state.TruckRequestCount}
						HasFlag={this.state.HasFlag}
						VehicleCount={this._gameContext.GetPlayerHq().GetVehicleCount()}
					/>
				);
			} else if (this.state.Item instanceof ReactorField) {
				return (
					<ReactorMenuComponent
						Item={this.state.Item}
						GameContext={this._gameContext}
						Interaction={this._interactionService.Publish()}
					/>
				);
			} else if (this.state.Item instanceof Cell || this.state.Item instanceof CellGroup) {
				return (
					<CellMenuComponent
						Item={this.state.Item}
						Interaction={this._interactionService.Publish()}
						ReactorCount={this._gameContext.GetPlayerHq().GetReactorsCount()}
					/>
				);
			}
		}
		return '';
	}

	private SetMenu(): void {
		const newValue = !this.state.HasMenu;
		this.setState({
			HasMenu: newValue
		});
		if (newValue) {
			this._soundService.GetGameAudioManager().PauseAll();
		} else if (!this._soundService.IsMute()) {
			this._soundService.GetGameAudioManager().PlayAll();
		}

		if (!this._networkService.HasSocket()) {
			GameSettings.IsPause = newValue;
		}
	}

	private SetFlag(): void {
		FlagCellCombination.IsFlagingMode = !FlagCellCombination.IsFlagingMode;
		this.setState({
			...this.state,
			HasFlag: FlagCellCombination.IsFlagingMode
		});
	}

	render() {
		return (
			<Redirect>
				{this.TopLeftInfo()}
				{this.TopMenuRender()}
				{this.state.GameStatus === GameStatus.Pending ? '' : this.GetEndMessage()}
				<CanvasComponent gameContext={this._gameContextService} />
				<Visible
					isVisible={
						!this.state.HasMenu &&
						isNullOrUndefined(this.state.Item) &&
						this.state.GameStatus === GameStatus.Pending
					}
				>
					<div class="right-bottom-menu">
						<ActiveRightBottomCornerButton
							isActive={this._interactionService.GetMultiSelectionContext().IsListeningUnit()}
							callBack={() => this.SendContext(new MultiTankMenuItem())}
							logo="fill-tank-multi-cell"
						/>
						<ActiveRightBottomCornerButton
							isActive={this._interactionService.GetMultiSelectionContext().IsListeningCell()}
							callBack={() => this.SendContext(new MultiCellMenuItem())}
							logo="fill-mult-cell"
						/>
					</div>
				</Visible>
				<Visible isVisible={!(this.state.HasMenu && this.state.GameStatus === GameStatus.Pending)}>
					{this.LeftMenuRender()}
				</Visible>
				<Visible isVisible={this.state.HasMenu && this.state.GameStatus === GameStatus.Pending}>
					{this.MenuRender()}
				</Visible>
			</Redirect>
		);
	}

	private TopLeftInfo() {
		if (this._networkService.HasSocket()) {
			return (
				<div style="position: fixed;left: 0%; color:white;">
					{this._networkService.GetOnlinePlayers().map((player) => {
						return (
							<div>
								{player.Name} <span class="badge badge-info">{player.GetLatency()}</span>{' '}
								{this.HasTimeout(player)}
							</div>
						);
					})}
				</div>
			);
		}
	}

	private SendContext(item: Item): void {
		const interaction = this._interactionService.Publish();
		interaction.Kind = InteractionKind.Up;
		interaction.OnSelect(item);
	}

	private HasTimeout(player: OnlinePlayer) {
		if (player.HasTimeOut()) {
			return (
				<span
					class="badge badge-danger align-text-center blink_me"
					style="background-color:#ff0062; border: white solid 0.5px"
				>
					<Icon Value={'fas fa-exclamation-circle'} />
				</span>
			);
		}
		return '';
	}

	private TopMenuRender() {
		if (this.state.GameStatus !== GameStatus.Pending) {
			return '';
		}

		return (
			<div style="position: fixed;">
				<button
					type="button"
					class="btn btn-dark small-space space-out fill-option"
					onClick={() => this.SetMenu()}
				/>
				<button type="button" class="btn btn-dark space-out">
					{this.ShowNoMoney()}
					{this._diamonds.toPrecision(2)}
					<span class="fill-diamond badge badge-secondary very-small-space middle very-small-left-margin very-small-right-margin">
						{' '}
					</span>
				</button>
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
		if ([ GameStatus.Victory, GameStatus.Defeat ].some((e) => e === this.state.GameStatus)) {
			return (
				<PopupComponent
					points={10}
					status={this.state.GameStatus}
					curves={this._appService.GetStats().GetCurves()}
					context={this._appService.GetRecord().GetRecord()}
				/>
			);
		}
		return '';
	}
}
