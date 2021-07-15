import { FC } from 'react'
import { ICurrentPlaying } from 'api/spotify'
import AlbumCover from 'components/AlbumCover'

import styles from './PlayerInfo.module.scss'

const PlayerInfo: FC<{ info?: ICurrentPlaying }> = ({ info }) => {
  if (!info) {
    return <>Currently there isn't a song being played</>
  }

  const {
    item: {
      album: { images, name: albumName },
      artists,
      name: songName,
    },
    is_playing: isPlaying,
  } = info

  const artistName = artists.length && artists[0]?.name

  return (
    <div className={styles.wrapper}>
      <AlbumCover images={images} />
      <p>{isPlaying ? 'Currently playing' : 'Currently paused'}</p>
      <p className={styles.song}>{songName}</p>
      <p className={styles.artist}>{artistName}</p>
      <p className={styles.album}>{albumName}</p>
    </div>
  )
}

export default PlayerInfo
