import { Component, h } from 'preact';
import { GameHelper } from '../../Core/Framework/GameHelper';
import { PeerHandler } from '../Network/Host/On/PeerHandler';
import { route } from 'preact-router';
import { Item } from '../../Core/Items/Item';
import { GameContext } from '../../Core/Framework/GameContext';
import { Tank } from '../../Core/Items/Unit/Tank';
import { Truck } from '../../Core/Items/Unit/Truck';
import { Cell } from '../../Core/Items/Cell/Cell';
import { ISelectable } from '../../Core/ISelectable';
import { ReactorField } from '../../Core/Items/Cell/Field/Bonus/ReactorField';
import { GameSettings } from '../../Core/Framework/GameSettings';
import { CombinationProvider } from '../../Core/Interaction/CombinationProvider';
import { SelectableChecker } from '../../Core/Interaction/SelectableChecker';
import { Headquarter } from '../../Core/Items/Cell/Field/Hq/Headquarter';
import { AppHandler } from './AppHandler';
import HqMenuComponent from './Parts/HqMenuComponent';
import TankMenuComponent from './Parts/TankMenuComponent';
import MultiTankMenuComponent from './Parts/MultiTankMenuComponent';
import CellMenuComponent from './Parts/CellMenuComponent';
import TruckMenuComponent from './Parts/TruckMenuComponent';
import { InteractionContext } from '../../Core/Interaction/InteractionContext';
import { RenderingHandler } from '../../Core/Setup/Render/RenderingHandler';
import { RenderingGroups } from '../../Core/Setup/Render/RenderingGroups';
import { MapRender } from '../../Core/Setup/Render/MapRender';
import { ComponentsHelper } from '../ComponentsHelper';
import ReactorMenuComponent from './Parts/ReactorMenuComponent';
import { Group } from '../../Core/Items/Group';
import { AttackField } from '../../Core/Items/Cell/Field/Bonus/AttackField';

