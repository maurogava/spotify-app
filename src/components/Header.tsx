import { useCallback, FC } from 'react'
import { useAuthContext } from 'hooks/useAuth'
import { ReactComponent as LogoIcon } from 'assets/logo.svg'
import { ReactComponent as MenuIcon } from 'assets/action-button.svg'
import { useHistory, Link } from 'react-router-dom'
import DropdownMenu from 'components/dropdown-menu/DropdownMenu'

import styles from './Header.module.scss'

const { Label, Item } = DropdownMenu

const Header: FC = () => {
  const { user } = useAuthContext()
  const history = useHistory()

  const handleLogout = useCallback(() => {
    history.push('/logout')
  }, [history])

  return (
    <div className={styles.header}>
      <span className={styles.logoWrapper}>
        <LogoIcon className={styles.logo} />
        {user?.display_name}
      </span>

      {user && (
        <DropdownMenu>
          <Label>
            <MenuIcon className={styles.menuIcon} />
          </Label>
          <Item>
            <Link className={styles.button} to="/">
              Home
            </Link>
          </Item>
          <Item>
            <Link className={styles.button} to="/library">
              Play lists
            </Link>
          </Item>
          <Item>
            <button className={styles.button} type="button" onClick={handleLogout}>
              Logout
            </button>
          </Item>
        </DropdownMenu>
      )}
    </div>
  )
}

export default Header
