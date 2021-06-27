import { Component, h } from 'preact';
import { Item } from '../../../Core/Items/Item';
import OnlinePlayersComponent from './Parts/OnlinePlayersComponent';
import { GameContext } from '../../../Core/Framework/Context/GameContext';
import { ISelectable } from '../../../Core/ISelectable';
import { GameSettings } from '../../../Core/Framework/GameSettings';
import CanvasComponent from '../CanvasComponent';
import PopupMenuComponent from '../../PopupMenu/PopupMenuComponent';
import { GameStatus } from '../../../Core/Framework/GameStatus';
import { OnlinePlayer } from '../../../Network/OnlinePlayer';
import PopupComponent from '../../Popup/PopupComponent';
import { IGameContextService } from '../../../Services/GameContext/IGameContextService';
import { IInteractionService } from '../../../Services/Interaction/IInteractionService';
import { Singletons, SingletonKey } from '../../../Singletons';
import Redirect from '../../Redirect/RedirectComponent';
import { AudioArchive } from '../../../Core/Framework/AudioArchiver';
import ActiveRightBottomCornerButton from './../../Common/Button/Corner/ActiveRightBottomCornerButton';
import { InteractionKind } from '../../../Core/Interaction/IInteractionContext';
import { MultiTankMenuItem } from '../../../Core/Menu/Buttons/MultiTankMenuItem';
import Visible from '../../Common/Visible/VisibleComponent';
import { isNullOrUndefined } from '../../../Core/Utils/ToolBox';
import { MultiCellMenuItem } from '../../../Core/Menu/Buttons/MultiCellMenuItem';
import { IAppService } from '../../../Services/App/IAppService';
import { GameBlueprint } from '../../../Core/Framework/Blueprint/Game/GameBlueprint';
import { IAudioService } from '../../../Services/Audio/IAudioService';
import { IOnlineService } from '../../../Services/Online/IOnlineService';
import { Dictionary } from '../../../Core/Utils/Collections/Dictionary';
import MenuSwitcher from './Parts/MenuSwitcher';
import Icon from '../../Common/Icon/IconComponent';

export default class GameCanvasComponent extends Component<
	any,
	{
		HasMenu: boolean;
		HasMultiMenu: boolean;
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
	private _onlineService: IOnlineService;
	private _interactionService: IInteractionService<GameContext>;
	private _appService: IAppService<GameBlueprint>;
	private _gameContext: GameContext;

	private _onItemSelectionChanged: any = this.OnItemSelectionChanged.bind(this);

	constructor() {
		super();
		this._gameContextService = Singletons.Load<IGameContextService<GameBlueprint, GameContext>>(
			SingletonKey.GameContext
		);
		this._soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._onlineService = Singletons.Load<IOnlineService>(SingletonKey.Online);
		this._interactionService = Singletons.Load<IInteractionService<GameContext>>(SingletonKey.Interaction);
		this._appService = Singletons.Load<IAppService<GameBlueprint>>(SingletonKey.App);
		this._gameContext = this._gameContextService.Publish();
		this.setState({
			HasMenu: false,
			TankRequestCount: 0,
			TruckRequestCount: 0,
			Amount: GameSettings.PocketMoney,
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
		if (this._onlineService.GetOnlinePlayerManager()) {
			this._onlineService
				.GetOnlinePlayerManager()
				.OnPlayersChanged.On((src: any, p: Dictionary<OnlinePlayer>) => {
					this.setState({});
				});
		}
	}

	private SetMenu(): void {
		const IsPopupVisible = !this.state.HasMenu;
		this.setState({
			HasMenu: IsPopupVisible
		});
		if (IsPopupVisible) {
			this._soundService.GetGameAudioManager().PauseAll();
		} else if (!this._soundService.IsMute()) {
			this._soundService.GetGameAudioManager().PlayAll();
		}

		if (!this._onlineService.IsOnline()) {
			GameSettings.IsPause = IsPopupVisible;
		}
	}

	render() {
		return (
			<Redirect>
				<OnlinePlayersComponent OnlineService={this._onlineService} />
				<Visible isVisible={this.state.GameStatus === GameStatus.Pending}>
					<div style="position: fixed;">
						<button
							type="button"
							class="btn btn-dark small-space space-out fill-option"
							onClick={() => this.SetMenu()}
						/>
						<button type="button" class="btn btn-dark space-out">
							<Visible isVisible={this.state.HasWarning}>
								<span class="fill-noMoney badge badge-warning very-small-space middle very-small-right-margin blink_me">
									{' '}
								</span>
							</Visible>
							{this._diamonds.toFixed(2)}
							<span class="fill-diamond badge badge-secondary very-small-space middle very-small-left-margin very-small-right-margin">
								{' '}
							</span>
						</button>
					</div>
				</Visible>
				<Visible isVisible={this.state.GameStatus !== GameStatus.Pending}>
					<PopupComponent
						points={10}
						status={this.state.GameStatus}
						curves={this._appService.GetStats().GetCurves()}
						context={this._appService.GetRecord().GetRecord()}
					/>
				</Visible>
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
					<MenuSwitcher
						IsSettingPatrol={this.state.IsSettingPatrol}
						TankRequestCount={this.state.TankRequestCount}
						TruckRequestCount={this.state.TruckRequestCount}
						VehicleCount={this._gameContext.GetPlayerHq().GetVehicleCount()}
						ReactorCount={this._gameContext.GetPlayerHq().GetReactorsCount()}
						Item={this.state.Item}
						HasMultiMenu={this.state.HasMultiMenu}
					/>
				</Visible>
				<Visible isVisible={this.state.HasMenu && this.state.GameStatus === GameStatus.Pending}>
					<PopupMenuComponent
						Status={this.state.GameStatus}
						Resume={() => this.SetMenu()}
						Quit={() => {
							GameSettings.IsPause = true;
							this.setState({
								HasMenu: false,
								GameStatus: GameStatus.Defeat
							});
						}}
					/>
				</Visible>
				<Visible isVisible={GameSettings.IsSynchronizing}>
					<div class="absolute-center-middle-menu dark-container container-center-horizontal">
						<span class="fit-content fit-height space-out-all">
							<div class="spin fit-content fit-height">
								<Icon Value={'fas fa-circle-notch'} />
							</div>
						</span>
						<div>Synchonizing...</div>
					</div>
				</Visible>
			</Redirect>
		);
	}

	private SendContext(item: Item): void {
		const interaction = this._interactionService.Publish();
		interaction.Kind = InteractionKind.Up;
		interaction.OnSelect(item);
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

	private HandleSettingPatrol(obj: any, value: boolean): void {
		this.setState({
			IsSettingPatrol: value
		});
	}

	private HandleCashMissing(obj: any, value: boolean): void {
		if (value !== this.state.HasWarning) {
			this.setState({
				HasWarning: value
			});
		}
	}

	private HandleGameStatus(obj: any, value: GameStatus): void {
		if (value !== this.state.GameStatus) {
			this.setState({
				GameStatus: value
			});
		}
	}
}
