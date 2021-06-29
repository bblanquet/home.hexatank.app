import { Component, h } from 'preact';
import { SimpleEvent } from '../../../../Core/Utils/Events/SimpleEvent';
import Icon from '../../../Common/Icon/IconComponent';
import { TimerComponent } from '../../../Common/Timer/TimerComponent';

export default class SynchronizingComponent extends Component<{ Quit: () => void; Timeout: SimpleEvent }, {}> {
	constructor() {
		super();
	}

	render() {
		return (
			<div class="absolute-center-middle-menu dark-container " style="width:300px">
				<div class="container-center-horizontal">
					<TimerComponent Duration={10} OnTimerDone={this.props.Timeout} isPause={false} />
					<div>Trying to synchonize...</div>
				</div>

				<div class="container-center-horizontal">
					<button type="button" class="btn btn-primary space-out right" onClick={() => this.props.Quit()}>
						<Icon Value={'fas fa-undo-alt'} /> Quit
					</button>
				</div>
			</div>
		);
	}
}
