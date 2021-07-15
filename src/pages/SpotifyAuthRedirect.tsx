import { useEffect, FC } from 'react'
import { Redirect } from 'react-router-dom'
import { EStatus } from 'hooks/useFetch'
import { useAuth } from 'hooks/useAuth'

const SpotifyAuthRedirect: FC = () => {
  const { createToken, status, userStatus } = useAuth()

  useEffect(() => {
    createToken()
  }, [createToken])

  let comp = <p>Authenticating...</p>

  if (status === EStatus.error || userStatus === EStatus.error) {
    comp = <p>There was an Error</p>
  } else if (status === EStatus.success && userStatus === EStatus.success) {
    comp = <Redirect to="/dashboard" />
  }

  return <div>{comp}</div>
}

export default SpotifyAuthRedirect
