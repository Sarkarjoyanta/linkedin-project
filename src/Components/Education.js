import React, {useState, useEffect} from 'react'
import {MdModeEdit} from 'react-icons/md'
import { getDatabase, ref, onValue, update } from "firebase/database";
import { useSelector } from 'react-redux';

const Education = () => {

  const db = getDatabase();

  let data = useSelector((state)=> state.userLoginInfo.userInfo)

  let[profileInfoList, setProfileInfoList] = useState([])

  let[editpost, setEditpost] = useState(false)
  let[schoolName, setSchoolName] = useState('')
  let[degreeName, setDegreeName] = useState('')
  let[passingYear, setPassingYear] = useState('')
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

   // edit education code here

   
  let handleEditPost = (id)=>{
    setEditpost(true)
    console.log("cheakeducation",id)
    setUpdateId(id)

  }

  let handleCencelPost = ()=>{
    setEditpost(false)
  }


  let handleFinalUpdate = ()=>{
    update(ref(db,"profileInfo/" + updateId),{
      schoolName: schoolName,
      degreeName: degreeName,
      passingYear: passingYear,
    }).then(()=>{
      setEditpost(false)
      setSchoolName('')
      setDegreeName('')
      setPassingYear('')
    })
  }


  return (
    <div>
      {/* editpost........start */}
      {editpost 
           ?
          <div className='w-full h-screen bg-blue-600 rounded p-5 absolute top-0 left-0 z-50 flex justify-center items-center'>
          <div>
          <p className='font-nunito font-bold text-xl text-yellow-600 mb-2'>SchoolName/CollegeName</p>
           <input onChange={(e)=>setSchoolName(e.target.value)} className=' w-[500px] px-2 py-4 border border-solid border:bg-black rounded p-2' type='text' value={schoolName} />

           <p className='font-nunito font-bold text-xl text-yellow-600 mb-2 mt-2'>Degree Name</p>
           <input onChange={(e)=>setDegreeName(e.target.value)} className=' w-[500px] px-2 py-4 border border-solid border:bg-black rounded p-2' type='text' value={degreeName} />

           <p className='font-nunito font-bold text-xl text-yellow-600 mb-2 mt-2'>Passing Year</p>
           <input onChange={(e)=>setPassingYear(e.target.value)} className=' w-[500px] px-2 py-4 border border-solid border:bg-black rounded p-2' type='text' value={passingYear} />
           <br />
          <button onClick={handleFinalUpdate} className='inline-block border border-solid border:bg-green-600 text-white text-base font-nunito font-bold mt-5 mr-5 bg-green-600 py-1 px-3 rounded'>Update</button>
          <button onClick={handleCencelPost} className='inline-block border border-solid border:bg-red-600 bg-red-600 text-white text-base font-nunito font-bold py-1 px-3 rounded'>Cencel</button>
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
             <h3 className='font-nunito font-bold text-2xl text-black mt-2'>Education</h3>
             <MdModeEdit onClick={()=>handleEditPost(item.id)} className='absolute top-1 left-[120px] text-xl' />
            </div>
             <div className='mt-3 flex'>
              <div className='flex items-center'>
                <img src='images/education.png'/>
              </div>
              
                <div className='ml-5'>
                <h4 className='font-nunito font-bold text-xl text-[#222] mt-2 '>{item.schoolName}</h4>
                <h5 className='font-nunito font-semi-bold text-base text-[#444] mt-2'>{item.degreeName}</h5>
                <p className='font-nunito font-semibold text-sm text-[#444] mt-2'>{item.passingYear}</p>
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

export default Education