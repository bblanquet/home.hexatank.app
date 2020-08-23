import { PacketKind } from './PacketKind';

export interface INetworkMessage{
    Emitter: string;
    Recipient:string;
    RoomName:string;
    Kind:PacketKind;
    HasContent():boolean;
    GetContent():any;
}