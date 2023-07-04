import React, { useState, useEffect } from 'react'
import { getDatabase, ref, onValue, update } from "firebase/database";
import {MdModeEdit} from 'react-icons/md'
import { useSelector } from 'react-redux';

const Experience = () => {

  const db = getDatabase();
  let[profileInfoList, setProfileInfoList] = useState([])
  
  let data = useSelector((state)=> state.userLoginInfo.userInfo)

  let[editpost, setEditpost] = useState(false)
  let[workTitle, setWorkTitle] = useState('')
  let[companyName, setCompanyName] = useState('')
  let[experienceYear, setExperienceYear] = useState('')
  let[updateId, setUpdateId] = useState(false)


  useEffect(()=>{
    const starCountRef = ref(db, 'profileInfo/');
    onValue(starCountRef, (snapshot) => {
    let arr=[]
    snapshot.forEach((item)=>{
      if(data.uid == item.val().userid){
        arr.push({...item.val(), id:item.key})
      }
    })
    setProfileInfoList(arr)
    });
   },[])

   // edit experience code here

   
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
      workTitle: workTitle,
      companyName: companyName,
      experienceYear: experienceYear,
    }).then(()=>{
      setEditpost(false)
      setWorkTitle('')
      setCompanyName('')
      setExperienceYear('')
    })
  }


  return (
    <div>
      {/* editpost........start */}
      {editpost 
           ?
          <div className='w-full h-screen bg-blue-600 rounded p-5 absolute top-0 left-0 z-50 flex justify-center items-center'>
          <div>
          <p className='font-nunito font-bold text-xl text-green-600 mb-2'>Work Title</p>
           <input onChange={(e)=>setWorkTitle(e.target.value)} className=' w-[500px] px-2 py-4 border border-solid border:bg-black rounded p-2' type='text' value={workTitle} />

           <p className='font-nunito font-bold text-xl text-green-600 mb-2 mt-2'>Company Name</p>
           <input onChange={(e)=>setCompanyName(e.target.value)} className=' w-[500px] px-2 py-4 border border-solid border:bg-black rounded p-2' type='text' value={companyName} />

           <p className='font-nunito font-bold text-xl text-green-600 mt-2 mb-2'>Experience Year</p>
           <input onChange={(e)=>setExperienceYear(e.target.value)} className=' w-[500px] px-2 py-4 border border-solid border:bg-black rounded p-2' type='text' value={experienceYear} />
           <br />
          <button onClick={handleFinalUpdate} className='inline-block border border-solid border:bg-green-600 text-black text-base font-nunito font-bold mt-5 mr-5 bg-green-600 py-1 px-3 rounded'>Update</button>
          <button onClick={handleCencelPost} className='inline-block border border-solid border:bg-red-600 text-black text-base font-nunito font-bold bg-red-600 py-1 px-3 rounded'>Cencel</button>
          </div>  
         </div>  
        
         :
        <div className='w-[850px] p-5 rounded mt-4 drop-shadow-lg bg-white border border-solid border:bg-[#444]'>
          {profileInfoList.length == 0
          ?
          <h3 className='font-nunito font-bold text-2xl bg-red-600 text-white p-5 rounded'>No Post Avilable</h3>
          :
          (profileInfoList.map((item)=>(
            <div>
            <div className='relative'>
             <h3 className='font-nunito font-bold text-2xl text-black mt-2'>Experience</h3>
             <MdModeEdit onClick={()=>handleEditPost(item.id)} className='absolute top-1 left-[135px] text-xl' />
            </div>
             <div className='mt-3 flex'>
              <div className='flex items-center'>
                <img src='images/Experience-1.png'/>
              </div>
              
                <div className='ml-5'>
                <h4 className='font-nunito font-bold text-xl text-[#222] mt-2 '>{item.workTitle}</h4>
                <h5 className='font-nunito font-semibold text-base text-[#444] mt-2'>{item.companyName}</h5>
                <p className='font-nunito font-semibold text-sm text-[#444] mt-2'>{item.experienceYear}</p>
              </div>
              </div>
            </div>
              )))
             }
          </div>
           }
    </div>
  )
}

export default Experience