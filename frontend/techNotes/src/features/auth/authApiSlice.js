import { apiSlice } from '../../app/api/apiSlice';
import { logOut, setCredentials } from './authSlice';

// logout should be called an "action creator" as it exported from authSlice.actions

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log('In sendLogout mutation', data)
                    dispatch(logOut()) // this will set token to null in local state
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState())
                    }, 1000)
                    // this will clear out the cache and query subscriptions and everything to do with apiSlice
                    // if you don't do this your one subscription still active either notes or users check video for more info
                    // wait for 1 sec before reseting the api state, for navigation (see video 10 at 15:30)
                    // check it again
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log('In refresh mutation', data)
                    const { accessToken } = data
                    dispatch(setCredentials({ accessToken }))
                } catch (err) {
                    console.log(err)
                }
            }
        }),
    })
})


export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
} = authApiSlice 