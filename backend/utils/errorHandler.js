// ErrorHandler sinifi JavaScript-in daxili Error sinifini genişləndirir.
// Bu sinif, xətaları daha strukturlaşdırılmış şəkildə idarə etmək üçün əlavə məlumatlar (məsələn, statusCode) əlavə edir.
class ErrorHandler extends Error {
    // Konstruktor funksiyası iki parametr qəbul edir:
    //   - message: Xəta mesajı (string tipində)
    //   - statusCode: HTTP status kodu (məsələn, 404, 500 və s.)
    constructor(message, statusCode) {
        // super(message) çağırışı ilə, valideyn sinif olan Error-in konstruktoru çağırılır və
        // message dəyəri Error obyektinə ötürülür.
        super(message);

        // İstifadəçi tərəfindən ötürülən statusCode dəyəri bu sinifin nümunəsinə (instance) əlavə edilir.
        this.statusCode = statusCode;

        // Error.captureStackTrace() metodu xətanın stack trace-ni (xəta baş verdiyi yerlərin siyahısını)
        // bu sinifin nümunəsinə əlavə edir.
        // Birinci parametr: 'this' – cari ErrorHandler obyektini təmsil edir.
        // İkinci parametr: this.constructor – cari konstruktor funksiyasını göstərir.
        // Bu, stack trace-nin ErrorHandler sinifindən başlayaraq göstərilməsini təmin edir.
        Error.captureStackTrace(this, this.constructor);
    }
}

// Yaradılmış ErrorHandler sinifini default olaraq ixrac edirik.
// Bu, digər modullarda bu sinifdən istifadə edərək xətaları idarə etməyə imkan verir.
export default ErrorHandler;
