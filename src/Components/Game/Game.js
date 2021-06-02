import React from 'react'
// import { solvePuzzle } from './GameHelpers'

const GameScreen = (props) => {
	const { puzzle, answers, visible, back } = props

	// const [currentHand, setCurrentHand] = useState(puzzle)
	// const [currentHand, setCurrentHand] = useState([])
	// const [currentAttempt, setCurrentAttempt] = useState([])

	const currentHand = []

	let gridLength = currentHand ? currentHand.length : 1

	// if (visible && puzzle !== null && puzzle[0].length > 1) {
	if (visible && currentHand === []) {
		// if (currentHand === []) setCurrentHand(puzzle)

		console.log('Game Screen Puzzle: ', puzzle)
		console.log('Game Screen Answers: ', answers)
		// const solved_puzzle = solvePuzzle(puzzle)
		// console.log('solved_puzzle = ', solved_puzzle)
	}
	// if (visible) {
	// 	alert(`Puzzle for:  ${puzzle}
	// 				\nSunset for: ${answers.sunset.result}
	// 				\nSunrise for: ${answers.sunrise.result}
	// 				`)
	// }

	if (puzzle === null) {
		back()
		return null
	}

	const moveToAttempt = (card) => {
		console.log('Moving: ', card)
	}

	return (
		<div
			style={visible ? { display: 'flex' } : { display: 'none' }}
			className='h-screen flex-col justify-between items-center font-bold w-full bg-purple-200'
		>
			<TopBar
				back={() => {
					back()
				}}
				pause={() => {
					alert('pause game')
				}}
			/>

			<div
				className={`bg-red-400 grid grid-cols-${gridLength} gap-3 mb-4 border-white`}
			>
				{/* Hand */}
				{currentHand
					? currentHand.map((card) => {
							return (
								<div
									key={card}
									onClick={() => moveToAttempt(card)}
									className='bg-white p-4 rounded border-2'
								>
									{card}
								</div>
							)
					  })
					: null}
			</div>
		</div>
	)
}

const TopBar = (props) => {
	const { back, pause } = props

	return (
		<div className='w-full bg-purple-700 text-white rounded-b shadow-lg flex justify-between items-center p-2'>
			{/* Navbar */}
			<button
				onClick={() => {
					back()
				}}
				className='inline-block px-8 py-1 rounded bg-purple-500 text-white font-bold'
			>
				Back
			</button>

			<p>ZERO RUSH</p>
			<button
				onClick={() => {
					pause()
				}}
				className='inline-block px-8 py-1 rounded bg-purple-500 text-white font-bold'
			>
				00:00
			</button>
		</div>
	)
}

export default GameScreen
