import { JSX, h } from 'preact';
import Btn from '../Common/Button/Stylish/Btn';
import { LockBtn } from '../Common/Button/Stylish/LockBtn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import { Face } from '../Components/Face';
import StatBar from '../Components/StatBar';
import Redirect from '../Components/Redirect';
import Visible from '../Common/Struct/Visible';
import Body from '../Common/Struct/Body';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import { StageState } from '../../Services/Campaign/StageState';
import { VictoryBtn } from '../Common/Button/Stylish/VictoryBtn';
import { HookedComponent } from '../Hooks/HookedComponent';
import { GreenHook } from '../Hooks/GreenHook';
import { useState } from 'preact/hooks';
import { CampaignState } from '../Model/GreenState';

export default class GreenScreen extends HookedComponent<{}, GreenHook, CampaignState> {
	public GetDefaultHook(): GreenHook {
		const [ state, setState ] = useState(GreenHook.DefaultState());
		return new GreenHook(state, setState);
	}

	public Rendering(): JSX.Element {
		return (
			<Redirect>
				<Body
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
								<Visible isVisible={this.Hook.State.HasBubble}>
									<div class="arrow-up" />
									<p class="bubble bubbleApp">{this.Hook.State.CurrentSentence}</p>
									<div class="container-center-horizontal">
										<Btn OnClick={() => this.Hook.SetBubble()} Color={ColorKind.Black}>
											<Icon Value="fas fa-undo-alt" /> Back
										</Btn>
										<Btn
											OnClick={() => this.Hook.Start(this.Hook.State.Level)}
											Color={ColorKind.Green}
										>
											<Icon Value="fas fa-fist-raised" /> Train
										</Btn>
									</div>
								</Visible>
								<Visible isVisible={!this.Hook.State.HasBubble}>
									<div class="container-center">
										<div class="container-center-horizontal">
											<Btn OnClick={() => this.Hook.RedCampaign()} Color={ColorKind.Black}>
												<Icon Value="fas fa-long-arrow-alt-right" />
											</Btn>
										</div>
										<div class="d-flex flex-wrap justify-content-center">
											{this.Hook.GetStages().map((state, index) => {
												if (state === StageState.lock) {
													return <LockBtn />;
												} else if (state === StageState.achieved) {
													return <VictoryBtn OnClick={() => this.Hook.Select(index + 1)} />;
												} else {
													return (
														<Btn
															OnClick={() => this.Hook.Select(index + 1)}
															Color={ColorKind.Green}
														>
															<Icon Value="fas fa-arrow-alt-circle-right" /> {index + 1}
														</Btn>
													);
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
							<SmBtn OnClick={() => this.Hook.Back()} Color={ColorKind.Black}>
								<Icon Value="fas fa-undo-alt" /> Back
							</SmBtn>
						</div>
					}
				/>
			</Redirect>
		);
	}
}
