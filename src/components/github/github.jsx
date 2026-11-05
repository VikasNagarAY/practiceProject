import React from 'react'
import { useLoaderData } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Github() {

    // const data = useLoaderData()
    const [data, setData] = useState(0);
    useEffect(() => {
        fetch('https://api.github.com/users/hiteshchoudhary')
            .then((response) => response.json())
            .then((data) => setData(data));
    }, []);

  return (
    <div className='bg-pink-400  rounded-2xl width-full text-center text-2xl    text-black-500 font-bold text-transform: uppercase flex flex-col justify-center items-center gap-4'>
        <p className='bg-pink-400  rounded-2xl width-full text-center text-2xl text-black-500 font-bold text-transform: uppercase'> Github name : {data.name} </p>
        <p className='bg-pink-400  rounded-2xl width-full text-center text-2xl text-black-500 font-bold text-transform: uppercase'> Github repo : {data.public_repos} </p>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'onClick={() => window.open(data.html_url, '_blank')}>
            repo
        </button>
        <h1 className='bg-pink-400  rounded-2xl width-full text-center text-2xl text-black-500 font-bold text-transform: uppercase'> Github followers : {data.followers} </h1>
        <img src={data.avatar_url} alt="github profile" className='rounded-full w-32 h-32' />
    </div>
  )
}

export default Github