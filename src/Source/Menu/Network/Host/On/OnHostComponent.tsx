import { HostState } from '../../HostState';
import { Component, h } from 'preact';
import { route } from 'preact-router';
import { Player } from '../../Player';
import { Message } from '../../Message';
import { PeerHandler } from './PeerHandler';
import linkState from 'linkstate';
import * as toastr from "toastr";
import { PacketKind } from '../../PacketKind';
import { MapGenerator } from '../../../../Core/Setup/Generator/MapGenerator';
import { PlaygroundHelper } from '../../../../Core/Utils/PlaygroundHelper';
import { MapContext } from '../../../../Core/Setup/Generator/MapContext';
import { GameMessage } from '../../../../Core/Utils/Network/GameMessage';
import { MessageProgess } from '../../../../Core/Utils/Network/MessageProgess';
import { MapMode } from '../../../../Core/Setup/Generator/MapMode';

export default class OnHostComponent extends Component<any, HostState> {

  constructor(props: any) {
    super(props);
    const p = new Player(props.playerName);

    this.setState({
      ServerName: props.serverName,
      Players: [p],
      IsAdmin: props.isAdmin.toLowerCase() == 'true' ? true : false,
      Player: p,
      Message: '',
      IaNumber: 0,
    });

    PeerHandler.Setup(this.state.Player, this.state.ServerName, this.state.IsAdmin);
    PeerHandler.Start(this.GetPlayers.bind(this), this.Back.bind(this));
    PeerHandler.Subscribe({
      func: this.Update.bind(this),
      type: PacketKind.Ready,
    });
    PeerHandler.Subscribe({
      func: this.ReceiveToast.bind(this),
      type: PacketKind.Toast,
    });
    PeerHandler.Subscribe({
      func: this.ReceivePing.bind(this),
      type: PacketKind.Ping,
    });
    PeerHandler.Subscribe({
      func: () => { PeerHandler.Ping() },
      type: PacketKind.Open,
    });

    PlaygroundHelper.Dispatcher.Init(!this.state.IsAdmin);
    PlaygroundHelper.PlayerName = this.state.Player.Name;
  }

  componentDidMount() { }

  componentWillUnmount() { }

  render() {
    return (
      <div class="base">
        <div class="centered">
          <div class="container">
          <div class="title-container">{this.state.ServerName}</div>
            <div class="btn-group btn-group-space" role="group" aria-label="Basic example">
              {this.state.IsAdmin
                ?
                <button type="button" class="btn btn-dark btn-sm" onClick={() => this.Start()}>Start</button>
                : ''
              }
              <button type="button" class="btn btn-dark btn-sm" onClick={() => this.ChangeReady()}>
                {this.state.Player.IsReady ? 'I am not ready' : 'I am ready'}
              </button>
              <button type="button" class="btn btn-primary btn-sm btn-danger" onClick={() => this.Back()}>Close</button>
            </div>
            {this.ShowIa()}
            <table class="table table-dark table-hover">
              <thead>
                <tr>
                  <th scope="col">Player</th>
                  <th scope="col">Status</th>
                  <th scope="col">Ping</th>
                  {this.state.IsAdmin ? <th scope="col">*</th> : ''}
                </tr>
              </thead>
              <tbody>
                {this.state.Players.map((player) => {
                  return (<tr class={this.state.Player.Name === player.Name ? 'row-blue' : ''}>
                    <td class="align-middle">{player.Name}</td>
                    <td class="align-middle">{player.IsReady ?
                      <span class="badge badge-success">Ready</span> :
                      <span class="badge badge-light">Not ready</span>}
                    </td>
                    <td class="align-middle">{player.Latency}</td>
                    {this.state.IsAdmin ?
                      <td class="align-middle">
                        <button type="button" class="btn btn-danger btn-small" onClick={() => this.MakeUserLeave(player.Name)}>X</button>
                      </td> : ''}
                  </tr>);
                })}
              </tbody>
            </table>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <button class="btn btn-dark" type="button" id="button-addon1" onClick={() => this.Send()}>Send</button>
              </div>
              <input type="text" class="form-control" id="toastMessageBox" value={this.state.Message} onInput={linkState(this, 'Message')} aria-label="Example text with button addon" aria-describedby="button-addon1" />
            </div>
          </div>
        </div>
      </div>);
  }

