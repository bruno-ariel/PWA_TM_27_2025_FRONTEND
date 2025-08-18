import { createContext, useEffect, useState } from "react"

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const isAuthenticated = Boolean(sessionStorage.getItem('access_token'))
    const [isAuthenticatedState, setIsAuthenticatedState] = useState(isAuthenticated)
    const login = (access_token) => {
        if (!access_token) {
            throw new Error('No se proporcionó un token de acceso')
        }
        sessionStorage.setItem('access_token', access_token)
        setIsAuthenticatedState(true)
    }
    return (
        <AuthContext.Provider value={{ isAuthenticatedState, login }}>
            {children}
        </AuthContext.Provider>
    )
}