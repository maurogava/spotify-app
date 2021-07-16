import { useCallback, useState, createContext, FC, ReactNode, useContext, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import useFetch from 'hooks/useFetch'
import { getToken, IToken, getUser as fetchUser, IUser } from 'api/spotify'

const { REACT_APP_CLIENT_ID: clientId, REACT_APP_REDIRECT_URL: redirectURI } = process.env

export interface IAuthData {
  accessToken?: string
  refreshToken?: string
  tokenType?: string
  scope?: string
  expiresIn?: number
  expiresAt?: number
  codeVerifier?: string
  state?: string
  user?: IUser
}

interface IAuthContext extends IAuthData {
  setAuthData: (data: IAuthData, refresh?: boolean) => void
}

interface IAuthContextProvider {
  children: ReactNode
}

const defaultAuthData = () => {
  const authData = localStorage.getItem('authData')
  if (authData) {
    return JSON.parse(authData)
  }

  return {}
}

export const AuthContext = createContext<IAuthContext>({
  ...defaultAuthData(),
  setAuthData: () => {},
})

export const useAuthContext = () => useContext(AuthContext)

export const AuthContextProvider: FC<IAuthContextProvider> = ({ children }) => {
  const [authData, setAuth] = useState<IAuthData>({ ...defaultAuthData() })

  const setAuthData = useCallback((data: IAuthData, refresh = false) => {
    const prevData = refresh ? null : localStorage.getItem('authData')
    const combinedData = { ...(prevData && JSON.parse(prevData)), ...data }

    localStorage.setItem('authData', JSON.stringify(combinedData))
    setAuth(combinedData)
  }, [])

  return (
    <AuthContext.Provider value={{ ...authData, setAuthData }}>{children}</AuthContext.Provider>
  )
}

const checkErrors = (params: URLSearchParams, state: string) => {
  if (params.has('error')) {
    throw new Error(params.get('error') ?? '')
  } else if (!params.has('state')) {
    throw new Error('State missing from response')
  } else if (params.get('state') !== state) {
    throw new Error('State mismatch')
  } else if (!params.has('code')) {
    throw new Error('Code missing from response')
  }
}

const parseTokenResponse = (res: IToken) => {
  const expiresAt = Date.now() + 1000 * res.expires_in

  return {
    scope: res.scope,
    accessToken: res.access_token,
    refreshToken: res.refresh_token,
    tokenType: res.token_type,
    expiresIn: res.expires_in,
    expiresAt,
  }
}

export const useAuth = () => {
  const { search } = useLocation()
  const history = useHistory()
  const { user, state, codeVerifier, accessToken, expiresAt, setAuthData } = useAuthContext()
  const { status, request } = useFetch(getToken, false)
  const { status: userStatus, request: userReq } = useFetch(fetchUser, false)

  const createToken = useCallback(async () => {
    if (accessToken && expiresAt && expiresAt > Date.now()) {
      return
    }

    const params = new URLSearchParams(search)
    const code = params.get('code')

    if (!clientId || !redirectURI || !code || !state || !codeVerifier) {
      // TODO: Handle the errors if some of these variables is missing
      return
    }

    checkErrors(params, state)

    // POST request to get the Token
    const res = await request({
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      redirect_uri: redirectURI,
      code_verifier: codeVerifier,
    })

    if (res) {
      setAuthData(parseTokenResponse(res))
    }
  }, [accessToken, codeVerifier, expiresAt, request, search, setAuthData, state])

  const getUser = useCallback(async () => {
    if (!accessToken || user) {
      return
    }
    // Request to get the user
    const res = await userReq()

    if (!res) {
      history.push('/login')
      return
    }

    setAuthData({ user: res })
  }, [accessToken, user, userReq, setAuthData, history])

  useEffect(() => {
    getUser()
  }, [getUser])

  return { createToken, status, userStatus }
}
