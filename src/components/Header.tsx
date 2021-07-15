import { useCallback, FC } from 'react'
import { useAuthContext } from 'hooks/useAuth'
import { ReactComponent as Logo } from 'assets/logo.svg'
import { useHistory } from 'react-router-dom'

import styles from './Header.module.scss'

const Header: FC = () => {
  const { user } = useAuthContext()
  const history = useHistory()

  const handleLogout = useCallback(() => {
    history.push('/logout')
  }, [history])

  return (
    <div className={styles.header}>
      <span className={styles.logoWrapper}>
        <Logo className={styles.logo} />
        {user?.display_name}
      </span>

      {user && (
        <button className={styles.logout} type="button" onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  )
}

export default Header
