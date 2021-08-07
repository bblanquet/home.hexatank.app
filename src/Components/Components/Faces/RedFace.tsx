import { h, Component } from 'preact';
import { SizeType } from '../../Model/SizeType';
import { Face } from '../Face';

export default class RedFace extends Component<
	{
		Size: SizeType;
	},
	{}
> {
	render() {
		return (
			<Face
				Size={this.props.Size}
				Eyes={[ 'fill-red-eyes-1', 'fill-red-eyes-2' ]}
				Mouths={[ 'fill-red-mouth-1', 'fill-red-mouth-2', 'fill-red-mouth-3' ]}
				Face={'fill-red-face'}
			/>
		);
	}
}
