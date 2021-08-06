import { JSX, h } from 'preact';
import Btn from '../Common/Button/Stylish/Btn';
import { LockBtn } from '../Common/Button/Stylish/LockBtn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import { Face } from '../Components/Face';
import StatBar from '../Components/StatBar';
import Redirect from '../Components/Redirect';
import Body from '../Common/Struct/Body';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import { StageState } from '../../Services/Campaign/StageState';
import { VictoryBtn } from '../Common/Button/Stylish/VictoryBtn';
import { HookedComponent } from '../Hooks/HookedComponent';
import { GreenHook } from '../Hooks/GreenHook';
import { useState } from 'preact/hooks';
import { CampaignState } from '../Model/GreenState';
import Column from '../Common/Struct/Column';
import Switch from '../Common/Struct/Switch';
import AnimatedIcon from '../Common/Button/Badge/AnimatedIcon';
import Line from '../Common/Struct/Line';

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
						<div>
							<div class="container-center">
								<div
									class="d-flex"
									style="flex-direction:row;align-content:space-between;align-items: center; margin:10px"
								>
									<SmBtn OnClick={() => this.Hook.BlueCampaign()} Color={ColorKind.Blue}>
										<Icon Value="fas fa-chevron-left" />
									</SmBtn>
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

									<SmBtn OnClick={() => this.Hook.RedCampaign()} Color={ColorKind.Red}>
										<Icon Value="fas fa-chevron-right" />
									</SmBtn>
								</div>
							</div>
							<Switch
								isLeft={this.Hook.State.HasBubble}
								left={
									<div>
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
									</div>
								}
								right={
									<div class="container-center">
										<div style="display: flex;flex-flow: row wrap;justify-content: space-around; width:200px">
											{this.Hook.GetStages().map((state, index) => {
												if (state === StageState.lock) {
													return <LockBtn Index={index + 1} />;
												} else if (state === StageState.achieved) {
													return (
														<SmBtn
															OnClick={() => this.Hook.Select(index + 1)}
															Color={ColorKind.Green}
														>
															<div class={`fill-gold-campaign max-width`}>
																<AnimatedIcon
																	values={[
																		'fill-light-1',
																		'fill-light-2',
																		'fill-light-3',
																		'fill-light-4'
																	]}
																	frequency={1000}
																/>
															</div>
															<Icon Value="fas fa-arrow-alt-circle-right" /> {index + 1}
														</SmBtn>
													);
												} else {
													return (
														<SmBtn
															OnClick={() => this.Hook.Select(index + 1)}
															Color={ColorKind.Green}
														>
															<div class={`fill-campaign max-width`} />
															<Icon Value="fas fa-arrow-alt-circle-right" /> {index + 1}
														</SmBtn>
													);
												}
											})}
										</div>
									</div>
								}
							/>
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
