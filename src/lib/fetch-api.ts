"use server"

export type TNoParams = Record<string, never>

export type FetchRequestParams<
	ResponseDataT = TNoParams,
	UrlParamsT = TNoParams,
	BodyParamsT = TNoParams,
	QueryParamsT = TNoParams,
> = {
	baseUrl?: string
	body?: BodyParamsT
	defaultData?: ResponseDataT
	headers?: Headers
	method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
	onError?: (error: Error) => void
	query?: QueryParamsT
	throwOnError?: boolean
	url: string
	urlParams?: UrlParamsT
	token?: string | null
}

export type FetchResponseResult<ResponseDataT = TNoParams> =
	| {
			data: ResponseDataT
			error: null
			status: number
			success: true
	  }
	| {
			data: null | ResponseDataT
			error: Error
			status: 0
			success: false
	  }

export async function fetchAPI<
	ResponseDataT = TNoParams,
	UrlParamsT = TNoParams,
	BodyParamsT = TNoParams,
	QueryParamsT = TNoParams,
>(
	params: FetchRequestParams<
		ResponseDataT,
		UrlParamsT,
		BodyParamsT,
		QueryParamsT
	>,
): Promise<FetchResponseResult<ResponseDataT>> {
	const {
		url,
		method,
		urlParams = {},
		query = {},
		body = {},
		headers = {},
		onError,
		defaultData,
		throwOnError,
		baseUrl,
		token,
	} = params

	const BASE_URL = baseUrl ?? process.env.NEXT_PUBLIC_BACKEND_URL
	// const API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY || ''

	if (!BASE_URL) {
		throw new Error("Backend URL not set in env!")
	}

	let resolvedUrl = BASE_URL + url
	for (const key in urlParams as Record<string, string>) {
		const value = (urlParams as Record<string, string>)[key]
		resolvedUrl = resolvedUrl
			.replace(`:${key}`, value.toString())
			.replace(`[${key}]`, value.toString())
	}

	// console.log({ resolvedUrl })

	const queryStr = new URLSearchParams(
		query as Record<string, string>,
	).toString()
	if (queryStr) {
		resolvedUrl += `?${queryStr}`
	}

	try {
		const response = await fetch(resolvedUrl, {
			method,
			headers: {
				"Content-Type": "application/json",
				// 'API-Key': API_KEY,
				token: token || "",
				...headers,
			},
			...(method !== "GET" && method !== "DELETE"
				? { body: JSON.stringify(body) }
				: {}),
			next: {
				revalidate: 0,
			},
		})

		// console.log({ response: response.status })
		const responseData = (await response.json()) as ResponseDataT
		// console.log({ responseData })

		return {
			success: true,
			status: response.status,
			data: responseData,
			error: null,
		}
	} catch (error) {
		const errorInstance = error as Error

		if (throwOnError) {
			throw errorInstance
		}

		if (onError) {
			onError(errorInstance)
		}

		console.log({ errorInstance })

		return {
			success: false,
			status: 0,
			data: defaultData ?? null,
			error: errorInstance,
		}
	}
}