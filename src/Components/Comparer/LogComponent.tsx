import * as luxon from 'luxon';
import { Component, h } from 'preact';
import { LogKind } from '../../Core/Utils/Logger/LogKind';
import { LogMessage } from '../../Core/Utils/Logger/LogMessage';
import { StaticLogger } from '../../Core/Utils/Logger/StaticLogger';
import GridComponent from '../Common/Grid/GridComponent';
import Icon from '../Common/Icon/IconComponent';

export default class LogComponent extends Component<{ messages: LogMessage[] }, {}> {
	public render() {
		return <GridComponent left={this.GetHeader()} right={this.GetContent()} />;
	}

	private GetHeader() {
		return (
			<thead>
				<tr class="d-flex">
					<th scope="col">Logs</th>
				</tr>
			</thead>
		);
	}

	private GetContent() {
		return (
			<tbody>
				{this.props.messages.map((message: LogMessage) => {
					return (
						<tr class="d-flex">
							<td
								class="align-self-center"
								style={`color:${StaticLogger.Colors.Get(LogKind[message.Kind])}`}
							>
								<Icon Value={StaticLogger.Icons.Get(LogKind[message.Kind])} />
							</td>
							<td class="align-self-center">
								{luxon.DateTime.fromJSDate(new Date(message.Date)).toFormat('mm:ss.S')}
							</td>
							<td class="align-self-center">
								<span class="badge badge-light">{message.Author}</span>
							</td>
							<td class="align-self-center">{message.Content}</td>
						</tr>
					);
				})}
			</tbody>
		);
	}
}
