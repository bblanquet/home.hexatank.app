import { h, Component } from 'preact';
import { route } from 'preact-router';
import { MapSetting } from '../Form/MapSetting';
import { MapGenerator } from '../../Core/Setup/Generator/MapGenerator';
import { MapEnv } from '../../Core/Setup/Generator/MapEnv';
import PanelComponent from '../Common/Panel/PanelComponent';
import MapFormComponent from '../Form/MapFormComponent';
import { IAppService } from '../../Services/App/IAppService';
import { Factory, FactoryKey } from '../../Factory';
import Redirect from '../Redirect/RedirectComponent';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';

export default class SinglePlayerComponent extends Component<any, MapSetting> {
	constructor(props: any) {
		super(props);
		this.setState(new MapSetting());
	}

	private Update(m: MapSetting): void {
		if (m.IaCount === 0) {
			m.IaCount = 1;
		}
		this.setState(m);
	}

	render() {
		return (
			<Redirect>
				<PanelComponent>
					<div class="container-center">
						<MapFormComponent Model={this.state} CallBack={this.Update.bind(this)} />
						<div class="container-center-horizontal">
							<ButtonComponent
								callBack={() => {
									this.Back();
								}}
								color={ColorKind.Black}
							>
								<Icon Value="fas fa-undo-alt" /> Back
							</ButtonComponent>
							<ButtonComponent
								callBack={() => {
									this.Start();
								}}
								color={ColorKind.Red}
							>
								<Icon Value="fas fa-arrow-alt-circle-right" /> Play
							</ButtonComponent>
						</div>
					</div>
				</PanelComponent>
			</Redirect>
		);
	}

	private Back() {
		route('/Home', true);
	}

	private ConvertSize(): number {
		if (this.state.Size === 'Small') return 8;
		if (this.state.Size === 'Medium') return 10;
		if (this.state.Size === 'Large') return 12;
		return 8;
	}

	private ConvertEnv(): MapEnv {
		if (this.state.Env === 'Sand') return MapEnv.sand;
		if (this.state.Env === 'Forest') return MapEnv.forest;
		if (this.state.Env === 'Ice') return MapEnv.ice;
		return MapEnv.forest;
	}

	Start(): void {
		let hqCount = this.state.IaCount + 1;
		if (this.ConvertSize() === 8 && 2 < hqCount) {
			hqCount = 2;
		} else if (hqCount === 1) {
			hqCount += 1;
		}

		const mapContext = new MapGenerator().GetMapDefinition(
			this.ConvertSize(),
			this.state.MapType,
			hqCount,
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
