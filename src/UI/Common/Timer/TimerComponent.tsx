import { Component, h } from 'preact';
import { SimpleEvent } from '../../../Core/Utils/Events/SimpleEvent';

export default class TimerComponent extends Component<
	{ Duration: number; OnTimerDone: SimpleEvent; isPause: boolean },
	{ CurrentDuration: number }
> {
	private _button: HTMLDivElement;

	componentDidMount() {
		this.setState({
			CurrentDuration: this.props.Duration
		});
		setTimeout(() => this.Update(), 1000);
	}

	private Update(): void {
		let current = this.state.CurrentDuration;

		if (!this.props.isPause) {
			current -= 1;
			if (current < 0) {
				current = 0;
			}
			if (this._button) {
				this._button.classList.remove('slow-bounce');
				setTimeout(() => {
					if (this._button) {
						this._button.classList.add('slow-bounce');
					}
				}, 50);

				this.setState({
					CurrentDuration: current
				});
			}
		}

		if (0 < current) {
			setTimeout(() => this.Update(), 1000);
		} else {
			this.props.OnTimerDone.Invoke();
		}
	}

	render() {
		if (5 < this.state.CurrentDuration) {
			return (
				<button
					type="button"
					class="btn btn-dark space-out"
					ref={(e: any) => {
						this._button = e;
					}}
				>
					{this.state.CurrentDuration}
				</button>
			);
		} else {
			return (
				<button
					type="button"
					class="btn btn-danger space-out"
					ref={(e: any) => {
						this._button = e;
					}}
				>
					{this.state.CurrentDuration}
				</button>
			);
		}
	}
}
