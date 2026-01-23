import { FaChartPie, FaChartBar, FaCog } from 'react-icons/fa';

export const dashboardData = {
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