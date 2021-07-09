import { Component, h } from 'preact';
import { route } from 'preact-router';
import { IAppService } from '../../Services/App/IAppService';
import { ICampaignService } from '../../Services/Campaign/ICampaignService';
import { Singletons, SingletonKey } from '../../Singletons';
import Btn from '../Common/Button/Stylish/Btn';
import { LockBtn } from '../Common/Button/Stylish/LockBtn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import { CampaignKind } from '../../Services/Campaign/CampaignKind';
import { CamouflageBlueprint } from '../../Core/Framework/Blueprint/Cam/CamouflageBlueprint';
import { FireBlueprint } from '../../Core/Framework/Blueprint/Fire/FireBlueprint';
import { DiamondBlueprint } from '../../Core/Framework/Blueprint/Diamond/DiamondBlueprint';
import { Face } from '../Components/Face';
import StatBar from '../Components/StatBar';
import Redirect from '../Components/Redirect';
import Visible from '../Components/Visible';
import { GreenSentences } from '../Model/Text';
import Struct from '../Components/Struct';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import { StageState } from '../../Services/Campaign/StageState';
import { VictoryBtn } from '../Common/Button/Stylish/VictoryBtn';

export default class GreenScreen extends Component<any, any> {
	private _campaignService: ICampaignService;

	constructor(props: any) {
		super(props);
		this._campaignService = Singletons.Load<ICampaignService>(SingletonKey.Campaign);
	}

	render() {
		return (
			<Redirect>
				<Struct
					header={<StatBar />}
					content={
						<div class="container-center-horizontal">
							<div style="width:80%">
								<div class="container-center">
									<Face
										eyes={[ 'fill-green-eyes1', 'fill-green-eyes2' ]}
										mouths={[
											'fill-green-mouth-1',
											'fill-green-mouth-2',
											'fill-green-mouth-3',
											'fill-green-mouth-4'
										]}
										face={'fill-green-face'}
									/>
								</div>
								<Visible isVisible={this.state.HasBubble}>
									<div class="arrow-up" />
									<p class="bubble">{this.state.CurrentSentence}</p>
									<div class="container-center-horizontal">
										<Btn
											callBack={() => {
												this.setState({
													HasBubble: !this.state.HasBubble
												});
											}}
											color={ColorKind.Black}
										>
											<Icon Value="fas fa-undo-alt" /> Back
										</Btn>
										<Btn
											callBack={() => {
												this.Start(this.state.level);
											}}
											color={ColorKind.Green}
										>
											<Icon Value="fas fa-fist-raised" /> Train
										</Btn>
									</div>
								</Visible>
								<Visible isVisible={!this.state.HasBubble}>
									<div class="container-center">
										<div class="container-center-horizontal">
											<Btn
												callBack={() => {
													this.RedCampaign();
												}}
												color={ColorKind.Black}
											>
												<Icon Value="fas fa-long-arrow-alt-right" />
											</Btn>
										</div>
										<div class="d-flex flex-wrap justify-content-center">
											{this._campaignService
												.GetButtons(CampaignKind.training)
												.map((state, index) => {
													if (state === StageState.lock) {
														return <LockBtn />;
													} else if (state === StageState.achieved) {
														return <VictoryBtn />;
													} else {
														return this.GetButton(index + 1);
													}
												})}
										</div>
									</div>
								</Visible>
							</div>
						</div>
					}
					footer={
						<div class="navbar nav-inner">
							<SmBtn callBack={() => this.Back()} color={ColorKind.Black}>
								<Icon Value="fas fa-undo-alt" /> Back
							</SmBtn>
						</div>
					}
				/>
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
			<Btn
				callBack={() => {
					this.setState({
						HasBubble: !this.state.HasBubble,
						level: index,
						Sentence: GreenSentences(index),
						CurrentSentence: ''
					});
					setTimeout(() => {
						this.TextAnimation();
					}, 100);
				}}
				color={ColorKind.Green}
			>
				{this.GetIcon(index)}
			</Btn>
		);
	}

	private GetIcon(index: number) {
		if (index === 1) {
			return <div class="fill-sm-hexa max-width icon-space" />;
		} else if (index === 2) {
			return <div class="fill-sm-tank max-width icon-space" />;
		} else {
			return <div class="fill-sm-diam max-width icon-space" />;
		}
	}

	private _timeout: NodeJS.Timeout;

	componentWillUnmount(): void {
		clearTimeout(this._timeout);
	}

	private TextAnimation(): void {
		if (this.state.CurrentSentence.length < this.state.Sentence.length) {
			this.setState({
				CurrentSentence: this.state.Sentence.substring(0, this.state.CurrentSentence.length + 1)
			});
		}

		if (this.state.CurrentSentence.length < this.state.Sentence.length) {
			this._timeout = setTimeout(() => {
				this.TextAnimation();
			}, 50);
		}
	}

	Start(index: number): void {
		const blueprint = this._campaignService.GetMapContext(CampaignKind.training, index);
		if (blueprint instanceof CamouflageBlueprint) {
			Singletons.Load<IAppService<CamouflageBlueprint>>(SingletonKey.CamouflageApp).Register(blueprint);
			route('{{sub_path}}Camouflage', true);
		} else if (blueprint instanceof FireBlueprint) {
			Singletons.Load<IAppService<FireBlueprint>>(SingletonKey.PowerApp).Register(blueprint);
			route('{{sub_path}}Fire', true);
		} else if (blueprint instanceof DiamondBlueprint) {
			Singletons.Load<IAppService<DiamondBlueprint>>(SingletonKey.DiamondApp).Register(blueprint);
			route('{{sub_path}}Diamond', true);
		}
	}
}
