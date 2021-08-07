import { h, Component } from 'preact';
import { SizeType } from '../../Model/SizeType';
import { Face } from '../Face';

export default class BlueFace extends Component<
	{
		Size: SizeType;
	},
	{}
> {
	render() {
		return (
			<Face
				Size={this.props.Size}
				Eyes={[ 'fill-blue-eyes-1', 'fill-blue-eyes-2' ]}
				Mouths={[ 'fill-blue-mouth-1', 'fill-blue-mouth-2', 'fill-blue-mouth-3' ]}
				Face={'fill-blue-face'}
			/>
		);
	}
}
