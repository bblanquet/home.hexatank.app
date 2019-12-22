import { PoisonField } from '../../Ceils/Field/PoisonField';
import { SlowField } from '../../Ceils/Field/SlowField';
import { AttackField } from '../../Ceils/Field/AttackField';
import { HealField } from '../../Ceils/Field/HealField';
import { PeerHandler } from './../../../Menu/Network/Host/On/PeerHandler';
import { Headquarter } from '../../Ceils/Field/Headquarter';
import { HexAxial } from '../Coordinates/HexAxial';
import { PlaygroundHelper } from '../PlaygroundHelper';
import { PacketKind } from '../../../Menu/Network/PacketKind';
import {route} from 'preact-router';
import { GameMessage } from './GameMessage';
import { MessageProgess } from './MessageProgess';
import { MapContext } from '../../Setup/Generator/MapContext';
import { Vehicle } from '../../Items/Unit/Vehicle';
import { IaHeadquarter } from '../../Ia/Hq/IaHeadquarter';
import { AliveField } from '../../Ceils/Field/AliveField';
import { Tank } from '../../Items/Unit/Tank';
import { MoneyField } from '../../Ceils/Field/MoneyField';
import { FastField } from '../../Ceils/Field/FastField';

export class MessageDispatcher{
    private _isClient:boolean=false;
    
    public Init(isClient:boolean):void{
        this._isClient = isClient;
        
        if(this._isClient){
            PeerHandler.Subscribe({
                type:PacketKind.Map,
                func:(e:any)=>this.GetMap(e)
            });
        }
        PeerHandler.Subscribe({
            type:PacketKind.Create,
            func:(e:any)=>this.CreateVehicle(e)
        });
        PeerHandler.Subscribe({
            type:PacketKind.Next,
            func:(e:any)=>this.ReceiveNextPosition(e)
        });
        PeerHandler.Subscribe({
            type:PacketKind.Destroyed,
            func:(e:any)=>this.Destroyed(e)
        });
        PeerHandler.Subscribe({
            type:PacketKind.Target,
            func:(e:any)=>this.Target(e)
        });
        PeerHandler.Subscribe({
            type:PacketKind.Field,
            func:(e:any)=>this.Field(e)
        });
        PeerHandler.Subscribe({
            type:PacketKind.Camouflage,
            func:(e:any)=>this.Camouflage(e)
        });
    }

    private Field(e: any): void {
        if(this.IsListenedHq(e)){
            const pos = new HexAxial(e.Ceil.Q,e.Ceil.R);
            const ceil = PlaygroundHelper.CeilsContainer.Get(pos);
            const type = e.Type;
            if(type === "Heal")
            {
                let field = new HealField(ceil);
                PlaygroundHelper.Playground.Items.push(field);
            }
            else if(type === "Attack")
            {
                let field = new AttackField(ceil);
                PlaygroundHelper.Playground.Items.push(field);
            }
            else if(type === "Money")
            {
                let field = new MoneyField(ceil);
                PlaygroundHelper.Playground.Items.push(field);
            }
            else if(type === "Fast")
            {
                let field = new FastField(ceil);
                PlaygroundHelper.Playground.Items.push(field);
            }
            else if(type === "Slow")
            {
                let field = new SlowField(ceil);
                PlaygroundHelper.Playground.Items.push(field);
            }
            else if(type === "Poison")
            {
                let field = new PoisonField(ceil);
                PlaygroundHelper.Playground.Items.push(field);
            }
        }
    }

    private Target(e: any): void {
        if(this.IsListenedHq(e)){
            const targetCeil = new HexAxial(e.TargetCeil.Q,e.TargetCeil.R);
            const pos = new HexAxial(e.Ceil.Q,e.Ceil.R);
            const tank = PlaygroundHelper.CeilsContainer.Get(pos).GetOccupier() as Tank;
            tank.SetMainTarget(PlaygroundHelper.CeilsContainer.Get(targetCeil).GetShootableEntity());
        }
    }

    private Camouflage(e: any): void {
        if(this.IsListenedHq(e)){
            const pos = new HexAxial(e.Ceil.Q,e.Ceil.R);
            const tank = PlaygroundHelper.CeilsContainer.Get(pos).GetOccupier() as Tank;
            tank.SetCamouflage();
        }
    }

    private Destroyed(e: any): void {
        const pos = new HexAxial(e.Ceil.Q,e.Ceil.R);
        const ceil = PlaygroundHelper.CeilsContainer.Get(pos);
        const destroyedItemName = e.Name;

        if(ceil.HasOccupier() && "vehicle"  === destroyedItemName){
            const vehicle = ceil.GetOccupier() as Vehicle;
            vehicle.Destroy();
            return;
        }
        else if(ceil.GetField().IsDesctrutible() 
        && "field" === destroyedItemName
        ){
            (<AliveField>ceil.GetField()).Destroy();
        }
    }

    private ReceiveNextPosition(e:any):void{
        if(this.IsListenedHq(e)){
            const nextPos = new HexAxial(e.NextCeil.Q,e.NextCeil.R);
            const vehicle = PlaygroundHelper.VehiclesContainer.Get(e.Id);
            vehicle.SetNextCeil(PlaygroundHelper.CeilsContainer.Get(nextPos));
        }    
    }

    private IsListenedHq(e:any):boolean{
        const coordinate = new HexAxial(e.Hq.Q,e.Hq.R);
        const hq = PlaygroundHelper.CeilsContainer.Get(coordinate).GetField() as Headquarter;
        return hq 
            && hq.PlayerName !== PlaygroundHelper.PlayerName
            && hq.constructor.name !== IaHeadquarter.name; //find a way to fix it
    }

    private CreateVehicle(e:any): void 
    {
        if(this.IsListenedHq(e))
        {
            if(!PlaygroundHelper.VehiclesContainer.Exist(e.Id)){
                const hqPos = new HexAxial(e.Hq.Q,e.Hq.R);
                const hq = PlaygroundHelper.CeilsContainer.Get(hqPos).GetField() as Headquarter;
                const pos = PlaygroundHelper.CeilsContainer.Get(new HexAxial(e.Ceil.Q,e.Ceil.R));
                if(e.Type === "Tank")
                {
                    hq.CreateTank(pos);
                }
                else if(e.Type === "Truck")
                {
                    hq.CreateTruck(pos);
                }
            }
        }
    }

    private GetMap(content:GameMessage<MapContext>):void{
        //isntantiate coordinate
        content.Message.Items.forEach(item=>{
            item.Position = new HexAxial(item.Position.Q,item.Position.R);
        });
        content.Message.CenterItem.Position = new HexAxial(
            content.Message.CenterItem.Position.Q,
            content.Message.CenterItem.Position.R);

        content.Message.Hqs.forEach(hq=>{
            hq.Diamond.Position = new HexAxial(
                hq.Diamond.Position.Q,
                hq.Diamond.Position.R);
            hq.Hq.Position = new HexAxial(
                hq.Hq.Position.Q,
                hq.Hq.Position.R);
        });

        PlaygroundHelper.MapContext = content.Message;
        if(content.Status == MessageProgess.end){
            PlaygroundHelper.IsOnline = true;
            route('/Canvas', true);
            PeerHandler.CloseRoom();
        }
    }
}