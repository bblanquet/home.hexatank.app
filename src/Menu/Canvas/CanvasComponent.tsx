import { Component, h } from 'preact';
import { PlaygroundHelper } from '../../Core/Utils/PlaygroundHelper';
import { GameSetup } from '../../Core/GameSetup';
import { PeerHandler } from '../Network/Host/On/PeerHandler';
import { route } from 'preact-router';
import { Item } from '../../Core/Items/Item';
import { Tank } from '../../Core/Items/Unit/Tank';
import { Truck } from '../../Core/Items/Unit/Truck';
import { Cell } from '../../Core/Cell/Cell'; 
import {TankMenuItem} from '../../Core/Menu/Buttons/TankMenuItem'; 
import {TruckMenuItem} from '../../Core/Menu/Buttons/TruckMenuItem';
import { TargetMenuItem } from '../../Core/Menu/Buttons/TargetMenuItem';
import { CamouflageMenuItem } from '../../Core/Menu/Buttons/CamouflageMenutItem';
import { PatrolMenuItem } from '../../Core/Menu/Buttons/PatrolMenuItem';
import { CancelMenuItem } from '../../Core/Menu/Buttons/CancelMenuItem';
import { PlusMenuItem } from '../../Core/Menu/Buttons/PlusMenuItem';
import { MinusMenuItem } from '../../Core/Menu/Buttons/MinusMenuItem';
import { BigMenuItem } from '../../Core/Menu/Buttons/BigMenuItem';
import { AttackMenuItem } from '../../Core/Menu/Buttons/AttackMenuItem';
import { InfluenceMenuItem } from '../../Core/Menu/Buttons/InfluenceMenuItem';
import { MoneyMenuItem } from '../../Core/Menu/Buttons/MoneyMenuItem';
import { SlowMenuItem } from '../../Core/Menu/Buttons/SlowMenuItem';
import { PoisonMenuItem } from '../../Core/Menu/Buttons/PoisonMenuItem';
import { HealMenuItem } from '../../Core/Menu/Buttons/HealMenuItem';
import { SpeedFieldMenuItem } from '../../Core/Menu/Buttons/SpeedFieldMenuItem';
import { ISelectable } from '../../Core/ISelectable';
import { InteractionKind } from '../../Core/Context/IInteractionContext';
import { PingInfo } from '../Network/Ping/PingInfo';
import { InfluenceField } from '../../Core/Cell/Field/InfluenceField';
import { GameSettings } from '../../Core/Utils/GameSettings';
import { SmallMenuItem } from '../../Core/Menu/Buttons/SmallMenuItem';
import { Headquarter } from '../../Core/Cell/Field/Headquarter';
import { AbortMenuItem } from '../../Core/Menu/Buttons/AbortMenuItem';
import { SearchMoneyMenuItem } from '../../Core/Menu/Buttons/SearchMoneyMenuItem';

