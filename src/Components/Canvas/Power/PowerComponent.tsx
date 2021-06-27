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
import { IInteractionService } from '../../../Services/Interaction/IInteractionService';
import { Singletons, SingletonKey } from '../../../Singletons';
import Redirect from '../../Redirect/RedirectComponent';
import { AudioArchive } from '../../../Core/Framework/AudioArchiver';
import ActiveRightBottomCornerButton from '../../Common/Button/Corner/ActiveRightBottomCornerButton';
import { InteractionKind } from '../../../Core/Interaction/IInteractionContext';
import { MultiTankMenuItem } from '../../../Core/Menu/Buttons/MultiTankMenuItem';
import Visible from '../../Common/Visible/VisibleComponent';
import { isNullOrUndefined } from '../../../Core/Utils/ToolBox';
import { MultiCellMenuItem } from '../../../Core/Menu/Buttons/MultiCellMenuItem';
import SmPopupComponent from '../../SmPopup/SmPopupComponent';
import { PowerBlueprint } from '../../../Core/Framework/Blueprint/Power/PowerBlueprint';
import { PowerContext } from '../../../Core/Framework/Context/PowerContext';
import TankMenuComponent from '../Game/Parts/TankMenuComponent';
import { Tank } from '../../../Core/Items/Unit/Tank';
import { Cell } from '../../../Core/Items/Cell/Cell';
import { ReactorField } from '../../../Core/Items/Cell/Field/Bonus/ReactorField';
import { CellGroup } from '../../../Core/Items/CellGroup';
import { UnitGroup } from '../../../Core/Items/UnitGroup';
import CellMenuComponent from '../Game/Parts/CellMenuComponent';
import MultiTankMenuComponent from '../Game/Parts/MultiTankMenuComponent';
import ReactorMenuComponent from '../Game/Parts/ReactorMenuComponent';
import { IAudioService } from '../../../Services/Audio/IAudioService';

export default class PowerCanvasComponent extends Component<
	any,
	{
		IsHoverMultiTank: boolean;
		IsHoverMultiCell: boolean;
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
	private _gameContextService: IGameContextService<PowerBlueprint, PowerContext>;
	private _soundService: IAudioService;
	private _interactionService: IInteractionService<PowerContext>;
	private _gameContext: PowerContext;

	private _onItemSelectionChanged: any = this.OnItemSelectionChanged.bind(this);
	private _onSelectionChanged: any = this.OnSelectionChanged.bind(this);

	constructor() {
		super();
		this._gameContextService = Singletons.Load<IGameContextService<PowerBlueprint, PowerContext>>(
			SingletonKey.PowerGameContext
		);
		this._soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._interactionService = Singletons.Load<IInteractionService<PowerContext>>(SingletonKey.PowerInteraction);
		this._gameContext = this._gameContextService.Publish();
		this._gameContext.OnGameStatusChanged.On(this.HandleGameStatus.bind(this));
		this.setState({
			HasMenu: false,
			TankRequestCount: 0,
			TruckRequestCount: 0,
			Amount: GameSettings.PocketMoney,
			HasWarning: false,
			GameStatus: GameStatus.Pending,
			IsSettingPatrol: false
		});
	}

	componentDidMount() {
		this._soundService.Pause(AudioArchive.loungeMusic);
		this._gameContext.OnItemSelected.On(this.HandleSelection.bind(this));
		this._gameContext.OnPatrolSetting.On(this.HandleSettingPatrol.bind(this));
		this._gameContext.OnGameStatusChanged.On(this.HandleGameStatus.bind(this));
		this._interactionService.OnMultiMenuShowed.On(this.HandleMultiMenuShowed.bind(this));
		this._interactionService.GetMultiSelectionContext().OnSelectionChanged.On(this._onSelectionChanged);
	}

	private OnItemSelectionChanged(obj: any, item: ISelectable): void {
		if (!item.IsSelected()) {
			item.OnSelectionChanged.Off(this._onItemSelectionChanged);
			this.setState({
				Item: null
			});
		}
	}

	private OnSelectionChanged(): void {
		this.setState({
			IsHoverMultiCell: this._interactionService.GetMultiSelectionContext().IsListeningCell(),
			IsHoverMultiTank: this._interactionService.GetMultiSelectionContext().IsListeningUnit()
		});
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

	private HandleGameStatus(obj: any, gs: GameStatus): void {
		if (gs !== this.state.GameStatus) {
			this.setState({
				GameStatus: gs
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
			} else if (this.state.Item instanceof ReactorField) {
				return <ReactorMenuComponent Item={this.state.Item} Interaction={this._interactionService.Publish()} />;
			} else if (this.state.Item instanceof Cell || this.state.Item instanceof CellGroup) {
				return (
					<CellMenuComponent
						Interaction={this._interactionService.Publish()}
						Item={this.state.Item}
						ReactorCount={1}
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

		GameSettings.IsPause = hasMenu;
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
							isActive={this.state.IsHoverMultiTank}
							callBack={() => this.SendContext(new MultiTankMenuItem())}
							logo="fill-tank-multi-cell"
						/>
						<ActiveRightBottomCornerButton
							isActive={this.state.IsHoverMultiCell}
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
			</div>
		);
	}

	private MenuRender() {
		return (
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
		);
	}

	private GetEndMessage() {
		if ([ GameStatus.Victory, GameStatus.Defeat ].some((e) => e === this.state.GameStatus)) {
			return <SmPopupComponent points={10} status={this.state.GameStatus} />;
		}
		return '';
	}
}
