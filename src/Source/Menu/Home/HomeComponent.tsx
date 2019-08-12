import {h, Component} from 'preact';
import {route} from 'preact-router';

export default class HomeComponent extends Component<any, any> {
    
    constructor(){
        super();
    }

    private ToCanvas(e:any):void{
        route('/Canvas', true);
    }

    private ToHost(e:any):void{
        route('/OffHost', true);
    }

    private ToJoin(e:any):void{
        route('/OffJoin', true);
    }

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        return (
            <div class="centered">
                <div class="btn-group-vertical">
                    <button type="button" class="btn btn-secondary" onClick={this.ToCanvas}>Single player</button>
                    <div class="btn-group" role="group">
                        <button id="btnGroupDrop1" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Multiplayers
                        </button>
                        <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                            <a class="dropdown-item" onClick={this.ToHost}>Host</a>
                            <a class="dropdown-item" onClick={this.ToJoin}>Join</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}