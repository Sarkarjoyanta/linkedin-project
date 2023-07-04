import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Footer from '../Components/Footer'
import Header from '../Components/Header'
import Post from '../Components/Post'
import { getAuth, onAuthStateChanged  } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { userLoginInfo } from '../slices/userSlice'


const Home = () => {

  let auth = getAuth()
  let navigate = useNavigate()
  let dispatch = useDispatch()
  let data = useSelector((state)=> state.userLoginInfo.userInfo)

  let [verify, setVerify] = useState(false)

  onAuthStateChanged(auth, (user) => {
    if (user.emailVerified){
      setVerify(true)
      dispatch(userLoginInfo(user))
      localStorage.setItem('userInfo',JSON.stringify(user))
    }
  });

  useEffect(()=>{
    if(!data){
      navigate('/login')
    }
  },[])

  return (
    <div>
      {verify 
      ? 
      <>
      <Header />
      <Post />
      <Footer/>
      </>
      :
      <div className='w-full h-screen flex justify-center items-center'>
        <h2 className='font-Nunito font-bold text-3xl text-white bg-[#5F35F5] p-5 rounded-lg'>Please verify your email</h2>
      </div>
      }
    
    </div>
    
    
    
  )
}

export default Home