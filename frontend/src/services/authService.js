import { auth } from '../config/firebase';
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

class AuthService {
    async register(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Kullanıcı başarıyla oluşturuldu:', userCredential.user);
            return userCredential;
        } catch (error) {
            console.error("Kayıt hatası:", error);
            let errorMessage = 'Kayıt işlemi başarısız.';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Bu email adresi zaten kullanımda.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Geçersiz email adresi.';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Email/Password girişi devre dışı bırakılmış.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Şifre çok zayıf.';
                    break;
                default:
                    errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
            }
            
            throw new Error(errorMessage);
        }
    }

    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error("Giriş hatası:", error);
            let errorMessage = 'Giriş işlemi başarısız.';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'Kullanıcı bulunamadı.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Hatalı şifre.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Geçersiz email adresi.';
                    break;
                default:
                    errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
            }
            
            throw new Error(errorMessage);
        }
    }

    async logout() {
        try {
            await signOut(auth);
            return true;
        } catch (error) {
            console.error("Çıkış hatası:", error);
            throw error;
        }
    }

    onAuthStateChanged(callback) {
        return onAuthStateChanged(auth, callback);
    }
}

export default new AuthService(); 