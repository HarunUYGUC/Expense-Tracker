import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaArrowUp, FaChartPie, FaCalendarAlt } from 'react-icons/fa';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

function AnalyzeExpenses() {
  const { user } = useAuth();
  
  // --- STATE'LER ---
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]); 
  const [categoryData, setCategoryData] = useState([]); 
  const [totalSpent, setTotalSpent] = useState(0); 

  // Filtreleme State'leri
  const [timeRange, setTimeRange] = useState('this_year'); // Varsayılan: Bu Yıl
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Etiket Yardımcısı
  const getRangeLabel = () => {
    switch (timeRange) {
      case 'this_month': return 'This Month';
      case 'last_3_months': return 'Last 3 Months';
      case 'this_year': return 'This Year';
      case 'all_time': return 'All Time';
      default: return 'This Year';
    }
  };
  
  // --- VERİ ÇEKME VE İŞLEME ---
  useEffect(() => {
    if (user) {
      setLoading(true);

      // Tarih Filtresi Hesaplama
      const now = new Date();
      let startDate = null;

      if (timeRange === 'this_month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (timeRange === 'last_3_months') {
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3);
      } else if (timeRange === 'this_year') {
        startDate = new Date(now.getFullYear(), 0, 1);
      }
      // 'all_time' için startDate null kalır

      // Sorguyu Oluştur
      let q;
      if (startDate) {
        q = query(
            collection(db, "receipts"),
            where("userId", "==", user.uid),
            where("createdAt", ">=", startDate), // Tarih filtresi
            orderBy("createdAt", "asc")
        );
      } else {
        // All Time
        q = query(
            collection(db, "receipts"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "asc")
        );
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const monthlyMap = {};
        const categoryMap = {};
        let total = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();
          const price = Number(data.price) || 0;
          total += price;

          // 1. AYLIK GRUPLAMA
          let monthName = "Unknown";
          if (data.createdAt && data.createdAt.toDate) {
            const date = data.createdAt.toDate();
            // Grafik için Ay-Yıl formatı (Örn: Jan 24) daha açıklayıcı olabilir
            // Ama şimdilik sadece Ay ismi (Jan) yeterli
            monthName = date.toLocaleString('default', { month: 'short' });
          }
          
          if (!monthlyMap[monthName]) monthlyMap[monthName] = 0;
          monthlyMap[monthName] += price;

          // 2. KATEGORİ GRUPLAMA
          if (data.isManual && data.items && Array.isArray(data.items)) {
            data.items.forEach(item => {
              const type = item.type || "Other";
              const itemPrice = Number(item.price) || 0;
              
              if (!categoryMap[type]) categoryMap[type] = 0;
              categoryMap[type] += itemPrice;
            });
          } else {
            if (!categoryMap["Scanned"]) categoryMap["Scanned"] = 0;
            categoryMap["Scanned"] += price;
          }
        });

        const formattedChartData = Object.keys(monthlyMap).map(key => ({
          name: key,
          amount: monthlyMap[key]
        }));

        const formattedCategoryData = Object.keys(categoryMap).map(key => ({
          name: key,
          amount: categoryMap[key]
        }));

        setChartData(formattedChartData);
        setCategoryData(formattedCategoryData);
        setTotalSpent(total);
        setLoading(false);

      }, (error) => {
        console.error("Error analyzing expenses:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user, timeRange]); // timeRange değişince sorguyu tekrar çalıştır

  const formatCurrency = (value) => {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="dashboard-page-wrapper p-4">
      <div className="container-fluid">

        {/* ----- BÖLÜM 1: HEADER & FİLTRELER ----- */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5">
          <div className="mb-3 mb-md-0">
            <h1 className="display-6 fw-bold">Expense Analysis</h1>
            <p className="text-muted">Real-time insights from your database.</p>
          </div>
          
          {/* FİLTRE DROPDOWN */}
          <div className="position-relative">
            <button 
                className="btn btn-outline-secondary d-flex align-items-center bg-white"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {getRangeLabel()} <FaChevronDown className="ms-2 small" />
            </button>
            
            {/* Dropdown Menüsü */}
            {isDropdownOpen && (
                <div className="card position-absolute end-0 mt-2 shadow-sm border-0" style={{ zIndex: 1000, minWidth: '150px' }}>
                    <div className="list-group list-group-flush">
                        <button className="list-group-item list-group-item-action" onClick={() => { setTimeRange('this_month'); setIsDropdownOpen(false); }}>This Month</button>
                        <button className="list-group-item list-group-item-action" onClick={() => { setTimeRange('last_3_months'); setIsDropdownOpen(false); }}>Last 3 Months</button>
                        <button className="list-group-item list-group-item-action" onClick={() => { setTimeRange('this_year'); setIsDropdownOpen(false); }}>This Year</button>
                        <button className="list-group-item list-group-item-action" onClick={() => { setTimeRange('all_time'); setIsDropdownOpen(false); }}>All Time</button>
                    </div>
                </div>
            )}
          </div>

        </div>

        {/* YÜKLENİYORSA */}
        {loading && (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        )}

        {!loading && (
            <>
                {/* ----- BÖLÜM 2: GRAFİKLER ----- */}
                <div className="row mb-5">
                
                {/* SOL GRAFİK: Spending Over Time */}
                <div className="col-lg-8 mb-4 mb-lg-0">
                    <div className="card border-0 shadow-sm h-100 card-accent">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                             <div>
                                <h5 className="card-title fw-bold mb-1">Spending Over Time</h5>
                                <p className="text-muted small mb-0">Breakdown for: <strong>{getRangeLabel()}</strong></p>
                             </div>
                             <div className="bg-primary-subtle p-2 rounded text-primary">
                                 <FaCalendarAlt />
                             </div>
                        </div>
                        
                        <div className="d-flex align-items-baseline mb-4">
                            <h2 className="fw-bold me-3 mb-0">${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                            <span className="text-success fw-medium d-flex align-items-center">
                                <FaArrowUp className="me-1 small" /> Total Selected
                            </span>
                        </div>

                        {/* Grafik Alanı */}
                        <div style={{ width: '100%', height: 300 }}>
                            {chartData.length > 0 ? (
                                <ResponsiveContainer>
                                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#0d6efd" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6c757d'}} />
                                    <YAxis hide={true} />
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'var(--bs-body-bg)', borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ color: 'var(--bs-body-color)' }}
                                        formatter={(value) => [formatCurrency(value), "Amount"]} 
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#0d6efd" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                                    No data available for this period.
                                </div>
                            )}
                        </div>
                    </div>
                    </div>
                </div>

                {/* SAĞ GRAFİK: Spending by Category */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                             <div>
                                <h5 className="card-title fw-bold mb-1">By Category</h5>
                                <p className="text-muted small mb-0">Where your money goes</p>
                             </div>
                             <div className="bg-info-subtle p-2 rounded text-info-emphasis">
                                 <FaChartPie />
                             </div>
                        </div>

                        <div style={{ width: '100%', height: 300 }}>
                            {categoryData.length > 0 ? (
                                <ResponsiveContainer>
                                    <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                                        <XAxis type="number" hide={true} />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{fontSize: 12, fill: '#6c757d'}} />
                                        <Tooltip 
                                            cursor={{fill: 'transparent'}} 
                                            contentStyle={{ borderRadius: '8px' }} 
                                            formatter={(value) => [formatCurrency(value), "Amount"]} 
                                        />
                                        <Bar dataKey="amount" fill="#0d6efd" radius={[0, 4, 4, 0]} barSize={20}>
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0d6efd' : '#6610f2'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                                    No category data.
                                </div>
                            )}
                        </div>
                    </div>
                    </div>
                </div>
                </div>

                {/* ----- BÖLÜM 3: BASİT ANALİZ TABLOSU ----- */}
                <div className="mb-5">
                <h3 className="h4 fw-bold mb-4">Category Breakdown</h3>
                <div className="card border-0 shadow-sm">
                    <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="table-light">
                        <tr>
                            <th scope="col" className="ps-4 py-3 text-muted fw-normal">Category</th>
                            <th scope="col" className="py-3 text-muted fw-normal text-end pe-4">Total Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categoryData.map((item, index) => (
                            <tr key={index}>
                                <td className="ps-4 fw-bold">{item.name}</td>
                                <td className="text-end pe-4 fw-medium">${item.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                         {categoryData.length === 0 && (
                            <tr><td colSpan="2" className="text-center py-4 text-muted">No data found.</td></tr>
                        )}
                        </tbody>
                    </table>
                    </div>
                </div>
                </div>
            </>
        )}

      </div>
    </div>
  );
}

export default AnalyzeExpenses;