import { Component, h } from 'preact';
import { PlaygroundHelper } from '../../Core/Utils/PlaygroundHelper';
import { GameSetup } from '../../Core/GameSetup';
import { MapGenerator } from '../../Core/Setup/Generator/MapGenerator';
import { PeerHandler } from '../Network/Host/On/PeerHandler';
import { route } from 'preact-router';
import { Item } from '../../Core/Items/Item';
import { Tank } from '../../Core/Items/Unit/Tank';
import { Truck } from '../../Core/Items/Unit/Truck';
import { Ceil } from '../../Core/Ceils/Ceil';
import {TankMenuItem} from '../../Core/Menu/Buttons/TankMenuItem';
import {TruckMenuItem} from '../../Core/Menu/Buttons/TruckMenuItem';
import { TargetMenuItem } from '../../Core/Menu/Buttons/TargetMenuItem';
import { PatrolMenuItem } from '../../Core/Menu/Buttons/PatrolMenuItem';
import { CancelMenuItem } from '../../Core/Menu/Buttons/CancelMenuItem';
import { AttackMenuItem } from '../../Core/Menu/Buttons/AttackMenuItem';
import { MoneyMenuItem } from '../../Core/Menu/Buttons/MoneyMenuItem';
import { HealMenuItem } from '../../Core/Menu/Buttons/HealMenuItem';
import { SpeedFieldMenuItem } from '../../Core/Menu/Buttons/SpeedFieldMenuItem';

export default class CanvasComponent extends Component<any, { 
  HasMenu: boolean,
  TankRequestCount:number,
  TruckRequestCount:number,
  Amount:number,
  HasFlag:boolean,
  Item:Item
}> {
  private _gameCanvas: HTMLDivElement;
  private _loop: { (): void };
  private _gameSetup: GameSetup;
  private _stop: boolean;

  constructor() {
    super();
    this._stop = true;
    PlaygroundHelper.InitApp();
    this._loop = this.GameLoop.bind(this);
    this.setState({
      HasMenu:false,
      TankRequestCount:0,
      TruckRequestCount:0,
      Amount:PlaygroundHelper.Settings.PocketMoney,
      HasFlag:false
    });
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
    PlaygroundHelper.PlayerHeadquarter.TruckRequestEvent.on((obj:any,e:number)=>{
      this.setState({
        ...this.state,
        TruckRequestCount:e
      });
    });
    PlaygroundHelper.PlayerHeadquarter.TankRequestEvent.on((obj:any,e:number)=>{
      this.setState({
        ...this.state,
        TankRequestCount:e
      });
    });
    PlaygroundHelper.PlayerHeadquarter.DiamondCountEvent.on((obj:any,e:number)=>{
      this.setState({
        ...this.state,
        Amount:e
      });
    });
    PlaygroundHelper.SelectedItem.on((obj:any, e:Item)=>{
      this.setState({
        ...this.state,
        Item:e
      });
    });
    this._loop();
  }

  private LeftMenu() {
    if(this.state.Item){
      if(this.state.Item instanceof Tank)
      {
        return this.TankMenu();
      }
      else if(this.state.Item instanceof Truck)
      {
        return this.TruckMenu();
      }
      else if(this.state.Item instanceof Ceil)
      {
        return this.CellMenu();
      }
    }
    return '';
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
    PlaygroundHelper.Settings.IsPause = this.state.HasMenu;
  }

  render() {
    return (
      <div style="width=100%">
        {this.TopMenu()}
        <div ref={(dom) => { this._gameCanvas = dom }} />
        {this.state.HasMenu ? '':this.LeftMenu()}
        {this.state.HasMenu ? '':this.RightMenu()}
        {this.state.HasMenu ? this.MenuMessage() : ''}
      </div>
    );
  }

  private RightMenu() {
    return (
      <div class="right-column">
        <div class="middle2 max-width">
          <div class="btn-group-vertical max-width">
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new TankMenuItem())}>
              <div class="white-background">{this.state.TankRequestCount}</div>
              <div class="fill-tank max-width standard-space"></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new TruckMenuItem())}>
              <div class="white-background">{this.state.TruckRequestCount}</div>
              <div class="fill-truck max-width standard-space"></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" onClick={(e: any) => this.SetFlag(e)}>
            <div class="white-background">{this.state.HasFlag ? 'ON' : 'OFF'}</div>
              <div class="fill-flag max-width standard-space"></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  private SendContext(item:Item): void {
    return PlaygroundHelper.InteractionContext.OnSelect(item);
  }

  private TankMenu() {
    return (
      <div class="left-column">
        <div class="middle2 max-width">
          <div class="btn-group-vertical max-width">
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new TargetMenuItem())}>
              <div class="fill-target max-width standard-space"></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new PatrolMenuItem())}>
              <div class="white-background">{this.state.HasFlag ? 'ON' : 'OFF'}</div>
              <div class="fill-patrol max-width standard-space"></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new CancelMenuItem())}>
              <div class="fill-cancel max-width standard-space"></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  private CellMenu() {
    return (
      <div class="left-column">
        <div class="middle2 max-width">
          <div class="btn-group-vertical max-width">
          <button type="button" class="btn btn-dark without-padding" 
          onClick={(e: any) => this.SendContext(new AttackMenuItem())}>
              <div class="fill-power max-width standard-space"></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new SpeedFieldMenuItem())}>
              <div class="fill-speed max-width standard-space"></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new HealMenuItem())}>
              <div class="fill-medic max-width standard-space"></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new MoneyMenuItem())}>
              <div class="fill-money max-width standard-space"></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new CancelMenuItem())}>
              <div class="fill-cancel max-width standard-space"></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  private TruckMenu() {
    return (
      <div class="left-column">
        <div class="middle2 max-width">
          <div class="btn-group-vertical max-width">
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new PatrolMenuItem())}>
              <div class="white-background">{this.state.HasFlag ? 'ON' : 'OFF'}</div>
              <div class="fill-patrol max-width standard-space"></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new CancelMenuItem())}>
              <div class="fill-cancel max-width standard-space"></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  private TopMenu() {
    return (
      <div style="position: fixed;">
        <button type="button" class="btn btn-dark space-out">
          {this.state.Amount}
        <span class="fill-diamond badge badge-secondary very-small-space middle very-small-margin"> </span>
        </button>
        <button type="button"class="btn btn-dark small-space space-out fill-option" onClick={(e: any) => this.SetMenu(e)} />
        <div style="width=30px;height=30px;">
        </div>
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
      HasMenu: !this.state.HasMenu
    });
  }

  private SetFlag(e: any):void{
    PlaygroundHelper.IsFlagingMode = !PlaygroundHelper.IsFlagingMode;
    this.setState({
      ...this.state,
      HasFlag:PlaygroundHelper.IsFlagingMode
    })
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