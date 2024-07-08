import { apiSlice } from '../../app/api/apiSlice';
import { logOut } from './authSlice';

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
                    // const { data } = 
                    await queryFulfilled
                    // console.log('Data', data)
                    dispatch(logOut()) // this will set token to null in local state
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState())
                    }, 1000)
                    // this will clear out the cache and query subscriptions and everything to do with apiSlice
                    // wait for 1 sec before reseting the api state, for navigation
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
            })
        }),
    })
})


export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
} = authApiSlice 