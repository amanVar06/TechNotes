import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {setCredentials} from "../../features/auth/authSlice";
// you can think of fetchBaseQuery as axios

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3500/api/v1',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token

        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    // console.log('Args', args) // request url, method, body
    // console.log(api) // signal, dispatch, getState()
    // console.log(extraOptions) //custom like {shout: true}

    let result = await baseQuery(args, api, extraOptions)

    // If you want, handle other status codes, too
    if (result?.error?.status === 403) {
        console.log('sending refresh token')

        // send refresh token to get new access token 
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if (refreshResult?.data) {

            // store the new token 
            api.dispatch(setCredentials({ ...refreshResult.data }))

            // retry original query with new access token
            result = await baseQuery(args, api, extraOptions)
        } else {

            // in code refreshResult?.error?.status === 403 is used which probably not correct as they changed expiresIn to 20 sec for refreshToken but maxAge for cookie stil 7 days, therefor I think we should use  401 instead of 403
            if (refreshResult?.error?.status === 401) {
                refreshResult.error.data.message = "Your login has expired. "
            }
            return refreshResult
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Note", "User"],
    endpoints: builder => ({})
});