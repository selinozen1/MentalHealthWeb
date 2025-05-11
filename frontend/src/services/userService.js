import { db } from '../config/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';

class UserService {
    constructor() {
        this.collectionRef = collection(db, 'users');
    }

    async createUser(userId, userData) {
        try {
            console.log('Firestore kayıt başlıyor...', { userId, userData });
            const userRef = doc(db, 'users', userId);
            await setDoc(userRef, {
                ...userData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            console.log('Firestore kayıt tamamlandı');
            return { id: userId, ...userData };
        } catch (error) {
            console.error("Kullanıcı oluşturma hatası:", error);
            throw new Error('Kullanıcı bilgileri kaydedilemedi: ' + error.message);
        }
    }

    async getAllUsers() {
        try {
            const querySnapshot = await getDocs(this.collectionRef);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Kullanıcıları getirme hatası:", error);
            throw error;
        }
    }

    async updateUser(userId, userData) {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, userData);
            return { id: userId, ...userData };
        } catch (error) {
            console.error("Kullanıcı güncelleme hatası:", error);
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            const userRef = doc(db, 'users', userId);
            await deleteDoc(userRef);
            return true;
        } catch (error) {
            console.error("Kullanıcı silme hatası:", error);
            throw error;
        }
    }
}

export default new UserService(); 