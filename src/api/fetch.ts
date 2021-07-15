export interface IHttpResponse<T> extends Response {
  parsedBody?: T
}

async function http<T>(request: RequestInfo): Promise<IHttpResponse<T>> {
  const response: IHttpResponse<T> = await fetch(request)

  try {
    response.parsedBody = await response.json()
  } catch {
    if (response.ok) {
      return response
    }
  }

  if (!response.ok && !response.parsedBody) {
    throw new Error(response.statusText)
  }

  return response
}

export async function get<T>(
  path: string,
  params?: Record<string, string>,
  conf?: RequestInit
): Promise<IHttpResponse<T>> {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(conf && conf.headers),
  }
  const args = {
    method: 'GET',
    ...conf,
    headers,
  }
  return await http<T>(new Request(path, args))
}

export async function post<T>(
  path: string,
  params?: Record<string, string>,
  conf?: RequestInit
): Promise<IHttpResponse<T>> {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    ...(conf && conf.headers),
  }
  const args = {
    method: 'POST',
    body: new URLSearchParams({ ...params }),
    ...conf,
    headers,
  }

  return await http<T>(new Request(path, args))
}
