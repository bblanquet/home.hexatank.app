import { MoneyField } from './../Ceils/Field/MoneyField';
import { HealField } from './../Ceils/Field/HealField';
import { AttackMenuItem } from './../Menu/Buttons/AttackMenuItem';
import { MultiSelectionHandler } from './MultiSelectionHandler';
import { ContextMode } from './ContextMode'; 
import { Point } from './Point';
import { MultiSelectionMenu } from '../Menu/Smart/MultiSelectionMenu';
import { InputManager } from './InputManager';
import { InteractionContext } from './../Context/InteractionContext';
import { SelectionMode } from '../Menu/Smart/SelectionMode';
import { PlaygroundHelper } from './PlaygroundHelper';
import { ItemsManager } from '../ItemsManager';
import { MultiSelectionInteractionContext } from '../Menu/Smart/MultiSelectionInteractionContext';
import { Vehicle } from '../Items/Unit/Vehicle';
import { Ceil } from '../Ceils/Ceil';
import { Menu } from '../Menu/Menu';
import { HealMenuItem } from '../Menu/Buttons/HealMenuItem';
import { SpeedFieldMenuItem } from '../Menu/Buttons/SpeedFieldMenuItem';
import { MoneyMenuItem } from '../Menu/Buttons/MoneyMenuItem';
import { PeerHandler } from '../../Menu/Network/Host/On/PeerHandler';
import { PacketKind } from '../../Menu/Network/PacketKind';
import { FastField } from '../Ceils/Field/FastField';
import { AttackField } from '../Ceils/Field/AttackField';

export class ContextSwitcher{    
    private _downPoint:Point;
    private _upPoint:Point;
    private _mode:ContextMode=ContextMode.SingleSelection;
    private _selectionMode:SelectionMode=SelectionMode.none;
    private _smartMenu:MultiSelectionMenu;
    private _multiContext:MultiSelectionInteractionContext;
    public Vehicles:Vehicle[];
    public Cells:Ceil[];
    private _multiHandler:MultiSelectionHandler;

    constructor(private _interactionContext:InteractionContext,
                private _itemsManager:ItemsManager,
                private _inputManager:InputManager,
                private _menu:Menu)
    {
        this.Vehicles = new Array<Vehicle>();
        this.Cells = new Array<Ceil>();
        this._multiHandler = new MultiSelectionHandler();
        this._smartMenu = new MultiSelectionMenu(this._inputManager.MovingEvent);
        this._multiContext = new MultiSelectionInteractionContext(
            this._inputManager.DownEvent,
            this._inputManager.MovingEvent,
            this._inputManager.DownStateEvent);
        this._inputManager.DownEvent.on((e:Point)=>this.OnDown(e));
        this._inputManager.HoldingEvent.on((e:Point)=>this.OnHolding());
        this._inputManager.UpEvent.on((e:Point)=>this.OnUp(e));
        this._smartMenu.SelectedModeEvent.on((e:SelectionMode)=>this.OnModeChanged(e));
    }

    private OnDown(point:Point):void{
        this._downPoint = new Point(point.X,point.Y);
    }

    private OnHolding():void{
        if(!PlaygroundHelper.HasSelection() && this._mode === ContextMode.SingleSelection){
            PlaygroundHelper.PauseNavigation();
            this._mode = ContextMode.SelectionMenu;
            this._smartMenu.Show(this._downPoint);
        }
    }

    private OnModeChanged(mode:SelectionMode):void{
        this._selectionMode = mode;
        if(mode !== SelectionMode.none)
        {
            this._mode = ContextMode.MultipleSelection;
            this._multiContext.Start();
        }
        else
        {
            this._mode = ContextMode.SingleSelection;
            PlaygroundHelper.RestartNavigation();
        }
    }

    private SetVehicles(cells:Ceil[]):void{
        cells.forEach( c=>{
            let occupier = (<Ceil><unknown>c).GetOccupier();
            if(occupier 
                && occupier instanceof Vehicle
                && !PlaygroundHelper.PlayerHeadquarter.IsEnemy(occupier)){
                    this.Vehicles.push(occupier);
                }
        });
        this.Vehicles.forEach(v=>{
            v.SetSelected(true);
        });
    }

