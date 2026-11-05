import React from 'react'
import { useParams } from 'react-router-dom'

function User() {
  const { id } = useParams()
  return (
    <div className='bg-pink-400  rounded-2xl width-full text-center text-2xl text-black-500 font-bold text-transform: uppercase'> user : {id} </div>
  )
}

export default User