import { PacketKind } from './../../PacketKind';
import { Player } from './../../Player';
const io = require('socket.io-client');

export class PeerHandler{
    private static _connector:RTCPeerConnection;
    private static _channel:RTCDataChannel;
    private static _socket:any;

    private static _handlers:{type:PacketKind,func:{(message:any):void}}[] = new Array<{type:PacketKind,func:{(message:any):void}}>();
    private static _player:Player;
    private static _serverName:string;
    private static _isAdmin:boolean;

    public static Start(getPlayers:(players:string[])=>void,leave:()=>void):void
    {
        this._socket = io('http://mottet.xyz:8080');
        this._socket.on('connect', () => 
        {
          this._socket.on('players',(data:{list:string[]})=>
          {
            getPlayers(data.list);
          });

          this._socket.on('close',(data:any)=>{
            console.log("server is closed");
            leave();
        });

        this._socket.on('kick',(data:any)=>{
            console.log("server is closed");
            if(this._player.Name === data.PlayerName){
                leave();
            }
        });

          if(this._isAdmin)
          {
            this._socket.emit('create', this._serverName);
          }

          this._socket.emit('join',  
          {
            ServerName:this._serverName, 
            PlayerName:this._player.Name,
          });

          if(this._isAdmin)
          {
            this.StartWebRtc();
          }
          else
          {
            this.StartRtcOffering();
          }
        });
    }

    private static StartWebRtc():void {
      console.log('Starting WebRTC in as waiter');
      this.SetupIceCandidate();
    
      //let wait for a data channel
      this._connector.ondatachannel = event => {
          console.log('received channel ' + event.channel.label);
          this._channel = event.channel;
          this.SetupDataChannel();
      };

      this.ListenSignal();
    }

    private static StartRtcOffering():void {
        console.log('Starting WebRTC in as offerer');
        this.SetupIceCandidate();
        
        //If user is offerer let them create a negotiation offer and set up the data channel
        this._connector.onnegotiationneeded = () => {
            this._connector.createOffer().then(offer=>{
                this._connector.setLocalDescription(offer).then(()=>
                {this.SendSignal({sdp:this._connector.localDescription});}
                ).catch(e=>console.log(e.message));
            });
        };

        this._channel = this._connector.createDataChannel(this._serverName);
        this.SetupDataChannel();
        this.ListenSignal();
    }

    private static SetupIceCandidate() {
        this._connector = new RTCPeerConnection({
        iceServers: [{
            urls: 'stun:stun.l.google.com:19302'
        }]
        });
        // 'onicecandidate' notifies us whenever an ICE agent needs to deliver a
        // message to the other peer through the signaling server
        this._connector.onicecandidate = event => {
            if (event.candidate) {
                this.SendSignal({ 'candidate': event.candidate });
            }
        };
    }

    private static ListenSignal():void {
        //Listen to signaling data
        this._socket.on('signaling', (data:any) => 
        {
            // Message was sent by us
            if (data.PlayerName !== this._player.Name) 
            {
                if (data.sdp) 
                {
                    // This is called after receiving an offer or answer from another peer
                    this._connector.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(()=>
                    {
                        console.log(this._player.Name + ' set remote description ', this._connector.remoteDescription.type.toUpperCase());
                        
                        if (this._connector.remoteDescription.type === 'offer')
                        {
                            this._connector.createAnswer().then(e=>{
                                this._connector.setLocalDescription(e).then(()=>{
                                    this.SendSignal({sdp:this._connector.localDescription})
                                });
                            });
                        }
                    });
                } 
                else if (data.candidate) 
                {
                    // Add the new ICE candidate to our connections remote description
                    let candidate = new RTCIceCandidate(data.candidate);
                    this._connector.addIceCandidate(candidate);
                }
            }
        });
    }


    private static SetupDataChannel():void 
    {
        this._channel.onopen =()=>this.CheckDataChannelState();
        this._channel.onclose =()=>this.CheckDataChannelState();
        this._channel.onmessage = event =>
        {
            let obj = JSON.parse(event.data);
            console.log(`player ${this._player.Name} received: ${(PacketKind[obj.type]).toString()}`)
            this._handlers.forEach(handler=>
            {
                if(handler.type === obj.type)
                {
                    handler.func(obj.content);
                }
            });
        }
    }
    
    private static CheckDataChannelState():void {
        console.log('WebRTC channel state is:', this._channel.readyState);
        if (this._channel.readyState === 'open') 
        {
            console.log('WebRTC data channel is now open');
            this.SendMessage(PacketKind.Open,{});
        }
    }

    private static SendSignal(message:any):void {
        console.log(this._player.Name + ' is sending message: \n' + JSON.stringify(message));
        this._socket.emit('signaling', {
            ServerName: this._serverName,
            PlayerName:this._player.Name,
            message
        });
    }

    public static Setup(player:Player, serverName:string, isAdmin:boolean ):void{
        this._player = player;
        this._serverName=serverName;
        this._isAdmin=isAdmin;
    }

    public static Kick(playerName:string){
        if(this._socket)
        {
            if(this._isAdmin)
            {
              this._socket.emit('kick', {ServerName:this._serverName,PlayerName:playerName});
            }
        }
    }

    public static CloseRoom(){
        if(this._socket)
        {
            if(this._isAdmin)
            {
              this._socket.emit('remove', this._serverName);
            }
            else
            {
              this._socket.emit('leave', {ServerName:this._serverName,PlayerName:this._player.Name});
            }
            this._socket.close();
        }
    }

    public static Stop():void{
        if(this._channel)
        {
            this._channel.close();
        }

        if(this._connector)
        {
            this._connector.close();
        }
        this.CloseRoom()
    }

    public static Subscribe(handler:{type:PacketKind,func:{(message:any):void}}):void{
        this._handlers.push(handler);
    }

    public static SendMessage(type:PacketKind, content:any):void
    {
        if(this._channel 
            && this._channel.readyState == "open"){
            let packet = JSON.stringify({
                type:type,
                content:content
            });
            this._channel.send(packet);
        }
    }

}