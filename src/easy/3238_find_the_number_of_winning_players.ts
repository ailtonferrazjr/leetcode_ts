/*
 * 3238 | Find the Number of Winning Players
 * Difficulty: Easy
 * ----------------
 *
 * Description:
 * You are given an integer "n" representing the number of players in a game and
 * a 2D array "pick" where "pick[i] = [xi, yi]" represents that the player "xi"
 * picked a ball of color "yi".
 * 
 * Player "i" wins the game if they pick strictly more than "i" balls of the
 * same color. In other words,
 * 
 * Player 0 wins if they pick any ball.
	Player 1 wins if they pick at least two
 * balls of the same color.
	...
	Player "i" wins if they pick at least"i + 1"
 * balls of the same color.
 * 
 * Return the number of players who win the game.
 * 
 * Note that multiple players can win the game.
 *
 * URL: https://https://leetcode.com/problems/find-the-number-of-winning-players/
*/

export function winningPlayerCount(_n: number, pick: number[][]): number {
	const winners = new Set();
	const mapping = new Map<number, Map<number, number>>();

	for (const [player, colour] of pick) {
		// In case we have the player already in winners, skip the analysis
		if (winners.has(player)) continue;

		// In case we don't have the current player in the mapping, we should add it
		if (!mapping.has(player)) mapping.set(player, new Map<number, number>());

		// Get the colour map
		const colourMap = mapping.get(player);

		// Get the count of balls of that color and add 1
		const count = (colourMap?.get(colour) || 0) + 1;

		// In case the count of balls of that colour are higher than player number, add them to the winners list
		if (count > player) {
			winners.add(player);
		}

		// Then add the count to the colourMap
		colourMap?.set(colour, count);
	}
	return winners.size;
}
