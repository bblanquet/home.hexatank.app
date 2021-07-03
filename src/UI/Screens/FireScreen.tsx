import { Component, h } from 'preact';
import { isNullOrUndefined } from 'util';
import { AudioArchive } from '../../Core/Framework/AudioArchiver';
import { FireBlueprint } from '../../Core/Framework/Blueprint/Fire/FireBlueprint';
import { FireContext } from '../../Core/Framework/Context/FireContext';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { InteractionKind } from '../../Core/Interaction/IInteractionContext';
import { ISelectable } from '../../Core/ISelectable';
import { Cell } from '../../Core/Items/Cell/Cell';
import { ReactorField } from '../../Core/Items/Cell/Field/Bonus/ReactorField';
import { CellGroup } from '../../Core/Items/CellGroup';
import { Item } from '../../Core/Items/Item';
import { Tank } from '../../Core/Items/Unit/Tank';
import { Truck } from '../../Core/Items/Unit/Truck';
import { UnitGroup } from '../../Core/Items/UnitGroup';
import { MultiCellMenuItem } from '../../Core/Menu/Buttons/MultiCellMenuItem';
import { MultiTankMenuItem } from '../../Core/Menu/Buttons/MultiTankMenuItem';
import { OnlinePlayer } from '../../Network/OnlinePlayer';
import { IAudioService } from '../../Services/Audio/IAudioService';
import { IGameContextService } from '../../Services/GameContext/IGameContextService';
import { IInteractionService } from '../../Services/Interaction/IInteractionService';
import { Singletons, SingletonKey } from '../../Singletons';
import ActiveRightBottomCornerButton from '../Common/Button/Corner/ActiveRightBottomCornerButton';
import CellMenuComponent from '../Components/Canvas/CellMenuComponent';
import MultiMenuComponent from '../Components/Canvas/MultiMenuComponent';
import MultiTankMenuComponent from '../Components/Canvas/MultiTankMenuComponent';
import ReactorMenuComponent from '../Components/Canvas/ReactorMenuComponent';
import TankMenuComponent from '../Components/Canvas/TankMenuComponent';
import TruckMenuComponent from '../Components/Canvas/TruckMenuComponent';
import GameCanvas from '../Components/GameCanvas';
import OptionPopup from '../Components/OptionPopup';
import Redirect from '../Components/Redirect';
import SmPopup from '../Components/SmPopup';
import Visible from '../Components/Visible';

export default class FireScreen extends Component<
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
	private _gameContextService: IGameContextService<FireBlueprint, FireContext>;
	private _soundService: IAudioService;
	private _interactionService: IInteractionService<FireContext>;
	private _gameContext: FireContext;

	private _onItemSelectionChanged: any = this.OnItemSelectionChanged.bind(this);
	private _onSelectionChanged: any = this.OnSelectionChanged.bind(this);

	constructor() {
		super();
		this._gameContextService = Singletons.Load<IGameContextService<FireBlueprint, FireContext>>(
			SingletonKey.PowerGameContext
		);
		this._soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._interactionService = Singletons.Load<IInteractionService<FireContext>>(SingletonKey.PowerInteraction);
		this._gameContext = this._gameContextService.Publish();
		this._gameContext.State.OnGameStatusChanged.On(this.HandleGameStatus.bind(this));
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
		this._gameContext.State.OnGameStatusChanged.On(this.HandleGameStatus.bind(this));
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
						isCovered={
							this.state.Item instanceof Cell ? (
								this._gameContext.GetPlayerHq().IsCovered(this.state.Item)
							) : (
								true
							)
						}
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

		this._gameContext.State.IsPause = hasMenu;
	}

	render() {
		return (
			<Redirect>
				{this.TopMenuRender()}
				{this.state.GameStatus === GameStatus.Pending ? '' : this.GetEndMessage()}
				<GameCanvas gameContext={this._gameContextService} />
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
			<OptionPopup
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
			return <SmPopup points={10} status={this.state.GameStatus} />;
		}
		return '';
	}
}
