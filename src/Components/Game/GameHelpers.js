// Function to return a puzzle based on a signature of a puzzle
function toPuzzle(signature) {
	console.log('toPuzzle', signature)
}

// Function to return a string representation of a puzzle
function toSignature(puzzle) {
	console.log('toSignature', puzzle)
}

// Function to keep generating puzzles and solving them
// until a 'good' one is found - "Good" can vary
const findGoodPuzzle = () => {
	var count = 0,
		puzzle_found = false,
		new_puzzle,
		new_puzzle_answers,
		threshold = 10

	while (!puzzle_found) {
		count++
		console.log('Attemp #', count)

		if (count > 100) {
			threshold = 1
		}
		// new_puzzle = sanitizePuzzle(generatePuzzle())
		new_puzzle = generatePuzzle()
		new_puzzle_answers = generateAnswers(new_puzzle)

		// console.log('New Puzzle', new_puzzle)

		if (new_puzzle_answers.has_valid_ans) {
			var is_good =
				new_puzzle_answers.all_permutations / new_puzzle_answers.all_answers <=
				threshold
			// new_puzzle_answers.is_good && new_puzzle_answers.has_zero
			if (is_good && new_puzzle_answers.has_zero) {
				puzzle_found = true
			} else {
				// console.log(`${new_puzzle} => ${new_puzzle_answers.sunset.result}`)
			}
		}
	}

	return {
		puzzle: new_puzzle,
		answer: new_puzzle_answers,
	}

	// console.log(`Puzzle #${count} is a match!`)
	// console.warn('You have 2 mins to find the permutation that gives zero...')
	// setTimeout(() => console.log('Ready!'), 1 * 1000)
	// setTimeout(() => console.log('Set!'), 2 * 1000)
	// setTimeout(
	// 	() => console.log('Go!\nPuzzle', sanitizePuzzle(new_puzzle)),
	// 	3 * 1000
	// )
	// setTimeout(
	// 	() => console.log('The Answer is', new_puzzle_answers.sunset),
	// 	2 * 60 * 1000
	// )
}

// Function to generate puzzle answers
const generateAnswers = (puzzle) => {
	// 1. Find all permutations of the puzzle
	var puzzle_permutations = permutePuzzle(puzzle)
	// console.log(
	// 	`Puzzle => ${puzzle}\nGenerating ${puzzle_permutations.length} answers!`
	// )
	// console.log(`Second permuations of ${puzzle}: \n ${permutePuzzle(puzzle)[1]}`)

	if (puzzle_permutations === null) return null

	// 2. Solve all permutations of the puzzle
	var puzzle_answers = {}
	for (let iterator = 0; iterator < puzzle_permutations.length; ++iterator) {
		var solved_puzzle = solvePuzzle(puzzle_permutations[iterator])

		if (
			solved_puzzle.answer - Math.floor(solved_puzzle.answer) === 0 &&
			solved_puzzle.answer >= 0
		) {
			// make sure we only accept POSITIVE WHOLE numbers
			// console.log(
			// 	`Answer for ${solved_puzzle.puzzle} is: ${solved_puzzle.answer}`
			// )
			// puzzle_answers[solved_puzzle.answer] = solved_puzzle.puzzle
			let currentPermCount = 0

			if (puzzle_answers[solved_puzzle.answer]) {
				currentPermCount = puzzle_answers[solved_puzzle.answer].permutationCount
			}

			puzzle_answers[solved_puzzle.answer] = {
				puzzle: solved_puzzle.puzzle,
				permutationCount: currentPermCount + 1,
			}
		}
	}

	// 3. Return puzzle for sunset and sunrise
	var all_answers = Object.keys(puzzle_answers)
	var is_good_puzzle = puzzle_permutations.length / all_answers.length <= 5, // was 10 before
		sunset = {},
		sunrise = {}
	// if (is_good_puzzle) {
	// 	console.log(`At least 10% unique answers found (${all_answers.length})`)
	// } else {
	// 	console.log(`Found ${all_answers.length} unique valid answers!`)
	// }

	if (all_answers.length > 1) {
		var last_ans = all_answers.length - 1

		// console.log(
		// 	`Sunset is ${all_answers[0]} and answer is  ${
		// 		puzzle_answers[all_answers[0]]
		// 	}`
		// )

		sunset = {
			result: all_answers[0],
			// answer: puzzle_answers[all_answers[0]],
			answer: puzzle_answers[all_answers[0]].puzzle,
			permutationCount: puzzle_answers[all_answers[0]].permutationCount,
		}

		// console.log(
		// 	`Sunrise is ${all_answers[last_ans]} and answer is  ${
		// 		puzzle_answers[all_answers[last_ans]]
		// 	}`
		// )

		sunrise = {
			result: all_answers[last_ans],
			// answer: puzzle_answers[all_answers[last_ans]],
			answer: puzzle_answers[all_answers[last_ans]].puzzle,
			permutationCount: puzzle_answers[all_answers[last_ans]].permutationCount,
		}
	} else {
		return {
			has_valid_ans: false,
		}
		// console.log('No positive whole answers found.')
	}

	// console.log(
	// 	`The sunset is ${sunset.result} so has_zero is ${all_answers[0] == 0}`
	// )

	return {
		has_valid_ans: true,
		is_good: is_good_puzzle,
		all_permutations: puzzle_permutations.length,
		all_answers: all_answers.length,
		has_zero: all_answers[0] === 0,
		sunset: sunset,
		sunrise: sunrise,
	}
}

