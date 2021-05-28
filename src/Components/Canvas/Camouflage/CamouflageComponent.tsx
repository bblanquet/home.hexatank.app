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
import PopupComponent from '../../Popup/PopupComponent';
import { IGameContextService } from '../../../Services/GameContext/IGameContextService';
import { INetworkService } from '../../../Services/Network/INetworkService';
import { IInteractionService } from '../../../Services/Interaction/IInteractionService';
import { Factory, FactoryKey } from '../../../Factory';
import Redirect from '../../Redirect/RedirectComponent';
import Icon from '../../Common/Icon/IconComponent';
import { ISoundService } from '../../../Services/Sound/ISoundService';
import { AudioContent } from '../../../Core/Framework/AudioArchiver';
import ActiveRightBottomCornerButton from '../../Common/Button/Corner/ActiveRightBottomCornerButton';
import { InteractionKind } from '../../../Core/Interaction/IInteractionContext';
import { MultiTankMenuItem } from '../../../Core/Menu/Buttons/MultiTankMenuItem';
import Visible from '../../Common/Visible/VisibleComponent';
import { isNullOrUndefined } from '../../../Core/Utils/ToolBox';
import { MultiCellMenuItem } from '../../../Core/Menu/Buttons/MultiCellMenuItem';
import { IAppService } from '../../../Services/App/IAppService';
import { FlagCellCombination } from '../../../Core/Interaction/Combination/FlagCellCombination';
import { BattleBlueprint } from '../../../Core/Setup/Blueprint/Battle/BattleBlueprint';
import { CamouflageGameContext } from '../../../Core/Framework/CamouflageGameContext';
import SmPopupComponent from '../../SmPopup/SmPopupComponent';

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
	private _diamonds: number;
	private _gameContextService: IGameContextService<BattleBlueprint, CamouflageGameContext>;
	private _soundService: ISoundService;
	private _networkService: INetworkService;
	private _interactionService: IInteractionService<CamouflageGameContext>;
	private _appService: IAppService<BattleBlueprint>;
	private _gameContext: CamouflageGameContext;

	private _onItemSelectionChanged: { (obj: any, selectable: ISelectable): void };

	constructor() {
		super();
		this._gameContextService = Factory.Load<IGameContextService<BattleBlueprint, CamouflageGameContext>>(
			FactoryKey.CamouflageGameContext
		);
		this._soundService = Factory.Load<ISoundService>(FactoryKey.Sound);
		this._networkService = Factory.Load<INetworkService>(FactoryKey.Network);
		this._interactionService = Factory.Load<IInteractionService<CamouflageGameContext>>(
			FactoryKey.CamouflageInteraction
		);
		this._appService = Factory.Load<IAppService<BattleBlueprint>>(FactoryKey.CamouflageApp);
		this._gameContext = this._gameContextService.Publish();
		this._onItemSelectionChanged = this.OnItemSelectionChanged.bind(this);
		this._gameContext.GameStatusChanged.On(this.HandleGameStatus.bind(this));
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
		this._soundService.Pause(AudioContent.menuMusic);
		this._gameContext.OnItemSelected.On(this.HandleSelection.bind(this));
		this._gameContext.OnPatrolSetting.On(this.HandleSettingPatrol.bind(this));
		this._gameContext.GameStatusChanged.On(this.HandleGameStatus.bind(this));
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
						interaction={this._interactionService}
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
		if (this._soundService.GetSoundManager()) {
			if (hasMenu) {
				this._soundService.GetSoundManager().PauseAll();
			} else if (!this._soundService.IsMute()) {
				this._soundService.GetSoundManager().PlayAll();
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
			<div style="position: fixed;left: 50%;transform: translateX(-50%);">
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
		if ([ GameStatus.Won, GameStatus.Lost ].some((e) => e === this.state.GameStatus)) {
			return <SmPopupComponent points={10} status={this.state.GameStatus} />;
		}
		return '';
	}
}
