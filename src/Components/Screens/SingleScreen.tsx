import { h, Component } from 'preact';
import { route } from 'preact-router';
import { GameBlueprintMaker } from '../../Core/Framework/Blueprint/Game/GameBlueprintMaker';
import { MapKind } from '../../Core/Framework/Blueprint/Items/MapKind';
import { IAppService } from '../../Services/App/IAppService';
import { Singletons, SingletonKey } from '../../Singletons';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import { MapShape } from '../../Core/Framework/Blueprint/Items/MapShape';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';
import { IPlayerProfilService } from '../../Services/PlayerProfil/IPlayerProfilService';
import BlueprintFormComponent from '../Components/Form/BlueprintFormComponent';
import { BlueprintSetup } from '../Components/Form/BlueprintSetup';
import Panel from '../Components/Panel/Panel';
import Redirect from '../Components/Redirect';
import { MapSize } from '../../Core/Framework/Blueprint/Items/MapSize';
import { HqAppearance } from '../../Core/Framework/Render/Hq/HqSkinHelper';

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
				<Panel
					content={
						<div class="container-center">
							<BlueprintFormComponent Model={this.state} CallBack={this.Update.bind(this)} />
						</div>
					}
					footer={
						<div class="navbar nav-inner">
							<div class="left">
								<SmBtn callBack={() => this.Back()} color={ColorKind.Black}>
									<Icon Value="fas fa-undo-alt" /> Back
								</SmBtn>
							</div>
							<div class="right">
								<SmBtn callBack={() => this.Start()} color={ColorKind.Red}>
									<Icon Value="fas fa-arrow-alt-circle-right" /> Play
								</SmBtn>
							</div>
						</div>
					}
				/>
			</Redirect>
		);
	}

	private Back() {
		route('{{sub_path}}Home', true);
	}

	private ConvertMapType(): MapShape {
		if (this.state.Shape === 'Flower') return MapShape.Flower;
		if (this.state.Shape === 'Donut') return MapShape.Donut;
		if (this.state.Shape === 'Cheese') return MapShape.Cheese;
		if (this.state.Shape === 'Triangle') return MapShape.Triangle;
		if (this.state.Shape === 'Y') return MapShape.Y;
		if (this.state.Shape === 'H') return MapShape.H;
		if (this.state.Shape === 'X') return MapShape.X;
		return MapShape.Rectangle;
	}

	private ConvertEnv(): MapKind {
		if (this.state.Env === 'Sand') return MapKind.Sand;
		if (this.state.Env === 'Forest') return MapKind.Forest;
		if (this.state.Env === 'Ice') return MapKind.Ice;
		return MapKind.Forest;
	}

	Start(): void {
		let hqCount = this.state.IaCount + 1;
		if (hqCount === 1) {
			hqCount += 1;
		}

		const blueprint = new GameBlueprintMaker().GetBluePrint(
			this.ConvertMapType(),
			this.ConvertEnv(),
			hqCount,
			HqAppearance.Colors
		);

		blueprint.Hqs.forEach((hq, index) => {
			if (!hq.PlayerName) {
				hq.isIa = true;
				hq.PlayerName = `IA-${index}`;
			}
			index += 1;
		});

		const playerName = this._profilService.GetProfil().LastPlayerName;
		blueprint.Hqs[0].PlayerName = playerName;
		blueprint.PlayerName = playerName;
		blueprint.Hqs[0].isIa = this.state.onylIa;
		Singletons.Load<IAppService<GameBlueprint>>(SingletonKey.App).Register(
			blueprint,
			() => this._profilService.AddPoints(30),
			() => this._profilService.AddPoints(3)
		);
		route('{{sub_path}}Canvas', true);
	}
}