// Function to find all permutations of a puzzle
function permutePuzzle(input, perm_arr = [], used_cards = []) {
	var my_perm_arr = perm_arr,
		my_used_cards = used_cards,
		i,
		card

	if (input === null) return null

	for (i = 0; i < input.length; i++) {
		card = input.splice(i, 1)
		my_used_cards.push(card)
		if (input.length === 0) {
			my_perm_arr.push(my_used_cards.slice())
		}
		permutePuzzle(input, my_perm_arr, my_used_cards)
		input.splice(i, 0, card)
		my_used_cards.pop()
	}
	return my_perm_arr
}

// Helper function to make sure the puzzle is in the right format
function sanitizePuzzle(puzzle) {
	var clean_puzzle = []
	for (let i = 0; i < puzzle.length; ++i) {
		clean_puzzle.push(puzzle[i].toString())
	}
	return clean_puzzle
}

// Function to Solve any puzzle permutation
function solvePuzzle(puzzle_to_solve) {
	// console.log('\nPuzzle to Solve: ', puzzle)
	var puzzle = sanitizePuzzle(puzzle_to_solve)
	let my_puzzle_answer = 0
	for (let index = 0; index < puzzle.length; index++) {
		if (index === 0) {
			my_puzzle_answer = Number(puzzle[0].substring(1, puzzle[0].length))
		} else {
			var current_card = puzzle[index]
			var sign = current_card.charAt(0)
			var value = Number(current_card.substring(1, current_card.length))

			if (sign === '+') {
				my_puzzle_answer += value
			} else if (sign === '-') {
				my_puzzle_answer -= value
			} else if (sign === '*') {
				my_puzzle_answer *= value
			} else if (sign === '÷') {
				my_puzzle_answer /= value
			} else {
				return -1
			}
		}
	}
	// console.log(`Answer for ${puzzle} is: ${my_puzzle_answer}`)
	return { answer: my_puzzle_answer, puzzle: puzzle }
}

// Function to Generate the puzzle based on the length passed
function generatePuzzle(
	puzzle_length = 6,
	plusRange = { min: 1, max: 18 },
	minusRange = { min: 1, max: 18 },
	multRange = { min: 2, max: 12 },
	divRange = { min: 2, max: 12 }
) {
	// console.log('Generating Puzzle...')
	var puzzle = []
	// generate a list of all cards
	var all_arithmetic_cards = initArithmeticCards('+', plusRange)
		.concat(initArithmeticCards('÷', divRange))
		.concat(initArithmeticCards('-', minusRange))
		.concat(initArithmeticCards('*', multRange))

	for (let i = 0; i < puzzle_length; i++) {
		var randomIndex = Math.floor(Math.random() * all_arithmetic_cards.length)
		// console.log('Pushing ::: ', all_arithmetic_cards[randomIndex])
		puzzle.push(all_arithmetic_cards[randomIndex])
		all_arithmetic_cards.splice(randomIndex, 1)
	}

	// console.log('Puzzle.toString() => ', puzzle.toString())
	// console.log('Remaining Cards => ', all_arithmetic_cards)

	return puzzle.toString()
	// return ['+7', '+7', '+7', '+7', '+7', '+7']
}

// Function to generate cards
function initArithmeticCards(sign, range) {
	if (sign === '+') {
		return makeCards(sign, range.min, range.max)
	}

	if (sign === '-') {
		return makeCards(sign, range.min, range.max)
	}

	if (sign === '*') {
		return makeCards(sign, range.min, range.max)
	}

	if (sign === '÷') {
		return makeCards(sign, range.min, range.max)
	}

	return 'Please pass +, -, * or ÷ as the parameter'
}

// Returns an array of string
function makeCards(sign, min, max) {
	let card_list = []

	for (let i = min; i <= max; i++) {
		card_list.push(`${sign}${i}`)
	}
	return card_list
}

export {
	generatePuzzle,
	solvePuzzle,
	generateAnswers,
	findGoodPuzzle,
	toPuzzle,
	toSignature,
}
