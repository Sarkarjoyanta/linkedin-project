import React,{useState, useEffect} from 'react'
import { getDatabase, ref, onValue, update } from "firebase/database";
import { useSelector } from 'react-redux';

const Editbio = () => {

    const db = getDatabase();

    let data = useSelector((state)=> state.userLoginInfo.userInfo)
  
    let[editpost, setEditpost] = useState(false)
    let[profileInfoList, setProfileInfoList] = useState([])
    let[about, setAbout] = useState('')
    let[updateId, setUpdateId] = useState(false)

  
    
  
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
    setUpdateId(id)

  }


  let handleBioCencelPost = ()=>{
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
    <div>
      {/* editpost........start */}
      {editpost 
      ?
       <div className='w-[300px] bg-blue-600 rounded p-5 absolute top-20 left-[50%] translate-x-[-50%] z-50'>
       <input onChange={(e)=>setAbout(e.target.value)} className='w-full px-2 py-4 border border-solid border:bg-black rounded p-2' type='text' value={about} />
      <button onClick={handleFinalUpdate} className='inline-block border border-solid border:bg-white text-black text-base font-nunito font-bold mt-5 mr-5 bg-white py-1 px-3 rounded'>update</button>
       <button onClick={handleBioCencelPost} className='inline-block border border-solid border:bg-white text-black text-base font-nunito font-bold bg-white py-1 px-3 rounded'>Cencel</button>
       </div>  
       :
       <div>
        {profileInfoList.map((item)=>(
          <div>
           <div>
          <p className='font-nunito font-regular text-base text-center text-[#222222]'>
           {item.about}
          </p>
          </div>
          <button onClick={()=>handleEditPost(item.id)} className='inline-block font-nunito font-medium text-base text-white px-3 py-1 border border-solid border:bg-blue-600 bg-blue-600 rounded mt-2'>Edit Bio</button>
        </div>
        ))}
       </div>
      }
      {/* editpost........end */}
    
    </div>
  )
}

export default Editbio