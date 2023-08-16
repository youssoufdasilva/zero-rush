import React from 'react'

const HowTo = (props) => {
 return (
    <div className='bg-purple-100 mx-4 smx-auto rounded'>
        <div className='m-4 text-center hidden'>
                    <p className='text-xl'>Get 6 chances to guess</p>
                    <p className='text-xl'>the lowest and highest</p>
                    <p className='text-xl'>numbers</p>
                </div>
        <div className='text-center font-normal'>
            <h1 className='m-2 text-2xl hidden'>How to Play</h1>

            <p className='mt-2 text-2xl-'>
                You will be dealt a hand of 4 or more cards. 
            </p>
            <p className='m-2- text-2xl-'>
                Each card has a symbol (+, -, x, ÷) and a number (from 1 to 9).
            </p>
            <p className='m-2 text-2xl-'>
                The goal is to arrange the cards in the right order to make
                <strong> the target numbers</strong>.
            </p>
            <p className='m-2 text-2xl-'>
                The target numbers are
                <strong> the <span className='bg-blue-600 round-full px-1 text-white font-bold'>lowest</span> 
                {' '} and the <span className='bg-green-600 round-full px-1 text-white font-bold'>highest</span> 
                 {' '} positive whole number </strong> that can be created by any arrangement of the hand.
            </p>
            <p className='m-2 text-2xl-'>
                You can choose to find either the <span className='bg-blue-600 round-full px-1 text-white font-bold'>lowest</span> 
                {' '} or the <span className='bg-green-600 round-full px-1 text-white font-bold'>highest</span> 
                 {' '} first, but <strong>both must be found</strong> to complete the round.
            </p>
            <p className='m-2 text-2xl-'>
                The number <strong>0 is allowed</strong>, but <strong>no negative numbers or decimals.</strong>
            </p>
            <p className='m-2 text-2xl-'>
                <strong>Ignore the symbol</strong> on the first card you use. 
                It doesn't matter which card you choose but <strong>you can only use each card one time.</strong>
            </p>
            <p className='m-2- text-2xl-'>
                After finding the target numbers, 
                <strong> new cards are drawn for the next round.</strong>
            </p>
            <p className='m-2 text-xl font-semibold'>Creating Combinations</p>

            <p className='m-2 text-2xl-'>
                Use the symbols and numbers on the remaining cards to create an equation.
            </p>
            <p className='mt-2 text-2xl-'>
                For example, if your cards are: {' '}
                <strong> x6 ÷4 -3 +3 </strong>
            </p>
            <p className='text-2xl-'>
                You could arrange them as: {' '}
                <strong> 3 -3 ÷4 x6 = 0 </strong>
            </p>
            <p className='text-sm-'>
                This makes the number 0, so you found the right order for the 
                <strong> <span className='bg-blue-600 round-full px-1 text-white font-bold'>lowest</span> 
                {' '} possible answer!</strong>
            </p>
            <p className='mt-2 text-2xl-'>
                You could also arrange them as: {' '}
                <strong> 4 +3 x6 -3 = 39 </strong>
            </p>
            <p className='m-2- text-2xl-'>
                This makes the number 39, so you found the right order for the 
                <strong> <span className='bg-green-600 round-full px-1 text-white font-bold'>highest</span> 
                {' '} possible answer!</strong>
            </p>

            {/* <p className='m-2 text-2xl-'>Tip</p> */}
            <p className='m-2 text-2xl-'>
            <strong>TIP:</strong> As shown in the example, multiplying and dividing by 0 are excellent ways to find the lowest possible number.
            </p>
            <p className='m-2 text-2xl-'>
            To find the highest, try doing all your additions before multiplying and doing your substractions after.
            </p>


                {/* You will be dealt a hand of 4 or more cards. Each card has an arithmetic symbol (+, -, x, ÷) and a number from 1-9.

                The goal is to arrange the cards in the right order to make the lowest or highest positive whole number.

                The number 0 is allowed, but no negative numbers or decimals.

                Ignore the symbol on the first card you use. It doesn't matter which card you choose.

                Use the symbols and numbers on the remaining cards to create an equation.

                For example, if your cards are:
                x 6 ÷ 4 - 3 + 3

                You could arrange them as:
                4 - 3 ÷ 2 x 6 = 0

                This makes the number 0, so you found the right order for the lowest possible answer!

                Or you could arrange them:

                4 + 3 x 7 - 3 = 39

                This order makes the number 39, the highest possible answer with these cards.

                Keep re-ordering your cards to find a combination that equals a positive whole number, either the lowest or highest you can make. */}
        </div>
    </div>
 )
}

export default HowTo;