import { ConnectionStatus } from './ConnectionStatus';
export class Player{
    public Name:string;
    public Connection:ConnectionStatus;
    public IsReady:boolean;
    public Latency:string;

    constructor(name:string){
        this.Name=name;
        this.Latency = '0';
        this.Connection = new ConnectionStatus();
    }
}