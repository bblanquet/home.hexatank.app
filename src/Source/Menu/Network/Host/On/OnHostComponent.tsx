import { HostState } from '../../HostState';
import { Component,h } from 'preact';
import { route } from 'preact-router';
import { Player } from '../../Player';
import {PeerHandler} from './PeerHandler';

export default class OnHostComponent extends Component<any, HostState> {
    private _peerHandler:PeerHandler;
    constructor(props:any){
        super(props);
        const p = new Player(props.playerName);
        this.setState({
            ServerName:props.serverName,
            Players:[p],
            IsAdmin:props.isAdmin.toLowerCase() == 'true' ? true : false,
            Player:p
        });
        this._peerHandler = new PeerHandler();
        this._peerHandler.Setup(this.state.Player,this.state.ServerName,this.state.IsAdmin);
        this._peerHandler.Start(this.GetPlayers.bind(this));
        this._peerHandler.Subscribe({
          func:this.Update.bind(this),
          type:'isReady',
        });
    }

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        return (<div class="centered">
        <ol class="breadcrumb">
           <li><a href="#">{this.state.ServerName}</a></li>
        </ol>
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

    private Update(data:any):void{
      var player = data as Player;
      if(player)
      {
        let p = this.state.Players.filter(p=>p.Name === player.Name)[0];
        p.IsReady = player.IsReady;
        this.setState({
          Players:this.state.Players
        })
      }
    }

    private GetPlayers(playerNames:string[]):void{
      let players = playerNames.map(l=>new Player(l)).filter(p=>p.Name!==this.state.Player.Name);
      players.push(this.state.Player);
      this.setState({
        Players:players
      });
    }

    private ChangeReady():void{
       const player = this.state.Player;
       player.IsReady = !player.IsReady;
       this.setState({
         Player:player
       });
       this._peerHandler.SendMessage('isReady',this.state.Player);
    }

    private Back(){
      this._peerHandler.Stop();
      route('/Home', true);
    }
}