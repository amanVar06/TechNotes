import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// you can think of fetchBaseQuery as axios

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500/api/v1" }),
    tagTypes: ["Note", "User"],
    endpoints: builder => ({})
});