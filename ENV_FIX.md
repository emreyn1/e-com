# .env.local Dosyası Düzeltme Rehberi

## ⚠️ ÖNEMLİ: Dosya Konumu

`.env.local` dosyası **mutlaka** şu konumda olmalı:
```
/Users/eceseckin/Desktop/e-com/e-com/.env.local
```

**YANLIŞ konumlar:**
- ❌ `/Users/eceseckin/Desktop/e-com/.env.local` (yanlış klasör)
- ❌ `e-com/.env.local` (yanlış klasör)

## ✅ Doğru Format

Dosyanız şu şekilde olmalı (gerçek key'lerinizle):

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
STRIPE_SECRET_KEY=sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
```

## 🔍 Kontrol Listesi

1. ✅ Dosya adı tam olarak `.env.local` (nokta ile başlıyor)
2. ✅ Dosya `/Users/eceseckin/Desktop/e-com/e-com/` klasöründe
3. ✅ Key'lerde **boşluk yok**
4. ✅ Key'lerde **tırnak işareti yok**
5. ✅ `your_secret_key_here` gibi placeholder değerler yok
6. ✅ Key'ler `sk_test_` ve `pk_test_` ile başlıyor
7. ✅ Dosyayı **kaydettiniz** (Cmd+S veya Ctrl+S)
8. ✅ **Server'ı yeniden başlattınız** (Ctrl+C sonra `npm run dev`)

## 🚨 Hala Çalışmıyorsa

1. Terminal'de şu komutu çalıştırın:
   ```bash
   cd /Users/eceseckin/Desktop/e-com/e-com
   cat .env.local
   ```

2. Eğer hala `your_secret_key_here` görüyorsanız:
   - Dosyayı tekrar açın
   - Gerçek key'leri yazın
   - **Kaydedin** (Cmd+S)
   - Server'ı **yeniden başlatın**

3. Next.js cache'i temizleyin:
   ```bash
   rm -rf .next
   npm run dev
   ```

## 📝 Stripe Key'leri Nereden Alınır?

1. https://dashboard.stripe.com/test/apikeys
2. Sağ üstte **Test mode** açık olmalı
3. **Publishable key** ve **Secret key** kopyalayın
4. `.env.local` dosyasına yapıştırın

