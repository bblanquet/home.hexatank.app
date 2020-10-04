import { h, Component } from 'preact';
import { route } from 'preact-router';
import { SinglePlayerState } from './SinglePlayerState';
import { MapGenerator } from '../../Core/Setup/Generator/MapGenerator';
import { MapEnv } from '../../Core/Setup/Generator/MapEnv';
import RedButtonComponent from '../Common/Button/Stylish/RedButtonComponent';
import DropDownComponent from '../Common/DropDown/DropDownComponent';
import BlackButtonComponent from '../Common/Button/Stylish/BlackButtonComponent';
import PanelComponent from '../Common/Panel/PanelComponent';
import { IAppService } from '../../Services/App/IAppService';
import { Factory, FactoryKey } from '../../Factory';
import Redirect from '../Redirect/RedirectComponent';

export default class SinglePlayerComponent extends Component<any, SinglePlayerState> {
	constructor(props: any) {
		super(props);
	}

	componentWillUpdate() {}

	componentDidMount() {
		this.setState({
			IaNumber: 1,
			Env: '0',
			MapType: 'Flower',
			Size: 12
		});
	}

	render() {
		return (
			<Redirect>
				<PanelComponent>
					<DropDownComponent
						OnInput={(e: any) => {
							this.setState({ IaNumber: Number(e.target.value) });
						}}
						Label={'IA'}
						Values={[ '1', '2', '3' ]}
					/>
					<DropDownComponent
						OnInput={(e: any) => {
							this.setState({ Env: e.target.value });
						}}
						Label={'Env'}
						Values={[ 'Sand', 'Forest', 'Ice' ]}
					/>
					<DropDownComponent
						OnInput={(e: any) => {
							this.setState({ Size: Number(e.target.value) });
						}}
						Label={'Env'}
						Values={[ 'Small', 'Medium', 'Large' ]}
					/>
					<DropDownComponent
						OnInput={(e: any) => {
							this.setState({ MapType: e.target.value });
						}}
						Label={'Shape'}
						Values={[ 'Donut', 'Cheese', 'Flower' ]}
					/>
					<p />
					<div class="container-center-horizontal">
						<BlackButtonComponent icon={'fas fa-undo-alt'} title={'Back'} callBack={() => this.Back()} />
						<RedButtonComponent
							icon={'fas fa-arrow-alt-circle-right'}
							title={'Play'}
							callBack={() => this.Start()}
						/>
					</div>
				</PanelComponent>
			</Redirect>
		);
	}

	private Back() {
		route('/Home', true);
	}

	private ConvertEnv(): MapEnv {
		if (this.state.Env === 'Sand') return MapEnv.sand;
		if (this.state.Env === 'Forest') return MapEnv.forest;
		if (this.state.Env === 'Ice') return MapEnv.ice;
	}

	private ConvertSize(): number {
		if (this.state.Env === 'Small') return 8;
		if (this.state.Env === 'Medium') return 12;
		if (this.state.Env === 'Large') return 16;
	}

	Start(): void {
		const mapContext = new MapGenerator().GetMapDefinition(
			this.ConvertSize(),
			this.state.MapType,
			+this.state.IaNumber + 1,
			this.ConvertEnv()
		);
		mapContext.Hqs[0].PlayerName = mapContext.PlayerName;
		mapContext.Hqs.forEach((hq, index) => {
			if (!hq.PlayerName) {
				hq.isIa = true;
				hq.PlayerName = `IA-${index}`;
			}
			index += 1;
		});
		Factory.Load<IAppService>(FactoryKey.App).Register(mapContext);
		route('/Canvas', true);
	}
}
