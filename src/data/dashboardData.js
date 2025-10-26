import { FaChartPie, FaChartBar, FaCog } from 'react-icons/fa';

import scan1 from '../assets/scan1.jpg';
import scan2 from '../assets/scan2.jpg';
import scan3 from '../assets/scan3.jpg';
import scan4 from '../assets/scan4.jpg';
import scan5 from '../assets/scan5.jpg';
import scan6 from '../assets/scan6.jpg';
import scan7 from '../assets/scan7.jpg';

export const dashboardData = {
recentScans: [
    { id: 1, img: scan1, title: 'Grocery Shopping', price: 120.50, date: '2025-10-20' },
    { id: 2, img: scan2, title: 'Dinner Out', price: 75.00, date: '2025-10-21' },
    { id: 3, img: scan3, title: 'Clothing Purchase', price: 250.00, date: '2025-10-22' },
    { id: 4, img: scan4, title: 'Takeaway Pizza', price: 30.50, date: '2025-10-23' },
    { id: 5, img: scan5, title: 'Gas Station', price: 60.00, date: '2025-10-24' },
    { id: 6, img: scan6, title: 'Office Supplies', price: 45.20, date: '2025-10-25' },
    { id: 7, img: scan7, title: 'Coffee Shop', price: 15.75, date: '2025-10-26' },
  ],
  quickLinks: [
    { id: 1, icon: FaChartPie, title: 'Analyze Expenses', to: '/analyze' },
    { id: 2, icon: FaChartBar, title: 'View Reports', to: '/reports' },
    { id: 3, icon: FaCog, title: 'Settings', to: '/settings' },
  ],
  monthlySpending: [
    { id: 1, title: 'Total Spent', value: 445.50, isCurrency: true },
    { id: 2, title: 'Average Spend per Receipt', value: 148.50, isCurrency: true },
    { id: 3, title: 'Number of Receipts', value: 3, isCurrency: false },
  ]
};