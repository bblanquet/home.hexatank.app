import {h, Component} from 'preact';
import {route} from 'preact-router';
import './HomeStyle.css';

export default class HomeComponent extends Component<any, any> {
    
    constructor(){
        super();
    }

    private SetSinglePlayerDirection(e:any):void{
        route('/Canvas', true);
    }

    private SetMenuDirection(e:any):void{
        route('/Main', true);
    }

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        return (
            <div class="centered">
                <div class="btn-group-vertical">
                    <button type="button" class="btn btn-secondary" onClick={this.SetSinglePlayerDirection}>Single player</button>
                    <div class="btn-group" role="group">
                        <button id="btnGroupDrop1" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Multiplayers
                        </button>
                        <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                            <a class="dropdown-item" href="#">Host</a>
                            <a class="dropdown-item" href="#">Join</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}