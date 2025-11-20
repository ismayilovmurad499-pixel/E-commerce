// Mongoose modulunu idxal edirik.
// Bu modul MongoDB ilə əlaqə yaratmaq və verilənlər bazası əməliyyatları aparmaq üçün istifadə olunur.
import mongoose from 'mongoose';

// Yeni cart (səbət) şeması yaradılır.
// mongoose.Schema() metodu vasitəsilə verilənlər bazasında istifadə olunacaq sənəd strukturunu təyin edirik.
const cartSchema = new mongoose.Schema({
    // "user" sahəsi, istifadəçi məlumatlarını saxlayır.
    // Hər bir cart sənədi bir istifadəçiyə aiddir.
    user: {
        // type: Bu sahə MongoDB-də ObjectId tipində olacaq.
        // mongoose.Schema.Types.ObjectId – digər kolleksiyalara referans vermək üçün istifadə olunur.
        type: mongoose.Schema.Types.ObjectId,
        // ref: Bu sahənin hansı kolleksiyaya istinad etdiyini göstərir. Burada 'User' modelinə referans verilir.
        ref: 'User',
        // required: Bu sahənin mütləq doldurulması lazım olduğunu bildirir.
        required: true,
    },
    // "products" sahəsi, cart-dakı məhsulların siyahısını saxlayır.
    // Bu, array (siyahı) şəklində təşkil olunub.
    products: [
        {
            // Hər bir məhsul obyektinin "product" sahəsi:
            product: {
                // Hər bir məhsul ID-si MongoDB-də ObjectId tipində olacaq.
                type: mongoose.Schema.Types.ObjectId,
                // Bu sahə 'Product' modelinə referans verir, yəni məhsulun məlumatları həmin kolleksiyadan alınacaq.
                ref: 'Product',
                // Bu sahə doldurulmalıdır, çünki hər bir məhsulun cart-da mövcud olması vacibdir.
                required: true,
            },
            // "quantity" sahəsi, həmin məhsuldan neçə dənə olduğunu göstərir.
            quantity: {
                // Bu sahə nömrə (Number) tipində olacaq.
                type: Number,
                // Mütləq doldurulmalıdır.
                required: true,
                // Əgər heç bir dəyər verilməyibsə, default olaraq 1 təyin olunur.
                default: 1,
            }
        }
    ]
}, 
// Schema konfiqurasiya obyektidir. Burada əlavə seçimlər təyin edilir.
{ 
    // timestamps: true - Mongoose avtomatik olaraq hər bir sənədə "createdAt" və "updatedAt" sahələrini əlavə edir.
    // Bu sahələr sənədin yaradılma və son yenilənmə vaxtını göstərir.
    timestamps: true 
});

// Yaradılmış cart şemasından "Cart" adlı model yaradırıq.
// mongoose.model() metodu, birinci parametr olaraq modelin adını, ikinci parametr olaraq isə şeması qəbul edir.
// Bu model vasitəsilə cart kolleksiyası üzərində CRUD əməliyyatları həyata keçiriləcək.
export default mongoose.model('Cart', cartSchema);
