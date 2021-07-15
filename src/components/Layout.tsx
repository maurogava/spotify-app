import { FC, ReactNode } from 'react'
import Header from 'components/Header'

import style from './Layout.module.scss'

interface ILayout {
  children: ReactNode
}

const Layout: FC<ILayout> = ({ children }) => {
  return (
    <div className={style.wrapper}>
      <Header />
      <div className={style.contentWrapper}>{children}</div>
    </div>
  )
}

export default Layout
