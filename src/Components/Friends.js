import React, { useState, useEffect } from 'react'
import {BsThreeDotsVertical} from 'react-icons/bs'
import { getDatabase, ref, onValue, remove} from "firebase/database";
import { useDispatch, useSelector } from 'react-redux';
import { activeChat } from '../slices/userSlice';

const Friends = () => {

  const db = getDatabase();
  let [friendList, setFriendList] = useState([])

  let dispatch = useDispatch()
  let data = useSelector((state)=> state.userLoginInfo.userInfo)



  useEffect(()=>{
    const friendRef = ref(db, 'friendlist/');
    onValue(friendRef, (snapshot) => {
        let arr = [];
    snapshot.forEach((item)=>{
        if(data.uid == item.val().receiverid || data.uid == item.val().senderid){
            arr.push({...item.val(), id: item.key})
        }
    })
    setFriendList(arr)
    });
    },[])

    let handleUnfriend = (item)=>{
      remove(ref(db, 'friendlist/' + item.id ))
    }

    let handleActiveSingleMsg = (item)=>{
      console.log("ac",item)
      if(item.receiverid === data.uid){
        dispatch(
          activeChat({
            status: 'single',
            id: item.senderid,
            name: item.sendername,
          })
        );
        localStorage.setItem(
          "activeChat",
          JSON.stringify({
            status: 'single',
            id: item.senderid,
            name: item.sendername,
          })
        );
  
        
      }else{
        dispatch(
          activeChat({
            status: 'single',
            id: item.receiverid,
            name: item.receivername,
          })
        );
        localStorage.setItem(
          "activeChat",
          JSON.stringify({
            status: 'single',
            id: item.receiverid,
            name: item.receivername,
          })
        );
  
  
      }
    }

  return (
    <div>
      <div className='mt-5 bg-white drop-shadow-md rounded py-3 px-5 h-[350px] overflow-y-scroll'>
        <h2 className='font-nunito font-bold text-xl'>Friends</h2>
        <BsThreeDotsVertical className='absolute top-4 right-4'/>

        {friendList.length == 0 ? 
        <h3 className='font-Nunito font-bold text-base bg-red-600 rounded p-2 text-white mt-4'>No Friend avilable</h3>
        :
        <>
        {friendList.map((item)=>(
        <div onClick={()=>handleActiveSingleMsg(item)} className='flex items-center gap-x-2 mb-4 mt-4'>
          <div className='w-[52px] h-[52px] rounded-full'>
            <img className='w-full h-full rounded-full' src="images/post1.png"/>
          </div>
          <div>
          <h3 className='font-Nunito font-semibold text-xl cursor-pointer'>
            {
            data.uid == item.senderid 
            ? 
            item.receivername 
            :
            item.sendername
            }
          </h3>
          <h3 className='font-nunito font-regular text-sm text-black'>Mern Stack Developer</h3>
          </div>

          <div className='ml-8'>
            <button onClick={()=>handleUnfriend(item)} className='font-Nunito font-medium text-base text-white bg-red-600 px-3 py-1 rounded'>
                Unfriend
            </button>
          </div>
       </div> 
        ))}
        </>
       } 

      </div>
    </div>
  )
}

export default Friends