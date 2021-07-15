import { get, post } from 'api/fetch'

const { REACT_APP_AUTHORIZE_URL: spotifyURL, REACT_APP_API_URL: apiUrl } = process.env

// Get Token
export interface IToken {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
}

export const getToken = (params?: Record<string, string>) =>
  post<IToken>(`${spotifyURL}/api/token`, params)

// Get User Data
export interface IUser {
  id: string
  display_name: string
  email: string
  external_urls: {
    spotify: string
  }
  followers: {
    href: string | null
    total: number
  }
  href: string
  images: []
  type: string
  uri: string
}

export const getUser = (params?: Record<string, string>, conf?: RequestInit) =>
  get<IUser>(`${apiUrl}/v1/me`, params, conf)

// Get Current
interface IArtist {
  id: string
  name: string
  type: string
  href: string
}

export interface IImage {
  height: number
  width: number
  url: string
}

export interface ICurrentPlaying {
  is_playing: boolean
  progress_ms: number
  item: {
    album: {
      album_type: string
      name: string
      href: string
      images: IImage[]
      elease_date: string
      type: string
    }
    artists: IArtist[]
    duration_ms: number
    id: string
    name: string
    track_number: number
    type: string
  }
}

export const getCurrentlyPlaying = (params?: Record<string, string>, conf?: RequestInit) =>
  get<ICurrentPlaying>(`${apiUrl}/v1/me/player/currently-playing`, params, conf)
