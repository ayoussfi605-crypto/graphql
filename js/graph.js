export function cumulativeXP(transactions) {

    let total = 0;

    return transactions.map(transaction => {

        total += transaction.amount;

        return total;

    });

}
