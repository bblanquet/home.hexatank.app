import { Component, h } from 'preact';
import { GameHelper } from '../../Core/Framework/GameHelper';
import { route } from 'preact-router';
import { Item } from '../../Core/Items/Item';
import { GameContext } from '../../Core/Framework/GameContext';
import { Tank } from '../../Core/Items/Unit/Tank';
import { Truck } from '../../Core/Items/Unit/Truck';
import { Cell } from '../../Core/Items/Cell/Cell';
import { ISelectable } from '../../Core/ISelectable';
import { ReactorField } from '../../Core/Items/Cell/Field/Bonus/ReactorField';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { Headquarter } from '../../Core/Items/Cell/Field/Hq/Headquarter';
import { AppHandler } from './AppHandler';
import HqMenuComponent from './Parts/HqMenuComponent';
import TankMenuComponent from './Parts/TankMenuComponent';
import MultiTankMenuComponent from './Parts/MultiTankMenuComponent';
import CellMenuComponent from './Parts/CellMenuComponent';
import TruckMenuComponent from './Parts/TruckMenuComponent';
import ReactorMenuComponent from './Parts/ReactorMenuComponent';
import { Group } from '../../Core/Items/Group';
import { GameStatus } from './GameStatus';
import { Player } from '../../Network/Player';
import RedButtonComponent from '../Common/Button/RedButtonComponent';
import BlackButtonComponent from '../Common/Button/BlackButtonComponent';

export default class CanvasComponent extends Component<
	any,
	{
		HasMenu: boolean;
		HasFlag: boolean;
		HasWarning: boolean;
		TankRequestCount: number;
		TruckRequestCount: number;
		Amount: number;
		Item: Item;
		Players: Player[];
		GameStatus: GameStatus;
	}
