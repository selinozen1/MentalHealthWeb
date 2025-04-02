import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Paper, Typography, Button, CircularProgress, useTheme, 
  Avatar, IconButton, Tooltip, Fade, Collapse, Card, CardContent,
  LinearProgress, Divider, Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import BarChartIcon from '@mui/icons-material/BarChart';

// Özel stil bileşenleri
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  }
}));

const MoodButton = styled(Button)(({ theme, selected }) => ({
  padding: theme.spacing(1.5),
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius * 1.5,
  transition: 'all 0.3s',
  backgroundColor: selected ? theme.palette.primary.light : theme.palette.grey[100],
  color: selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  border: selected ? `2px solid ${theme.palette.primary.main}` : 'none',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[3],
    backgroundColor: selected ? theme.palette.primary.light : theme.palette.grey[200],
  }
}));

const AnimatedProgress = styled(CircularProgress)(({ theme }) => ({
  animation: 'loadIn 1.5s ease-out',
  '@keyframes loadIn': {
    '0%': {
      opacity: 0,
      transform: 'scale(0.8)',
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
}));

function Dashboard({ themeContext }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [activities, setActivities] = useState([
    { id: 1, name: 'Egzersiz', completed: false, progress: 0, trend: 'up' },
    { id: 2, name: 'Okuma', completed: true, progress: 100, trend: 'stable' },
    { id: 3, name: 'Meditasyon', completed: false, progress: 30, trend: 'down' },
  ]);
  const [moodHistory, setMoodHistory] = useState([
    { date: '1 Haz', mood: 'Mutlu' },
    { date: '2 Haz', mood: 'Normal' },
    { date: '3 Haz', mood: 'Stresli' },
    { date: '4 Haz', mood: 'Normal' },
    { date: '5 Haz', mood: 'Mutlu' },
  ]);
  const [showTips, setShowTips] = useState(false);
  const [stressLevel, setStressLevel] = useState('Düşük');
  const [showStressTips, setShowStressTips] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Ahmet');
  
  const theme = useTheme();
  const { mode, toggleThemeMode } = themeContext || { mode: 'light', toggleThemeMode: () => {} };
  
  // Simüle edilmiş veri yükleme
  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Veri yüklenirken hata oluştu:', error);
      setLoading(false);
    }
  }, []);
  
  // Stres seviyesi kontrolü
  useEffect(() => {
    try {
      if (selectedMood === 'Stresli') {
        const timer = setTimeout(() => {
          setStressLevel('Yüksek');
          setShowStressTips(true);
        }, 500);
        
        return () => clearTimeout(timer);
      } else if (selectedMood) {
        setStressLevel(selectedMood === 'Mutlu' ? 'Düşük' : 'Orta');
        setShowStressTips(false);
      }
    } catch (error) {
      console.error('Stres seviyesi hesaplanırken hata oluştu:', error);
    }
  }, [selectedMood]);
  
  const handleMoodSelect = (mood) => {
    try {
      setSelectedMood(mood);
      // Geçmiş duygu durumlarını güncelle
      const today = new Date();
      const dateStr = `${today.getDate()} ${today.toLocaleString('tr-TR', { month: 'short' })}`;
      
      // Bugün zaten varsa güncelle, yoksa ekle
      const updatedHistory = [...moodHistory];
      const todayIndex = updatedHistory.findIndex(item => item.date === dateStr);
      
      if (todayIndex >= 0) {
        updatedHistory[todayIndex].mood = mood;
      } else {
        updatedHistory.push({ date: dateStr, mood });
      }
      
      setMoodHistory(updatedHistory);
    } catch (error) {
      console.error('Duygu durumu kaydedilirken hata oluştu:', error);
    }
  };
  
  const handleActivityToggle = (id) => {
    try {
      setActivities(activities.map(activity => 
        activity.id === id 
          ? { 
              ...activity, 
              completed: !activity.completed, 
              progress: !activity.completed ? 100 : 0,
              // Animasyon için geçiş efekti
              transition: 'all 0.5s ease-in-out'
            } 
          : activity
      ));
    } catch (error) {
      console.error('Aktivite güncellenirken hata oluştu:', error);
    }
  };
  
  // Emoji yardımcı fonksiyonu
  const getMoodEmoji = (mood) => {
    switch(mood) {
      case 'Mutlu': return '😊';
      case 'Normal': return '😐';
      case 'Stresli': return '😓';
      default: return '';
    }
  };
  
  // Trend gösterge fonksiyonu
  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '→';
      default: return '';
    }
  };
  
  // Günlük öneri
  const getDailyTip = () => {
    const tips = [
      "Bugün 10 dakika meditasyon yapmayı unutma!",
      "Günde en az 2 litre su içmeyi hedefle.",
      "Ekran molası ver ve 5 dakika pencereden dışarı bak.",
      "Bugün sevdiğin bir arkadaşını ara.",
      "Akşam yatmadan önce telefonu bırak ve kitap oku."
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  };
  
  // Stres yönetimi önerileri
  const getStressTips = () => {
    return [
      { icon: <SelfImprovementIcon />, text: "5 dakika derin nefes egzersizi yap" },
      { icon: <MusicNoteIcon />, text: "Rahatlatıcı müzik dinle" },
      { icon: <TipsAndUpdatesIcon />, text: "Kısa bir yürüyüşe çık" }
    ];
  };
  
  return (
    <Box sx={{ p: 3 }}>
      {/* Üst Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight="bold">
          Merhaba, {userName}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Bildirimler">
            <IconButton>
              <NotificationsIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={mode === 'light' ? 'Karanlık Mod' : 'Aydınlık Mod'}>
            <IconButton onClick={toggleThemeMode}>
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
          
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            {userName.charAt(0)}
          </Avatar>
        </Box>
      </Box>
      
      {/* Günlük Öneri Kartı */}
      <Tooltip title="Tıkla ve daha fazla öneri gör">
        <StyledPaper 
          elevation={2} 
          sx={{ mb: 4, p: 3, cursor: 'pointer' }}
          onClick={() => setShowTips(!showTips)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TipsAndUpdatesIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
            <Typography variant="h6" fontWeight="medium">
              Günün Önerisi: {getDailyTip()}
            </Typography>
          </Box>
          
          <Collapse in={showTips}>
            <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="body1" fontWeight="medium" gutterBottom>
                Daha Fazla Öneri:
              </Typography>
              <ul>
                <li>Günde en az 8000 adım atmayı hedefle</li>
                <li>Akşam yemeğinden sonra ekranlardan uzak dur</li>
                <li>Haftada en az 3 gün 30 dakika egzersiz yap</li>
              </ul>
            </Box>
          </Collapse>
        </StyledPaper>
      </Tooltip>
      
      {/* Hoş Geldiniz Kartı */}
      <StyledPaper elevation={2} sx={{ mb: 4, p: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary" gutterBottom>
          Hoş Geldiniz, {userName} 👋
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Bugün nasıl hissediyorsunuz?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Duygularınızı paylaşarak günlük takibinizi kolaylaştırın
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <MoodButton 
            selected={selectedMood === 'Mutlu'} 
            onClick={() => handleMoodSelect('Mutlu')}
          >
            {getMoodEmoji('Mutlu')} Mutlu
          </MoodButton>
          <MoodButton 
            selected={selectedMood === 'Normal'} 
            onClick={() => handleMoodSelect('Normal')}
          >
            {getMoodEmoji('Normal')} Normal
          </MoodButton>
          <MoodButton 
            selected={selectedMood === 'Stresli'} 
            onClick={() => handleMoodSelect('Stresli')}
          >
            {getMoodEmoji('Stresli')} Stresli
          </MoodButton>
        </Box>
      </StyledPaper>
      
      {/* Ana İçerik Grid */}
      <Grid container spacing={3}>
        {/* Aktiviteler Kartı */}
        <Grid item xs={12} md={6}>
          <StyledPaper elevation={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Günlük Aktiviteler
            </Typography>
            <Box sx={{ mt: 2 }}>
              {activities.map((activity) => (
                <Box 
                  key={activity.id}
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 1.5,
                    mb: 1,
                    borderRadius: 1,
                    bgcolor: theme.palette.background.default,
                    transition: 'background-color 0.3s',
                    '&:hover': {
                      bgcolor: theme.palette.action.hover,
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {activity.name}
                    {activity.completed && (
                      <Fade in={activity.completed}>
                        <Box component="span" sx={{ ml: 1, color: 'success.main' }}>✓</Box>
                      </Fade>
                    )}
                    <Tooltip title="Aktivite trendi">
                      <Box component="span" sx={{ ml: 1, opacity: 0.7 }}>
                        {getTrendIcon(activity.trend)}
                      </Box>
                    </Tooltip>
                  </Box>
                  <Box sx={{ 
                    width: 100, 
                    bgcolor: 'grey.200', 
                    borderRadius: 5, 
                    height: 8, 
                    overflow: 'hidden',
                    mr: 2
                  }}>
                    <Box 
                      sx={{ 
                        width: `${activity.progress}%`, 
                        bgcolor: 'primary.main', 
                        height: '100%',
                        transition: 'width 0.5s ease-in-out'
                      }} 
                    />
                  </Box>
                  <Button 
                    size="small" 
                    variant={activity.completed ? "outlined" : "contained"}
                    onClick={() => handleActivityToggle(activity.id)}
                    sx={{
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    {activity.completed ? 'Tamamlandı' : 'Tamamla'}
                  </Button>
                </Box>
              ))}
            </Box>
          </StyledPaper>
        </Grid>
        
        {/* İlerleme Kartları */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            {/* Haftalık Ortalama */}
            <Grid item xs={12} sm={6}>
              <StyledPaper elevation={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Haftalık Ortalama
                </Typography>
                <Box sx={{ position: 'relative', display: 'inline-flex', my: 2 }}>
                  {loading ? (
                    <CircularProgress size={80} />
                  ) : (
                    <AnimatedProgress variant="determinate" value={75} size={80} thickness={4} color="success" />
                  )}
                  <Fade in={!loading}>
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
                      <Typography variant="h6" component="div" color="text.primary">
                        75%
                      </Typography>
                    </Box>
                  </Fade>
                </Box>
              </StyledPaper>
            </Grid>
            
            {/* Aktivite Tamamlama */}
            <Grid item xs={12} sm={6}>
              <StyledPaper elevation={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Aktivite Tamamlama
                </Typography>
                <Box sx={{ position: 'relative', display: 'inline-flex', my: 2 }}>
                  {loading ? (
                    <CircularProgress size={80} />
                  ) : (
                    <AnimatedProgress variant="determinate" value={80} size={80} thickness={4} color="primary" />
                  )}
                  <Fade in={!loading}>
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
                      <Typography variant="h6" component="div" color="text.primary">
                        80%
                      </Typography>
                    </Box>
                  </Fade>
                </Box>
              </StyledPaper>
            </Grid>
            
            {/* Stres Seviyesi */}
            <Grid item xs={12}>
              <StyledPaper elevation={2} sx={{ p: 3 }}>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom align="center">
                  Stres Seviyesi
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>
                  <Typography variant="h1" component="span" sx={{ mr: 2 }}>
                    {stressLevel === 'Düşük' ? '😌' : stressLevel === 'Orta' ? '😐' : '😓'}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {stressLevel}
                  </Typography>
                </Box>
                
                <Collapse in={showStressTips}>
                  <Card sx={{ mt: 2, bgcolor: theme.palette.background.default }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Stres Yönetimi Önerileri
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      {getStressTips().map((tip, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ mr: 1, color: 'primary.main' }}>{tip.icon}</Box>
                          <Typography variant="body2">{tip.text}</Typography>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Collapse>
              </StyledPaper>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Duygu Durumu Geçmişi */}
        <Grid item xs={12}>
          <StyledPaper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <BarChartIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Duygu Durumu Geçmişi
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 150 }}>
              {moodHistory.map((item, index) => {
                const moodHeight = item.mood === 'Mutlu' ? 100 : item.mood === 'Normal' ? 60 : 30;
                const moodColor = item.mood === 'Mutlu' ? 'success.main' : item.mood === 'Normal' ? 'info.main' : 'error.main';
                
                return (
                  <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: `${100 / moodHistory.length}%` }}>
                    <Tooltip title={item.mood}>
                      <Box 
                        sx={{ 
                          height: `${moodHeight}%`, 
                          width: 30, 
                          bgcolor: moodColor,
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.5s',
                          '&:hover': {
                            opacity: 0.8,
                            transform: 'translateY(-5px)'
                          }
                        }} 
                      />
                    </Tooltip>
                    <Typography variant="caption" sx={{ mt: 1 }}>
                      {item.date}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Chip 
                label="Mutlu" 
                size="small" 
                sx={{ bgcolor: 'success.main', color: 'white', mr: 1 }} 
              />
              <Chip 
                label="Normal" 
                size="small" 
                sx={{ bgcolor: 'info.main', color: 'white', mr: 1 }} 
              />
              <Chip 
                label="Stresli" 
                size="small" 
                sx={{ bgcolor: 'error.main', color: 'white' }} 
              />
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;