import React, {useState, useEffect} from 'react'
import {MdModeEdit} from 'react-icons/md'
import { getDatabase, ref, onValue, update } from "firebase/database";
import { useSelector } from 'react-redux';


const About = () => {

  const db = getDatabase();

  let data = useSelector((state)=> state.userLoginInfo.userInfo)

  let[editpost, setEditpost] = useState(false)
  let[updateId, setUpdateId] = useState(false)
  let[about, setAbout] = useState('')

  let[profileInfoList, setProfileInfoList] = useState([])



  useEffect(()=>{
    const starCountRef = ref(db, 'profileInfo/');
    onValue(starCountRef, (snapshot) => {
    let arr = []
    snapshot.forEach((item)=>{
      if(data.uid == item.val().userid){
        arr.push({...item.val(), id:item.key})
      }
    })
    setProfileInfoList(arr)
    });
   },[])

  // edit about code here

   
  let handleEditPost = (id)=>{
    setEditpost(true)
    console.log(id)
    setUpdateId(id)

  }

  let handleCencelPost = ()=>{
    setEditpost(false)
  }


  let handleFinalUpdate = ()=>{
    update(ref(db,"profileInfo/" + updateId),{
      about: about,
    }).then(()=>{
      setEditpost(false)
      setAbout('')
    })
  }





  return (
    <div className='mb-5'>
       {/* editpost........start */}
       {editpost 
       ?
       <div className='w-full h-screen bg-blue-600 rounded p-5 absolute top-0 left-0 z-50 flex justify-center items-center'>
       <div className='w-[300px]'>
        <p className='font-nunito font-bold text-xl text-yellow-600 mb-2'>Write somthing</p>
       <input onChange={(e)=>setAbout(e.target.value)} className='w-full px-2 py-4 border border-solid border:bg-black rounded p-2' type='text' value={about} />
       <button onClick={handleFinalUpdate} className='inline-block border border-solid border:bg-green-600 text-black text-base font-nunito font-bold mt-5 mr-5 bg-green-600 py-1 px-3 rounded'>Update</button>
       <button onClick={handleCencelPost} className='inline-block border border-solid border:bg-red-600 text-black text-base font-nunito font-bold bg-red-600 py-1 px-3 rounded'>Cencel</button>
       </div> 
      </div> 
       : 
    
      <div className='p-5 rounded drop-shadow-lg bg-white border border-solid border:bg-[#444]'>
        <div className='relative'>
          <h3 className='font-nunito font-bold text-2xl text-black mt-2 mb-3'>About</h3>
         {profileInfoList.map((item)=>(
          <div>
           <MdModeEdit onClick={()=>handleEditPost(item.id)} className='absolute top-1 left-20 text-xl' />
           <p className='font-nunito font-medium text-base text-black'>{item.about}</p>
           </div>
         ))}
         </div>

        <a className='font-nunito font-regular text-base text-[#0275B1]' href='#'>See More</a>
      </div>
      }

     
    </div>
  )
}

export default About