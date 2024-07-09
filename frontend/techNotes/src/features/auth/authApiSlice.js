import { apiSlice } from '../../app/api/apiSlice';
import { logOut, setCredentials } from './authSlice';

// logout should be called an "action creator" as it exported from authSlice.actions

/*
when I login with Trust this device and try to logout immediately without any refresh api call occured, I am unable to return to home page. It stuck only there with no content.
I think it's because in authApiSlice, at login mutation we are not using setCredential to set access token but we're doing this in refresh mutation, therefore i guess in persist login component when I want to select current token, I can't find any,  resulting into an error during logout.

Think?
*/

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials }
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled
                    console.log('In login mutation', data)
                    const { accessToken } = data
                    dispatch(setCredentials({ accessToken }))
                } catch (err) {
                    console.log(err)
                }
            }
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