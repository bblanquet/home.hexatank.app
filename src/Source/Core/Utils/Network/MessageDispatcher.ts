import { PlaygroundHelper } from './../PlaygroundHelper';
import { PacketKind } from '../../../Menu/Network/PacketKind';
import { PeerHandler } from '../../../Menu/Network/Host/On/PeerHandler';
import {route} from 'preact-router';
import { GameMessage } from './GameMessage';
import { MessageProgess } from './MessageProgess';
import { MapContext } from '../../Setup/Generator/MapContext';

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
    }

    public ReceiveMap(content:GameMessage<MapContext>):void{
        PlaygroundHelper.MapContext = content.Message;
        if(content.Status == MessageProgess.end){
            route('/Canvas', true);
        }
    }
}