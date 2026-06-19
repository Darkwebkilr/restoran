/**
 * HTML5 Canvas tabanlı istemci taraflı resim sıkıştırma yardımcısı.
 * Herhangi bir npm paketi yüklemesi gerektirmeden çalışır.
 * 
 * @param file Sıkıştırılacak orijinal dosya
 * @param maxWidth Maksimum genişlik sınırı (varsayılan 1200px)
 * @param quality Sıkıştırma kalitesi (0.0 ile 1.0 arası, varsayılan 0.8)
 */
export async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Sadece resim dosyalarını kabul et
    if (!file.type.startsWith("image/")) {
      reject(new Error("Lütfen sadece resim dosyası seçin."));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Genişlik maksimum sınırı aşıyorsa en-boy oranını koruyarak yeniden boyutlandır
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context oluşturulamadı."));
          return;
        }

        // Resmi canvas üzerine çiz
        ctx.drawImage(img, 0, 0, width, height);

        // Canvas'ı sıkıştırılmış JPEG formatında Blob'a dönüştür
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Sıkıştırma sırasında Blob oluşturulamadı."));
            }
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = (err) => reject(new Error("Resim yüklenirken bir hata oluştu: " + err));
    };
    reader.onerror = (err) => reject(new Error("Dosya okunurken bir hata oluştu: " + err));
  });
}
