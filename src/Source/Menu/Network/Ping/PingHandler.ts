import { LiteEvent } from '../../../Core/Utils/LiteEvent';
import { PeerHandler } from '../Host/On/PeerHandler';
import { PacketKind } from '../PacketKind';
import { PingInfo } from './PingInfo';

export class PingHandler{
    
    constructor(private _name:string){
        PeerHandler.Subscribe({
            func: this.OnPartialPingReceived.bind(this),
            type: PacketKind.PartialPing,
          });
          PeerHandler.Subscribe({
            func: this.OnPingReceived.bind(this),
            type: PacketKind.Ping,
          });
    }

    public Start():void{
        this.PartialPing();
    }

    public Stop():void{
        this.PingReceived.clear();
    }

    public PingReceived:LiteEvent<PingInfo>=new LiteEvent<PingInfo>();

    private OnPingReceived(data: { Sender: string, Receiver:string, Date: number }): void {
        if(data.Sender === this._name)
        {
          const pingInfo = new PingInfo();
          pingInfo.Duration = Math.abs(new Date().getTime() - data.Date).toString();
          pingInfo.Receiver = data.Receiver;
          pingInfo.Sender = data.Sender;
          this.PingReceived.trigger(this,pingInfo);
          setTimeout(()=>{this.PartialPing();},2000);
        }
      }
    
      private OnPartialPingReceived(data: { Sender: string, Date: number }): void 
      {
        if(data.Sender !== this._name)
        {
          PeerHandler.SendMessage(PacketKind.Ping, {
            ...data,
            Receiver:this._name
        });
        }
      }

    private PartialPing():void {
        PeerHandler.SendMessage(PacketKind.PartialPing, {
            Sender: this._name,
            Date: new Date().getTime(),
            Receiver:''
        });
    }

}