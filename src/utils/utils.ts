export const calculateAngleBetweenPlatforms = (x1: number, y1: number, x2: number, y2: number, doi: number) => {
    const deltaY = y2 - y1;
    const deltaX = x2 - x1;
    const huyen = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angleInRadians = Math.sin(doi / huyen);
    const angleInDegrees = (angleInRadians * 180) / Math.PI;
    return angleInDegrees;
}

export const calculateDistanceBetweenPlatforms = (x1: number, y1: number, x2: number, y2: number) => {
    const deltaY = y2 - y1;
    const deltaX = x2 - x1;
    const ke = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    return ke;
}