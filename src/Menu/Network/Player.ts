import { PlayerStatus } from './PlayerStatus';
export class Player{
    public Name:string;
    public Status:PlayerStatus=PlayerStatus.NotReady;
    public Latency:string;
    constructor(name:string){
        this.Name=name;
        this.Latency = '0';
    }
}