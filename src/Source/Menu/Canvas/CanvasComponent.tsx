import { Component, h } from 'preact';
import { PlaygroundHelper } from '../../Core/Utils/PlaygroundHelper';
import { GameSetup } from '../../Core/GameSetup';
import { MapGenerator } from '../../Core/Setup/Generator/MapGenerator';
import { PeerHandler } from '../Network/Host/On/PeerHandler';
import { route } from 'preact-router';


export default class CanvasComponent extends Component<any, { hasMenu: boolean }> {
  private _gameCanvas: HTMLDivElement;
  private _loop: { (): void };
  private _gameSetup: GameSetup;
  private _stop: boolean;

  constructor() {
    super();
    this._stop = true;
    PlaygroundHelper.InitApp();
    this._loop = this.GameLoop.bind(this);
  }

  componentDidMount() {
    this._stop = false;
    PlaygroundHelper.App.start();
    this._gameCanvas.appendChild(PlaygroundHelper.App.view);

    if (!PlaygroundHelper.MapContext) {
      PlaygroundHelper.MapContext = new MapGenerator().GetMapDefinition(3);
      PlaygroundHelper.SetDefaultName();
      PlaygroundHelper.MapContext.Hqs[0].PlayerName = PlaygroundHelper.PlayerName;
      PlaygroundHelper.MapContext.Hqs.forEach(hq => {
        if (!hq.PlayerName) {
          hq.isIa = true;
        }
      });
    }
    this._gameSetup = new GameSetup();
    this._gameSetup.SetGame(PlaygroundHelper.App.stage, PlaygroundHelper.Viewport);
    PlaygroundHelper.InteractionManager.on('pointerdown', PlaygroundHelper.InputManager.OnMouseDown.bind(PlaygroundHelper.InputManager), false);
    PlaygroundHelper.InteractionManager.on('pointermove', PlaygroundHelper.InputManager.OnMouseMove.bind(PlaygroundHelper.InputManager), false);
    PlaygroundHelper.InteractionManager.on('pointerup', PlaygroundHelper.InputManager.OnMouseUp.bind(PlaygroundHelper.InputManager), false);
    PlaygroundHelper.ResizeTheCanvas();
    window.addEventListener('resize', () => PlaygroundHelper.ResizeTheCanvas());
    window.addEventListener('DOMContentLoaded', () => PlaygroundHelper.ResizeTheCanvas());
    PlaygroundHelper.InteractionManager.autoPreventDefault = false;
    this._gameSetup.SetCenter();
    this._loop();
  }

  private GameLoop(): void {
    if (this._stop) {
      return;
    }
    requestAnimationFrame(this._loop);
    PlaygroundHelper.Playground.Update();
  }

  componentWillUnmount() {
    this._stop = true;
    PlaygroundHelper.App.stop();
    PlaygroundHelper.Playground.Items.forEach(item => {
      item.Destroy();
      PlaygroundHelper.Render.Remove(item);
    });
    PlaygroundHelper.Playground.Items = [];
  }

  componentDidUpdate() {
    PlaygroundHelper.Settings.IsPause = this.state.hasMenu;
  }

  render() {
    return (
      <div style="width=100%">
        {this.state.hasMenu ? '':this.LeftMenu()}
        {this.state.hasMenu ? '':this.TopMenu()}
        {this.state.hasMenu ? this.MenuMessage() : ''}
        <div ref={(dom) => { this._gameCanvas = dom }} />
      </div>
    );
  }

  private LeftMenu() {
    return (
      <div class="right-small">
        <div class="middle2 max-width">
          <div class="btn-group-vertical max-width">
            <button type="button" class="btn btn-dark without-padding">
              <div class="white-background">0</div>
              <div class="fill-tank max-width standard-space"></div>
            </button>
            <button type="button" class="btn btn-dark without-padding">
              <div class="white-background">0</div>
              <div class="fill-truck max-width standard-space"></div>
            </button>
            <button type="button" class="btn btn-dark without-padding">
              <div class="fill-flag max-width standard-space"></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  private TopMenu() {
    return (
      <div style="display:inline-block">
        <button type="button" class="btn btn-dark space-out">
          10
        <span class="badge badge-secondary fill-diamond very-small-space middle"> </span>
        </button>
        <button type="button" class="btn btn-dark small-space fill-option space-out" onClick={(e: any) => this.SetMenu(e)} />
      </div>
    );
  }

  private Cheat(e: any): void {
    PlaygroundHelper.Settings.ShowEnemies = !PlaygroundHelper.Settings.ShowEnemies;
  }

  private Quit(e: any): void {
    route('/Home', true);
    PeerHandler.Stop();
  }

  private SetMenu(e: any): void {
    this.setState({
      hasMenu: !this.state.hasMenu
    });
  }

  private MenuMessage() {
    return (
      <div class="base">
        <div class="centered">
          <div class="container">
            <div class="title-container">Menu</div>
            <div class="container-center">
              <div class="btn-group-vertical btn-block">
                <button type="button" class="btn btn-primary-blue btn-block" onClick={(e: any) => this.SetMenu(e)}>Resume</button>
                <button type="button" class="btn btn-primary-blue btn-block" onClick={(e: any) => this.Cheat(e)}>Cheat</button>
                <button type="button" class="btn btn-dark btn-block" onClick={(e: any) => this.Quit(e)}>Quit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private EndMessage() {
    return (
      <div class="base">
        <div class="centered">
          <div class="container">
            You won
          <div class="bottom-container">
              <div style="float:right;">
                <button type="button" class="btn btn-dark btn-sm">Back</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }



}