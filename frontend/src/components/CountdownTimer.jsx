import { useState, useEffect } from 'react';
import { getTimeRemaining, formatTimeRemaining } from '../utils/timeSync';

function CountdownTimer({ endTime }) {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        // Update immediately
        const updateTimer = () => {
            const remaining = getTimeRemaining(endTime);
            setTimeLeft(formatTimeRemaining(remaining));
        };

        updateTimer();

        // Update every second
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [endTime]);

    return (
        <div className="countdown-timer">
            <span className={timeLeft === 'Ended' ? 'ended' : ''}>
                {timeLeft}
            </span>
        </div>
    );
}

export default CountdownTimer;
