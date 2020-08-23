import { ServerPingObserver } from './ServerPingObserver';
import { ServerSocket } from './../../Server/ServerSocket';
import { LiteEvent } from '../../../EventHandler/LiteEvent';

export class TimeoutPingObserver {
    public PingReceived: LiteEvent<number> = new LiteEvent<number>();
    private _obs:ServerPingObserver<number>;
    private _isDone:boolean;

	constructor(socket: ServerSocket, user:string,recipient: string, private Timeout:number) {
        this._isDone=false;
        this._obs = new ServerPingObserver<number>(socket,user,recipient);
        this._obs.PingReceived.On((e:any,data:number)=>{
            if(!this._isDone){
                let latency = Math.abs(new Date().getTime() - data);
                console.log(`[PING] [${recipient}] ${latency}`);
                if(latency < this.Timeout){
                    this._isDone = true;
                    this.PingReceived.Invoke(this,latency);
                    this.Stop();
                }
            }
        });
	}

	public Start(): void {
        this._obs.Start(new Date().getTime());
        this.Retry();
	}

    private Retry():void{
        setTimeout(()=>{
            if(!this._isDone){
                this._obs.Start(new Date().getTime());
                this.Retry();
            }
        },this.Timeout);
    }

	public Stop(): void {
        this._isDone = true;
        this.PingReceived.Clear();
        this._obs.Stop();
	}
}
