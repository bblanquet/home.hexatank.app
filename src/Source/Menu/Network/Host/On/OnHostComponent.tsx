import { HostState } from '../../HostState';
import { Component,h } from 'preact';
import { route } from 'preact-router';
import { Player } from '../../Player';
import {PeerHandler} from './PeerHandler';
import linkState from 'linkstate';
import * as toastr from "toastr";

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
        PeerHandler.Start(this.GetPlayers.bind(this));
        PeerHandler.Subscribe({
          func:this.Update.bind(this),
          type:'isReady',
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
                  <input type="text" class="form-control" placeholder="" onInput={linkState(this, 'Message')} aria-label="Example text with button addon" aria-describedby="button-addon1"/>
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
       PeerHandler.SendMessage('isReady',this.state.Player);
    }

    private Send():void{
      toastr.options.positionClass='toast-top-right';
      toastr["success"]("Inconceivable!");
      this.setState({
        Message:''
      })
    }

    private Back(){
      PeerHandler.Stop();
      route('/Home', true);
    }
}