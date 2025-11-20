// Bu funksiya default olaraq ixrac edilir və üç parametr qəbul edir:
// - user: İstifadəçi obyekti (JWT token yaratmaq üçün istifadə olunur)
// - statusCode: HTTP cavab status kodu (məsələn, 200, 201 və s.)
// - res: Express-in HTTP cavab obyektidir (cavabı müştəriyə göndərmək üçün istifadə olunur)
export default (user, statusCode, res) => {
  
    // İstifadəçi obyektində mövcud olan "jwtTokeniEldeEt" metodunu çağıraraq JWT token yaradılır.
    // Bu metod, istifadəçinin identifikatoru və digər məlumatlardan token yaradır.
    const token = user.jwtTokeniEldeEt();

    // Yaradılmış token konsola yazılır (debug məqsədi ilə).
    console.log(token);

    // Cookie üçün seçimlər (options) obyektini yaradırıq.
    // Bu obyekt cookie-nin necə saxlanılacağını və müddətini təyin edir.
    const options = {
        // expires: Cookie-nin bitmə vaxtını təyin edir.
        // Date.now() cari vaxtın millisaniyə şəklində dəyərini qaytarır.
        // process.env.COOKIE_EXPIRES_TIME dəyəri (günlərlə) mühit dəyişənindən götürülür,
        // daha sonra 24*60*60*1000 ilə çarpılır ki, gün dəyəri millisaniyəyə çevrilsin.
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
        // httpOnly: true olsaydı, cookie yalnız server tərəfdən əldə edilə bilərdi (JavaScript vasitəsilə oxunmazdı).
        // Burada false təyin edilib, yəni cookie müştəri tərəfdə də əlçatan olacaq.
        httpOnly: false
    };

    // HTTP cavabı göndərilir:
    // 1. res.status(statusCode): Cavabın status kodunu təyin edir.
    // 2. .cookie("token", token, options): "token" adlı cookie yaradılır,
    //    dəyəri olaraq yaradılmış JWT token verilir və yuxarıda təyin olunmuş seçimlər tətbiq edilir.
    // 3. .json({ token, user }): Cavab JSON formatında göndərilir və müştəriyə token ilə birlikdə istifadəçi məlumatları təqdim olunur.
    res.status(statusCode).cookie("token", token, options).json({
        token,
        user
    });
};
