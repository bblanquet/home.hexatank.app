import { Component, h } from 'preact';
import { route } from 'preact-router';
import { IAppService } from '../../Services/App/IAppService';
import { ICampaignService } from '../../Services/Campaign/ICampaignService';
import { Factory, FactoryKey } from '../../Factory';
import Redirect from '../Redirect/RedirectComponent';
import ButtonComponent from '../Common/Button/Stylish/ButtonComponent';
import { LockButton } from '../Common/Button/Stylish/LockButton';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import { CampaignKind } from '../../Services/Campaign/CampaignKind';
import { FaceComponent } from './FaceComponent';
import NavbarComponent from '../Common/Navbar/NavbarComponent';

export default class TrainingComponent extends Component<any, any> {
	private _campaignService: ICampaignService;

	constructor(props: any) {
		super(props);
		this._campaignService = Factory.Load<ICampaignService>(FactoryKey.Campaign);
	}

	render() {
		return (
			<Redirect>
				<NavbarComponent>
					<div class="generalContainer absolute-center-middle">
						<div class="container-center">
							<FaceComponent
								eyes={[]}
								mouths={[
									'fill-training-flag-1',
									'fill-training-flag-2',
									'fill-training-flag-3',
									'fill-training-flag-4'
								]}
								face={'fill-training'}
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
									<Icon Value="fas fa-long-arrow-alt-right" />
								</ButtonComponent>
							</div>
							<div class="d-flex flex-wrap justify-content-center">
								{this._campaignService.GetButtons(CampaignKind.training).map((isPossible, index) => {
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
				</NavbarComponent>
			</Redirect>
		);
	}

	private Back() {
		route('/Home', true);
	}

	private RedCampaign() {
		route('/Campaign', true);
	}

	private GetButton(index: number) {
		return (
			<ButtonComponent
				callBack={() => {
					this.Start(index);
				}}
				color={ColorKind.Green}
			>
				<Icon Value="fas fa-arrow-alt-circle-right" /> {index}
			</ButtonComponent>
		);
	}

	Start(index: number): void {
		const mapContext = this._campaignService.GetMapContext(CampaignKind.training, index);
		Factory.Load<IAppService>(FactoryKey.CamouflageApp).Register(mapContext);
		route('/Canvas', true);
	}
}
