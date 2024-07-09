import { useParams } from 'react-router-dom'
import EditNoteForm from './EditNoteForm'
// import { useSelector } from 'react-redux'
// import { selectNoteById } from './notesApiSlice'
// import { selectAllUsers } from '../users/usersApiSlice'

import { useGetNotesQuery } from './notesApiSlice'
import { useGetUsersQuery } from '../users/usersApiSlice'
import useAuth from '../../hooks/useAuth'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

// prevent an employee from editing another employee's note, using id of note and pasting it in the url

const EditNote = () => {
    
    useTitle('techNotes: Edit Note')
    
    const { id } = useParams()

    // const note = useSelector(state => selectNoteById(state, id))
    // const users = useSelector(selectAllUsers)

    const { username, isManager, isAdmin } = useAuth()

    const { note } = useGetNotesQuery("notesList", {
        selectFromResult: ({ data }) => ({
            note: data?.entities[id]
        }),
    })

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        }),
    })

    if (!note || !users?.length) return <PulseLoader color={"#FFF"} />

    if (!isManager && !isAdmin) {
        if (note.username !== username) {
            return <p className="errmsg">No access</p>
        }
    }

    const content = <EditNoteForm note={note} users={users} />

    // const content = note && users ? <EditNoteForm note={note} users={users} /> : <p>Loading...</p>

    return content
}

export default EditNote