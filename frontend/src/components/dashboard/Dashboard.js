import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Checkbox,
  FormControlLabel,
  Alert,
  IconButton,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Slider,
  TextField,
  Rating
} from '@mui/material';
import {
  Mood as MoodIcon,
  SentimentSatisfied as NormalIcon,
  SentimentVeryDissatisfied as StressIcon,
  Notifications as NotificationIcon,
  DarkMode as DarkModeIcon,
  FitnessCenter as ExerciseIcon,
  Book as ReadingIcon,
  SelfImprovement as MeditationIcon,
  Edit as JournalIcon,
  CheckCircle as CompletedIcon,
  RadioButtonUnchecked as UncompletedIcon,
  Bedtime as SleepIcon,
  Psychology as StressIcon2,
  WaterDrop as WaterIcon,
  Restaurant as FoodIcon
} from '@mui/icons-material';
import { auth } from '../../config/firebase';
import moodService from '../../services/moodService';
import userService from '../../services/userService';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [mood, setMood] = useState('');
  const [activities, setActivities] = useState({
    exercise: false,
    reading: false,
    meditation: false,
    journaling: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todaysMood, setTodaysMood] = useState(null);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [activityProgress, setActivityProgress] = useState(0);
  const [dailyData, setDailyData] = useState({
    sleepHours: 7,
    stressLevel: 3,
    waterIntake: 4,
    mealQuality: 3,
    notes: '',
    mood: 'normal'
  });
  const [success, setSuccess] = useState(false);
  const [weeklyError, setWeeklyError] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error('Oturum açmanız gerekiyor');
        }

        // Kullanıcı bilgilerini al
        const userData = await userService.getAllUsers();
        const userDoc = userData.find(u => u.id === currentUser.uid);
        if (!userDoc) {
          throw new Error('Kullanıcı bilgileri bulunamadı');
        }
        setUser(userDoc);

        // Bugünün verilerini al
        const todayMood = await moodService.getTodaysMood(currentUser.uid);
        if (todayMood) {
          setTodaysMood(todayMood);
          setMood(todayMood.mood || '');
          setActivities(todayMood.activities || {
            exercise: false,
            reading: false,
            meditation: false,
            journaling: false
          });
          setDailyData(todayMood.dailyData || {
            sleepHours: 7,
            stressLevel: 3,
            waterIntake: 4,
            mealQuality: 3,
            notes: '',
            mood: 'normal'
          });
        }

        // Haftalık verileri al
        const weeklyMoods = await moodService.getWeeklyMoods(currentUser.uid);
        const progress = weeklyMoods ? (weeklyMoods.length / 7) * 100 : 0;
        setWeeklyProgress(progress);
        setWeeklyError(weeklyMoods.length === 0 ? "Bu hafta henüz veri yok." : null);

        // Aktivite ilerlemesini hesapla
        if (todayMood?.activities) {
          const completedActivities = Object.values(todayMood.activities).filter(Boolean).length;
          const totalActivities = Object.keys(todayMood.activities).length;
          setActivityProgress(totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0);
        }

      } catch (error) {
        console.error('Veri yükleme hatası:', error);
        setError(error.message || 'Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleMoodChange = async (event, newMood) => {
    if (newMood !== null) {
      try {
        setMood(newMood);
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          throw new Error('Kullanıcı oturumu bulunamadı');
        }

        const moodData = {
          mood: newMood,
          activities: {
            exercise: false,
            reading: false,
            meditation: false,
            journaling: false
          },
          dailyData: {
            sleepHours: 7,
            stressLevel: 3,
            waterIntake: 4,
            mealQuality: 3,
            notes: ''
          },
          userId: currentUser.uid,
          created: new Date(),
          updatedAt: new Date()
        };

        const savedMood = await moodService.saveDailyMood(currentUser.uid, moodData);
        
        if (savedMood) {
          setTodaysMood(savedMood);
          setActivities(savedMood.activities);
          setDailyData(savedMood.dailyData);
          setError(null);
        }
      } catch (error) {
        console.error('Duygu durumu kaydetme hatası:', error);
        setError('Duygu durumu kaydedilemedi. Lütfen tekrar deneyin.');
      }
    }
  };

  const handleActivityToggle = async (activity) => {
    try {
      const newActivities = {
        ...activities,
        [activity]: !activities[activity]
      };
      setActivities(newActivities);

      if (todaysMood) {
        await moodService.updateActivities(todaysMood.id, newActivities);
        const completedActivities = Object.values(newActivities).filter(Boolean).length;
        const totalActivities = Object.keys(newActivities).length;
        setActivityProgress((completedActivities / totalActivities) * 100);
      }
    } catch (error) {
      console.error('Aktivite güncelleme hatası:', error);
      setError('Aktivite güncellenirken bir hata oluştu.');
    }
  };

  const handleDailyDataChange = async (field, value) => {
    try {
      const newData = {
        ...dailyData,
        [field]: value
      };
      setDailyData(newData);

      if (todaysMood) {
        await moodService.updateDailyData(todaysMood.id, newData);
      }
    } catch (error) {
      console.error('Günlük veri güncelleme hatası:', error);
      setError('Veriler güncellenirken bir hata oluştu.');
    }
  };

  const handleSaveDailyData = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('Kullanıcı oturumu bulunamadı');
      const moodData = {
        mood: dailyData.mood,
        activities,
        dailyData,
        userId: currentUser.uid
      };
      console.log('currentUser.uid:', currentUser.uid);
      console.log('moodData.userId:', moodData.userId);
      const result = await moodService.saveDailyMood(currentUser.uid, moodData);
      console.log('Firestore kayıt sonucu:', result);
      setSuccess(true);
    } catch (error) {
      console.error('Firestore kayıt hatası:', error);
      setError('Veriler kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const ActivityCard = ({ title, icon, activity, completed }) => (
    <Card 
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)'
        }
      }}
      onClick={() => handleActivityToggle(activity)}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {icon}
          <Typography sx={{ ml: 2 }}>{title}</Typography>
        </Box>
        {completed ? 
          <CompletedIcon color="success" /> : 
          <UncompletedIcon color="disabled" />
        }
      </CardContent>
      <LinearProgress 
        variant="determinate" 
        value={completed ? 100 : 0} 
        sx={{ height: 4 }}
      />
    </Card>
  );

  const DailyDataCard = ({ title, icon, value, onChange, type, min, max, step, marks }) => (
    <Card sx={{ mb: 2, p: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography sx={{ ml: 2 }} variant="h6">
            {title}
          </Typography>
        </Box>
        {type === 'slider' && (
          <Slider
            value={value}
            onChange={(_, newValue) => onChange(newValue)}
            min={min}
            max={max}
            step={step}
            marks={marks}
            valueLabelDisplay="auto"
            sx={{ mt: 2 }}
          />
        )}
        {type === 'rating' && (
          <Rating
            value={value}
            onChange={(_, newValue) => onChange(newValue)}
            max={5}
            sx={{ mt: 1 }}
          />
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Veriler Yükleniyor...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth={false} disableGutters sx={{
      minHeight: "100vh",
      bgcolor: "linear-gradient(135deg, #f3eaff 0%, #e3f0ff 100%)",
      px: { xs: 1, md: 6 }, py: 4
    }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
        <Paper elevation={6} sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 5,
          width: "100%",
          maxWidth: 700,
          textAlign: "center",
          mb: 3,
          bgcolor: "#fff8fc"
        }}>
          <Typography variant="h3" fontWeight={800} sx={{ color: "#7c3aed" }}>
            Hoş Geldiniz, <span style={{ color: "#4f46e5" }}>{user?.name || "Misafir"}</span> 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Günün Önerisi: Ekran molası ver ve 5 dakika pencereden dışarı bak.
          </Typography>
        </Paper>
        {error && (
          <Alert severity="error" sx={{ width: "100%", maxWidth: 700, mb: 2 }}>{error}</Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ width: "100%", maxWidth: 700, mb: 2 }}>Veriler başarıyla kaydedildi!</Alert>
        )}
        {weeklyError && (
          <Alert severity={weeklyError === "Bu hafta henüz veri yok." ? "info" : "error"} sx={{ width: "100%", maxWidth: 700, mb: 2 }}>
            {weeklyError}
          </Alert>
        )}
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={7}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4, mb: 4, bgcolor: "#f7f5ff" }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Günlük Veriler
            </Typography>
            <Box>
              <DailyDataCard
                title="Uyku Süresi (Saat)"
                icon={<SleepIcon color="primary" />}
                value={dailyData.sleepHours}
                onChange={(value) => handleDailyDataChange('sleepHours', value)}
                type="slider"
                min={0}
                max={12}
                step={0.5}
                marks={[
                  { value: 0, label: '0' },
                  { value: 6, label: '6' },
                  { value: 8, label: '8' },
                  { value: 12, label: '12' }
                ]}
              />
              <DailyDataCard
                title="Stres Seviyesi"
                icon={<StressIcon2 color="error" />}
                value={dailyData.stressLevel}
                onChange={(value) => handleDailyDataChange('stressLevel', value)}
                type="slider"
                min={1}
                max={5}
                step={1}
                marks={[
                  { value: 1, label: 'Çok Düşük' },
                  { value: 3, label: 'Orta' },
                  { value: 5, label: 'Çok Yüksek' }
                ]}
              />
              <DailyDataCard
                title="Su Tüketimi (Litre)"
                icon={<WaterIcon color="info" />}
                value={dailyData.waterIntake}
                onChange={(value) => handleDailyDataChange('waterIntake', value)}
                type="slider"
                min={0}
                max={8}
                step={0.5}
                marks={[
                  { value: 0, label: '0L' },
                  { value: 2, label: '2L' },
                  { value: 4, label: '4L' },
                  { value: 8, label: '8L' }
                ]}
              />
              <Card sx={{ mb: 2, p: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Günlük Notlar
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={dailyData.notes}
                    onChange={(e) => handleDailyDataChange('notes', e.target.value)}
                    placeholder="Bugün kendinizi nasıl hissettiniz? Notlarınızı buraya yazabilirsiniz..."
                    variant="outlined"
                  />
                </CardContent>
              </Card>
              <Box sx={{ mb: 2 }}>
                <Typography>Ruh Hali</Typography>
                <ToggleButtonGroup
                  value={dailyData.mood}
                  exclusive
                  onChange={(_, value) => handleDailyDataChange('mood', value)}
                  sx={{ mt: 1, mb: 1, width: '100%' }}
                >
                  <ToggleButton value="cokiyi" sx={{ flex: 1, flexDirection: 'column' }}>
                    <span style={{ fontSize: 28 }}>😁</span>
                    <Typography variant="caption">Çok İyi</Typography>
                  </ToggleButton>
                  <ToggleButton value="iyi" sx={{ flex: 1, flexDirection: 'column' }}>
                    <span style={{ fontSize: 28 }}>😊</span>
                    <Typography variant="caption">İyi</Typography>
                  </ToggleButton>
                  <ToggleButton value="normal" sx={{ flex: 1, flexDirection: 'column' }}>
                    <span style={{ fontSize: 28 }}>😐</span>
                    <Typography variant="caption">Normal</Typography>
                  </ToggleButton>
                  <ToggleButton value="kotu" sx={{ flex: 1, flexDirection: 'column' }}>
                    <span style={{ fontSize: 28 }}>🙁</span>
                    <Typography variant="caption">Kötü</Typography>
                  </ToggleButton>
                  <ToggleButton value="cokkotu" sx={{ flex: 1, flexDirection: 'column' }}>
                    <span style={{ fontSize: 28 }}>😞</span>
                    <Typography variant="caption">Çok Kötü</Typography>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>
          </Paper>

          <Paper elevation={4} sx={{ p: 4, borderRadius: 4, mb: 4, bgcolor: "#f7f5ff" }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Günlük Aktiviteler
            </Typography>
            <Box>
              <ActivityCard
                title="Egzersiz"
                icon={<ExerciseIcon color={activities.exercise ? 'success' : 'disabled'} />}
                activity="exercise"
                completed={activities.exercise}
              />
              <ActivityCard
                title="Okuma"
                icon={<ReadingIcon color={activities.reading ? 'success' : 'disabled'} />}
                activity="reading"
                completed={activities.reading}
              />
              <ActivityCard
                title="Meditasyon"
                icon={<MeditationIcon color={activities.meditation ? 'success' : 'disabled'} />}
                activity="meditation"
                completed={activities.meditation}
              />
              <ActivityCard
                title="Günlük Yazma"
                icon={<JournalIcon color={activities.journaling ? 'success' : 'disabled'} />}
                activity="journaling"
                completed={activities.journaling}
              />
            </Box>
          </Paper>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveDailyData}
            fullWidth
            sx={{
              mt: 2,
              py: 2,
              borderRadius: 4,
              fontWeight: 700,
              fontSize: "1.2rem",
              letterSpacing: 1,
              bgcolor: "#7c3aed",
              ":hover": { bgcolor: "#4f46e5" }
            }}
          >
            Kaydet
          </Button>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4, mb: 4, bgcolor: "#f7f5ff", textAlign: "center" }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Haftalık İlerleme
            </Typography>
            <Box sx={{ position: 'relative', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
              <CircularProgress
                variant="determinate"
                value={weeklyProgress}
                size={120}
                thickness={4}
                sx={{ color: 'success.main' }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h5" component="div" color="text.secondary">
                  {`${Math.round(weeklyProgress)}%`}
                </Typography>
              </Box>
            </Box>
          </Paper>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4, bgcolor: "#f7f5ff", textAlign: "center" }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Aktivite Tamamlama
            </Typography>
            <Box sx={{ position: 'relative', display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
              <CircularProgress
                variant="determinate"
                value={activityProgress}
                size={120}
                thickness={4}
                sx={{ color: 'secondary.main' }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h5" component="div" color="text.secondary">
                  {`${Math.round(activityProgress)}%`}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 