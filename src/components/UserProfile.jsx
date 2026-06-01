import React from 'react'
import Data from "./../db.json"
import { useParams } from 'react-router-dom'

const UserProfile = () => {
    const { id } = useParams()

    const user = Data.find(user => user.id == id)

    if (!user) {
        return <div>User not found</div>
    }


    return (
        <div>
            <strong>{user.role}</strong>
            <p>{user.age}</p>

        </div>
    )
}

export default UserProfile