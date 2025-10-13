export const allProducts = [
  {
    id: 1,
    name: 'Organic Bananas',
    purchaseCount: 3,
    latestPurchase: { price: 2.49, date: 'July 15, 2024', store: 'Fresh Foods Market' },
    priceComparison: { pricesByStore: [ { id: 's1', name: 'Fresh Foods Market', price: 2.49 }, { id: 's2', name: "Grocer's Outlet", price: 2.35 }, { id: 's3', name: 'SuperMart', price: 2.55 } ] },
    purchaseHistory: [ { id: 1, date: 'July 15, 2024', store: 'Fresh Foods Market', price: 2.49 }, { id: 2, date: 'June 20, 2024', store: 'Fresh Foods Market', price: 2.29 }, { id: 3, date: 'May 10, 2024', store: 'Fresh Foods Market', price: 2.19 } ],
  },
  {
    id: 2,
    name: 'Heirloom Tomatoes',
    purchaseCount: 5,
    latestPurchase: { price: 4.99, date: 'July 12, 2024', store: "Grocer's Outlet" },
    priceComparison: { pricesByStore: [ { id: 's1', name: 'Fresh Foods Market', price: 5.29 }, { id: 's2', name: "Grocer's Outlet", price: 4.99 }, { id: 's3', name: 'SuperMart', price: 5.15 } ] },
    purchaseHistory: [ { id: 1, date: 'July 12, 2024', store: "Grocer's Outlet", price: 4.99 }, { id: 2, date: 'June 15, 2024', store: 'Fresh Foods Market', price: 5.29 } ],
  },
  {
    id: 3,
    name: 'Avocado Hass',
    purchaseCount: 8,
    latestPurchase: { price: 1.99, date: 'July 14, 2024', store: 'SuperMart' },
    priceComparison: { pricesByStore: [ { id: 's1', name: 'Fresh Foods Market', price: 2.10 }, { id: 's2', name: "Grocer's Outlet", price: 2.05 }, { id: 's3', name: 'SuperMart', price: 1.99 } ] },
    purchaseHistory: [ { id: 1, date: 'July 14, 2024', store: 'SuperMart', price: 1.99 }, { id: 2, date: 'July 1, 2024', store: 'SuperMart', price: 2.05 } ],
  }
];

export const getProductById = (id) => {
  return allProducts.find(product => product.id === Number(id));
};