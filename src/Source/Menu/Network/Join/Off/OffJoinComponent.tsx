import {h, Component} from 'preact';
import {route} from 'preact-router';
const io = require('socket.io-client');
import linkState from 'linkstate';

export default class OffJoinComponent extends Component<any, {ServerNames:string[], PlayerName:string}> {
    private _socket:any;

    constructor(){
        super();
        this.setState({
            ServerNames:new Array<string>(),
            PlayerName:'John doe'
        });
        this._socket = io('http://localhost:3000');
        this.Start();
    }

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        return <div class="centered">
                <div class="form-group mb-2">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="inputGroup-sizing-default">Playername</span>
                        </div>
                        <input type="text" value={this.state.PlayerName} onInput={linkState(this, 'PlayerName')} class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
                    </div>
                </div>

            <table class="table table-dark table-hover">
            <thead>
                <tr>
                <th scope="col">Servers</th>
                <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
            {this.state.ServerNames.map((serverName) => {
                return (<tr>
                    <td class="align-middle">{serverName}</td>
                    <td class="align-middle"><button type="button" onClick={()=>this.Join(serverName)} class="btn btn-primary">Join</button></td>
                </tr>);
            })}
            </tbody>
            </table>
            <button type="button" class="btn btn-secondary btn-sm btn-space" onClick={this.Back}>Back</button>
        </div>;
    }

    private Join(servername:string):void{
        route(`/OnHost/${servername}/${this.state.PlayerName}/${false}`, true);
    }

    private Back(e:any){
        route('/Home', true);
    }

    private Start():void{
        this._socket.on('connect', () => 
        {
            this._socket.emit('rooms');
            this._socket.on('rooms', (roomsData:{serverNames:string[]}) =>
                {
                    this.setState({
                        ServerNames:roomsData.serverNames
                    });
                }
            );
        });
    }
}