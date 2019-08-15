import { Player } from './../../Player';
const io = require('socket.io-client');

export class PeerHandler{
    private _connector:RTCPeerConnection;
    private _channel:RTCDataChannel;
    private _socket:any;

    private _handlers:{type:string,func:{(message:any):void}}[] = new Array<{type:string,func:{(message:any):void}}>();
    private _player:Player;
    private _serverName:string;
    private _isAdmin:boolean;

    public Start(getPlayers:(players:string[])=>void):void
    {
        this._socket = io('http://localhost:3000');
        this._socket.on('connect', () => 
        {
          this._socket.on('players',(data:{list:string[]})=>
          {
            getPlayers(data.list);

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

    private StartWebRtc():void {
      console.log('Starting WebRTC in as waiter');
      this.SetupIceCandidate();
    
      // If user is not the offerer let wait for a data channel
      this._connector.ondatachannel = event => {
          console.log('received channel ' + event.channel.label);
          this._channel = event.channel;
          this.SetupDataChannel();
      };

      this.ListenSignal();
    }

    private StartRtcOffering():void {
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

    private SetupIceCandidate() {
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

    private ListenSignal():void {
        //Listen to signaling data from Scaledrone
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
                        console.log(this._player.Name + ' receives a signal ', this._connector.remoteDescription.type.toUpperCase() + ' message.');
                        
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

    private SetupDataChannel():void 
    {
        this.CheckDataChannelState();
        this._channel.onopen =()=>this.CheckDataChannelState;
        this._channel.onclose =()=>this.CheckDataChannelState;
        this._channel.onmessage = event =>
        {
            console.log(`player ${this._player.Name} received: ${event.data.type}`)
            this._handlers.forEach(handler=>
            {
                if(handler.type === event.data.type)
                {
                    handler.func(event.data.content);
                }
            });
        }
    }
    
    private CheckDataChannelState():void {
        console.log('WebRTC channel state is:', this._channel.readyState);
        if (this._channel.readyState === 'open') 
        {
            console.log('WebRTC data channel is now open');
        }
    }

    private SendSignal(message:any):void {
        console.log(this._player.Name + ' is sending message: \n' + JSON.stringify(message));
        this._socket.emit('signaling', {
            ServerName: this._serverName,
            PlayerName:this._player.Name,
            message
        });
    }

    public Setup(player:Player, serverName:string, isAdmin:boolean ):void{
        this._player = player;
        this._serverName=serverName;
        this._isAdmin=isAdmin;
    }

    public Stop():void{
        if(this._isAdmin)
        {
          this._socket.emit('remove', this._serverName);
        }
        else
        {
          this._socket.emit('leave', this._serverName);
        }
    }

    public Subscribe(handler:{type:string,func:{(message:any):void}}):void{
        this._handlers.push(handler);
    }

    public SendMessage(type:string, content:any):void
    {
        let packet = JSON.stringify({
            type:type,
            content:content
        });
        this._channel.send(packet);
    }

}