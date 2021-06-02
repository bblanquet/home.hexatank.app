import { Component, h } from 'preact';
import { Item } from '../../../Core/Items/Item';
import { Truck } from '../../../Core/Items/Unit/Truck';
import { ISelectable } from '../../../Core/ISelectable';
import { GameSettings } from '../../../Core/Framework/GameSettings';
import CanvasComponent from '../CanvasComponent';
import MultiMenuComponent from '../Game/Parts/MultiMenuComponent';
import TruckMenuComponent from '../Game/Parts/TruckMenuComponent';
import PopupMenuComponent from '../../PopupMenu/PopupMenuComponent';
import { GameStatus } from '../../../Core/Framework/GameStatus';
import { OnlinePlayer } from '../../../Network/OnlinePlayer';
import { IGameContextService } from '../../../Services/GameContext/IGameContextService';
import { INetworkService } from '../../../Services/Network/INetworkService';
import { IInteractionService } from '../../../Services/Interaction/IInteractionService';
import { Factory, FactoryKey } from '../../../Factory';
import Redirect from '../../Redirect/RedirectComponent';
import Icon from '../../Common/Icon/IconComponent';
import { AudioArchive } from '../../../Core/Framework/AudioArchiver';
import Visible from '../../Common/Visible/VisibleComponent';
import SmPopupComponent from '../../SmPopup/SmPopupComponent';
import { CamouflageContext } from '../../../Core/Setup/Context/CamouflageContext';
import { CamouflageBlueprint } from '../../../Core/Setup/Blueprint/Cam/CamouflageBlueprint';
import { IAudioService } from '../../../Services/Audio/IAudioService';

export default class CamouflageCanvasComponent extends Component<
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
	private _gameContextService: IGameContextService<CamouflageBlueprint, CamouflageContext>;
	private _soundService: IAudioService;
	private _networkService: INetworkService;
	private _interactionService: IInteractionService<CamouflageContext>;
	private _gameContext: CamouflageContext;

	private _onItemSelectionChanged: { (obj: any, selectable: ISelectable): void };

	constructor() {
		super();
		this._gameContextService = Factory.Load<IGameContextService<CamouflageBlueprint, CamouflageContext>>(
			FactoryKey.CamouflageGameContext
		);
		this._soundService = Factory.Load<IAudioService>(FactoryKey.Audio);
		this._networkService = Factory.Load<INetworkService>(FactoryKey.Network);
		this._interactionService = Factory.Load<IInteractionService<CamouflageContext>>(
			FactoryKey.CamouflageInteraction
		);
		this._gameContext = this._gameContextService.Publish();
		this._onItemSelectionChanged = this.OnItemSelectionChanged.bind(this);
		this._gameContext.OnGameStatusChanged.On(this.HandleGameStatus.bind(this));
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
		this._soundService.Pause(AudioArchive.menuMusic);
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
			if (this.state.Item instanceof Truck) {
				return (
					<TruckMenuComponent
						Interaction={this._interactionService.Publish()}
						Truck={this.state.Item}
						isSettingPatrol={this.state.IsSettingPatrol}
					/>
				);
			}
		}
		return '';
	}

	private SetMenu(): void {
		const hasMenu = !this.state.HasMenu;
		this.setState({
			HasMenu: hasMenu
		});
		if (this._soundService.GetGameAudioManager()) {
			if (hasMenu) {
				this._soundService.GetGameAudioManager().PauseAll();
			} else if (!this._soundService.IsMute()) {
				this._soundService.GetGameAudioManager().PlayAll();
			}
		}

		if (!this._networkService.HasSocket()) {
			GameSettings.IsPause = hasMenu;
		}
	}

	render() {
		return (
			<Redirect>
				{this.TopLeftInfo()}
				{this.TopMenuRender()}
				{this.state.GameStatus === GameStatus.Pending ? '' : this.GetEndMessage()}
				<CanvasComponent gameContext={this._gameContextService} />
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
			</div>
		);
	}

	private MenuRender() {
		return <PopupMenuComponent status={this.state.GameStatus} callBack={() => this.SetMenu()} />;
	}

	private GetEndMessage() {
		if ([ GameStatus.Victory, GameStatus.Defeat ].some((e) => e === this.state.GameStatus)) {
			return <SmPopupComponent points={10} status={this.state.GameStatus} />;
		}
		return '';
	}
}
