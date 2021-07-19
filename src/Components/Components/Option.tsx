import { h, Component } from 'preact';
import { BlueprintSetup } from '../Model/BlueprintSetup';
import BlueprintForm from './BlueprintForm';

export default class Option extends Component<{ Model: BlueprintSetup }> {
	constructor() {
		super();
	}

	render() {
		return (
			<div style="margin:15px">
				<BlueprintForm
					Model={this.props.Model}
					EnableEmptyIa={true}
					OnChanged={(m: BlueprintSetup) => {
						this.props.Model.Env = m.Env;
						this.props.Model.IAs = m.IAs;
						this.props.Model.Shape = m.Shape;
						this.props.Model.IsFullIA = m.IsFullIA;
					}}
				/>
			</div>
		);
	}
}
