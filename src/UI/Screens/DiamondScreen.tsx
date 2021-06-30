import { Component, h } from 'preact';
import { isNullOrUndefined } from 'util';
import { AudioArchive } from '../../Core/Framework/AudioArchiver';
import { DiamondBlueprint } from '../../Core/Framework/Blueprint/Diamond/DiamondBlueprint';
import { DiamondContext } from '../../Core/Framework/Context/DiamondContext';
import { GameContext } from '../../Core/Framework/Context/GameContext';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { InteractionKind } from '../../Core/Interaction/IInteractionContext';
import { ISelectable } from '../../Core/ISelectable';
import { Cell } from '../../Core/Items/Cell/Cell';
import { ReactorField } from '../../Core/Items/Cell/Field/Bonus/ReactorField';
import { Headquarter } from '../../Core/Items/Cell/Field/Hq/Headquarter';
import { CellGroup } from '../../Core/Items/CellGroup';
import { Item } from '../../Core/Items/Item';
import { Tank } from '../../Core/Items/Unit/Tank';
import { Truck } from '../../Core/Items/Unit/Truck';
import { UnitGroup } from '../../Core/Items/UnitGroup';
import { MultiCellMenuItem } from '../../Core/Menu/Buttons/MultiCellMenuItem';
import { MultiTankMenuItem } from '../../Core/Menu/Buttons/MultiTankMenuItem';
import { OnlinePlayer } from '../../Network/OnlinePlayer';
import { IAppService } from '../../Services/App/IAppService';
import { IAudioService } from '../../Services/Audio/IAudioService';
import { IGameContextService } from '../../Services/GameContext/IGameContextService';
import { IInteractionService } from '../../Services/Interaction/IInteractionService';
import { Singletons, SingletonKey } from '../../Singletons';
import ActiveRightBottomCornerButton from '../Common/Button/Corner/ActiveRightBottomCornerButton';
import TimerComponent from '../Common/Timer/TimerComponent';
import CellMenuComponent from '../Components/Canvas/CellMenuComponent';
import HqMenuComponent from '../Components/Canvas/HqMenuComponent';
import MultiMenuComponent from '../Components/Canvas/MultiMenuComponent';
import MultiTankMenuComponent from '../Components/Canvas/MultiTankMenuComponent';
import ReactorMenuComponent from '../Components/Canvas/ReactorMenuComponent';
import TankMenuComponent from '../Components/Canvas/TankMenuComponent';
import TruckMenuComponent from '../Components/Canvas/TruckMenuComponent';
import CanvasComponent from '../Components/CanvasComponent';
import PopupMenuComponent from '../Components/PopupMenuComponent';
import Redirect from '../Components/RedirectComponent';
import SmPopupComponent from '../Components/SmPopupComponent';
import Visible from '../Components/VisibleComponent';

export default class DiamondScreen extends Component<
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
	private _gameContextService: IGameContextService<DiamondBlueprint, DiamondContext>;
	private _soundService: IAudioService;
	private _interactionService: IInteractionService<GameContext>;
	private _appService: IAppService<DiamondBlueprint>;
	private _gameContext: DiamondContext;

	private _onItemSelectionChanged: { (obj: any, selectable: ISelectable): void };

	constructor() {
		super();
		this._gameContextService = Singletons.Load<IGameContextService<DiamondBlueprint, DiamondContext>>(
			SingletonKey.DiamondGameContext
		);
		this._soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._interactionService = Singletons.Load<IInteractionService<GameContext>>(SingletonKey.DiamondInteraction);
		this._appService = Singletons.Load<IAppService<DiamondBlueprint>>(SingletonKey.DiamondApp);
		this._gameContext = this._gameContextService.Publish();
		this._onItemSelectionChanged = this.OnItemSelectionChanged.bind(this);
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
		this._gameContext.State.OnGameStatusChanged.On(this.HandleGameStatus.bind(this));
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
						TankRequestCount={this.state.TankRequestCount}
						TruckRequestCount={this.state.TruckRequestCount}
						VehicleCount={this._gameContext.GetPlayerHq().GetVehicleCount()}
					/>
				);
			} else if (this.state.Item instanceof ReactorField) {
				return <ReactorMenuComponent Item={this.state.Item} Interaction={this._interactionService.Publish()} />;
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

		this._gameContext.State.IsPause = newValue;
	}

	render() {
		return (
			<Redirect>
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

	private SendContext(item: Item): void {
		const interaction = this._interactionService.Publish();
		interaction.Kind = InteractionKind.Up;
		interaction.OnSelect(item);
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
				<TimerComponent
					Duration={this._gameContext.Duration}
					OnTimerDone={this._gameContext.OnTimerDone}
					isPause={this.state.HasMenu}
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
		return (
			<PopupMenuComponent
				Status={this.state.GameStatus}
				Resume={() => this.SetMenu()}
				Quit={() => {
					this._gameContext.State.IsPause = true;
					this.setState({
						HasMenu: false,
						GameStatus: GameStatus.Defeat
					});
				}}
			/>
		);
	}

	private GetEndMessage() {
		if ([ GameStatus.Victory, GameStatus.Defeat ].some((e) => e === this.state.GameStatus)) {
			return <SmPopupComponent points={10} status={this.state.GameStatus} />;
		}
		return '';
	}
}
