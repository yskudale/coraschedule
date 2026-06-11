// ============================================
// LoginPage.tsx
// Uses: React Hook Form → form state + validation
//       Redux loginUser → async login action
//       authSlice → global state update
//       useNavigate → redirect after login
// ============================================

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { loginUser } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import type { LoginCredentials } from '@/features/auth/types/index';
import styles from './LoginPage.module.scss';

export default function LoginPage() {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const [showPwd, setShowPwd] = useState(false);

  const { isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  // If already logged in → skip login, go straight to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // ── React Hook Form ───────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({ mode: 'onTouched' });

  const onSubmit = (data: LoginCredentials) => {
    dispatch(loginUser(data));
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* ── Left: Brand Panel ───────────────────────── */}
      <div className={styles.brand}>
        <div className={styles.brandInner}>

          <div className={styles.logo}>
            <div className={styles.logoIcon}>C</div>
            <div>
              <span className={styles.logoText}>CORA</span>
              <span className={styles.logoSub}>Physical Therapy</span>
            </div>
          </div>

          <h1 className={styles.tagline}>
            Get On Our Books.<br />Get On With Your Life.
          </h1>

          <p className={styles.taglineSub}>
            Book appointments with our expert therapists — Physical,
            Occupational and Speech Therapy, all in one place.
          </p>

          <div className={styles.services}>
            {['Physical Therapy', 'Occupational Therapy', 'Speech Therapy'].map(
              (service) => (
                <div key={service} className={styles.serviceTag}>
                  {service}
                </div>
              )
            )}
          </div>

        </div>
      </div>

      {/* ── Right: Form Panel ───────────────────────── */}
      <div className={styles.formPanel}>
        <div className={styles.card}>

          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Welcome Back</h2>
            <p className={styles.cardSub}>
              Sign in to manage your appointments
            </p>
          </div>

          {/* Demo credentials hint */}
          <div className={styles.hint}>
            <strong>Demo login:</strong> patient@cora.com / cora123
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className={styles.form}
          >

            {/* Email field */}
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <div className={styles.inputWrapper}>
                <Mail size={18} className={styles.inputIcon} />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className={`${styles.input} ${
                    errors.email ? styles.inputError : ''
                  }`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <span className={styles.errorMsg}>
                  <AlertCircle size={14} />
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password field */}
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.inputIcon} />
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`${styles.input} ${
                    errors.password ? styles.inputError : ''
                  }`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Minimum 6 characters',
                    },
                  })}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPwd((prev) => !prev)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className={styles.errorMsg}>
                  <AlertCircle size={14} />
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Redux error — wrong password or server error */}
            {error && (
              <div className={styles.apiError}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading
                ? <span className={styles.btnSpinner} />
                : 'Sign In to CORA'
              }
            </button>

          </form>

          <p className={styles.footer}>
            New patient?{' '}
            <a href="#" className={styles.link}>
              Schedule an appointment
            </a>
          </p>

        </div>
      </div>

    </div>
  );
}