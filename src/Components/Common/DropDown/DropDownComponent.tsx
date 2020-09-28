import { h, Component } from 'preact';

export default class DropDownComponent extends Component<
	{ OnInput: (e: any) => void; Label: string; Values: string[] },
	{}
> {
	constructor() {
		super();
	}

	render() {
		return (
			<div class="col-auto my-1">
				<div class="input-group mb-3">
					<div class="input-group-prepend">
						<span class="input-group-text custom-black-btn" id="inputGroup-sizing-default">
							{this.props.Label}
						</span>
					</div>
					<select
						onInput={(e: any) => {
							this.props.OnInput(e);
						}}
						class="custom-select mr-sm-2"
					>
						{this.props.Values.map((v) => <option value={v}>{v}</option>)}
					</select>
				</div>
			</div>
		);
	}
}
