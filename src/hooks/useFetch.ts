import { useCallback, useEffect, useState } from 'react'

import useShallowCompareMemo from 'hooks/useShallowCompareMemo'
import { useAuthContext } from 'hooks/useAuth'
import { IHttpResponse } from 'api/fetch'
import { useHistory } from 'react-router-dom'

export enum EStatus {
  success = 'success',
  loading = 'loading',
  error = 'error',
  idle = 'idle',
}

interface IFetch<T> {
  res?: T
  error?: string | number
  status: EStatus
}

type TPayload = Record<string, string>

interface IReturnedData<T> extends IFetch<T> {
  request: (payload?: TPayload) => Promise<T | undefined>
}

export const useFetch = <Res>(
  apiCall: (payload?: TPayload, conf?: RequestInit) => Promise<IHttpResponse<Res>>,
  payload: TPayload | boolean = true
): IReturnedData<Res> => {
  const [fetchResponse, setFetchResponse] = useState<IFetch<Res>>({
    status: EStatus.idle,
  })

  const history = useHistory()

  const { accessToken, tokenType } = useAuthContext()

  const request = useCallback(
    async (data) => {
      let response
      let conf

      if (accessToken && tokenType) {
        conf = {
          headers: {
            Authorization: `${tokenType} ${accessToken}`,
          },
        }
      }

      setFetchResponse((prev) => ({
        ...prev,
        status: EStatus.loading,
      }))

      try {
        const res = await apiCall(data, conf)
        response = res.parsedBody

        if (!res.ok) {
          setFetchResponse({
            res: undefined,
            status: EStatus.error,
            error: res.status,
          })

          res.status === 401 && history.push('/login')
        } else {
          setFetchResponse({
            res: response,
            status: EStatus.success,
            error: undefined,
          })
        }
      } catch (err) {
        const error = `There was an error fetching the data: ${err}`

        setFetchResponse({
          res: undefined,
          status: EStatus.error,
          error,
        })
      }

      return response
    },
    [accessToken, apiCall, history, tokenType]
  )

  useEffect(() => {
    if (payload === false) {
      return
    }

    request(payload === true ? undefined : payload)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request, useShallowCompareMemo(payload)])

  return { ...fetchResponse, request }
}

export default useFetch
