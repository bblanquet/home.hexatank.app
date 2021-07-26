export const RedSentences = [
	'Are you sure you want to fight me?',
	"Don't cry after I beat you.",
	'How dare you challenge me!',
	'I am undefeatable.',
	'Your carefreeness will be your end.'
];

export const BlueSentences = [ '...', 'zzzZZZzzzz.' ];

export const LoadingSentences = [
	'Importing ammo from abroad...',
	'Analyzing vehicle blueprints...',
	'Polishing nice trophies...',
	'Manufacturing vehicle parts...',
	'Recruting some vilains...',
	'Setting antennas up for communication between troops...',
	'Adding shining effects to precious resources...',
	'Loading very manly sound effects...',
	'Planting battlefield trees...',
	'Painting vehicles with fancy colors...'
];

export function GreenSentences(index: number) {
	if (index === 1) {
		return 'Make a vehicle reach a specific destination.';
	} else if (index === 2) {
		return 'Make a tank destroy a shield, to reach that goal, you will need to create powerup cells.';
	} else {
		return 'Retrieve at least 35 diamonds for your headquarter, you got 120 seconds soldier.';
	}
}
