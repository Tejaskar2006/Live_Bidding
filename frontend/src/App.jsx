import { useEffect, useState } from 'react';
import AuctionDashboard from './components/AuctionDashboard';
import Analytics from './components/Analytics';
import socket from './utils/socket';
import { setServerTimeOffset } from './utils/timeSync';
import './styles/index.css';

function App() {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        socket.on('SERVER_TIME', (data) => {
            console.log('Received server time:', data.serverTime);
            setServerTimeOffset(data.serverTime);
        });

        socket.on('connect', () => {
            setUserId(socket.id);
        });

        return () => {
            socket.off('SERVER_TIME');
            socket.off('connect');
        };
    }, []);

    return (
        <div className="app">
            <Analytics userId={userId} />
            <AuctionDashboard userId={userId} />
        </div>
    );
}

export default App;
