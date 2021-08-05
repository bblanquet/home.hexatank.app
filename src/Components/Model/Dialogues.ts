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
	'You have to destroy the oponent outpost.',
	'You have to create your own outpost.',
	'You have retrieve resources for your headquarter.'
];

export const Camouflage = [ 'bring your unit to this safe spot.', 'Be careful the path is full of obstacles...', '' ];
export const Fire = [
	'The opponent is very confident of his new highly protected headquarter, destroy it!',
	'To breach out try to conquest reactors first, arrows point them out.',
	'Good luck soldier.',
	''
];

export const outpost = [
	'Let settle an outpost in this land, that will enable you to fix your tank.',
	'',
	"Well done, you have a operational outpost, this outpost will help you to assist your units. let's start by repairing your tank.",
	'',
	"Now that your tank is like new, let's destroy this ugly boulder over there.",
	''
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
