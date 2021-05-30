import { Component, h } from 'preact';
import { SimpleEvent } from '../../../Core/Utils/Events/SimpleEvent';

export class TimerComponent extends Component<
	{ Duration: number; OnTimerDone: SimpleEvent },
	{ CurrentDuration: number }
> {
	componentDidMount() {
		this.setState({
			CurrentDuration: this.props.Duration
		});
		setTimeout(() => this.Update(), 1000);
	}

	private Update(): void {
		let current = this.state.CurrentDuration;
		current -= 1;
		if (current < 0) {
			current = 0;
		}

		this.setState({
			CurrentDuration: current
		});

		if (0 < current) {
			setTimeout(() => this.Update(), 1000);
		} else {
			this.props.OnTimerDone.Invoke();
		}
	}

	render() {
		if (5 < this.state.CurrentDuration) {
			return (
				<button type="button" class="btn btn-dark space-out">
					{this.state.CurrentDuration}
				</button>
			);
		} else {
			return (
				<button type="button" class="btn btn-danger space-out bounce">
					{this.state.CurrentDuration}
				</button>
			);
		}
	}
}
