import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, doc, getDoc, setDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportContext = createContext(null);

export const ReportProvider = ({ children }) => {
  const { user } = useAuth();
  
  // State'ler
  const [hasNotification, setHasNotification] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportMonthText, setReportMonthText] = useState(""); // Örn: "January 2025"

  // BİLDİRİM KONTROLÜ
  useEffect(() => {
    if (user) {
      const checkNotificationStatus = async () => {
        const today = new Date();
        
        // Geçen ayın tarihini hesapla
        const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        
        // Rapor Anahtarı (Veritabanı için ID): "2025-01" (Yıl-Ay)
        const currentReportKey = `${prevMonthDate.getFullYear()}-${prevMonthDate.getMonth() + 1}`;
        
        // Rapor İsmi (Kullanıcı için): "January 2025"
        const monthName = prevMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        setReportMonthText(monthName);

        try {
          // Firestore'dan kullanıcının ayarlarını çek
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          let lastSeenReportKey = "";
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            lastSeenReportKey = userData.lastSeenReport || "";
          }

          // KURAL: Eğer kullanıcının son gördüğü rapor, şu anki rapordan farklıysa BİLDİRİM GÖSTER.
          // Ay değiştiyse ve görmediyse her gün görsün.
          if (lastSeenReportKey !== currentReportKey) {
            setHasNotification(true);
          } else {
            setHasNotification(false);
          }

        } catch (error) {
          console.error("Error checking notification status:", error);
        }
      };

      checkNotificationStatus();
    }
  }, [user]);

  // PDF OLUŞTURMA
  const generateAndDownloadPDF = async () => {
    if (!user) return;
    setIsGenerating(true);

    try {
      const now = new Date();
      // Geçen Ayın 1'i
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      // Geçen Ayın Son Günü
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

      const monthName = startOfLastMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

      // Veritabanı Sorgusu
      const q = query(
        collection(db, "receipts"),
        where("userId", "==", user.uid),
        where("createdAt", ">=", startOfLastMonth),
        where("createdAt", "<=", endOfLastMonth),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const receipts = [];
      let totalSpent = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        receipts.push(data);
        totalSpent += Number(data.price) || 0;
      });

      if (receipts.length === 0) {
        alert(`No expenses found for ${monthName}. PDF cannot be generated.`);
        setIsGenerating(false);
        return;
      }

      // PDF Oluşturma
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.text("Monthly Expense Report", 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Period: ${monthName}`, 14, 32);
      doc.text(`Total Spent: $${totalSpent.toLocaleString(undefined, {minimumFractionDigits: 2})}`, 14, 38);

      const tableColumn = ["Date", "Description", "Type", "Amount"];
      const tableRows = [];

      receipts.forEach(receipt => {
        let dateStr = "N/A";
        if (receipt.createdAt && typeof receipt.createdAt.toDate === 'function') {
           dateStr = receipt.createdAt.toDate().toLocaleDateString();
        } else if (receipt.date) {
           dateStr = receipt.date;
        }

        const description = receipt.fileName || receipt.title || "No Description";
        const type = receipt.isManual ? "Manual Entry" : "Scanned Receipt";
        const price = `$${Number(receipt.price).toFixed(2)}`;

        tableRows.push([dateStr, description, type, price]);
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: 'striped',
        headStyles: { fillColor: [13, 110, 253] },
        styles: { fontSize: 10, cellPadding: 3 },
      });

      doc.save(`Expense_Report_${monthName.replace(/\s/g, '_')}.pdf`);

      // PDF indirilince okundu olarak işaretle
      markAsRead();

    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("An error occurred while generating the PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  // OKUNDU İŞARETLEME
  const markAsRead = async () => {
    if (!user) return;
    
    // UI'da kırmızıyı hemen kaldır
    setHasNotification(false);

    try {
      const today = new Date();
      // Geçen ayın anahtarı (Çünkü rapor geçen aya ait)
      const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const currentReportKey = `${prevMonthDate.getFullYear()}-${prevMonthDate.getMonth() + 1}`;

      // Firestore'a kaydet: "Kullanıcı bu raporu gördü"
      // 'users' koleksiyonu yoksa otomatik oluşur. 'merge: true' ile diğer verileri silmez.
      await setDoc(doc(db, "users", user.uid), {
        lastSeenReport: currentReportKey
      }, { merge: true });

    } catch (error) {
      console.error("Error marking report as read:", error);
    }
  };

  return (
    <ReportContext.Provider value={{ hasNotification, reportMonthText, isGenerating, generateAndDownloadPDF, markAsRead }}>
      {children}
    </ReportContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useReport = () => useContext(ReportContext);