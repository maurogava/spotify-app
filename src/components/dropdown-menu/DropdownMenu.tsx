import { FC, Children, useState, useEffect, ReactElement } from 'react'
import { cx } from 'utils/utils'
import Label, { ILabel } from './Label'
import Item, { IItem } from './Item'

import style from './DropdownMenu.module.scss'

interface IDropdownMenu {
  children: ReactElement[]
  className?: string
}

interface IDropdownComposition {
  Label: FC<ILabel>
  Item: FC<IItem>
}

const DropdownMenu: FC<IDropdownMenu> & IDropdownComposition = ({ children, className = '' }) => {
  const [isOpened, setIsOpened] = useState(false)

  useEffect(() => {
    // We just want to execute this effect if `isOpened = true`.
    if (!isOpened) {
      return
    }

    const closeMenu = () => {
      setIsOpened(false)
    }

    document.addEventListener('click', closeMenu)
    // eslint-disable-next-line consistent-return
    return () => document.removeEventListener('click', closeMenu)
  }, [isOpened])

  const showMenu = () => {
    setIsOpened(true)
  }

  const childrenArray = Children.toArray(children) as ReactElement[]
  const label = childrenArray.find((child) => child?.type === Label)
  const items = childrenArray.filter((child) => child?.type === Item)

  return (
    <div className={cx(style.container, className)}>
      <button
        type="button"
        className={cx(style.button, label?.props?.className)}
        onClick={showMenu}
      >
        {label}
      </button>
      <div className={cx(style.listWrapper, isOpened && style.isOpened)}>{items}</div>
    </div>
  )
}

DropdownMenu.Label = Label
DropdownMenu.Item = Item

export default DropdownMenu
