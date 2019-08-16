import { Player } from './Player';

export class HostState{
    public ServerName:string;
    public IsAdmin:boolean;
    public Players:Array<Player>;
    public Player:Player;
    public Message:string;
}