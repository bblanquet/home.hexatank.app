export class Player{
    public Name:string;
    public IsReady:boolean;
    public Latency:string;
    constructor(name:string){
        this.Name=name;
        this.Latency = '0';
    }
}