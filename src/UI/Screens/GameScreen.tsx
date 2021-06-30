import { Component, h } from 'preact';
import { Item } from '../../Core/Items/Item';
import OnlinePlayersComponent from '../Components/Canvas/OnlinePlayersComponent';
import { GameContext } from '../../Core/Framework/Context/GameContext';
import { ISelectable } from '../../Core/ISelectable';
import { GameSettings } from '../../Core/Framework/GameSettings';
import CanvasComponent from '../Components/CanvasComponent';
import PopupMenuComponent from '../Components/PopupMenuComponent';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { OnlinePlayer } from '../../Network/OnlinePlayer';
import PopupComponent from '../Components/PopupComponent';
import { IGameContextService } from '../../Services/GameContext/IGameContextService';
import { IInteractionService } from '../../Services/Interaction/IInteractionService';
import { Singletons, SingletonKey } from '../../Singletons';
import Redirect from '../Components/RedirectComponent';
import { AudioArchive } from '../../Core/Framework/AudioArchiver';
import ActiveRightBottomCornerButton from '../Common/Button/Corner/ActiveRightBottomCornerButton';
import { InteractionKind } from '../../Core/Interaction/IInteractionContext';
import { MultiTankMenuItem } from '../../Core/Menu/Buttons/MultiTankMenuItem';
import Visible from '../Components/VisibleComponent';
import { isNullOrUndefined } from '../../Utils/ToolBox';
import { MultiCellMenuItem } from '../../Core/Menu/Buttons/MultiCellMenuItem';
import { IAppService } from '../../Services/App/IAppService';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { IAudioService } from '../../Services/Audio/IAudioService';
import { IOnlineService } from '../../Services/Online/IOnlineService';
import { Dictionary } from '../../Utils/Collections/Dictionary';
import MenuSwitcher from '../Components/Canvas/MenuSwitcher';
import SynchronizingComponent from '../Components/Canvas/SynchronizingComponent';
import Switch from '../Components/SwitchComponent';
import { SimpleEvent } from '../../Utils/Events/SimpleEvent';

export default class GameScreen extends Component<
	any,
	{
		IsSynchronising: boolean;
		IsSettingMenuVisible: boolean;
		IsMultiMenuVisible: boolean;
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
	private _timeout: SimpleEvent = new SimpleEvent();
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
			IsSettingMenuVisible: false,
			TankRequestCount: 0,
			TruckRequestCount: 0,
			Amount: GameSettings.PocketMoney,
			HasWarning: false,
			GameStatus: GameStatus.Pending,
			IsSettingPatrol: false,
			IsSynchronising: false
		});
		this._diamonds = GameSettings.PocketMoney;
		this._timeout.On(() => {
			this.Stop(true);
		});
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
		this._gameContext.State.OnGameStatusChanged.On(this.HandleGameStatus.bind(this));
		this._interactionService.OnMultiMenuShowed.On(this.HandleMultiMenuShowed.bind(this));
		if (this._onlineService.GetOnlinePlayerManager()) {
			this._onlineService
				.GetOnlinePlayerManager()
				.OnPlayersChanged.On((src: any, ps: Dictionary<OnlinePlayer>) => {
					this.setState({ IsSynchronising: ps.Values().some((p) => !p.IsSync()) });
				});
		}
	}

	private SetMenu(): void {
		const isSettingMenuVisible = !this.state.IsSettingMenuVisible;
		this.setState({
			IsSettingMenuVisible: isSettingMenuVisible
		});
		if (isSettingMenuVisible) {
			this._soundService.GetGameAudioManager().PauseAll();
		} else if (!this._soundService.IsMute()) {
			this._soundService.GetGameAudioManager().PlayAll();
		}

		if (!this._onlineService.IsOnline()) {
			this._gameContext.State.IsPause = isSettingMenuVisible;
		}
	}

	private Stop(isVictory: boolean): void {
		this._gameContext.State.IsPause = true;
		this.setState({
			IsSettingMenuVisible: false,
			GameStatus: isVictory ? GameStatus.Victory : GameStatus.Defeat
		});
	}

	render() {
		return (
			<Redirect>
				<OnlinePlayersComponent OnlineService={this._onlineService} />
				<Visible isVisible={this.state.GameStatus !== GameStatus.Pending}>
					<PopupComponent
						points={10}
						status={this.state.GameStatus}
						curves={this._appService.GetStats().GetCurves()}
						context={this._appService.GetRecord().GetRecord()}
					/>
				</Visible>
				<Visible isVisible={this.state.GameStatus === GameStatus.Pending}>
					<Switch
						isVisible={this.state.IsSynchronising}
						left={
							<SynchronizingComponent
								Timeout={this._timeout}
								Quit={() => {
									this.Stop(false);
								}}
							/>
						}
						right={
							<Switch
								isVisible={this.state.IsSettingMenuVisible}
								left={
									<PopupMenuComponent
										Status={this.state.GameStatus}
										Resume={() => this.SetMenu()}
										Quit={() => {
											this.Stop(false);
										}}
									/>
								}
								right={
									<span>
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
										<Visible isVisible={isNullOrUndefined(this.state.Item)}>
											<div class="right-bottom-menu">
												<ActiveRightBottomCornerButton
													isActive={this._interactionService
														.GetMultiSelectionContext()
														.IsListeningUnit()}
													callBack={() => this.SendContext(new MultiTankMenuItem())}
													logo="fill-tank-multi-cell"
												/>
												<ActiveRightBottomCornerButton
													isActive={this._interactionService
														.GetMultiSelectionContext()
														.IsListeningCell()}
													callBack={() => this.SendContext(new MultiCellMenuItem())}
													logo="fill-mult-cell"
												/>
											</div>
										</Visible>
										<Visible isVisible={!isNullOrUndefined(this.state.Item)}>
											<MenuSwitcher
												IsSettingPatrol={this.state.IsSettingPatrol}
												TankRequestCount={this.state.TankRequestCount}
												TruckRequestCount={this.state.TruckRequestCount}
												VehicleCount={this._gameContext.GetPlayerHq().GetVehicleCount()}
												ReactorCount={this._gameContext.GetPlayerHq().GetReactorsCount()}
												Item={this.state.Item}
												HasMultiMenu={this.state.IsMultiMenuVisible}
											/>
										</Visible>
									</span>
								}
							/>
						}
					/>
				</Visible>
				<CanvasComponent gameContext={this._gameContextService} />
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
			IsMultiMenuVisible: isDisplayed
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