export default class CanvasComponent extends Component<any, { 
  HasMenu: boolean,
  TankRequestCount:number,
  TruckRequestCount:number,
  Amount:number,
  HasFlag:boolean,
  Item:Item,
  PingStatus:string,
  HasWarning:boolean
}> {
  private _gameCanvas: HTMLDivElement;
  private _loop: { (): void };
  private _gameSetup: GameSetup;
  private _stop: boolean;
  private _onItemSelectionChanged:{(obj:any,selectable:ISelectable):void};

  constructor() {
    super();
    this._stop = true;
    this._onItemSelectionChanged = this.OnItemSelectionChanged.bind(this); 
    this._loop = this.GameLoop.bind(this);
    PlaygroundHelper.InitApp();
    this.setState({
      HasMenu:false,
      TankRequestCount:0,
      TruckRequestCount:0,
      Amount:GameSettings.PocketMoney,
      HasFlag:false,
      PingStatus:'no data',
      HasWarning:false
    });
  }

  private OnItemSelectionChanged(obj:any,item: ISelectable): void {
    if(!item.IsSelected()){
      item.SelectionChanged.off(this._onItemSelectionChanged);
      this.setState({
        ...this.state,
        Item:null,
      });
    }
  }

  componentDidMount() {
    this._stop = false;
    PlaygroundHelper.App.start();
    this._gameCanvas.appendChild(PlaygroundHelper.App.view);

    if (!PlaygroundHelper.MapContext) {
      throw 'context missing, cannot implement map'
    }

    if(PlaygroundHelper.IsOnline){
      PlaygroundHelper.PingHandler.PingReceived.on((obj:any,data:PingInfo)=>{
        this.setState({
          PingStatus:`${data.Receiver}: ${data.Duration}`
        })
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
      (e as unknown as ISelectable).SelectionChanged.on(this._onItemSelectionChanged);
      this.setState({
        ...this.state,
        Item:e
      });
    });
    PlaygroundHelper.WarningChanged.on((obj:any,e:boolean)=>{
      this.setState({
        ...this.state,
        HasWarning:e
      });
    });
    this._loop();
  }

  private LeftMenuRender() {
    if(this.state.Item){
      if(this.state.Item instanceof Tank)
      {
        return this.TankMenu();
      }
      else if(this.state.Item instanceof Truck)
      {
        return this.TruckMenu();
      }
      else if(this.state.Item instanceof Headquarter)
      {
        return this.HqMenuRender();
      }
      else if(this.state.Item instanceof InfluenceField)
      {
        return this.FactoryMenu();
      }
      else if(this.state.Item instanceof Cell)
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
    if(!PlaygroundHelper.IsOnline){
      GameSettings.IsPause = this.state.HasMenu;
    }
  }

  private SendContext(item:Item): void {
    PlaygroundHelper.InteractionContext.Kind = InteractionKind.Up;
    return PlaygroundHelper.InteractionContext.OnSelect(item);
  }

  private Cheat(e: any): void {
    GameSettings.ShowEnemies = !GameSettings.ShowEnemies;
  }

  private Quit(e: any): void {
    route('/Home', true);
    PlaygroundHelper.InteractionContext.Mute();
    PlaygroundHelper.IsOnline = false;
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

  render() {
    return (
      <div style="width=100%">
        {PlaygroundHelper.IsOnline ? this.TopLeftInfo() : ''}
        {this.TopMenuRender()}
        <div ref={(dom) => { this._gameCanvas = dom }} />
        {this.state.HasMenu ? '':this.LeftMenuRender()}
        {this.state.HasMenu ? this.MenuRender() : ''}
      </div>
    );
  }

  private HqMenuRender() {
    return (
      <div class="left-column">
        <div class="middle2 max-width">
          <div class="btn-group-vertical max-width">
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new TankMenuItem())}>
              <div class="white-background">{this.state.TankRequestCount}</div>
              <div class="fill-tank max-width standard-space"></div>
              <div class="max-width text-center darker">{GameSettings.TankPrice*PlaygroundHelper.PlayerHeadquarter.GetVehicleCount()} <span class="fill-diamond badge very-small-space middle"> </span></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new TruckMenuItem())}>
              <div class="white-background">{this.state.TruckRequestCount}</div>
              <div class="fill-truck max-width standard-space"></div>
              <div class="max-width text-center darker">{GameSettings.TruckPrice*PlaygroundHelper.PlayerHeadquarter.GetVehicleCount()} <span class="fill-diamond badge very-small-space middle"> </span></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" onClick={(e: any) => this.SetFlag(e)}>
            <div class="white-background">{this.state.HasFlag ? 'ON' : 'OFF'}</div>
              <div class="fill-flag max-width standard-space"></div>
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

  private FactoryMenu() {
    const field = this.state.Item as InfluenceField;
    return (
      <div class="left-column">
        <div class="middle2 max-width">
          <div class="btn-group-vertical max-width">
          <button type="button" class="btn btn-light without-padding">
              <div class="fill-energy max-width standard-space"></div>
              <div class="max-width text-center darker">{field.Battery.GetCurrentPower()}/{field.Battery.GetTotalPower()}</div>
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new PlusMenuItem())}>
              <div class="fill-plus max-width standard-space"></div>
              {field.Battery.HasStock() ? '':
              <div class="max-width text-center darker">{GameSettings.TruckPrice*PlaygroundHelper.PlayerHeadquarter.GetTotalEnergy()} <span class="fill-diamond badge very-small-space middle"> </span></div>
              }
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new MinusMenuItem())}>
              <div class="fill-minus max-width standard-space"></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new BigMenuItem())}>
              <div class="fill-big max-width standard-space"></div>
              {field.Battery.HasStock() ? '':
              <div class="max-width text-center darker">{GameSettings.TruckPrice*PlaygroundHelper.PlayerHeadquarter.GetTotalEnergy()} <span class="fill-diamond badge very-small-space middle"> </span></div>
              }            
              </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new SmallMenuItem())}>
              <div class="fill-small max-width standard-space"></div>
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

  private TankMenu() {
    return (
      <div class="left-column">
        <div class="middle2 max-width">
          <div class="btn-group-vertical max-width">
          <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new PatrolMenuItem())}>
              <div class="white-background">{false ? 'ON' : 'OFF'}</div>
              <div class="fill-patrol max-width standard-space"></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new TargetMenuItem())}>
              <div class="fill-target max-width standard-space"></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new CamouflageMenuItem())}>
              <div class="fill-camouflage max-width standard-space"></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new AbortMenuItem())}>
              <div class="fill-abort max-width standard-space"></div>
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
          onClick={(e: any) => this.SendContext(new InfluenceMenuItem())}>
              <div class="fill-influence max-width standard-space"></div>
              <div class="max-width text-center darker">{GameSettings.TruckPrice*PlaygroundHelper.PlayerHeadquarter.GetInfluenceCount()} <span class="fill-diamond badge very-small-space middle"> </span></div>
            </button>
          <button type="button" class="btn btn-dark without-padding" 
          onClick={(e: any) => this.SendContext(new AttackMenuItem())}>
              <div class="fill-power max-width standard-space"></div>
              <div class="max-width text-center darker">{GameSettings.FieldPrice} <span class="fill-diamond badge very-small-space middle"> </span></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new SpeedFieldMenuItem())}>
              <div class="fill-speed max-width standard-space"></div>
              <div class="max-width text-center darker">{GameSettings.FieldPrice} <span class="fill-diamond badge very-small-space middle"> </span></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new HealMenuItem())}>
              <div class="fill-medic max-width standard-space"></div>
              <div class="max-width text-center darker">{GameSettings.FieldPrice} <span class="fill-diamond badge very-small-space middle"> </span></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new MoneyMenuItem())}>
              <div class="fill-money max-width standard-space"></div>
              <div class="max-width text-center darker">{GameSettings.FieldPrice} <span class="fill-diamond badge very-small-space middle"> </span></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new PoisonMenuItem())}>
              <div class="fill-poison max-width standard-space"></div>
              <div class="max-width text-center darker">{GameSettings.FieldPrice} <span class="fill-diamond badge very-small-space middle"> </span></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new SlowMenuItem())}>
              <div class="fill-slow max-width standard-space"></div>
              <div class="max-width text-center darker">{GameSettings.FieldPrice} <span class="fill-diamond badge very-small-space middle"> </span></div>
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
              <div class="white-background">{false ? 'ON' : 'OFF'}</div>
              <div class="fill-patrol max-width standard-space"></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new SearchMoneyMenuItem())}>
              <div class="fill-searchMoney max-width standard-space"></div>
            </button>
            <button type="button" class="btn btn-dark without-padding" 
            onClick={(e: any) => this.SendContext(new AbortMenuItem())}>
              <div class="fill-abort max-width standard-space"></div>
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

  private TopLeftInfo(){
  return (<div style="position: fixed;left: 0%; color:white;">{this.state.PingStatus}</div>);
  }

  private TopMenuRender() {
    return (
      <div style="position: fixed;left: 50%;transform: translateX(-50%);">
        <button type="button" class="btn btn-dark space-out">
        {this.ShowNoMoney()}
        {this.state.Amount.toPrecision(2)}
         <span class="fill-diamond badge badge-secondary very-small-space middle very-small-left-margin very-small-right-margin"> </span>
        </button>
        <button type="button"class="btn btn-dark small-space space-out fill-option" onClick={(e: any) => this.SetMenu(e)} />
      </div>
    );
  }

  private ShowNoMoney(){
    if(this.state.HasWarning){
      return (<span class="fill-noMoney badge badge-warning very-small-space middle very-small-right-margin blink_me" > </span>);
    }else{
      return ('');
    }
  }

  private MenuRender() {
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