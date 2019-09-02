import { Headquarter } from './../../Ceils/Field/Headquarter';
import { HexAxial } from './../Coordinates/HexAxial';
import { PlaygroundHelper } from './../PlaygroundHelper';
import { PacketKind } from '../../../Menu/Network/PacketKind';
import { PeerHandler } from '../../../Menu/Network/Host/On/PeerHandler';
import {route} from 'preact-router';
import { GameMessage } from './GameMessage';
import { MessageProgess } from './MessageProgess';
import { MapContext } from '../../Setup/Generator/MapContext';
import { Tank } from '../../Items/Unit/Tank';
import { Truck } from '../../Items/Unit/Truck';

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
            func:(e:any)=>this.ReceiveUnit(e)
        });
    }
    ReceiveUnit(e:any): void {
        const coordinate = new HexAxial(e.Hq.Q,e.Hq.R);
        const hq = PlaygroundHelper.CeilsContainer.Get(coordinate).GetField() as Headquarter;
        if(e.Name === Tank.constructor.name)
        {
            hq.CreateTank(false);
        }
        else if(e.Name === Truck.constructor.name)
        {
            hq.CreateTruck(false);
        }
    }

    public ReceiveMap(content:GameMessage<MapContext>):void{
        content.Message.Items.forEach(item=>{
            item.Position = new HexAxial(item.Position.Q,item.Position.R);
        });
        content.Message.CenterItem.Position = new HexAxial(
            content.Message.CenterItem.Position.Q,
            content.Message.CenterItem.Position.R);
        content.Message.Hq.Diamond.Position = new HexAxial(
            content.Message.Hq.Diamond.Position.Q,
            content.Message.Hq.Diamond.Position.R);
        content.Message.Hq.Hq.Position = new HexAxial(
            content.Message.Hq.Hq.Position.Q,
            content.Message.Hq.Hq.Position.R);
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