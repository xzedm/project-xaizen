"use client";

import TrueFocus from '@/blocks/TextAnimations/TrueFocus/TrueFocus';



export default function Focus() {
    return (
        <div className='mt-20'>
            <TrueFocus 
                sentence="True Focus"
                manualMode={true}
                blurAmount={5}
                borderColor="red"
                animationDuration={1}
                pauseBetweenAnimations={1}
            />
        </div>
    )
} 