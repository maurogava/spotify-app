import { FC, useCallback } from 'react'
import { useAuthContext } from 'hooks/useAuth'
import { base64url, generateCodeChallenge, randomBytes } from 'utils/auth'
import styles from './SpotifyLogin.module.scss'

const {
  REACT_APP_AUTHORIZE_URL: spotifyURL,
  REACT_APP_CLIENT_ID: clientId,
  REACT_APP_REDIRECT_URL: redirectURI,
  REACT_APP_SCOPE: scope,
} = process.env

const SpotifyLogin: FC = () => {
  const { setAuthData } = useAuthContext()

  const beginLogin = useCallback(async () => {
    if (!clientId || !scope || !redirectURI || !spotifyURL) {
      throw new Error('There are some of the env variables missing')
    }

    const code_verifier = base64url(randomBytes(96))
    const state = base64url(randomBytes(96))

    const params = new URLSearchParams({
      response_type: 'code',
      code_challenge_method: 'S256',
      client_id: clientId,
      redirect_uri: redirectURI,
      code_challenge: await generateCodeChallenge(code_verifier),
      state,
      scope,
    })

    setAuthData({ codeVerifier: code_verifier, state }, true)

    location.href = `${spotifyURL}/authorize?${params}`
  }, [setAuthData])

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Spotify Playlist Creator</h1>
      <button className={styles.button} type="button" onClick={beginLogin}>
        Sign In
      </button>
    </div>
  )
}

export default SpotifyLogin
