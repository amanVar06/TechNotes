import { useEffect } from "react"

const useTitle = (title) => {

    useEffect(() => {
        const prevTitle = document.title
        document.title = title

        return () => document.title = prevTitle
        // a clean up function which sets the title back to the previous title
    }, [title])

}

export default useTitle