export default class CanvasComponent extends Component<
	any,
	{
		HasMenu: boolean;
		HasRefresh: boolean;
		TankRequestCount: number;
		TruckRequestCount: number;
		Amount: number;
		HasFlag: boolean;
		Item: Item;
		PingStatus: string;
		HasWarning: boolean;
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
			PingStatus: 'no data',
			HasWarning: false
		});
	}
	private OnItemSelectionChanged(obj: any, item: ISelectable): void {
		if (!item.IsSelected()) {
			item.SelectionChanged.Off(this._onItemSelectionChanged);
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
		this._appHandler.InitApp();
		GameHelper.Updater = this._appHandler.Playground;
		GameHelper.ViewContext = this._appHandler.ViewContext;
		GameHelper.Render = new RenderingHandler(
			new RenderingGroups(
				{
					zs: [ -1, 0, 1, 2, 3, 4, 5 ],
					parent: this._appHandler.GetViewport()
				},
				{
					zs: [ 6, 7 ],
					parent: this._appHandler.GetApp().stage
				}
			)
		);

		this._appHandler.GetApp().start();
		this._gameCanvas.appendChild(this._appHandler.GetApp().view);
		if (!GameHelper.MapContext) {
			throw 'context missing, cannot implement map';
		}

		this._gameContext = new MapRender().Render(GameHelper.MapContext);
		const checker = new SelectableChecker(this._gameContext.MainHq);
		this._appHandler.InteractionContext = new InteractionContext(
			this._appHandler.InputManager,
			new CombinationProvider().GetCombination(this._appHandler, checker, this._gameContext),
			checker,
			this._appHandler.GetViewport()
		);
		this._appHandler.InteractionContext.Listen();
		this._appHandler.SetBackgroundColor(GameHelper.MapContext.MapMode);

		this._appHandler.InteractionManager.on(
			'pointerdown',
			this._appHandler.InputManager.OnMouseDown.bind(this._appHandler.InputManager),
			false
		);
		this._appHandler.InteractionManager.on(
			'pointermove',
			this._appHandler.InputManager.OnMouseMove.bind(this._appHandler.InputManager),
			false
		);
		this._appHandler.InteractionManager.on(
			'pointerup',
			this._appHandler.InputManager.OnMouseUp.bind(this._appHandler.InputManager),
			false
		);
		this._appHandler.ResizeTheCanvas();
		window.addEventListener('resize', () => this._appHandler.ResizeTheCanvas());
		window.addEventListener('DOMContentLoaded', () => this._appHandler.ResizeTheCanvas());
		this._appHandler.InteractionManager.autoPreventDefault = false;
		this.SetCenter();
		this._gameContext.MainHq.OnTruckRequestChanged.On((obj: any, e: number) => {
			this.setState({
				TruckRequestCount: e
			});
		});
		this._gameContext.MainHq.OnTankRequestChanged.On((obj: any, e: number) => {
			this.setState({
				TankRequestCount: e
			});
		});
		this._gameContext.MainHq.OnDiamondCountChanged.On((obj: any, e: number) => {
			this.setState({
				Amount: e
			});
		});
		this._gameContext.OnItemSelected.On((obj: any, e: Item) => {
			((e as unknown) as ISelectable).SelectionChanged.On(this._onItemSelectionChanged);
			this.setState({
				Item: e
			});
		});
		this._gameContext.MainHq.OnCashMissing.On((obj: any, e: boolean) => {
			if (e !== this.state.HasWarning) {
				this.setState({
					HasWarning: e
				});
			}
		});
		this.GameLoop();
	}

	public SetCenter(): void {
		const hqPoint = this._gameContext.MainHq.GetBoundingBox().GetCentralPoint();
		const halfWidth = GameSettings.ScreenWidth / 2;
		const halfHeight = GameSettings.ScreenHeight / 2;
		console.log('x: ' + -(hqPoint.X - halfWidth));
		console.log('y: ' + -(hqPoint.Y - halfHeight));
		this._appHandler.Playground.ViewContext.SetX(-(hqPoint.X - halfWidth));
		this._appHandler.Playground.ViewContext.SetY(-(hqPoint.Y - halfHeight));
	}

	private LeftMenuRender() {
		if (this.state.Item) {
			if (this.state.Item instanceof Tank) {
				return <TankMenuComponent AppHandler={this._appHandler} />;
			} else if (this.state.Item instanceof Truck) {
				return <TruckMenuComponent AppHandler={this._appHandler} />;
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
		this.setState({
			HasRefresh: !this.state.HasRefresh
		});
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
		this._appHandler.Clear();
		this._gameCanvas = null;
	}

	componentDidUpdate() {}

	private Cheat(e: any): void {
		GameSettings.ShowEnemies = !GameSettings.ShowEnemies;
	}

	private Quit(e: any): void {
		route('/Home', true);
		this._appHandler.InteractionContext.Mute();
		PeerHandler.Stop();
	}

	private SetMenu(e: any): void {
		this.setState({
			HasMenu: !this.state.HasMenu
		});
		GameSettings.IsPause = this.state.HasMenu;
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
				{/* {GameHelper.IsOnline ? this.TopLeftInfo() : ''} */}
				{this.TopMenuRender()}
				<div
					ref={(dom) => {
						this._gameCanvas = dom;
					}}
				/>
				{this.state.HasMenu ? '' : this.LeftMenuRender()}
				{this.state.HasMenu ? this.MenuRender() : ''}
			</div>
		);
	}

	private TopLeftInfo() {
		return <div style="position: fixed;left: 0%; color:white;">{this.state.PingStatus}</div>;
	}

	private TopMenuRender() {
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
					onClick={(e: any) => this.SetMenu(e)}
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
					{ComponentsHelper.GetRedButton(false, 'fas fa-undo-alt', 'Resume', (e) => this.SetMenu(e))}
					{GameSettings.ShowEnemies ? (
						ComponentsHelper.GetBlackButton(false, 'fas fa-undo-alt', 'Cheat', (e) => this.Cheat(e))
					) : (
						ComponentsHelper.GetRedButton(false, 'fas fa-undo-alt', 'Cheat', (e) => this.Cheat(e))
					)}
					{ComponentsHelper.GetRedButton(false, 'fas fa-undo-alt', 'Quit', (e) => this.Quit(e))}
				</div>
			</div>
		);
		return value;
	}

	private EndMessage() {
		return (
			<div class="base">
				<div class="centered">
					<div class="container">
						You won
						<div class="bottom-container">
							<div style="float:right;">
								<button type="button" class="btn btn-dark btn-sm">
									Back
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
