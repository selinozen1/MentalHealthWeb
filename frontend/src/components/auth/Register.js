import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  InputAdornment,
  IconButton,
  Avatar
} from '@mui/material';
import { Visibility, VisibilityOff, PersonAddOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            width: '100%',
          }}
        >
          <Avatar sx={{ 
            m: 1, 
            bgcolor: 'secondary.main',
            width: 56,
            height: 56
          }}>
            <PersonAddOutlined />
          </Avatar>

          <Typography component="h1" variant="h5" sx={{ mb: 3, color: 'text.primary' }}>
            Kayıt Ol
          </Typography>

          <Formik
            initialValues={{ name: '', email: '', password: '' }}
            validationSchema={Yup.object({
              name: Yup.string()
                .required('İsim gereklidir'),
              email: Yup.string()
                .email('Geçerli bir email adresi giriniz')
                .required('Email adresi gereklidir'),
              password: Yup.string()
                .min(6, 'Şifre en az 6 karakter olmalıdır')
                .required('Şifre gereklidir')
            })}
            onSubmit={(values) => {
              console.log(values);
              navigate('/login');
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="name"
                  label="İsim"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'secondary.light',
                      },
                    },
                  }}
                />

                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Adresi"
                  name="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'secondary.light',
                      },
                    },
                  }}
                />

                <TextField
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Şifre"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'secondary.light',
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    fontSize: '1rem',
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #64B5F6 30%, #7E57C2 90%)',
                    boxShadow: '0 3px 5px 2px rgba(100, 181, 246, .3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #7E57C2 30%, #64B5F6 90%)',
                    }
                  }}
                >
                  Kayıt Ol
                </Button>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Link 
                    href="/login" 
                    variant="body2"
                    sx={{
                      color: 'secondary.main',
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'secondary.dark',
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    {"Zaten hesabınız var mı? Giriş yapın"}
                  </Link>
                </Box>
              </Box>
            )}
          </Formik>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 