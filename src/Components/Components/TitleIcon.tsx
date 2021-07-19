import { h, Component } from 'preact';
import { GameStatus } from '../../Core/Framework/GameStatus';
import Switch from '../Common/Struct/Switch';

export default class TitleIcon extends Component<{ Status: GameStatus }> {
	public render() {
		return (
			<div class="title-popup-container" style="margin-bottom:30px">
				<Switch
					isLeft={this.props.Status === GameStatus.Victory}
					left={
						<div class="fill-victory light-bounce">
							<div class="fill-victory-star infinite-bounce" />
						</div>
					}
					right={
						<div class="fill-defeat light-bounce">
							<div class="fill-defeat-eyes fade" />
						</div>
					}
				/>
			</div>
		);
	}
}
