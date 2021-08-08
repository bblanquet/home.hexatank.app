import { JSX, h } from 'preact';
import { GameStatus } from '../../Core/Framework/GameStatus';
import { MultiCellMenuItem } from '../../Core/Menu/Buttons/MultiCellMenuItem';
import { MultiTankMenuItem } from '../../Core/Menu/Buttons/MultiTankMenuItem';
import ActiveRightBottomCornerButton from '../Common/Button/Corner/ActiveRightBottomCornerButton';
import GameCanvas from '../Components/GameCanvas';
import OptionPopup from '../Components/OptionPopup';
import Redirect from '../Components/Redirect';
import SmPopup from '../Components/SmPopup';
import Visible from '../Common/Struct/Visible';
import { HookedComponent } from '../Hooks/HookedComponent';
import { RuntimeState } from '../Model/RuntimeState';
import { useState } from 'preact/hooks';
import MenuSwitcher from '../Components/Canvas/MenuSwitcher';
import { isNullOrUndefined } from '../../Utils/ToolBox';
import Switch from '../Common/Struct/Switch';
import { SelectionKind } from '../../Core/Menu/Smart/MultiSelectionContext';
import { SingletonKey } from '../../Singletons';
import Bubble from '../Components/Bubble';
import { ColorKind } from '../Common/Button/Stylish/ColorKind';
import { RedGameHook } from '../Hooks/RedGameHook';
import TopButtons from '../Components/TopButtons';

export default class RedGameScreen extends HookedComponent<{}, RedGameHook, RuntimeState> {
	public GetDefaultHook(): RedGameHook {
		return new RedGameHook(SingletonKey.Gameworld, useState(RedGameHook.DefaultState()));
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
				<Visible isVisible={this.Hook.State.GameStatus === GameStatus.Pending}>
					<Visible isVisible={!this.Hook.State.HasMenu}>
						<TopButtons
							OnClick={() => this.Hook.SetMenu()}
							HasWarning={this.Hook.State.HasWarning}
							Amount={this.Hook.State.Amount}
						/>
					</Visible>
				</Visible>
				<GameCanvas Center={this.Hook.GetCenter()} OnRefresh={this.Hook.OnRefresh} />
				<Switch
					isLeft={!isNullOrUndefined(this.Hook.State.Sentence) && 0 < this.Hook.State.Sentence.length}
					left={
						<Bubble
							Color={ColorKind.Red}
							Sentence={this.Hook.State.Sentence}
							OnNext={() => this.Hook.SetNextSentence()}
						/>
					}
					right={
						<Visible isVisible={this.Hook.State.GameStatus === GameStatus.Pending}>
							<Visible isVisible={!this.Hook.State.HasMenu}>
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
			</Redirect>
		);
	}
}
