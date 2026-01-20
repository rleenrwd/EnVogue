const parseTimeToMinutes = (timeStr) => {
    //Makes sure argument is a str, splits it to arr of strings, and converts each element to a number
    const [h, m] = String(timeStr).trim().split(':').map(Number); 
    if (Number.isNaN(h) || Number.isNaN(m)) return null; // Makes sure h and m are a valid number
    if (h < 0 || h > 23 || m < 0 || m > 59) return null; // Enforces valid time range hours: 0-23, mins: 0-59
    return h * 60 + m; // converts a time into minutes from midnight

}

const minutesToTime = (mins) => {
    if (!Number.isFinite(mins) || mins < 0) return null;
    const h = Math.floor(mins/60);
    const m = mins % 60;
    const hh = String(h).padStart(2, '0'); // Ensures this is at least 2 characters adding 0 on left if needed
    const mm = String(m).padStart(2, '0');
    return `${hh}:${mm}`;
}

const generateAvailStartTimes = ({ storeOpenMin, storeCloseMin, serviceDurationBlockMins, stepMinutes}) => {
    const latestStart = storeCloseMin - serviceDurationBlockMins;
    const startTimes = [];
    for (let t = storeOpenMin; t <= latestStart; t+= stepMinutes) {
        startTimes.push(t);
    }
    return startTimes;
}

module.exports = {
    parseTimeToMinutes,
    minutesToTime,
    generateAvailStartTimes
}