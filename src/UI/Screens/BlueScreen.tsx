import { Component, h } from 'preact';
import { route } from 'preact-router';
import { IAppService } from '../../Services/App/IAppService';
import { ICampaignService } from '../../Services/Campaign/ICampaignService';
import { Singletons, SingletonKey } from '../../Singletons';
import Redirect from '../Components/Redirect';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { LockButton } from '../Common/Button/Stylish/LockButton';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import { CampaignKind } from '../../Services/Campaign/CampaignKind';
import { Face } from '../Components/Face';
import Navbar from '../Components/Navbar';
import { GameBlueprint } from '../../Core/Framework/Blueprint/Game/GameBlueprint';

export default class BlueScreen extends Component<any, any> {
	private _campaignService: ICampaignService;

	constructor(props: any) {
		super(props);
		this._campaignService = Singletons.Load<ICampaignService>(SingletonKey.Campaign);
		const a = '';
	}

	render() {
		return (
			<Redirect>
				<Navbar>
					<div class="generalContainer absolute-center-middle">
						<div class="container-center">
							<Face
								eyes={[ 'fill-blue-eyes-1', 'fill-blue-eyes-2' ]}
								mouths={[ 'fill-blue-mouth-1', 'fill-blue-mouth-2', 'fill-blue-mouth-3' ]}
								face={'fill-blue-face'}
							/>
						</div>
						<div class="container-center">
							<div class="container-center-horizontal">
								<ButtonComponent
									callBack={() => {
										this.RedCampaign();
									}}
									color={ColorKind.Black}
								>
									<Icon Value="fas fa-long-arrow-alt-left" />
								</ButtonComponent>
							</div>
							<div class="d-flex flex-wrap justify-content-center">
								{this._campaignService.GetButtons(CampaignKind.blue).map((isPossible, index) => {
									if (isPossible) {
										return this.GetButton(index + 1);
									} else {
										return <LockButton />;
									}
								})}
							</div>
							<ButtonComponent
								callBack={() => {
									this.Back();
								}}
								color={ColorKind.Black}
							>
								<Icon Value="fas fa-undo-alt" /> Back
							</ButtonComponent>
						</div>
					</div>
				</Navbar>
			</Redirect>
		);
	}

	private Back() {
		route('{{sub_path}}Home', true);
	}

	private RedCampaign() {
		route('{{sub_path}}Red', true);
	}

	private GetButton(index: number) {
		return (
			<ButtonComponent
				callBack={() => {
					this.Start(index);
				}}
				color={ColorKind.Blue}
			>
				<Icon Value="fas fa-arrow-alt-circle-right" /> {index}
			</ButtonComponent>
		);
	}

	Start(index: number): void {
		const mapContext = this._campaignService.GetMapContext(CampaignKind.blue, index);
		Singletons.Load<IAppService<GameBlueprint>>(SingletonKey.App).Register(mapContext);
		route('{{sub_path}}Canvas', true);
	}
}
