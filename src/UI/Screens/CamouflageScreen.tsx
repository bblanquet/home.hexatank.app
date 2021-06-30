import { Component, h } from 'preact';
import { Item } from '../../Core/Items/Item';
import { Truck } from '../../Core/Items/Unit/Truck';
import { ISelectable } from '../../Core/ISelectable';
import { GameSettings } from '../../Core/Framework/GameSettings';
import CanvasComponent from '../Components/CanvasComponent';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { OnlinePlayer } from '../../Network/OnlinePlayer';
import { Singletons, SingletonKey } from '../../Singletons';
import { AudioArchive } from '../../Core/Framework/AudioArchiver';
import { CamouflageContext } from '../../Core/Framework/Context/CamouflageContext';
import { CamouflageBlueprint } from '../../Core/Framework/Blueprint/Cam/CamouflageBlueprint';
import { IAudioService } from '../../Services/Audio/IAudioService';
import { IGameContextService } from '../../Services/GameContext/IGameContextService';
import { IInteractionService } from '../../Services/Interaction/IInteractionService';
import MultiMenuComponent from '../Components/Canvas/MultiMenuComponent';
import TruckMenuComponent from '../Components/Canvas/TruckMenuComponent';
import PopupMenuComponent from '../Components/PopupMenuComponent';
import Redirect from '../Components/RedirectComponent';
import SmPopupComponent from '../Components/SmPopupComponent';
import Visible from '../Components/VisibleComponent';

export default class CamouflageScreen extends Component<
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
	private _gameContextService: IGameContextService<CamouflageBlueprint, CamouflageContext>;
	private _soundService: IAudioService;
	private _interactionService: IInteractionService<CamouflageContext>;
	private _gameContext: CamouflageContext;

	private _onItemSelectionChanged: { (obj: any, selectable: ISelectable): void };

	constructor() {
		super();
		this._gameContextService = Singletons.Load<IGameContextService<CamouflageBlueprint, CamouflageContext>>(
			SingletonKey.CamouflageGameContext
		);
		this._soundService = Singletons.Load<IAudioService>(SingletonKey.Audio);
		this._interactionService = Singletons.Load<IInteractionService<CamouflageContext>>(
			SingletonKey.CamouflageInteraction
		);
		this._gameContext = this._gameContextService.Publish();
		this._onItemSelectionChanged = this.OnItemSelectionChanged.bind(this);
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

		this._gameContext.State.IsPause = hasMenu;
	}

	render() {
		return (
			<Redirect>
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
