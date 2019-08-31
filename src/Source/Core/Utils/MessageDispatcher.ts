import { HexAxial } from './Coordinates/HexAxial';
import { PacketKind } from './../../Menu/Network/PacketKind';
import { PeerHandler } from '../../Menu/Network/Host/On/PeerHandler';
import {route} from 'preact-router';

export class MessageDispatcher{
    private _isClient:boolean=false;
    private _mapContent:Array<DecorationContext>;
    
    public Init(isClient:boolean):void{
        this._isClient = isClient;
        
        if(this._isClient){
            this._mapContent = new Array<DecorationContext>();
            PeerHandler.Subscribe({
                type:PacketKind.Map,
                func:(e:any)=>this.ReceiveMap(e)
            });
        }
    }

    public ReceiveMap(content:DecorationContext):void{
        this._mapContent.push(content);
        if(content.Status == MessageProgess.end){
            route('/Canvas', true);
        }
    }
}

export enum DecorationType{
    None,
    Stone,
    Water,
    Puddle,
    Bush,
    Tree,
    Rock,
    Diamond,
    Hq
}

export enum MessageProgess{
    start,
    inProgress,
    end
}

export class DecorationContext{
    public Type:DecorationType;
    public Position:HexAxial;
    public Status:MessageProgess;
}