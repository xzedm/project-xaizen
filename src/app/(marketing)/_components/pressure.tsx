"use client";

import TextPressure from '../../../blocks/TextAnimations/TextPressure/TextPressure';

// Note:
// Make sure the font you're using supports all the variable properties. 
// React Bits does not take responsibility for the fonts used

export const Pressure = () => {
    return (
        <div style={{position: 'relative', height: '100px'}}>
            <TextPressure
                text="Boost Productivity!"
                flex={true}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={true}
                textColor="#000000"
                strokeColor="#ff0000"
                minFontSize={100}
            />
        </div>
    )
}
