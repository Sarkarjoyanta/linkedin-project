import React, { useEffect, useState } from 'react'
import {BiCloudUpload} from 'react-icons/bi'
import {TiDelete} from 'react-icons/ti'
import { useSelector } from 'react-redux'
import { getDatabase, ref, set, push, onValue, remove } from "firebase/database";
import { getStorage, ref as storageref, uploadBytes, getDownloadURL } from "firebase/storage";

const Projects = () => {


  const db = getDatabase()
  let data = useSelector((state)=> state.userLoginInfo.userInfo)
  console.log('abc',data)
  const storage = getStorage();



  let[projectUploadModal, setProjectUploadModal] = useState(false)
  let[projectList, setProjectList] = useState([])
  

  let handleProjectUploadCencel = ()=>{
    setProjectUploadModal(false)
  }


  let handleProjectUploadFile=(e)=>{
    console.log(e.target.files[0].name)
        const storageRef = storageref(storage, 'Project-pic/' + e.target.files[0].name,);
        uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
          getDownloadURL(storageRef).then((downloadURL) => {
            set(push(ref(db, 'projects/')), {
              statusname:data.displayName,
              statusid:data.uid,
              imgProjectFile: downloadURL,
            }).then(()=>{
              setProjectUploadModal(false)
            })
          });
        });
  }



  useEffect(()=>{
    const starCountRef = ref(db, 'projects/');
    onValue(starCountRef, (snapshot) => {
    let arr=[]
    snapshot.forEach((item)=>{
    if(data.uid == item.val().statusid){
        arr.push({...item.val(), id:item.key})
    }
    })
    setProjectList(arr)
    });
  },[])

  let handleDeleteProject = (item)=>{
    remove(ref(db, 'projects/' + item.id))
  }


  return (
    <div>

          {projectUploadModal
           ?
            <div className='w-full h-screen bg-blue-500 absolute top-0 left-0 flex justify-center items-center z-50'> 
            <div className='w-[600px] bg-white rounded p-5 text-center'>
              <h3 className='font-nunito font-bold text-2xl mb-6 text-center'>Upload your project</h3>
              <div className='flex justify-center'>
              </div>
              <input onChange={handleProjectUploadFile} className='mt-4' type='file'/>
              <div className='mt-5'>
              <button className='inline-block border border-solid border:bg-blue-500 bg-blue-500 rounded py-2 px-5 mr-5 text-white text-base font-nunito font-bold'>Upload</button>
              <button onClick={handleProjectUploadCencel} className='inline-block border border-solid border:bg-red-500 bg-red-500 rounded py-2 px-5 text-white text-base font-nunito font-bold'>Cancel</button>
              </div>
            </div>
          </div>
          :
        <div className='w-[850px] p-5 rounded drop-shadow-lg bg-white border border-solid border:bg-[#444]'>
        <div className='flex'>
        <div >
        <h3 className='font-nunito font-bold text-2xl text-black mt-2 mb-5'>Projects</h3>
          <div className='relative '>
            <div className='flex gap-x-7 flex-wrap'>
              {
                projectList.length == 0
                ?
                <img className='w-[250px] h-[160px]' src="images/project-pic.png"/>
                :
                (projectList.map((item)=>(
                <div className='w-[250px] h-[160px] mb-7 relative'>
                 <img className='w-full h-full' src={item.imgProjectFile}/>
                 <TiDelete onClick={()=>handleDeleteProject(item)} className='text-3xl text-black absolute top-0 right-0'/>
                </div>
              )))
              }
            </div>
           <div className='w-[250px] h-[160px] bg-[rgba(0,0,0,0.5)] absolute top-0 left-0 flex justify-center items-center opacity-0 hover:opacity-100 duration-300 z-20'>
            <BiCloudUpload onClick={()=>setProjectUploadModal(true)} className='text-4xl text-white' />
           </div>
          </div>
        </div>
       </div>
          
     </div>
     }
    </div>
  )
}

export default Projects