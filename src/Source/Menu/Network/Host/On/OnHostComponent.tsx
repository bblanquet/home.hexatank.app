import { HostState } from '../../HostState';
import { Component,h } from 'preact';
import { route } from 'preact-router';
import { Player } from '../../Player';
const io = require('socket.io-client');

export default class OnHostComponent extends Component<any, HostState> {
    private _connector:RTCPeerConnection;
    private _channel:RTCDataChannel;
    private _socket:any;

    constructor(props:any){
        super(props);
        const p = new Player(props.playerName);
        this.setState({
            ServerName:props.serverName,
            Players:[p],
            IsAdmin:props.isAdmin.toLowerCase() == 'true' ? true : false,
            Player:p
        })
        this._socket = io('http://localhost:3000');
        this.StartServer();
    }

    componentDidMount() {

    }

    componentWillUnmount() {}

    render() {
        return (<div class="centered">
        <ul class="list-group list-group-horizontal">
            <li class="list-group-item">{this.state.ServerName}</li>
        </ul>

        <table class="table table-dark table-hover">
            <thead>
                <tr>
                <th scope="col">Player</th>
                <th scope="col">Status</th>
                </tr>
            </thead>
            <tbody>
            {this.state.Players.map((player) => {
                return (<tr>
                    <td class="align-middle">{player.Name}</td>
                    <td class="align-middle">{player.IsReady ?  
                      <span class="badge badge-success">Ready</span>  :  
                      <span class="badge badge-info">Not ready</span> }
                    </td>
                </tr>);
            })}
            </tbody>
            </table>

            {this.state.IsAdmin 
            ? 
            <button type="button" class="btn btn-primary btn-sm btn-success btn-space" onClick={() => this.Back()}>Start</button>
            :''            
            }
        <button type="button" class="btn btn-primary btn-sm btn-danger btn-space" onClick={() => this.Back()}>Close</button>
        <button type="button" class="btn btn-primary btn-sm btn-space" onClick={() => this.ChangeReady()}>
            {this.state.Player.IsReady ? 'I am not ready' : 'I am ready'}
        </button>
    </div>);
    }

    private StartServer():void
    {
        this._socket.on('connect', () => 
        {
          this._socket.on('players',(data:{list:string[]})=>
          {
            let players = data.list.map(l=>new Player(l)).filter(p=>p.Name!==this.state.Player.Name);
            players.push(this.state.Player);
            this.setState({
              Players:players
            });

          });

          if(this.state.IsAdmin)
          {
            this._socket.emit('create', this.state.ServerName);
          }

          this._socket.emit('join',  
          {
            'ServerName':this.state.ServerName,
            'PlayerName':this.state.Player.Name,
          });

          if(this.state.IsAdmin)
          {
            this.startWebRTC();
          }
          else
          {
            this.startOffererWebRTC();
          }
        });
    }

    private startOffererWebRTC():void {
        console.log('Starting WebRTC in as offerer');
        this._connector = new RTCPeerConnection({
            iceServers: [{
                urls: 'stun:stun.l.google.com:19302'
            }]
          });
      
        // 'onicecandidate' notifies us whenever an ICE agent needs to deliver a
        // message to the other peer through the signaling server
        this._connector.onicecandidate = event => {
          if (event.candidate) {
            this.sendSignalingMessage({'candidate': event.candidate});
          }
        };
      
        // If user is offerer let them create a negotiation offer and set up the data channel
        this._connector.onnegotiationneeded = () => {
          this._connector.createOffer();
        }
        
        this._channel = this._connector.createDataChannel(this.state.ServerName);
        this.setupDataChannel();
      
        this.startListentingToSignals();
      }

      private startWebRTC():void {
        console.log('Starting WebRTC in as waiter');
        this._connector = new RTCPeerConnection({
            iceServers: [{
                urls: 'stun:stun.l.google.com:19302'
            }]
          });
      
        // 'onicecandidate' notifies us whenever an ICE agent needs to deliver a
        // message to the other peer through the signaling server
        this._connector.onicecandidate = event => {
          if (event.candidate) {
            this.sendSignalingMessage({'candidate': event.candidate});
          }
        };
      
        // If user is not the offerer let wait for a data channel
        this._connector.ondatachannel = event => {
            this._channel = event.channel;
            this.setupDataChannel();
        };
      
        this.startListentingToSignals();
      }

      private startListentingToSignals():void {
          //Listen to signaling data from Scaledrone
          this._socket.on('data', (message:any) => {
            // Message was sent by us
            if (message.playerName === this.state.Player.Name) 
            {
                return;
            }
            if (message.sdp) 
            {
              // This is called after receiving an offer or answer from another peer
              this._connector.setRemoteDescription(new RTCSessionDescription(message.sdp));
              console.log('pc.remoteDescription.type', this._connector.remoteDescription.type);
              if (this._connector.remoteDescription.type === 'offer')
              {
                this._connector.createAnswer()
              }
            } 
            else if (message.candidate) 
            {
              // Add the new ICE candidate to our connections remote description
              this._connector.addIceCandidate(new RTCIceCandidate(message.candidate));
            }
          });
      }

    //   private localDescCreated(desc:any):void {
    //     this._connector.setLocalDescription(
    //       desc,
    //       () => this.sendSignalingMessage({'sdp': this._connector.localDescription}),
    //       (error:any) => console.error(error)
    //     );
    //   }

      private setupDataChannel():void 
      {
        this.checkDataChannelState();
        this._channel.onopen =this.checkDataChannelState;
        this._channel.onclose = this.checkDataChannelState;
        this._channel.onmessage = event =>
          console.log(`player ${this.state.Player.Name} received: ${event.data.Name} ready->${event.data.IsReady}`)
      }
      
      private checkDataChannelState():void {
        console.log('WebRTC channel state is:', this._channel.readyState);
        if (this._channel.readyState === 'open') 
        {
          console.log('WebRTC data channel is now open');
        }
      }

      private sendSignalingMessage(message:any):void {
        this._socket.publish({
          room: this.state.ServerName,
          message
        });
      }
    
    private Back(){
      if(this.state.IsAdmin)
      {
        this._socket.emit('remove', this.state.ServerName);
      }
      else
      {
        this._socket.emit('leave', this.state.ServerName);
      }
      route('/Home', true);
    }

    private ChangeReady():void{
        const player = this.state.Player;
        player.IsReady = !player.IsReady;
        this.setState({
          Player:player
        });
        this._channel.send(JSON.stringify(this.state.Player));
    }
}


            // if (error) {
            //   return console.error(error);
            // }
            // this._room = this._socket.subscribe(this.state.Port.toString());
            // this._room.on('open', (error:any) => {
            // if (error) {
            //     return console.error(error);
            // }
            // console.log('Connected to signaling server');
            // });
            // // We're connected to the room and received an array of 'members'
            // // connected to the room (including us). Signaling server is ready.
            // this._room.on('members', (members:any[]) => 
            // {
            //     if (members.length >= 3) {
            //     return alert('The room is full');
            //     }
            //     // If we are the second user to connect to the room we will be creating the offer
            //     if(members.length === 2)
            //     {
            //         this.startOffererWebRTC();
            //     }
            //     else
            //     {
            //         this.startWebRTC();
            //     }
            // });