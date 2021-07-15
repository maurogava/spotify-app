import { FC, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useAuthContext } from 'hooks/useAuth'

const Logout: FC = () => {
  const { user, setAuthData } = useAuthContext()

  useEffect(() => {
    setAuthData({}, true)
  }, [setAuthData])

  return <>{!user && <Redirect to="/" />}</>
}

export default Logout
