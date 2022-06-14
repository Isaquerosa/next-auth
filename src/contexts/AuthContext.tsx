import Router from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";
import { parseCookies, setCookie, destroyCookie } from "nookies";

import { api } from "../services/apiClient";


interface SingInCredentials {
  email: string
  password: string
}

interface AuthContextData {
  signIn: (credentials: SingInCredentials) => Promise<void>
  signOut: () => void
  isAuthenticated: boolean
  user: User
}

interface AuthProviderProps {
  children: ReactNode
}

interface User {
  email: string
  permissions: string[]
  roles: string[]
}

export const AuthContext = createContext({} as AuthContextData) 

let authChannel: BroadcastChannel 

export function signOut() {
  destroyCookie(undefined, 'nextauth.token')
  destroyCookie(undefined, 'nextauth.refreshToken')

  authChannel.postMessage('signOut')

  Router.push('/')
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [ user, setUser ] = useState<User>(null)
  const isAuthenticated = !!user

  useEffect(() => {
    authChannel = new BroadcastChannel('auth')

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case 'signOut':
          signOut()
          break
        default:
          break
      }
    }
  }, [])

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies()

    if(token) {
      api.get('/me')
      .then(response => {
        const { email, permissions, roles } = response.data

        setUser({
          email,
          permissions,
          roles
        })
      })
      .catch(error => {
        signOut()
      })
    }
  }, [])

  async function signIn({ email, password }: SingInCredentials) {
    try {
      const response = await api.post('/sessions', {
        email,
        password
      })

      const { token, refreshToken, permissions, roles } = response.data

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30,// 30 dias
        path: '/'  
      })

      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30,// 30 dias
        path: '/'  
      })
  
      setUser({
        email,
        permissions,
        roles
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`

      Router.push('/dashboard')
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      { children }
    </AuthContext.Provider>
  )
}