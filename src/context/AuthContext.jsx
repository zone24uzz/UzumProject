/**
 * AuthContext — система авторизации
 * Хранит пользователей в localStorage (имитация БД)
 * В реальном проекте заменить на API-вызовы к бэкенду
 */
import { createContext, useContext, useState, useEffect } from 'react'
import { notifyAdminNewUser } from '../services/telegramBot'

const AuthContext = createContext(null)

const STORAGE_KEY = 'uzum_users'
const SESSION_KEY = 'uzum_session'

// Получить всех пользователей из localStorage
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

// Сохранить пользователей
function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authModal, setAuthModal] = useState(false) // открыть модалку
  const [authTab, setAuthTab]   = useState('login') // 'login' | 'register'

  // Восстановить сессию при загрузке
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      if (saved) setUser(JSON.parse(saved))
    } catch {}
  }, [])

  // ── Регистрация ──────────────────────────────────────────────────────
  const register = async ({ name, email, password }) => {
    const users = getUsers()
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Пользователь с таким email уже существует')
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      // В реальном проекте — хэшировать пароль на сервере!
      passwordHash: btoa(password),
      telegramId: null,
      tgNotifications: true,
      orders: [],
      createdAt: new Date().toISOString(),
    }

    saveUsers([...users, newUser])

    // Уведомить администратора о новом пользователе
    notifyAdminNewUser({ name, email })

    // Авто-вход после регистрации
    const sessionUser = { ...newUser, passwordHash: undefined }
    setUser(sessionUser)
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
    return sessionUser
  }

  // ── Вход ────────────────────────────────────────────────────────────
  const login = ({ email, password, remember }) => {
    const users = getUsers()
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!found) throw new Error('Пользователь не найден')
    if (found.passwordHash !== btoa(password)) throw new Error('Неверный пароль')

    const sessionUser = { ...found, passwordHash: undefined }
    setUser(sessionUser)
    if (remember) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))
    }
    return sessionUser
  }

  // ── Выход ────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
  }

  // ── Обновить профиль (имя, email) ────────────────────────────────────
  const updateProfile = (updates) => {
    const users  = getUsers()
    const idx    = users.findIndex(u => u.id === user.id)
    if (idx === -1) return
    users[idx] = { ...users[idx], ...updates }
    saveUsers(users)
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
  }

  // ── Привязать Telegram ID ────────────────────────────────────────────
  const linkTelegram = (telegramId) => {
    updateProfile({ telegramId })
  }

  // ── Переключить уведомления Telegram ────────────────────────────────
  const toggleTgNotifications = (enabled) => {
    updateProfile({ tgNotifications: enabled })
  }

  // ── Добавить заказ в историю ─────────────────────────────────────────
  const addOrder = (order) => {
    const users = getUsers()
    const idx   = users.findIndex(u => u.id === user?.id)
    if (idx === -1) return
    users[idx].orders = [order, ...(users[idx].orders || [])]
    saveUsers(users)
    const updated = { ...user, orders: users[idx].orders }
    setUser(updated)
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
  }

  // ── Открыть модалку авторизации ──────────────────────────────────────
  const openAuth = (tab = 'login') => {
    setAuthTab(tab)
    setAuthModal(true)
  }

  return (
    <AuthContext.Provider value={{
      user, register, login, logout,
      updateProfile, linkTelegram, toggleTgNotifications, addOrder,
      authModal, setAuthModal, authTab, setAuthTab, openAuth,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
