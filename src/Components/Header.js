import React from 'react'
import { FiLogOut } from 'react-icons/fi'
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { userLoginInfo } from '../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { NavLink } from "react-router-dom";

const Header = () => {


    let activeClassName  = "border-b-2 border-solid border-[blue]";
    

    let auth = getAuth()
    let navigate = useNavigate()
    let dispatch = useDispatch()

    let handleLogout = ()=>{
        signOut(auth).then(() => {
            dispatch(userLoginInfo('null'))
            localStorage.removeItem('userInfo')
            setTimeout(()=>{
                navigate('/login')
            })
          }).catch((error) => {
            console.log(error.code)
          });
    }


  return (
    <div className='p-2 border border-solid border:bg-[#444] bg-white drop-shadow-lg mx-auto'>
          <div className='flex'>
            <div className='w-1/5'>
                <img className='ml-1' src='images/logo.png'/>
            </div>
            <div className='w-3/5 flex justify-center items-center gap-x-8'>
              <NavLink
              to='/home'
              className={({ isActive }) =>
              isActive ? activeClassName  : ""
              }
              >
                <h2 className='font-nunito font-bold text-2xl text-blue-600'>Home</h2>
              </NavLink>
              <NavLink
              to='/profile'
              className={({ isActive }) =>
              isActive ? activeClassName  : ""
              }
              >
                <h2 className='font-nunito font-bold text-2xl text-blue-600'>Profile</h2>
              </NavLink>
              <NavLink
              to='/message'
              className={({ isActive }) =>
              isActive ? activeClassName  : ""
              }
              >
               <h2 className='font-nunito font-bold text-2xl text-blue-600'>Message</h2>
              </NavLink>
            </div>
            <div onClick={handleLogout} className='w-1/5 flex justify-end items-center gap-x-2'>
              <FiLogOut className='text-black text-3xl cursor-pointer'/>
              <h2 className='font-nunito font-semibold text-xl cursor-pointer'>Log Out</h2>
            </div>
          </div>
    </div>
  )
}

export default Header