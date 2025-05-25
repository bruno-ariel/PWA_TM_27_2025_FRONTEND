import { useState } from "react"
import { createContext } from "react"

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    let isAuthenticated = Boolean(sessionStorage.getItem("access_token"))
    const [isAuthenticatedState, setIsAuthenticatedState] = useState(isAuthenticated)
    const login = (acces_token) => {
        sessionStorage.setItem('access_token', acces_token)
        setIsAuthenticatedState(true)
    }
    return (
        <AuthContext.Provider value={{isAuthenticatedState}}>
            {children}
        </AuthContext.Provider>
    )
}