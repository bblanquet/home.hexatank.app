import { h, Component } from 'preact';
import { SizeType } from '../../Model/SizeType';
import { Face } from '../Face';

export default class GreenFace extends Component<
	{
		Size: SizeType;
	},
	{}
> {
	render() {
		return (
			<Face
				Size={this.props.Size}
				Eyes={[ 'fill-green-eyes1', 'fill-green-eyes2' ]}
				Mouths={[ 'fill-green-mouth-1', 'fill-green-mouth-2', 'fill-green-mouth-3', 'fill-green-mouth-4' ]}
				Face={'fill-green-face'}
			/>
		);
	}
}
