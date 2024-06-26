import { JSX, h } from 'preact';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { MultiCellMenuItem } from '../../Core/Menu/Buttons/MultiCellMenuItem';
import { MultiTankMenuItem } from '../../Core/Menu/Buttons/MultiTankMenuItem';
import ActiveRightBottomCornerButton from '../Common/Button/Corner/ActiveRightBottomCornerButton';
import TimerComponent from '../Common/Timer/TimerComponent';
import GameCanvas from '../Components/GameCanvas';
import OptionPopup from '../Components/OptionPopup';
import Redirect from '../Components/Redirect';
import SmPopup from '../Components/SmPopup';
import Visible from '../Common/Struct/Visible';
import { HookedComponent } from '../Framework/HookedComponent';
import { DiamondHook } from '../Hooks/DiamondHook';
import { RuntimeState } from '../Model/RuntimeState';
import { useState } from 'preact/hooks';
import MenuSwitcher from '../Components/Canvas/MenuSwitcher';
import { isNullOrUndefined } from '../../Utils/ToolBox';
import Switch from '../Common/Struct/Switch';
import { SelectionKind } from '../../Core/Menu/Smart/MultiSelectionContext';
import { SingletonKey } from '../../Singletons';
import Bubble from '../Components/Bubble';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import TopButtons from '../Components/TopButtons';

export default class DiamondScreen extends HookedComponent<{}, DiamondHook, RuntimeState> {
	public GetDefaultHook() {
		return new DiamondHook(SingletonKey.Diamondworld, useState(DiamondHook.DefaultState()));
	}

	public Rendering(): JSX.Element {
		return (
			<Redirect>
				<Visible
					isVisible={
						this.Hook.State.GameStatus !== GameStatus.Pending &&
						!isNullOrUndefined(this.Hook.State.StatusDetails)
					}
				>
					<SmPopup Status={this.Hook.State.GameStatus} Details={this.Hook.State.StatusDetails} />
				</Visible>
				<Switch
					isLeft={!isNullOrUndefined(this.Hook.State.Sentence) && 0 < this.Hook.State.Sentence.length}
					left={
						<Bubble
							Color={ColorKind.Green}
							Sentence={this.Hook.State.Sentence}
							OnNext={() => this.Hook.SetNextSentence()}
						/>
					}
					right={
						<Visible isVisible={this.Hook.State.GameStatus === GameStatus.Pending}>
							<Visible isVisible={!this.Hook.State.HasMenu}>
								<div style="position: fixed;">
									<button
										type="button"
										class="btn btn-dark small-space space-out fill-option"
										onClick={() => this.Hook.SetMenu()}
									/>
									<button type="button" class="btn btn-dark space-out ">
										<div
											class="d-flex"
											style="flex-direction:row;align-content:space-between;align-items: center"
										>
											<Visible isVisible={this.Hook.State.HasWarning}>
												<div
													class="fill-noMoney radius-5px very-small-space blink_me space-out"
													style="background-color:#ffc107"
												/>
											</Visible>
											<div class="fit-content">
												{this.Hook.State.Amount.toFixed(2)} / {this.Hook.GetGoalDiamond()}
											</div>
											<div
												class="fill-diamond radius-5px very-small-space space-out"
												style="background-color:#6c757d"
											/>
										</div>
									</button>
									<TimerComponent
										Duration={this.Hook.GetDuration()}
										OnTimerDone={this.Hook.OnTimerDone()}
										isPause={this.Hook.State.HasMenu}
									/>
								</div>
								<Switch
									isLeft={isNullOrUndefined(this.Hook.State.Item)}
									left={
										<div class="right-bottom-menu">
											<ActiveRightBottomCornerButton
												isActive={this.Hook.State.SelectionKind === SelectionKind.Vehicle}
												callBack={() => this.Hook.SendContext(new MultiTankMenuItem())}
												logo="fill-tank-multi-cell"
											/>
											<ActiveRightBottomCornerButton
												isActive={this.Hook.State.SelectionKind === SelectionKind.Cell}
												callBack={() => this.Hook.SendContext(new MultiCellMenuItem())}
												logo="fill-mult-cell"
											/>
										</div>
									}
									right={
										<MenuSwitcher
											VehicleCount={this.Hook.GetVehicleCount()}
											ReactorCount={this.Hook.GetReactor()}
											Item={this.Hook.State.Item}
											OnClick={(e) => this.Hook.SendContext(e)}
											FieldBtns={this.Hook.GetFieldBtns()}
											Btns={this.Hook.GetBtns()}
										/>
									}
								/>
							</Visible>

							<Visible isVisible={this.Hook.State.HasMenu}>
								<OptionPopup
									Status={this.Hook.State.GameStatus}
									Resume={() => this.Hook.SetMenu()}
									Quit={() => this.Hook.Stop(false)}
								/>
							</Visible>
						</Visible>
					}
				/>
				<GameCanvas Center={this.Hook.GetCenter()} OnRefresh={this.Hook.OnRefresh} />
			</Redirect>
		);
	}
}
