import { Versionning } from '../../Components/Model/Versionning';
import { IVersionService } from './IVersionService';

export class VersionService implements IVersionService {
	private _versions: Versionning[] = [
		new Versionning('0.8.25', [ 'Change the selection behavior in training' ], [ 'Marvin' ]),
		new Versionning(
			'0.8.23',
			[
				'Improve tutorials',
				'Fix interaction bugs',
				'Authorize overlaps between units',
				'Improve online syncrhonisation #3'
			],
			[ 'Marvin' ]
		),
		new Versionning(
			'0.8.14',
			[ 'Fix frozen units', 'Fix and improve IA', 'Improve online synchronisation #2' ],
			[ 'Doug' ]
		),
		new Versionning(
			'0.8.13',
			[
				'Add self-automated collectors',
				'Disable fog of war',
				'Change game speed',
				'Make stages replayable',
				'Fix multi-selection bugs',
				'Improve online synchronisation #1'
			],
			[ 'Doug', 'Marvin' ]
		)
	];

	GetVersions(): Versionning[] {
		return this._versions;
	}

	public GetVersionNumber(): string {
		return this._versions[0].Name;
	}
}
