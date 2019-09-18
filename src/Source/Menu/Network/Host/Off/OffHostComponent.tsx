import {h, Component} from 'preact';
import {route} from 'preact-router';
import {OffHostState} from './OffHostState';
import linkState from 'linkstate';

export default class OffHostComponent extends Component<any, OffHostState> {
    
    constructor(){
        super();
        this.setState({
            ServerName:'John\'s server',
            PlayerName:'John'
        })
    }

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        return (<div class="centered">
                <div class="form-group mb-2">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="inputGroup-sizing-default">Server name</span>
                        </div>
                        <input type="text" value={this.state.ServerName} onInput={linkState(this, 'ServerName')} class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
                    </div>
                </div>
                <div class="form-group mb-2">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="inputGroup-sizing-default">PlayerName</span>
                        </div>
                        <input type="text" value={this.state.PlayerName} onInput={linkState(this, 'PlayerName')} class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
                    </div>
                </div>
            <div class="btn-group btn-group-space" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-dark btn-sm" onClick={(e) => this.Start(e)}>Start</button>
                <button type="button" class="btn btn-primary btn-sm btn-danger" onClick={this.Back}>Back</button>
            </div>
        </div>);
    }

    private Start(e:any):void{
        route(`/OnHost/${this.state.ServerName}/${this.state.PlayerName}/${true}`, true);
    }

    private Back(e:any){
        route('/Home', true);
    }
    
}