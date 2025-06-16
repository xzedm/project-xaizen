"use client"

import { useState, useEffect } from 'react'
import { Button } from './ui/button';

const Timer = () => {

const defaultTime = 1500;
const [isRunning, setIsRunning] = useState(false);
const [timeLeft, setTimeLeft] = useState(defaultTime);

useEffect(() => {
    let timer = null;
  
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
  

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft]);

const formatTime = (seconds:number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

const stopTimer = () => {
    setIsRunning(prev => !prev);
}

const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(defaultTime);
}



  return (
    <div>
        <div className='flex flex-col justify-center items-center'>
            <div className='mb-8 flex justify-center items-center'>
                <Button className='px-4 py-2 mx-4 cursor-pointer'>Short Break</Button>
                <Button className='px-4 py-2 mx-4 cursor-pointer'>Long Break</Button>
            </div>
            <div className='text-9xl'>{formatTime(timeLeft)}</div>
            <div className='mt-8 flex justify-center items-center'>
                <Button className='px-4 py-2 mx-4 cursor-pointer hover:bg-white hover:text-black border border-black' onClick={stopTimer}>
                    {isRunning ? 'Pause' : 'Start'}
                </Button>
                <Button className='px-4 py-2 mx-4 cursor-pointer hover:bg-white hover:text-black border border-black' onClick={resetTimer}>
                    Reset
                </Button>
            </div>
    </div>
    </div>
  )
}

export default Timer
