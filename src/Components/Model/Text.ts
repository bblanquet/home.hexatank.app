export const RedSentences = [
	'There is no hero without a villain',
	'I like being a villain. Villains are more exciting.',
	'My mustache made me look more like a villain. I wish I had a mustache...',
	'I’m not handsome enough to be hero. Maybe a villain, though.',
	'History will decide if I’m a villain or a hero.'
];

export const BlueSentences = [ '...', 'zzzZZZzzzz.', 'Mmmmh' ];

export const LoadingSentences = [
	'Importing ammo from abroad...',
	'Analyzing vehicle blueprints...',
	'Polishing nice trophies...',
	'Manufacturing vehicle parts...',
	'Recruting some villains...',
	'Setting antennas up for communication between troops...',
	'Adding shining effects to precious resources...',
	'Loading very manly sound effects...',
	'Planting battlefield trees...',
	'Painting vehicles with fancy colors...'
];

export const trainingSentences = [
	'You have to make a tank reach its destination.',
	'You have to destroy a force field, to reach that goal, you will have to generate power up cells.',
	'You have 120 seconds to retrieve at least 35 diamonds.'
];

export function GreenSentences(index: number) {
	if (index === 1) {
		return trainingSentences[0];
	} else if (index === 2) {
		return trainingSentences[1];
	} else {
		return trainingSentences[2];
	}
}
