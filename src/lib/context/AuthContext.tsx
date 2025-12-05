import { createContext, useContext, useState, ReactNode } from 'react'
import { Buyer, Marketer } from '@/lib/types'

type User = (Buyer | Marketer) & { userType: 'buyer' | 'marketer' }

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('smartleads_user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const login = (user: User) => {
    setUser(user)
    localStorage.setItem('smartleads_user', JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('smartleads_user')
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
