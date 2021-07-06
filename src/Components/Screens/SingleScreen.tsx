import { h, Component } from 'preact';
import { route } from 'preact-router';
import { GameBlueprintMaker } from '../../Core/Framework/Blueprint/Game/GameBlueprintMaker';
import { MapKind } from '../../Core/Framework/Blueprint/Items/MapKind';
import { IAppService } from '../../Services/App/IAppService';
import { Singletons, SingletonKey } from '../../Singletons';
import Btn from '../Common/Button/Stylish/Btn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import { MapShape } from '../../Core/Framework/Blueprint/Items/MapShape';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import BlueprintFormComponent from '../Components/Form/BlueprintFormComponent';
import { BlueprintSetup } from '../Components/Form/BlueprintSetup';
import MdPanelComponent from '../Components/Panel/MdPanelComponent';
import Redirect from '../Components/Redirect';

export default class SingleScreen extends Component<any, BlueprintSetup> {
	private _profilService: IPlayerProfilService;

	constructor(props: any) {
		super(props);
		this._profilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
		this.setState(new BlueprintSetup());
	}

	private Update(m: BlueprintSetup): void {
		if (m.IaCount === 0) {
			m.IaCount = 1;
		}
		this.setState(m);
	}

	render() {
		return (
			<Redirect>
				<MdPanelComponent>
					<div class="container-center">
						<BlueprintFormComponent Model={this.state} CallBack={this.Update.bind(this)} />
						<div class="container-center-horizontal">
							<Btn
								callBack={() => {
									this.Back();
								}}
								color={ColorKind.Black}
							>
								<Icon Value="fas fa-undo-alt" /> Back
							</Btn>
							<Btn
								callBack={() => {
									this.Start();
								}}
								color={ColorKind.Red}
							>
								<Icon Value="fas fa-arrow-alt-circle-right" /> Play
							</Btn>
						</div>
					</div>
				</MdPanelComponent>
			</Redirect>
		);
	}

	private Back() {
		route('{{sub_path}}Home', true);
	}

	private ConvertSize(): number {
		if (this.state.Size === 'Small') return 8;
		if (this.state.Size === 'Medium') return 10;
		if (this.state.Size === 'Large') return 12;
		return 8;
	}

	private ConvertEnv(): MapKind {
		if (this.state.Env === 'Sand') return MapKind.sand;
		if (this.state.Env === 'Forest') return MapKind.forest;
		if (this.state.Env === 'Ice') return MapKind.ice;
		return MapKind.forest;
	}

	Start(): void {
		let hqCount = this.state.IaCount + 1;
		if (this.ConvertSize() === 8 && 2 < hqCount) {
			hqCount = 2;
		} else if (hqCount === 1) {
			hqCount += 1;
		}

		const blueprint = new GameBlueprintMaker().GetBluePrint(
			this.ConvertSize(),
			this.ConvertMapType(),
			this.ConvertEnv(),
			hqCount
		);
		if (!this.state.onylIa) {
			const playerName = this._profilService.GetProfil().LastPlayerName;
			blueprint.Hqs[0].PlayerName = playerName;
			blueprint.PlayerName = playerName;
		}
		blueprint.Hqs.forEach((hq, index) => {
			if (!hq.PlayerName) {
				hq.isIa = true;
				hq.PlayerName = `IA-${index}`;
			}
			index += 1;
		});
		Singletons.Load<IAppService<GameBlueprint>>(SingletonKey.App).Register(blueprint);
		route('{{sub_path}}Canvas', true);
	}

	private ConvertMapType(): MapShape {
		if (this.state.MapType === 'Flower') return MapShape.Flower;
		if (this.state.MapType === 'Donut') return MapShape.Donut;
		if (this.state.MapType === 'Cheese') return MapShape.Cheese;
		if (this.state.MapType === 'Triangle') return MapShape.Triangle;
		if (this.state.MapType === 'Y') return MapShape.Y;
		if (this.state.MapType === 'H') return MapShape.H;
		if (this.state.MapType === 'X') return MapShape.X;
		return MapShape.Rectangle;
	}
}
