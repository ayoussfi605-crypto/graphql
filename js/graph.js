export function cumulativeXP(transactions) {

    let total = 0;

    return transactions.map(transaction => {

        total += transaction.amount;

        return total;

    });

}


export function calculatePoints(xp) {

    const width = 640;
    const height = 300;

    const offsetX = 40;
    const offsetY = 20;
    const maxXP = Math.max(...xp);

    const point = [];

    xp.forEach((value, index) => {
        const x = offsetX + (index / (xp.length - 1)) * width;

        const y = offsetY + height - (value / maxXP) * height;

        point.push({ x, y });

    });
    console.log(point);

    return point;
}

export function pointsToString(points) {

    return points
        .map(point => `${point.x},${point.y}`)
        .join(" ");

}