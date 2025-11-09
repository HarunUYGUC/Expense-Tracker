export const allStores = [
  {
    id: 1,
    name: 'SuperMart',
    address: '123 Market Street, Anytown, USA 12345',
    stats: {
      avgSpend: 45.82,
      avgSpendChange: 2.5,
      totalSpent: 1237.14,
      visitCount: 27,
      mostFrequentItem: 'Organic Milk'
    },
    purchases: [
      { id: 1, date: 'Oct 28, 2023', receiptId: '#8A3F-239B', items: 12, total: 52.14 },
      { id: 2, date: 'Oct 21, 2023', receiptId: '#7C1E-942C', items: 8, total: 38.99 },
      { id: 3, date: 'Oct 15, 2023', receiptId: '#6B9D-115A', items: 15, total: 61.05 },
      { id: 4, date: 'Oct 07, 2023', receiptId: '#5A8C-347F', items: 5, total: 29.50 },
      { id: 5, date: 'Sep 30, 2023', receiptId: '#497B-671D', items: 21, total: 88.23 },
    ]
  },
  {
    id: 2,
    name: 'Fresh Foods Market',
    address: '456 Green Avenue, Veggie City, USA 67890',
    stats: {
      avgSpend: 62.10,
      avgSpendChange: -1.2,
      totalSpent: 850.50,
      visitCount: 14,
      mostFrequentItem: 'Avocados'
    },
    purchases: [
      { id: 1, date: 'Nov 01, 2023', receiptId: '#1A2B-3C4D', items: 10, total: 65.00 },
      { id: 2, date: 'Oct 25, 2023', receiptId: '#5E6F-7G8H', items: 7, total: 45.50 },
    ]
  }
];

export const getStoreById = (id) => {
  return allStores.find(store => store.id === Number(id));
};
