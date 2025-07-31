export function millisToMinutesAndSeconds(millis: number): string {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return seconds === 60
        ? (minutes + 1).toString() + ':00'
        : minutes.toString() +
              ':' +
              (seconds < 10 ? '0' : '') +
              seconds.toString();
}
