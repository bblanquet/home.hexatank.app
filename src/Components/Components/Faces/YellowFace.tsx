import { h, Component } from 'preact';
import { SizeType } from '../../Model/SizeType';
import { Face } from '../Face';

export default class YellowFace extends Component<
	{
		Size: SizeType;
	},
	{}
> {
	render() {
		return <Face Size={this.props.Size} Eyes={[]} Mouths={[]} Face={'fill-yellow-face'} />;
	}
}
