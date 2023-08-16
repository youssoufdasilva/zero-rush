import React, { useState } from 'react'

import GameScreen from './Components/Game/Game'

import SimpleWelcomeScreen from './Components/WelcomeScreen'
import ConfirmPuzzle from './Components/ConfirmPuzzle'
import { generatePuzzle, generateAnswers } from './Components/Game/GameHelpers'

const App = () => {
	const [showWelcome, setShowWelcome] = useState(true)
	const [showGameSelect, setShowGameSelect] = useState(true)
	const [showGame, setShowGame] = useState(false)
	const [generatedPuzzle, setGeneratedPuzzle] = useState(null)
	const [generatedAnswers, setGeneratedAnswers] = useState(null)
	const [isRushing, setIsRushing] = useState(false)
	// const [rushCounter, setRushCounter] = useState(false)
	const [rushFound, setRushFound] = useState(false)
	const [searchHistory, setSearchHistory] = useState([])

	const startGame = () => {
		setShowGame(true)
		setShowWelcome(false)
	}

	/* 	const findGoodPuzzleWithZero = (limit = 100) => {
		setGeneratedPuzzle(null)
		setGeneratedAnswers(null)

		for (let i = 0; i < limit; ++i) {
			// if (stopRush) {
			// 	alert('breakkk')
			// 	break
			// }

			console.log('Attempt #', i)

			let my_puzzle_string = generatePuzzle()
			let my_answer_obj = generateAnswers(my_puzzle_string.split(','))

			if (my_answer_obj !== null && my_answer_obj.has_valid_ans) {
				// console.log('Checking ', my_answer_obj)

				let has_zero = my_answer_obj.sunset.result === '0'

				if (my_answer_obj.is_good && has_zero) {
					console.log('>  Good and has Zero Found at ', i)
					setGeneratedPuzzle(my_puzzle_string)
					setGeneratedAnswers(my_answer_obj)
					setRushFound(true)
					setIsRushing(false)
					break
				} else {
					console.log('Not Good Found at ', i)
					// setGeneratedPuzzle(my_puzzle_string)
					// setGeneratedAnswers(my_answer_obj)
					// break
				}
			}

			if (i === limit - 1) {
				searchPuzzle()
				setIsRushing(false)
				break
			}
		}
		// setStopRush(false)
	} */

	const searchPuzzle = (experiement = false) => {
		// console.log('Starting game...')
		setIsRushing(false)
		setRushFound(false)

		let my_puzzle_string

		if (experiement) {
			my_puzzle_string = generatePuzzle(
				4,
				{ min: 1, max: 9 }, //plusRange
				{ min: 1, max: 9 }, //minusRange
				{ min: 1, max: 9 }, //multRange
				{ min: 1, max: 9 } //divRange
			)
		} else {
			my_puzzle_string = generatePuzzle()
		}
		console.log('my_puzzle_string ', my_puzzle_string)
		setGeneratedPuzzle(my_puzzle_string)

		let my_answer_obj = generateAnswers(my_puzzle_string.split(','))
		console.log('my_answer_obj ', my_answer_obj)
		setGeneratedAnswers(my_answer_obj)

		let temp_history = searchHistory
		if (temp_history.length > 3) {
			temp_history.splice(0, 1)
		}
		temp_history.push({
			puzzle: generatedPuzzle,
			answers: generatedAnswers,
		})

		setSearchHistory(temp_history)
	}

	React.useEffect(() => {
		if (
			showWelcome &&
			searchHistory.length === 0 &&
			generatedPuzzle === null &&
			generatedAnswers === null
		) {
			searchPuzzle(true)
		}
	})

	return (
		// Welcome Screen
		<div className='w-full md:max-w-mdx mx-auto my-0 bg-purple-200x'>
			{/* WelcomeScreen */}
			<SimpleWelcomeScreen
				visible={showWelcome}
				search={() => {
					searchPuzzle(true)
				}}
				prevSearch={() => {
					let temp_history = searchHistory
					if (temp_history.length > 1) {
						const prevPuzzle = temp_history.pop()
						setGeneratedPuzzle(prevPuzzle.puzzle)
						setGeneratedAnswers(prevPuzzle.answers)
						setSearchHistory(temp_history)
					} else {
						searchPuzzle(true)
					}
					// temp_history.splice(temp_history.length - 1, 1)
				}}
				historyLength={searchHistory.length}
				toggleGameSelect={(value)=>{
					setShowGameSelect(value)
				}}
				// experiemtalSearch={() => {
				// 	searchPuzzle(true)
				// }}
				// rush={() => {
				// 	setIsRushing(true)
				// 	setTimeout(() => {
				// 		setGeneratedPuzzle(null)
				// 		findGoodPuzzleWithZero(10)
				// 	}, 100)
				// }}
				// isRushing={isRushing}
			>
				<React.Fragment>
					{/* {isRushing} */}
					{showGameSelect && <ConfirmPuzzle
						puzzle={generatedPuzzle}
						answers={generatedAnswers}
						start={() => {
							startGame()
						}}
						clear={() => {
							setGeneratedPuzzle(null)
							setGeneratedAnswers(null)
						}}
						isRushing={isRushing}
						rushFound={rushFound}
					/>}
				</React.Fragment>
			</SimpleWelcomeScreen>

			<GameScreen
				puzzle={generatedPuzzle}
				answers={generatedAnswers}
				visible={showGame}
				back={() => {
					setGeneratedPuzzle(null)
					setGeneratedAnswers(null)
					setShowWelcome(true)
					setShowGame(false)
				}}
				search={() => {
					searchPuzzle()
				}}
			/>
		</div>
	)
}

export default App
