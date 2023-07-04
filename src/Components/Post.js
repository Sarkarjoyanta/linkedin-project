import React, { useEffect, useState } from 'react'
import {BiImages} from 'react-icons/bi'
import {FiSend} from 'react-icons/fi'
import { getDatabase, ref, set, push, onValue, remove, update } from "firebase/database";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Editbio from './Editbio';
import { getDownloadURL, getStorage, ref as storageref, uploadBytes } from "firebase/storage";
import Userlist from './Userlist';
import { RotatingLines } from 'react-loader-spinner';
import moment from 'moment';
import GroupList from './GroupList';
import Mygroups from './Mygroups';


const Post = () => {

  const db = getDatabase()
  let data = useSelector((state)=> state.userLoginInfo.userInfo)
  console.log('abc',data)
  const storage = getStorage();


  let[postmsg, setPostMsg] = useState('')
  let[postmsgerr, setPostMsgerr] = useState('')

  let[photoPostTitle, setPhotoPostTitle] = useState('')
  let[photoPostFile, setPhotoPostFile]=useState(null)
  let[postUploadModal, setPostUploadModal] = useState(false)
  let[loading, setLoading] = useState(false)
  let[coverImgList, setCoverImgList] = useState([])
  let[profileInfoList, setProfileInfoList] = useState([])
 
  let[postlist, setPostList] = useState([])
  let[editpost, setEditpost] = useState(false)
  let[editpostlist, setEditPostList] = useState('')
  let[editpostlisterr, setEditPostListerr] = useState('')
  let[updateId, setUpdateId] = useState(false)

 

  let handlePostUpdate = (e)=>{
    setPostMsg(e.target.value)
    setPostMsgerr('')
  }


  let handlePostMsgSend = ()=>{
    if(!postmsg){
      setPostMsgerr("please write somthing...")
    }else{
      set(push(ref(db,'postmsgimg/')),{
        userid: data.uid,
        username: data.displayName,
        msg: postmsg,
        date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}- ${new Date().getHours()}  ${new Date().getMinutes()}`
      }).then(()=>{
        setPostMsg('')
      })
    }
    
  }

 


  let handlePostRemoved = (item)=>{
    console.log(item)
    remove(ref(db, 'postmsgimg/' + item.id ))
  }


  let handleImgUploadCencel = ()=>{
    setPostUploadModal(false)
  }
  
  
  let handleImgPostUploadModal = ()=>{
    setPostUploadModal(true)
  }


  let hanldePhotoPostFIle=(e)=>{
    console.log(e.target.files[0].name)
    const storageRef = storageref(storage, e.target.files[0].name);
    uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        setPhotoPostFile(downloadURL)
      });
    });
  }

let photoPostsend = ()=>{
  set(push(ref(db, "postmsgimg/")),{
    userid: data.uid,
    username: data.displayName,
    postmsg: photoPostTitle,
    postimage: photoPostFile,
    date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}- ${new Date().getHours()}  ${new Date().getMinutes()}`
  }).then(() => {
  setPostUploadModal(false)
  setPhotoPostTitle('')
  setLoading(false)
  })

  }




  useEffect(()=>{
    const starCountRef = ref(db, "postmsgimg/" );
        onValue(starCountRef, (snapshot) => {
          let arr=[]
          snapshot.forEach((item)=>{
            console.log('posimgmsg', item.val())
            arr.push({...item.val(), id: item.key})
          })
          setPostList(arr)
        });
  },[])


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
  
 
  // Edit post code here


  let handleEditPost = (id)=>{
    setEditpost(true)
    setUpdateId(id)
  }

  let handleCencelPost = ()=>{
    setEditpost(false)
  }

  let handleUpdatePost = (e)=>{
    setEditPostList(e.target.value)
    setEditPostListerr('')
  }

  let handleFinalUpdate = ()=>{
    if(!editpostlist){
      setEditPostListerr("Please write something.")
    }else{
      update(ref(db,"postmsgimg/" + updateId),{
        msg: editpostlist,
        postmsg: photoPostTitle,
      }).then(()=>{
        setEditpost(false)
        setEditPostList('')
      })
    }
  }
  
  // cover pic code

  useEffect(() => {
    const starCountRef = ref(db, 'coverpic/');
    onValue(starCountRef, (snapshot) => {
      let arr = []
      snapshot.forEach((item) => {
        if (data.uid == item.key) {
          arr.push(item.val())
        }
      })
      setCoverImgList(arr)
    });
  }, [])
 


  return (
    <div>
      <div className='flex ml-2'>
            <div className='w-1/5'>
              <Userlist />
              <GroupList />
            </div>

               {/* photopostmodal code start..... */}
            {postUploadModal 
            ?
            <div className='w-full h-screen bg-blue-500 absolute top-0 left-0 flex justify-center items-center z-50'>
              <div className='w-[600px] bg-white rounded p-5'>
                <h3 className='font-nunito font-bold text-2xl mb-6 text-center'>Upload your post</h3>
               <h1 className='font-nunito text-xl font-bold text-primary'>Photo Title</h1>
               <input onChange={(e)=>setPhotoPostTitle(e.target.value)} className='font-nunito w-full py-3 border border-solid rounded-md border-primary  text-xl px-5 text-primary block mt-5 mb-5' type='input' value={photoPostTitle}/>
               <h1 className='font-nunito text-xl font-bold text-primary'>Photo Post</h1>
               <input onChange={hanldePhotoPostFIle} className='font-nunito text-xl text-primary block mt-5 mb-5' type='file'/>
               <p className='font-nunito font-regular text-base text-green-600 mt-4'>After select image and wait few second then click upload button</p>
                {loading
                 ?
               <div className="flex justify-center mt-2">
                <RotatingLines
                 strokeColor="grey"
                 strokeWidth="5"
                 animationDuration="0.75"
                 width="50"
                 visible={true}
                />
                </div>
                :
                <div className='mt-5'>
                <button onClick={photoPostsend} className='inline-block border border-solid border:bg-blue-500 bg-blue-500 rounded py-2 px-5 mr-5 text-white text-base font-nunito font-bold'>Upload</button>
                <button onClick={handleImgUploadCencel} className='inline-block border border-solid border:bg-red-500 bg-red-500 rounded py-2 px-5 text-white text-base font-nunito font-bold'>Cancel</button>
                </div>
               }
              </div>
            </div>
            :
            <div className='w-3/5 ml-12'>
                   <h2 className='font-nunito font-bold text-2xl mt-2.5 mb-3'>New Post</h2>
                   <div className='relative w-[750px]'>
                   <input onChange={handlePostUpdate} value={postmsg} className='py-7 w-full rounded p-5 font-nunito font-regular text-black text-2xl border border-solid border:bg-[#444444] drop-shadow-lg'  type='text' placeholder="What's on your mind... "/>
                   {postmsgerr &&
                   <p className='font-nunito font-regular w-[500px] text-base text-white bg-red-500 p-2 rounded mt-1 ml-0'>{postmsgerr}</p>
                   }
                   <BiImages onClick={handleImgPostUploadModal} className='absolute right-14 top-8 text-2xl'/>
                   <FiSend onClick={handlePostMsgSend} className='absolute right-4 top-8 text-2xl'/>
                  </div>
                  <div className='w-[750px] h-[500px] mt-5 ml-0 overflow-y-scroll'>
                    {/* post-1 start */}
                    {/* editpost........start */}
                   {editpost
                   ?
                  <div className='w-full h-screen bg-blue-600 rounded p-5 absolute top-0 left-0 z-50 flex justify-center items-center'>
                  <div className='w-[300px]'>
                  <input onChange={handleUpdatePost} className='w-full px-2 py-4 border border-solid border:bg-black rounded p-2' type='text' value={editpostlist}/>
                  {editpostlisterr &&
                  <p className='font-nunito font-regular text-base text-white bg-red-600 p-1 mt-1 rounded'>{editpostlisterr}</p>
                  }
                  <button onClick={handleFinalUpdate} className='inline-block border border-solid border:bg-white text-black text-base font-nunito font-bold mt-5 mr-5 bg-white py-1 px-3 rounded'>Update</button>
                  <button onClick={handleCencelPost} className='inline-block border border-solid border:bg-white text-black text-base font-nunito font-bold bg-white py-1 px-3 rounded'>Cancel</button>
                 </div>
                 </div>
                 :
                    <div>
                    {postlist.map((item)=>(
                      <div className='relative mb-4 bg-white p-5 border border-solid border:bg-[#444] drop-shadow-lg'>
                      <div className='flex'>
                        {
                          data.uid == item.userid
                          ?
                          <div className='w-[52px] h-[52px] rounded-full'>
                           <img className='w-full h-full rounded-full' src={data.photoURL}/>
                         </div>
                          :
                          <div className='w-[52px] h-[52px] rounded-full'>
                           <img className='w-full h-full rounded-full' src='images/post1.png'/>
                          </div>
                        }
                      
                      <div className='ml-2'>
                      <h3 className='font-nunito font-bold text-xl text-[#444]'>{item.username}</h3>
                      {profileInfoList.map((item)=>(
                      <h4 className='font-nunito font-semibold text-base text-black'>{item.title}</h4>
                      ))}
                      <p className='font-nunito font-normal text-xs mt-1 text-[#444]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                      </div>
                      
                      </div>
                        <h4 className='font-nunito font-bold text-xl text-[#181818] mt-3'>{item.msg}</h4>
                        <h1 className='font-nunito font-medium text-xl text-[#181818] mb-3'>{item.postmsg}</h1>
                        <img src={item.postimage}/> 
                         <div>
                          {data.uid == item.userid
                          ?
                          <>
                          <button onClick={()=>handleEditPost(item.id)} className='absolute top-5 right-24 text-base font-nunito font-medium border border-solid border:bg-blue-600 bg-blue-600 rounded py-1 px-2 text-white'>Edit</button>
                          <button onClick={()=>handlePostRemoved(item)} className='absolute top-5 right-5  text-base font-nunito font-medium border border-solid border:bg-red-600 bg-red-600 rounded py-1 px-2 text-white'>Delete</button>
                          </>
                          :
                          <div></div>
                          }
                         </div>
                         
                      </div>
                    ))}        
                    </div>
                    } 
                  </div>
                </div>
               }


               {/* profile code start....... */}
                
               <div className='w-1/5 relative mt-4'>
                {coverImgList.length == 0
                ?
                <div className='w-[250px] h-[122px] rounded'>
                    <img className='w-full h-full rounded' src='images/cover.png' />
                 </div>
                :
                (coverImgList.map((item)=>(
                 <div className='w-[250px] h-[122px] rounded'>
                    <img className='w-full h-full rounded' src={item.coverimg} />
                 </div>
                 )))
                }
                     <img className='absolute top-[58px] right-[74px] w-[120px] h-[120px] rounded-full' src={data.photoURL} />
                      <div className='flex justify-center'>
                        <div className=' w-[250px] text-center'>
                       <Link to='/profile'>
                         <h2 className='font-nunito font-bold text-xl text-center text-[#444] mt-16'>{data.displayName}</h2>
                       </Link>
                        {profileInfoList.map((item)=>(
                          <h3 className='font-nunito font-semibold text-base text-center text-blue-600'>{item.title}</h3>
                          ))}
                        <Editbio />
                      </div>
                     </div>
                    <Mygroups/>
               </div>

      </div> 
    </div>
    

  )
}

export default Post