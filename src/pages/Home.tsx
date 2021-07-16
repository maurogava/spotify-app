import { FC } from 'react'
import useFetch, { EStatus } from 'hooks/useFetch'
import { getCurrentlyPlaying } from 'api/spotify'
import PlayerInfo from 'components/PlayerInfo'

const Home: FC = () => {
  const { res, status } = useFetch(getCurrentlyPlaying)

  let content = <>...loading</>

  if (status === EStatus.success) {
    content = <PlayerInfo info={res} />
  }

  return <>{content}</>
}

export default Home
