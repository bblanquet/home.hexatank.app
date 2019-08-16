import { HostState } from '../../HostState';
import { Component,h } from 'preact';
import { route } from 'preact-router';
import { Player } from '../../Player';
import { Message } from '../../Message';
import {PeerHandler} from './PeerHandler';
import linkState from 'linkstate';
import * as toastr from "toastr";
import { PacketKind } from '../../PacketKind';

export default class OnHostComponent extends Component<any, HostState> {

    constructor(props:any){
        super(props);
        const p = new Player(props.playerName);
        this.setState({
            ServerName:props.serverName,
            Players:[p],
            IsAdmin:props.isAdmin.toLowerCase() == 'true' ? true : false,
            Player:p,
            Message:''
        });
        PeerHandler.Setup(this.state.Player,this.state.ServerName,this.state.IsAdmin);
        PeerHandler.Start(this.GetPlayers.bind(this),this.Back.bind(this));
        PeerHandler.Subscribe({
          func:this.Update.bind(this),
          type:PacketKind.Ready,
        });
        PeerHandler.Subscribe({
          func:this.ReceiveToast.bind(this),
          type:PacketKind.Toast,
        });
    }

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        return (
        <div>
          <div class="centered">
            <ol class="breadcrumb">
              <li>{this.state.ServerName}</li>
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

                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <button class="btn btn-dark" type="button" id="button-addon1" onClick={() => this.Send()}>Send</button>
                  </div>
                  <input type="text" class="form-control" value={this.state.Message} onInput={linkState(this, 'Message')} aria-label="Example text with button addon" aria-describedby="button-addon1"/>
                </div>

                {this.state.IsAdmin 
                ? 
                <button type="button" class="btn btn-primary btn-sm btn-dark btn-space" onClick={() => this.Back()}>Start</button>
                :''            
                }
            <button type="button" class="btn btn-primary btn-sm btn-danger btn-space" onClick={() => this.Back()}>Close</button>
            <button type="button" class="btn btn-primary btn-sm btn-space" onClick={() => this.ChangeReady()}>
                {this.state.Player.IsReady ? 'I am not ready' : 'I am ready'}
            </button>
        </div>
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

    private ReceiveToast(data:any):void{
      var message = data as Message;
      if(message)
      {
        toastr["success"](message.Content,message.Name,{iconClass: 'toast-blue'});
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
       PeerHandler.SendMessage(PacketKind.Ready,this.state.Player);
    }

    private Send():void{
      
      let message = new Message();
      message.Name = this.state.Player.Name;
      message.Content = this.state.Message;
      this.setState({
        Message:''
      });

      toastr["success"](message.Content, message.Name, {iconClass: 'toast-white'});
      PeerHandler.SendMessage(PacketKind.Toast, message);
    }

    private Back():void{
      PeerHandler.Stop();
      route('/Home', true);
    }
}