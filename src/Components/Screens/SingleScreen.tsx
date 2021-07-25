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
import BlueprintForm from '../Components/BlueprintForm';
import { BlueprintSetup } from '../Model/BlueprintSetup';
import Panel from '../Components/Panel/Panel';
import Redirect from '../Components/Redirect';
import { HqAppearance } from '../../Core/Framework/Render/Hq/HqSkinHelper';
import { PlayerBlueprint } from '../../Core/Framework/Blueprint/Game/HqBlueprint';
import { BrainKind } from '../../Core/Ia/Decision/BrainKind';

export default class SingleScreen extends Component<any, BlueprintSetup> {
	private _profilService: IPlayerProfilService;

	constructor(props: any) {
		super(props);
		this._profilService = Singletons.Load<IPlayerProfilService>(SingletonKey.PlayerProfil);
	}

	componentDidMount() {
		this.setState(new BlueprintSetup());
	}

	private Update(m: BlueprintSetup): void {
		if (m.IAs.length === 0) {
			m.IAs.length = 1;
		}
		this.setState(m);
	}

	render() {
		return (
			<Redirect>
				<Panel
					content={
						<BlueprintForm Model={this.state} OnChanged={this.Update.bind(this)} EnableEmptyIa={false} />
					}
					footer={
						<div class="navbar nav-inner">
							<div class="left">
								<SmBtn OnClick={() => this.Back()} Color={ColorKind.Black}>
									<Icon Value="fas fa-undo-alt" /> Back
								</SmBtn>
							</div>
							<div class="right">
								<SmBtn OnClick={() => this.Start()} Color={ColorKind.Red}>
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

	private ConvertBrain(ia: string): BrainKind {
		if (ia === 'Weak') return BrainKind.Weak;
		if (ia === 'Normal') return BrainKind.Normal;
		if (ia === 'Strong') return BrainKind.Strong;
		if (ia === 'Dummy') return BrainKind.Dummy;
		if (ia === 'Kamikaze') return BrainKind.Kamikaze;
		return BrainKind.Strong;
	}

	Start(): void {
		const playerName = this._profilService.GetProfil().LastPlayerName;
		const players = new Array<PlayerBlueprint>();
		if (this.state.IsFullIA) {
			this.state.IAs.forEach((ia, index) => {
				players.push(
					new PlayerBlueprint(
						`IA${index}`,
						HqAppearance.Colors[index + 1],
						index === 0,
						this.ConvertBrain(ia)
					)
				);
			});
		} else {
			players.push(new PlayerBlueprint(playerName, HqAppearance.Colors[0], true));
			this.state.IAs.forEach((ia, index) => {
				players.push(
					new PlayerBlueprint(`IA${index}`, HqAppearance.Colors[index + 1], false, this.ConvertBrain(ia))
				);
			});
		}

		const blueprint = new GameBlueprintMaker().GetBluePrint(this.ConvertMapType(), this.ConvertEnv(), players);

		Singletons.Load<IAppService<GameBlueprint>>(SingletonKey.App).Register(
			blueprint,
			() => this._profilService.AddPoints(30),
			() => this._profilService.AddPoints(3)
		);
		route('{{sub_path}}Canvas', true);
	}
}
