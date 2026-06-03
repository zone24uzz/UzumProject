/**
 * AuthModal — модальное окно входа и регистрации
 * Glassmorphism-дизайн в стиле Uzum Market
 */
import { useState, useEffect } from 'react'
import { X, Eye, EyeOff, User, Mail, Lock, Check, AlertCircle, Loader } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AuthModal() {
  const { authModal, setAuthModal, authTab, setAuthTab, login, register } = useAuth()
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '', remember: false, agree: false })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [success, setSuccess] = useState(false)

  // Сбросить форму при переключении вкладки
  useEffect(() => {
    setForm({ name: '', email: '', password: '', confirm: '', remember: false, agree: false })
    setErrors({})
    setSuccess(false)
  }, [authTab, authModal])

  // Закрыть по Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setAuthModal(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [setAuthModal])

  if (!authModal) return null

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
  }

  // ── Валидация ───────────────────────────────────────────────────────
  const validate = () => {
    const errs = {}
    if (authTab === 'register' && !form.name.trim()) errs.name = 'Введите имя'
    if (!form.email.trim()) errs.email = 'Введите email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Некорректный email'
    if (!form.password) errs.password = 'Введите пароль'
    else if (form.password.length < 6) errs.password = 'Минимум 6 символов'
    if (authTab === 'register') {
      if (form.password !== form.confirm) errs.confirm = 'Пароли не совпадают'
      if (!form.agree) errs.agree = 'Необходимо принять условия'
    }
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      if (authTab === 'login') {
        login({ email: form.email, password: form.password, remember: form.remember })
      } else {
        await register({ name: form.name, email: form.email, password: form.password })
      }
      setSuccess(true)
      setTimeout(() => setAuthModal(false), 900)
    } catch (err) {
      setErrors({ global: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(15,10,30,0.65)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={e => { if (e.target === e.currentTarget) setAuthModal(false) }}
    >
      <div style={{
        width: '100%', maxWidth: 460,
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 28,
        boxShadow: '0 32px 80px rgba(123,47,190,0.25), 0 0 0 1px rgba(123,47,190,0.08)',
        overflow: 'hidden',
        animation: 'slideInUp3d 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      }}>

        {/* ── Шапка с вкладками ── */}
        <div style={{ position: 'relative', background: 'linear-gradient(135deg, #7B2FBE 0%, #9b4fd4 100%)', padding: '28px 32px 0' }}>
          {/* Декор-орбы */}
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

          <button
            onClick={() => setAuthModal(false)}
            style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.28)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            <X size={16} />
          </button>

          {/* Логотип */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, position: 'relative', zIndex: 1 }}>
            <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 14 }}>U</span>
            </div>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 20 }}>uzum</span>
          </div>

          {/* Вкладки */}
          <div style={{ display: 'flex', gap: 4, position: 'relative', zIndex: 1 }}>
            {[['login', 'Вход'], ['register', 'Регистрация']].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setAuthTab(tab)}
                style={{
                  flex: 1, padding: '11px 0',
                  background: authTab === tab ? '#fff' : 'transparent',
                  border: 'none', borderRadius: '14px 14px 0 0',
                  color: authTab === tab ? '#7B2FBE' : 'rgba(255,255,255,0.7)',
                  fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Форма ── */}
        <form onSubmit={handleSubmit} style={{ padding: '28px 32px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Глобальная ошибка */}
          {errors.global && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '10px 14px', color: '#DC2626', fontSize: 13, fontWeight: 500 }}>
              <AlertCircle size={15} />
              {errors.global}
            </div>
          )}

          {/* Успех */}
          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '10px 14px', color: '#059669', fontSize: 13, fontWeight: 600 }}>
              <Check size={15} />
              {authTab === 'login' ? 'Добро пожаловать!' : 'Аккаунт создан!'}
            </div>
          )}

          {/* Имя (только при регистрации) */}
          {authTab === 'register' && (
            <Field label="Имя" icon={<User size={16} />} error={errors.name}>
              <input
                type="text"
                placeholder="Ваше имя"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                style={inputStyle(!!errors.name)}
              />
            </Field>
          )}

          {/* Email */}
          <Field label="Email" icon={<Mail size={16} />} error={errors.email}>
            <input
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              style={inputStyle(!!errors.email)}
            />
          </Field>

          {/* Пароль */}
          <Field label="Пароль" icon={<Lock size={16} />} error={errors.password}
            suffix={
              <button type="button" onClick={() => setShowPass(v => !v)} style={eyeBtn}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          >
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Минимум 6 символов"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              style={inputStyle(!!errors.password)}
            />
          </Field>

          {/* Подтверждение пароля */}
          {authTab === 'register' && (
            <Field label="Подтверждение пароля" icon={<Lock size={16} />} error={errors.confirm}
              suffix={
                <button type="button" onClick={() => setShowConfirm(v => !v)} style={eyeBtn}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            >
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Повторите пароль"
                value={form.confirm}
                onChange={e => set('confirm', e.target.value)}
                style={inputStyle(!!errors.confirm)}
              />
            </Field>
          )}

          {/* Запомнить меня / Забыли пароль */}
          {authTab === 'login' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#555' }}>
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={e => set('remember', e.target.checked)}
                  style={{ accentColor: '#7B2FBE', width: 15, height: 15 }}
                />
                Запомнить меня
              </label>
              <button type="button" style={{ background: 'none', border: 'none', color: '#7B2FBE', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Забыли пароль?
              </button>
            </div>
          )}

          {/* Согласие с правилами */}
          {authTab === 'register' && (
            <div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', fontSize: 12, color: '#666', lineHeight: 1.5 }}>
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={e => set('agree', e.target.checked)}
                  style={{ accentColor: '#7B2FBE', width: 15, height: 15, marginTop: 1, flexShrink: 0 }}
                />
                Я соглашаюсь с{' '}
                <span style={{ color: '#7B2FBE', fontWeight: 600 }}>условиями использования</span>
                {' '}и{' '}
                <span style={{ color: '#7B2FBE', fontWeight: 600 }}>политикой конфиденциальности</span>
              </label>
              {errors.agree && <p style={{ fontSize: 11, color: '#DC2626', marginTop: 4 }}>{errors.agree}</p>}
            </div>
          )}

          {/* Кнопка отправки */}
          <button
            type="submit"
            disabled={loading || success}
            style={{
              width: '100%', padding: '14px 0',
              borderRadius: 14, border: 'none',
              background: 'linear-gradient(135deg, #7B2FBE 0%, #9b4fd4 100%)',
              color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: loading || success ? 0.8 : 1,
              transition: 'transform 0.15s, box-shadow 0.15s',
              boxShadow: '0 4px 20px rgba(123,47,190,0.35)',
              marginTop: 4,
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(123,47,190,0.5)' } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(123,47,190,0.35)' }}
          >
            {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
            {loading ? 'Загрузка...' : authTab === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>

          {/* Переключение вкладки */}
          <p style={{ textAlign: 'center', fontSize: 13, color: '#888' }}>
            {authTab === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
            <button
              type="button"
              onClick={() => setAuthTab(authTab === 'login' ? 'register' : 'login')}
              style={{ background: 'none', border: 'none', color: '#7B2FBE', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}
            >
              {authTab === 'login' ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </form>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  )
}

// ── Вспомогательные компоненты и стили ──────────────────────────────────────

function Field({ label, icon, error, suffix, children }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        {label}
      </label>
      <div style={{
        display: 'flex', alignItems: 'center',
        border: `2px solid ${error ? '#FCA5A5' : '#EDE9FE'}`,
        borderRadius: 12, background: error ? '#FFF5F5' : '#FAFAFE',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        overflow: 'hidden',
      }}
        onFocusCapture={e => e.currentTarget.style.borderColor = '#7B2FBE'}
        onBlurCapture={e => e.currentTarget.style.borderColor = error ? '#FCA5A5' : '#EDE9FE'}
      >
        <span style={{ padding: '0 12px', color: error ? '#DC2626' : '#9b4fd4', display: 'flex' }}>{icon}</span>
        <div style={{ flex: 1 }}>{children}</div>
        {suffix && <span style={{ padding: '0 10px', display: 'flex' }}>{suffix}</span>}
      </div>
      {error && (
        <p style={{ fontSize: 11, color: '#DC2626', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  )
}

const inputStyle = (hasError) => ({
  width: '100%', padding: '12px 4px', border: 'none', outline: 'none',
  fontSize: 14, background: 'transparent', color: '#222',
})

const eyeBtn = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: '#aaa', display: 'flex', padding: 0,
  transition: 'color 0.2s',
}
