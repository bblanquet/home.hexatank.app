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

export default class CampaignComponent extends Component<any, any> {
	private _campaignService: ICampaignService;

	constructor(props: any) {
		super(props);
		this._campaignService = Factory.Load<ICampaignService>(FactoryKey.Campaign);
	}

	render() {
		return (
			<Redirect>
				<div class="generalContainer absolute-center-middle">
					<div class="container-center">
						<FaceComponent
							eyes={[ 'fill-redArmy-eyes', 'fill-redArmy-eyes-blink' ]}
							mouths={[ 'fill-redArmy-mouth-1', 'fill-redArmy-mouth-2', 'fill-redArmy-mouth-3' ]}
							face={'fill-redArmy'}
						/>
					</div>
					<div class="container-center">
						<div class="container-center-horizontal">
							<ButtonComponent
								callBack={() => {
									this.BlueCampaign();
								}}
								color={ColorKind.Black}
							>
								<Icon Value="fas fa-long-arrow-alt-right" />
							</ButtonComponent>
						</div>
						<div class="d-flex flex-wrap justify-content-center">
							{this._campaignService.GetButtons(CampaignKind.red).map((isPossible, index) => {
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
			</Redirect>
		);
	}

	private Back() {
		route('/Home', true);
	}

	private BlueCampaign() {
		route('/BlueCampaignComponent', true);
	}

	private GetButton(index: number) {
		return (
			<ButtonComponent
				callBack={() => {
					this.Start(index);
				}}
				color={ColorKind.Red}
			>
				<Icon Value="fas fa-arrow-alt-circle-right" /> {index}
			</ButtonComponent>
		);
	}

	Start(index: number): void {
		const mapContext = this._campaignService.GetMapContext(CampaignKind.red, index);
		Factory.Load<IAppService>(FactoryKey.App).Register(mapContext);
		route('/Canvas', true);
	}
}
