import { INetworkMessage } from './INetworkMessage';
import {PacketKind} from './PacketKind';
import { isNullOrUndefined } from 'util';

export class NetworkMessage<T> implements INetworkMessage{

    public Content:T;
    public Emitter: string;
    public RoomName:string;
    public Recipient:string;
    public Kind:PacketKind;

    public HasContent():boolean{
        return !isNullOrUndefined(this.Content);
    }

    GetContent():any {
        return this.Content;
    }
}