// mongoose modulunu idxal edirik. 
// Bu modul MongoDB ilə əlaqə yaratmaq və verilənlər bazası əməliyyatları aparmaq üçün istifadə olunur.
import mongoose from 'mongoose';

// Yeni "favoriteSchema" şemasını yaradaraq, favori məlumatların necə saxlanılacağını təyin edirik.
const favoriteSchema = new mongoose.Schema({
    // "user" sahəsi: Hər bir favori sənədi müəyyən bir istifadəçiyə aiddir.
    user: {
        // Bu sahənin tipini "mongoose.Schema.Types.ObjectId" kimi təyin edirik.
        // Bu, MongoDB-də unikal identifikator (ObjectId) deməkdir.
        type: mongoose.Schema.Types.ObjectId,
        // "ref" sahəsi ilə, bu ObjectId-nin "User" modelinə referans verdiyini bildiririk.
        // Yəni, bu sahədə saxlanılan dəyər "User" kolleksiyasından olan sənədlərə istinad edir.
        ref: 'User',
        // "required: true" - Bu sahə mütləq doldurulmalıdır.
        required: true
    },
    // "products" sahəsi: İstifadəçinin favorilər siyahısında olan məhsulların siyahısını saxlayır.
    products: [{
        // Array daxilindəki hər bir element "mongoose.Schema.Types.ObjectId" tipində olacaq.
        // Bu, hər bir məhsulun unikal identifikatorudur.
        type: mongoose.Schema.Types.ObjectId,
        // "ref" ilə, bu ObjectId-nin "Product" modelinə referans verdiyini göstəririk.
        // Beləliklə, hər bir dəyər "Product" kolleksiyasından olan sənədlərə istinad edir.
        ref: 'Product'
    }]
}, {
    // Schema konfiqurasiya obyektidir.
    // "timestamps: true" - Bu seçim aktiv olduqda, Mongoose hər bir sənədə avtomatik olaraq 
    // "createdAt" (yaradılma vaxtı) və "updatedAt" (son yenilənmə vaxtı) sahələrini əlavə edir.
    timestamps: true
});

// Yaradılmış şema əsasında "Favorite" modelini yaradırıq və ixrac edirik.
// mongoose.model() metodu birinci parametr olaraq modelin adını ("Favorite"),
// ikinci parametr olaraq isə şemamızı (favoriteSchema) qəbul edir.
// Bu model vasitəsilə verilənlər bazasında "Favorite" kolleksiyası üzərində CRUD əməliyyatları aparmaq mümkün olacaq.
export default mongoose.model('Favorite', favoriteSchema);
