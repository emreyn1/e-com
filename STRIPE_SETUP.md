# Stripe API Key Kurulum Rehberi

## .env vs .env.local Farkı

### .env
- **Genel ortam değişkenleri** için kullanılır
- Git'e commit edilebilir (genelde örnek değerlerle)
- Tüm ortamlar için geçerli

### .env.local
- **Yerel geliştirme** için özel değişkenler
- **Git'e commit edilmez** (.gitignore'da)
- `.env` dosyasındaki değerleri **geçersiz kılar** (override)
- **Güvenlik**: Gerçek API key'lerinizi buraya koyun

### Next.js Öncelik Sırası (yüksekten düşüğe):
1. `.env.local` (en yüksek öncelik)
2. `.env.development` veya `.env.production`
3. `.env`

## Stripe Key Kurulumu

1. `.env.local` dosyasını açın
2. Stripe Dashboard'dan aldığınız key'leri yapıştırın:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz...
STRIPE_SECRET_KEY=sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz...
```

### Önemli Notlar:
- ✅ Key'lerde **boşluk olmamalı**
- ✅ Key'lerde **tırnak işareti olmamalı** (sadece değer)
- ✅ Test key'ler `sk_test_` ve `pk_test_` ile başlamalı
- ✅ Dashboard'da **Test Mode** açık olmalı (sağ üstte toggle)

### Server'ı Yeniden Başlatın:
Environment variable'lar değiştiğinde mutlaka server'ı yeniden başlatın:
```bash
# Ctrl+C ile durdurun, sonra:
npm run dev
```

## Sorun Giderme

### "Invalid API key provided" hatası alıyorsanız:

1. ✅ Key'lerin başında/sonunda boşluk var mı kontrol edin
2. ✅ Test mode'da mı olduğunuzu kontrol edin
3. ✅ Server'ı yeniden başlattınız mı?
4. ✅ `.env.local` dosyasında doğru key'ler var mı?
5. ✅ Key'ler `sk_test_` ve `pk_test_` ile mi başlıyor?

### Test Kartları:
- Kart: `4242 4242 4242 4242`
- Tarih: Herhangi bir gelecek tarih
- CVC: `123`
- ZIP: `12345`
