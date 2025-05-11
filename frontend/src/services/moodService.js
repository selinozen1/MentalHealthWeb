import { db } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, orderBy, limit, Timestamp } from 'firebase/firestore';

const moodService = {
    async saveDailyMood(userId, moodData) {
        try {
            if (!userId) {
                throw new Error('Kullanıcı ID gerekli');
            }

            const moodsRef = collection(db, 'moods');
            
            // Bugünün başlangıcını ve sonunu hesapla
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            // Bugün için kayıt var mı kontrol et
            const q = query(
                moodsRef,
                where('userId', '==', userId),
                where('created', '>=', Timestamp.fromDate(today)),
                where('created', '<', Timestamp.fromDate(tomorrow))
            );

            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                // Bugün için kayıt varsa güncelle
                const moodDoc = querySnapshot.docs[0];
                const updatedData = {
                    mood: moodData.mood,
                    activities: moodData.activities,
                    dailyData: moodData.dailyData,
                    updatedAt: Timestamp.now()
                };

                await updateDoc(doc(db, 'moods', moodDoc.id), updatedData);
                return { 
                    id: moodDoc.id,
                    ...updatedData,
                    userId,
                    created: moodDoc.data().created
                };
            }

            // Yeni kayıt oluştur
            const newMoodData = {
                ...moodData,
                userId,
                created: Timestamp.now(),
                updatedAt: Timestamp.now()
            };

            const docRef = await addDoc(moodsRef, newMoodData);
            return { 
                id: docRef.id,
                ...newMoodData
            };

        } catch (error) {
            console.error('Mood kaydetme hatası:', error);
            throw new Error('Duygu durumu kaydedilemedi: ' + error.message);
        }
    },

    async getTodaysMood(userId) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
    
            const moodsRef = collection(db, 'moods');
            const q = query(
                moodsRef,
                where('userId', '==', userId),
                where('created', '>=', Timestamp.fromDate(today)),
                where('created', '<', Timestamp.fromDate(tomorrow)),
                limit(1)
            );
    
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                console.log('Bugün için mood kaydı yok.');
                return null;
            }
    
            const moodDoc = querySnapshot.docs[0];
            return { id: moodDoc.id, ...moodDoc.data() };
        } catch (error) {
            console.error('Mood getirme hatası:', error);
            throw new Error('Günlük duygu durumu getirilemedi. Lütfen tekrar deneyin.');
        }
    },

    async getWeeklyMoods(userId) {
        try {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            weekAgo.setHours(0, 0, 0, 0);

            const moodsRef = collection(db, 'moods');
            const q = query(
                moodsRef,
                where('userId', '==', userId),
                where('created', '>=', Timestamp.fromDate(weekAgo)),
                orderBy('created', 'desc')
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Haftalık mood getirme hatası:', error);
            throw new Error('Haftalık veriler getirilemedi. Lütfen tekrar deneyin.');
        }
    },

    async updateActivities(moodId, moodData) {
        try {
            const moodRef = doc(db, 'moods', moodId);
            await updateDoc(moodRef, {
                mood: moodData.mood,
                activities: moodData.activities,
                dailyData: moodData.dailyData,
                updatedAt: Timestamp.now()
            });
            return { id: moodId, ...moodData };
        } catch (error) {
            console.error('Aktivite güncelleme hatası:', error);
            throw new Error('Aktiviteler güncellenemedi. Lütfen tekrar deneyin.');
        }
    },

    async updateDailyData(moodId, dailyData) {
        try {
            const moodRef = doc(db, 'moods', moodId);
            await updateDoc(moodRef, {
                dailyData,
                updatedAt: Timestamp.now()
            });
            return true;
        } catch (error) {
            console.error('Günlük veri güncelleme hatası:', error);
            throw new Error('Günlük veriler güncellenemedi. Lütfen tekrar deneyin.');
        }
    }
};

export default moodService; 