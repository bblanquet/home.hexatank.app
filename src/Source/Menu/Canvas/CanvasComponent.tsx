import { Component, h } from 'preact';
import { PlaygroundHelper } from '../../Core/Utils/PlaygroundHelper';
import { GameSetup } from '../../Core/GameSetup';
import { MapGenerator } from '../../Core/Setup/Generator/MapGenerator';

export default class CanvasComponent extends Component<any, { refresh: boolean }> {
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

  componentWillUnmount() {
    this._stop = true;
    PlaygroundHelper.App.stop();
    PlaygroundHelper.Playground.Items.forEach(item => {
      item.Destroy();
      PlaygroundHelper.Render.Remove(item);
    });
    PlaygroundHelper.Playground.Items = [];
  }

  render() {
    return (
      <div>
        {this.MenuMessage()}
        <div ref={(dom) => { this._gameCanvas = dom }} />
      </div>
    );
  }

  private MenuMessage() {
    return (
      <div class="base">
        <div class="centered">
          <div class="container">
            <div class="relative-center">
              <div class="btn-group-vertical">
                <button type="button" class="btn btn-secondary">Resume</button>
                <div class="btn-group btn-group-toggle" data-toggle="buttons">
                  <label class="btn btn-primary active">
                    <input type="checkbox" checked autocomplete="off"> Checkbox 1 (pre-checked)</input>
                  </label>
                </div>
                <button type="button" class="btn btn-dark">Quit</button>
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

  private GameLoop(): void {
    if (this._stop) {
      return;
    }
    requestAnimationFrame(this._loop);
    PlaygroundHelper.Playground.Update();
  }

}