  private ShowIa() {
    if (this.state.IsAdmin) {
      return (<div class="form-group">
        <label class="text-dark" for="exampleFormControlSelect1">Ia</label>
        <select onChange={linkState(this, 'IaNumber')} class="form-control" id="exampleFormControlSelect1">
          <option>0</option>
          <option>1</option>
          <option>2</option>
        </select>
      </div>);
    }
    return '';
  }

  private ReceivePing(data: { PlayerName: string, Date: number }): void {
    const player = this.state.Players.filter(p => p.Name === data.PlayerName)[0];
    player.Latency = Math.abs(Date.now() - data.Date).toString();
    this.setState({
      Players: this.state.Players
    });
  }

  private MakeUserLeave(playerName: string): void {
    PeerHandler.Kick(playerName);
  }

  private Update(data: any): void {
    var player = data as Player;
    if (player) {
      let p = this.state.Players.filter(p => p.Name === player.Name)[0];
      p.IsReady = player.IsReady;
      this.setState({
        Players: this.state.Players
      })
    }
  }

  private ReceiveToast(data: any): void {
    var message = data as Message;
    if (message) {
      toastr["success"](message.Content, message.Name, { iconClass: 'toast-blue' });
    }
  }

  private GetPlayers(playerNames: string[]): void {
    let players = playerNames.map(l => new Player(l)).filter(p => p.Name !== this.state.Player.Name);
    players.push(this.state.Player);
    this.setState({
      Players: players
    });
  }

  private ChangeReady(): void {
    const player = this.state.Player;
    player.IsReady = !player.IsReady;
    this.setState({
      Player: player
    });
    PeerHandler.SendMessage(PacketKind.Ready, this.state.Player);
  }

  private Send(): void {

    let message = new Message();
    message.Name = this.state.Player.Name;
    message.Content = this.state.Message;
    this.setState({
      Message: ''
    });

    toastr["success"](message.Content, message.Name, { iconClass: 'toast-white' });
    PeerHandler.SendMessage(PacketKind.Toast, message);
    document.getElementById("toastMessageBox").focus();
  }

  private Start(): void {
    if (this.IsEveryoneReady()) {
      const hqCount = +this.state.IaNumber + this.state.Players.length;
      let mapContext = new MapGenerator().GetMapDefinition(hqCount,MapMode.forest);
      this.Assign(mapContext, this.state.Players);
      let message = new GameMessage<MapContext>();
      message.Message = mapContext;
      message.Status = MessageProgess.end;
      PeerHandler.SendMessage(PacketKind.Map, message);
      this.SetIa(mapContext);
      PlaygroundHelper.MapContext = mapContext;
      PlaygroundHelper.PlayerName = this.state.Player.Name;
      route('/Canvas', true);
    }
  }

  public Assign(mapContext: MapContext, players: Player[]): void {
    if (mapContext.Hqs.length < players.length) {
      throw new Error("not enough hq");
    }

    for (let i = 0; i < mapContext.Hqs.length; i++) {
      if (i < players.length) {
        mapContext.Hqs[i].PlayerName = players[i].Name;
      }
    }
  }

  public SetIa(mapContext: MapContext): void {
    let index = 0;
    mapContext.Hqs.forEach(hq => {
      if (!hq.PlayerName) {
        hq.isIa = true;
        hq.PlayerName = `IA${index}`;
      }
      index += 1;
    });
  }

  private IsEveryoneReady(): boolean {
    return this.state.Players.some(u => u.IsReady);
  }

  private Back(): void {
    PeerHandler.Stop();
    route('/Home', true);
  }
}