    private OnUp(point:Point):void{
        this._upPoint = new Point(point.X,point.Y);
        const distance = this._downPoint.GetDistance(this._upPoint);

        switch(this._mode){
            case ContextMode.SingleSelection:
                if(distance < PlaygroundHelper.Settings.Size/3)
                {
                    this._interactionContext.Point = new PIXI.Point(point.X,point.Y);
                    this._itemsManager.Select(this._interactionContext);
                }
            break;
            case ContextMode.SelectionMenu:
                this._smartMenu.Hide();
            break;
            case ContextMode.MultipleSelection:
                if(this._selectionMode === SelectionMode.unit){
                    this.HandleUnit();
                }else if(this._selectionMode === SelectionMode.cell){
                    this.HandleCell();
                }else{
                    throw 'wrong';
                }

            break;
        }
    }

    private HandleCell() {
        if (this.Cells.length === 0) {
            this.Cells = this._multiContext.GetCells();
            this.Cells.forEach(c=>{
                c.SetSelected(true);
            });
            this._multiContext.Stop();
            if (this.Cells.length === 0) 
            {
                this._mode = ContextMode.SingleSelection;
                PlaygroundHelper.RestartNavigation();
            }
            else 
            {
                this._menu.Show(this.Cells[0]);
                this._multiContext.Start();
            }
        }
        else 
        {
            let menuItem = this._multiContext.GetCellButton();
            if(menuItem && 
                PlaygroundHelper.PlayerHeadquarter.GetAmount() 
                >= PlaygroundHelper.Settings.FieldPrice*this.Cells.length){
                
                if(menuItem instanceof HealMenuItem ){
                    this.Cells.forEach(c=>{
                        PeerHandler.SendMessage(PacketKind.Field,{
                            Hq:PlaygroundHelper.PlayerHeadquarter.GetCurrentCeil().GetCoordinate(),
                            Ceil:c.GetCoordinate(),
                            Type:"Heal"
                        });
                        let field = new HealField(c);
                        PlaygroundHelper.Playground.Items.push(field);
                    });
                }
                else if(menuItem instanceof AttackMenuItem)
                {
                    this.Cells.forEach(c=>{
                        PeerHandler.SendMessage(PacketKind.Field,{
                            Hq:PlaygroundHelper.PlayerHeadquarter.GetCurrentCeil().GetCoordinate(),
                            Ceil:c.GetCoordinate(),
                            Type:"Attack"
                        });
                        let field = new AttackField(c);
                        PlaygroundHelper.Playground.Items.push(field);
                    });
                }
                else if(menuItem instanceof SpeedFieldMenuItem)
                {
                    this.Cells.forEach(c=>{
                        PeerHandler.SendMessage(PacketKind.Field,{
                            Hq:PlaygroundHelper.PlayerHeadquarter.GetCurrentCeil().GetCoordinate(),
                            Ceil:c.GetCoordinate(),
                            Type:"Money"
                        });
                        let field = new MoneyField(c);
                        PlaygroundHelper.Playground.Items.push(field);
                    });
                }
                else if(menuItem instanceof MoneyMenuItem){
                    this.Cells.forEach(c=>{
                        PeerHandler.SendMessage(PacketKind.Field,{
                            Hq:PlaygroundHelper.PlayerHeadquarter.GetCurrentCeil().GetCoordinate(),
                            Ceil:c.GetCoordinate(),
                            Type:"Fast"
                        });
                        let field = new FastField(c);
                        PlaygroundHelper.Playground.Items.push(field);
                    });
                }
            }
            this.Cells.forEach(c => {
                c.SetSelected(false);
            });
            this.Vehicles = [];
            this.Cells = [];
            this._multiContext.Stop();
            this._mode = ContextMode.SingleSelection;
            PlaygroundHelper.RestartNavigation();
        }
    }

    private HandleUnit() {
        if (this.Vehicles.length === 0) {
            this.SetVehicles(this._multiContext.GetCells());
            this._multiContext.Stop();
            if (this.Vehicles.length === 0) {
                this._mode = ContextMode.SingleSelection;
                PlaygroundHelper.RestartNavigation();
            }
            else {
                this._multiContext.Start();
            }
        }
        else {
            if (this._multiContext.GetCells().length > 0) {
                this._multiHandler.GiveOrders(this.Vehicles, this._multiContext.GetCells());
            }
            this.Vehicles.forEach(v => {
                v.SetSelected(false);
            });
            this.Vehicles = [];
            this._multiContext.Stop();
            this._mode = ContextMode.SingleSelection;
            PlaygroundHelper.RestartNavigation();
        }
    }
}