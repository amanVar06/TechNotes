import { useParams } from 'react-router-dom'
import EditUserForm from './EditUserForm'
// import { useSelector } from 'react-redux'
// import { selectUserById } from './usersApiSlice'

import { useGetUsersQuery } from './usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const EditUser = () => {
  const { id } = useParams()
  useTitle('techNotes: Edit User')

  // memoized selector to get the user by id
  // const user = useSelector(state => selectUserById(state, id))

  const { user } = useGetUsersQuery("usersList", {
      selectFromResult: ({ data }) => ({
          user: data?.entities[id]
      }),
  })

  // const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>

  if (!user) return <PulseLoader color={"#FFF"} />

  const content = <EditUserForm user={user} />

  return content
}

export default EditUser