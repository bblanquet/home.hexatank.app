import { h, JSX } from 'preact';
import Redirect from '../Components/Redirect';
import Btn from '../Common/Button/Stylish/Btn';
import { LockBtn } from '../Common/Button/Stylish/LockBtn';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import Icon from '../Common/Icon/IconComponent';
import { Face } from '../Components/Face';
import StatBar from '../Components/StatBar';
import SmBtn from '../Common/Button/Stylish/SmBtn';
import Body from '../Common/Struct/Body';
import { StageState } from '../../Services/Campaign/StageState';
import { VictoryBtn } from '../Common/Button/Stylish/VictoryBtn';
import { HookedComponent } from '../Framework/HookedComponent';
import { BlueHook } from '../Hooks/BlueHook';
import { CampaignState } from '../Model/GreenState';
import { useState } from 'preact/hooks';
import Visible from '../Common/Struct/Visible';
import AnimatedIcon from '../Common/Button/Badge/AnimatedIcon';
import Switch from '../Common/Struct/Switch';
import Column from '../Common/Struct/Column';
import { SizeType } from '../Model/SizeType';
import BlueFace from '../Components/Faces/BlueFace';

export default class BlueScreen extends HookedComponent<{}, BlueHook, CampaignState> {
	public GetDefaultHook(): BlueHook {
		const [ state, setState ] = useState(BlueHook.DefaultState());
		return new BlueHook(state, setState);
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
									<SmBtn OnClick={() => this.Hook.Red()} Color={ColorKind.Red}>
										<Icon Value="fas fa-chevron-left" />
									</SmBtn>
									<BlueFace Size={SizeType.Bg} />
									<SmBtn OnClick={() => this.Hook.Green()} Color={ColorKind.Green}>
										<Icon Value="fas fa-chevron-right" />
									</SmBtn>
								</div>
							</div>

							<Switch
								isLeft={this.Hook.State.HasBubble}
								left={
									<div>
										<Column>
											<div class="arrow-up" />
											<div
												class="bubbleApp"
												style="width:fit-content;max-width:80%;min-width:50px;padding:10px"
											>
												{this.Hook.State.CurrentSentence}
											</div>
										</Column>
										<div class="container-center-horizontal">
											<Btn OnClick={() => this.Hook.SetBubble()} Color={ColorKind.Black}>
												<Icon Value="fas fa-undo-alt" /> Back
											</Btn>
											<Btn OnClick={() => this.Hook.Start()} Color={ColorKind.Blue}>
												<Icon Value="fas fa-fist-raised" /> Fight
											</Btn>
										</div>
									</div>
								}
								right={
									<div class="container-center">
										<div style="display: flex;flex-flow: row wrap;justify-content: space-around; width:200px">
											{this.Hook.GetStages().map((state, index) => {
												if (state === StageState.lock) {
													return <LockBtn Index={this.GetLevel(index)} />;
												} else if (state === StageState.achieved) {
													return (
														<SmBtn
															OnClick={() => this.Hook.Select(this.GetLevel(index))}
															Color={ColorKind.Blue}
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
															<Icon Value="fas fa-arrow-alt-circle-right" />{' '}
															{this.GetLevel(index)}
														</SmBtn>
													);
												} else {
													return (
														<SmBtn
															OnClick={() => this.Hook.Select(this.GetLevel(index))}
															Color={ColorKind.Blue}
														>
															<div class={`fill-campaign max-width`} />
															<Icon Value="fas fa-arrow-alt-circle-right" />{' '}
															{this.GetLevel(index)}
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

	private GetLevel(index: number): number {
		return index + 1;
	}
}
