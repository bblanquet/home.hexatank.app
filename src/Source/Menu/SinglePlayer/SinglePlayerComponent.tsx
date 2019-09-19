import {h, Component} from 'preact';
import {route} from 'preact-router';
import { SinglePlayerState } from './SinglePlayerState';
import linkState from 'linkstate';
import { PlaygroundHelper } from '../../Core/Utils/PlaygroundHelper';
import { MapGenerator } from '../../Core/Setup/Generator/MapGenerator';

export default class SinglePlayerComponent extends Component<any, SinglePlayerState> {

    constructor(props: any) {
        super(props);
        this.setState({
            IaNumber:1
        });
    }

    render() {
        return (
        <div class="centered">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item active" aria-current="page">Single player</li>
                </ol>
            </nav>
            <div class="form-group">
                <label class="text-light" for="exampleFormControlSelect1">Ia</label>
                <select onChange={linkState(this, 'IaNumber')} class="form-control" id="exampleFormControlSelect1">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                </select>
            </div>
        <div class="btn-group btn-group-space" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-dark btn-sm" onClick={(e) => this.Start(e)}>Start</button>
            <button type="button" class="btn btn-primary btn-sm btn-danger" onClick={(e)=>this.Back(e)}>Back</button>
        </div>
        </div>)
    }

    private Back(e:any){
        route('/Home', true);
    }

    Start(e: MouseEvent): void {
        PlaygroundHelper.MapContext = new MapGenerator().GetMapDefinition(+this.state.IaNumber+1);
        PlaygroundHelper.SetDefaultName();
        PlaygroundHelper.MapContext.Hqs[0].PlayerName = PlaygroundHelper.PlayerName;
        let index = 0;
        PlaygroundHelper.MapContext.Hqs.forEach(hq=>{
          if(!hq.PlayerName){
            hq.isIa = true;
            hq.PlayerName = `IA${index}`;
          }
          index+=1;
        });
        route('/Canvas', true);
    }
}