import React from 'react'
import Chat from '../Components/Chat'
import Friends from '../Components/Friends'
// import Groups from '../Components/Groups'
import Header from '../Components/Header'

const Message = () => {
  return (
    <>
    <Header />
    <div className='flex justify-between'>
        <div className='w-[400px]'>
            <Friends />
            {/* <Groups /> */}
        </div>
        <div className='w-[990px]'>
            <Chat/>
        </div>
    </div>
    </>
  )
}

export default Message