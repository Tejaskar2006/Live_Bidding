

let serverTimeOffset = 0; // Difference between server time and client time


export function setServerTimeOffset(serverTimeISO) {
    const serverTime = new Date(serverTimeISO).getTime();
    const clientTime = Date.now();
    serverTimeOffset = serverTime - clientTime;
    console.log('⏰ Time offset set:', serverTimeOffset, 'ms');
}


export function getServerTime() {
    return new Date(Date.now() + serverTimeOffset);
}


export function getTimeRemaining(endTimeISO) {
    const endTime = new Date(endTimeISO).getTime();
    const currentServerTime = getServerTime().getTime();
    const remaining = endTime - currentServerTime;
    return Math.max(0, remaining);
}


export function formatTimeRemaining(ms) {
    if (ms <= 0) return 'Ended';

    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}
