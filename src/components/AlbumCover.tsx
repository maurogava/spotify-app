import { FC, useRef, Fragment } from 'react'
import { IImage } from 'api/spotify'

import styles from './AlbumCover.module.scss'

const AlbumCover: FC<{ images: IImage[] }> = ({ images }) => {
  const hasDefaultImgRef = useRef(false)

  const imgs = images.map(({ width, url }) => {
    // Skip too small images
    if (hasDefaultImgRef.current) {
      return
    }

    if (!hasDefaultImgRef.current && width < 400) {
      hasDefaultImgRef.current = true

      return (
        <Fragment key={url}>
          <source srcSet={url} media={`(min-width: ${width}px)`} />
          <img src={url} alt="Album Cover" loading="lazy" />
        </Fragment>
      )
    }

    return <source key={url} srcSet={url} media={`(min-width: ${width}px)`} />
  })

  return <picture className={styles.picture}>{imgs}</picture>
}

export default AlbumCover
