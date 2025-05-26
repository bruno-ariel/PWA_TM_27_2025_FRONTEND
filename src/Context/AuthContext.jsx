import { useState , createContext , useEffect} from "react"

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const isAuthenticated = Boolean(sessionStorage.getItem('access_token'))
    const [isAuthenticatedState, setIsAuthenticatedState] = useState(isAuthenticated)
    const login = (acces_token) => {
        sessionStorage.setItem('access_token', acces_token)
        setIsAuthenticatedState(true)
    }    
    return (
        <AuthContext.Provider value={{isAuthenticatedState , login }}>
            {children}
        </AuthContext.Provider>
    )
}