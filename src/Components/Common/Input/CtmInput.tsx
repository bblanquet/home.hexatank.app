import { h, Component } from 'preact';

export default class CtmInput extends Component<
	{ type: string; label: string; value: string; isEditable: boolean; onInput: (e: any) => void; max: number },
	{}
> {
	render() {
		return (
			<div class="input-group mb-3" style="max-width:300px">
				<div class="input-group-prepend">
					<span class="input-group-text black-primary custom-btn-layout-1">{this.props.label}</span>
				</div>
				<input
					maxLength={this.props.max}
					type={this.props.type}
					value={this.props.value}
					onInput={(e: any) => this.props.onInput(e)}
					disabled={!this.props.isEditable}
					class="form-control"
					aria-label="Default"
				/>
			</div>
		);
	}
}
