import { PeerHandler } from './../../../Menu/Network/Host/On/PeerHandler';
import { Headquarter } from './../../Ceils/Field/Headquarter';
import { HexAxial } from './../Coordinates/HexAxial';
import { PlaygroundHelper } from './../PlaygroundHelper';
import { PacketKind } from '../../../Menu/Network/PacketKind';
import {route} from 'preact-router';
import { GameMessage } from './GameMessage';
import { MessageProgess } from './MessageProgess';
import { MapContext } from '../../Setup/Generator/MapContext';
import { Vehicle } from '../../Items/Unit/Vehicle';

export class MessageDispatcher{
    private _isClient:boolean=false;
    
    public Init(isClient:boolean):void{
        this._isClient = isClient;
        
        if(this._isClient){
            PeerHandler.Subscribe({
                type:PacketKind.Map,
                func:(e:any)=>this.ReceiveMap(e)
            });
        }

        PeerHandler.Subscribe({
            type:PacketKind.Create,
            func:(e:any)=>this.ReceiveVehicle(e)
        });

        PeerHandler.Subscribe({
            type:PacketKind.Next,
            func:(e:any)=>this.ReceiveNextPosition(e)
        });
        PeerHandler.Subscribe({
            type:PacketKind.Destroyed,
            func:(e:any)=>this.Destroyed(e)
        })
    }
    Destroyed(e: any): void {
        const pos = new HexAxial(e.Ceil.Q,e.Ceil.R);
        const ceil = PlaygroundHelper.CeilsContainer.Get(pos);
        if(ceil.HasOccupier()){
            const vehicle = ceil.GetOccupier() as Vehicle;
            vehicle.Destroy();
        }
    }

    private ReceiveNextPosition(e:any):void{
        if(this.IsListenedHq(e)){
            const nextPos = new HexAxial(e.NextCeil.Q,e.NextCeil.R);
            const pos = new HexAxial(e.Ceil.Q,e.Ceil.R);
            const vehicle = PlaygroundHelper.CeilsContainer.Get(pos).GetOccupier() as Vehicle;
            vehicle.SetNextCeil(PlaygroundHelper.CeilsContainer.Get(nextPos));
        }    
    }

    private IsListenedHq(e:any):boolean{
        const coordinate = new HexAxial(e.Hq.Q,e.Hq.R);
        const hq = PlaygroundHelper.CeilsContainer.Get(coordinate).GetField() as Headquarter;
        return hq 
            && hq.PlayerName !== PlaygroundHelper.PlayerName
            && hq.constructor.name !== 'IaHeadquarter';
    }

    private ReceiveVehicle(e:any): void 
    {
        if(this.IsListenedHq(e))
        {
            const coordinate = new HexAxial(e.Hq.Q,e.Hq.R);
            const hq = PlaygroundHelper.CeilsContainer.Get(coordinate).GetField() as Headquarter;
            if(e.Name === "Tank")
            {
                hq.CreateTank();
            }
            else if(e.Name === "Truck")
            {
                hq.CreateTruck();
            }
        }
    }

    private ReceiveMap(content:GameMessage<MapContext>):void{
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
            route('/Canvas', true);
        }
    }
}