> {
	private _gameCanvas: HTMLDivElement;
	private _stop: boolean;
	private _onItemSelectionChanged: { (obj: any, selectable: ISelectable): void };
	private _appHandler: AppHandler;
	private _gameContext: GameContext;

	constructor() {
		super();
		this._stop = true;
		this._onItemSelectionChanged = this.OnItemSelectionChanged.bind(this);
		this.setState({
			HasMenu: false,
			TankRequestCount: 0,
			TruckRequestCount: 0,
			Amount: GameSettings.PocketMoney,
			HasFlag: false,
			HasWarning: false,
			GameStatus: GameStatus.Pending
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
		GameSettings.Init();
		this._stop = false;
		this._appHandler = new AppHandler();
		this._gameContext = this._appHandler.InitApp();
		this._gameCanvas.appendChild(this._appHandler.GetApp().view);
		this._gameContext.GetMainHq().OnTruckRequestChanged.On(this.UpdateTruckRequest.bind(this));
		this._gameContext.GetMainHq().OnTankRequestChanged.On(this.UpdateTankRequest.bind(this));
		this._gameContext.GetMainHq().OnDiamondCountChanged.On(this.UpdateMoney.bind(this));
		this._gameContext.OnItemSelected.On(this.UpdateSelection.bind(this));
		this._gameContext.GetMainHq().OnCashMissing.On(this.UpdateWarning.bind(this));
		this._gameContext.OnGameEnded.On(this.UpdateGameStatus.bind(this));
		this.GameLoop();
	}

	private UpdateTruckRequest(obj: any, e: number): void {
		this.setState({
			TruckRequestCount: e
		});
	}

	private UpdateTankRequest(obj: any, e: number): void {
		this.setState({
			TankRequestCount: e
		});
	}

	private UpdateMoney(obj: any, e: number): void {
		this.setState({
			Amount: e
		});
	}

	private UpdateSelection(obj: any, e: Item): void {
		((e as unknown) as ISelectable).OnSelectionChanged.On(this._onItemSelectionChanged);
		this.setState({
			Item: e
		});
	}

	private UpdateWarning(obj: any, e: boolean): void {
		if (e !== this.state.HasWarning) {
			this.setState({
				HasWarning: e
			});
		}
	}

	private UpdateGameStatus(obj: any, e: GameStatus): void {
		if (e !== this.state.GameStatus) {
			this.setState({
				GameStatus: e
			});
		}
	}

	private LeftMenuRender() {
		if (this.state.Item) {
			if (this.state.Item instanceof Tank) {
				return <TankMenuComponent AppHandler={this._appHandler} Tank={this.state.Item} />;
			} else if (this.state.Item instanceof Truck) {
				return <TruckMenuComponent AppHandler={this._appHandler} Truck={this.state.Item} />;
			} else if (this.state.Item instanceof Group) {
				return <MultiTankMenuComponent AppHandler={this._appHandler} />;
			} else if (this.state.Item instanceof Headquarter) {
				return (
					<HqMenuComponent
						SetFlag={this.SetFlag.bind(this)}
						TankRequestCount={this.state.TankRequestCount}
						TruckRequestCount={this.state.TruckRequestCount}
						HasFlag={this.state.HasFlag}
						AppHandler={this._appHandler}
						GameContext={this._gameContext}
					/>
				);
			} else if (this.state.Item instanceof ReactorField) {
				return (
					<ReactorMenuComponent
						Item={this.state.Item}
						AppHandler={this._appHandler}
						GameContext={this._gameContext}
					/>
				);
			} else if (this.state.Item instanceof Cell) {
				return (
					<CellMenuComponent
						Item={this.state.Item}
						AppHandler={this._appHandler}
						GameContext={this._gameContext}
					/>
				);
			}
		}
		return '';
	}

	private GameLoop(): void {
		if (this._stop) {
			return;
		}
		requestAnimationFrame(() => this.GameLoop());
		GameHelper.Updater.Update();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', () => this._appHandler.ResizeTheCanvas());
		window.removeEventListener('DOMContentLoaded', () => this._appHandler.ResizeTheCanvas());
		this._stop = true;
		GameHelper.Updater.Items.forEach((item) => {
			item.Destroy();
		});
		GameHelper.Updater.Items = [];
		GameHelper.Updater = null;
		GameHelper.MapContext = null;
		GameHelper.Render.Clear();
		GameHelper.Render = null;
		GameHelper.ViewContext = null;
		if (GameHelper.Socket) {
			GameHelper.Socket.Stop();
			GameHelper.Socket = null;
		}
		this._appHandler.Clear();
		this._gameCanvas = null;
	}

	componentDidUpdate() {}

	private Cheat(): void {
		GameSettings.ShowEnemies = !GameSettings.ShowEnemies;
	}

	private Quit(): void {
		route('/Home', true);
		this._appHandler.InteractionContext.Mute();
	}

	private SetMenu(): void {
		this.setState({
			HasMenu: !this.state.HasMenu
		});
		if (!GameHelper.Socket) {
			GameSettings.IsPause = this.state.HasMenu;
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
			<div style="width=100%">
				{this.TopLeftInfo()}
				{this.TopMenuRender()}
				{this.state.GameStatus === GameStatus.Pending ? '' : this.GetEndMessage()}
				<div
					ref={(dom) => {
						this._gameCanvas = dom;
					}}
				/>
				{this.state.HasMenu && this.state.GameStatus === GameStatus.Pending ? '' : this.LeftMenuRender()}
				{this.state.HasMenu && this.state.GameStatus === GameStatus.Pending ? this.MenuRender() : ''}
			</div>
		);
	}

	private TopLeftInfo() {
		return (
			<div style="position: fixed;left: 0%; color:white;">
				{GameHelper.Players.map((player) => {
					return (
						<div>
							{player.Name} <span class="badge badge-info">{player.Latency}</span>
						</div>
					);
				})}
			</div>
		);
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
					onClick={(e: any) => this.SetMenu()}
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
		let value = (
			<div class="generalContainer absolute-center-middle-menu menu-container fit-content">
				<div class="container-center">
					<div class="title-container">Menu</div>
					<RedButtonComponent
						icon={'fas fa-undo-alt'}
						title={'Resume'}
						isFirstRender={false}
						callBack={() => this.SetMenu()}
					/>
					{GameSettings.ShowEnemies ? (
						<BlackButtonComponent
							icon={'fas fa-undo-alt'}
							title={'Cheat'}
							isFirstRender={false}
							callBack={() => this.Cheat()}
						/>
					) : (
						<RedButtonComponent
							icon={'fas fa-undo-alt'}
							title={'Cheat'}
							isFirstRender={false}
							callBack={() => this.Cheat()}
						/>
					)}
					<RedButtonComponent
						icon={'fas fa-undo-alt'}
						title={'Quit'}
						isFirstRender={false}
						callBack={() => this.Quit()}
					/>{' '}
				</div>
			</div>
		);
		return value;
	}

	private GetEndMessage() {
		if (this.state.GameStatus === GameStatus.Won) {
			return (
				<div class="generalContainer absolute-center-middle-menu menu-container fit-content">
					<div class="container-center">
						<div class="fill-victory" style="width:20vh;height:20vh" />
						<RedButtonComponent
							icon={'fas fa-undo-alt'}
							title={'Quit'}
							isFirstRender={false}
							callBack={() => this.Quit()}
						/>
					</div>
				</div>
			);
		} else if (this.state.GameStatus === GameStatus.Lost) {
			return (
				<div class="generalContainer absolute-center-middle-menu menu-container fit-content">
					<div class="container-center">
						<div class="fill-rip" style="width:20vh;height:20vh" />
						<RedButtonComponent
							icon={'fas fa-undo-alt'}
							title={'Quit'}
							isFirstRender={false}
							callBack={() => this.Quit()}
						/>
					</div>
				</div>
			);
		}
		return '';
	}
}
