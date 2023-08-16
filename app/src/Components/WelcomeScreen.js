import React, {useState} from 'react';
import HowTo from './HowTo';

// const WelcomeScreen = (props) => {
// 	const { visible, search, experiemtalSearch, rush, isRushing, children } =
// 		props

// 	return (
// 		<div
// 			style={visible ? { display: 'flex' } : { display: 'none' }}
// 			className='h-screen flex-col justify-center items-center font-bold bg-purple-200'
// 		>
// 			<p className='text-3xl'>Welcome to</p>
// 			<p className='text-4xl'>ZERO RUSH!</p>
// 			<div>
// 				<button
// 					onClick={() => {
// 						experiemtalSearch()
// 					}}
// 					className={
// 						!isRushing
// 							? 'm-4 px-4 py-2 rounded-full bg-purple-800 text-white font-bold'
// 							: 'hidden'
// 					}
// 				>
// 					?
// 				</button>

// 				<button
// 					onClick={() => {
// 						search()
// 					}}
// 					className={
// 						!isRushing
// 							? 'mt-4 px-8 py-2 rounded bg-purple-800 text-white font-bold'
// 							: 'hidden'
// 					}
// 				>
// 					Random Puzzle
// 				</button>

// 				<button
// 					onClick={() => {
// 						rush()
// 					}}
// 					className={
// 						!isRushing
// 							? `mt-4 ml-4 px-2 py-2 rounded-full bg-purple-800 text-white font-bold`
// 							: 'hidden'
// 					}
// 				>
// 					Rush
// 				</button>
// 			</div>
// 			{children}
// 		</div>
// 	)
// }

const SimpleWelcomeScreen = (props) => {
	const { visible, search, prevSearch, historyLength, toggleGameSelect, children } = props

	const [searchText, setSearchText] = useState('')
    const [showHowTo, setShowHowTo] = useState(false)


	React.useEffect(() => {
		if (historyLength > 0) {
			let temp_search_text = ''
			for (let i = 0; i < historyLength - 1; i++) {
				temp_search_text += '<'
			}
			setSearchText(temp_search_text)
		}
	}, [historyLength])

	return (
		<div
			style={visible ? { display: 'flex' } : { display: 'none' }}
			className='h-screen flex-col justify-center items-center font-bold bg-purple-200 w-fullx md:max-w-md mx-auto my-0 '
		>
			<p className='text-3xl'>Welcome to</p>
			<p className='text-4xl'>OVERZERO!</p>

			<div className='m-6 p-2 bg-gray-700 text-white rounded' 
            	onClick={()=>{
					toggleGameSelect(showHowTo)
				setShowHowTo(!showHowTo)}}
			>
                {showHowTo ? 'Close Rules' : "How To Play" }
            </div>

            {showHowTo && <div style={{height: "calc(100vh / 2)", overflowY: "auto"}}><HowTo/></div>} 

			{!showHowTo && <div>
				<button
					onClick={() => {
						search()
					}}
					className={
						'mt-4 px-8 py-2 rounded bg-purple-800 text-white font-bold'
					}
				>
					Search Puzzle
				</button>

				<button
					onClick={() => {
						prevSearch()
					}}
					className={
						historyLength <= 1
							? 'hidden'
							: 'ml-2 px-4 py-2 rounded-full bg-purple-800 text-white text-xs font-bold'
					}
				>
					{searchText}
				</button>
			</div>}
			{children}
		</div>
	)
}

export default SimpleWelcomeScreen;