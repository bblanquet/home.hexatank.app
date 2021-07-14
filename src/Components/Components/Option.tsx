import { h, Component } from 'preact';
import { BlueprintSetup } from './Form/BlueprintSetup';
import BlueprintFormComponent from './Form/BlueprintFormComponent';

export default class Option extends Component<{ Model: BlueprintSetup }> {
	constructor() {
		super();
	}

	render() {
		return (
			<div style="margin:15px">
				<BlueprintFormComponent
					Model={this.props.Model}
					CallBack={(m: BlueprintSetup) => {
						this.props.Model.Env = m.Env;
						this.props.Model.IaCount = m.IaCount;
						this.props.Model.Shape = m.Shape;
						this.props.Model.onylIa = m.onylIa;
					}}
				/>
			</div>
		);
	}
}
