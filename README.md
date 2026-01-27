🛠️ Kullanılan Teknolojiler ve Kütüphaneler

Bu proje, modern web geliştirme standartlarına uygun olarak aşağıdaki teknoloji yığını (Tech Stack) ile geliştirilmiştir.

⚛️ Çekirdek (Core)

React: Kullanıcı arayüzü oluşturmak için kullanılan JavaScript kütüphanesi.

Vite: Hızlı ve modern frontend geliştirme aracı (Build tool).

React Router DOM: Sayfalar arası geçiş ve yönlendirme (SPA) yönetimi.

🔥 Backend & Bulut Hizmetleri (Firebase)

Authentication: Kullanıcı kayıt, giriş ve güvenli oturum yönetimi.

Cloud Firestore: NoSQL tabanlı, gerçek zamanlı veritabanı (Fiş ve harcama verileri için).

Cloud Storage: Kullanıcıların yüklediği fiş görsellerinin güvenli depolanması.

🎨 Tasarım & UI

Bootstrap 5: Responsive (mobil uyumlu) ve modern arayüz tasarımı (Grid sistemi, Kartlar).

Uiverse.io: Projedeki özel buton animasyonları (Pulse, Logout, Add, Save butonları) için CSS kaynakları.

React Icons: Uygulama genelinde kullanılan vektörel ikonlar.

Framer Motion: Sadece ViewReports sayfasındaki kart geçiş animasyonları için kullanılmıştır.

CSS3 & Custom Styles: Karanlık mod (Dark Mode) entegrasyonu.

📊 Veri & İşlevsellik

Recharts: Harcama analizleri için dinamik grafikler (Area Chart, Bar Chart).

React Dropzone: Fiş yükleme alanında sürükle-bırak (drag & drop) desteği.

Tesseract.js: Tarayıcı tabanlı OCR (Optik Karakter Tanıma) ile resimden otomatik fiyat okuma.

jsPDF: Aylık harcama raporlarını otomatik PDF olarak oluşturma.

⚙️ Mimari Yaklaşım

Context API: Global durum yönetimi (AuthContext, ThemeContext, ReportContext).

Hooks: useState, useEffect gibi React kancalarının etkin kullanımı.

Hibrit Veri Yapısı: Hem dosya tabanlı (resim) hem metin tabanlı (manuel) veri girişini destekler.
