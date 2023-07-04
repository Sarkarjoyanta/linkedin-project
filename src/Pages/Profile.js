import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import {BiCloudUpload} from 'react-icons/bi'
import {MdModeEdit} from 'react-icons/md'
import Footer from '../Components/Footer'
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getStorage, uploadBytes, ref as sref, getDownloadURL, uploadString } from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { toast, ToastContainer } from 'react-toastify';
import { RotatingLines } from 'react-loader-spinner';
import { getDatabase, ref, set, onValue, remove, update } from "firebase/database";
import About from '../Components/About';
import Projects from '../Components/Projects';
import Experience from '../Components/Experience';
import Education from '../Components/Education';
import Friendsrequest from '../Components/Friendsrequest'
import Setupprofileinfo from '../Components/Setupprofileinfo'
import FriendList from '../Components/Friends'
import moment from 'moment'
import Header from '../Components/Header'

const Profile = () => {

  const auth = getAuth();
  const db = getDatabase()
  let data = useSelector((state)=> state.userLoginInfo.userInfo)
  console.log('abc',data)
  const storage = getStorage();
  const [image, setImage] = useState('');
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();

  
  let[imageUploadModal, setImageUploadModal] = useState(false)
  let[loading, setLoading] = useState(false)
  // let[show ,setShow] = useState(false)
  let[friendShow ,setFriendShow] = useState(false)
  let[postShow ,setPostShow] = useState(false)
  let[postMsgTitle ,setPostMsgTitle] = useState('')
  let[contactInfoShow ,setContactInfoShow] = useState(false)
  let[postlist ,setPostlist] = useState([])
  let[editpost, setEditpost] = useState(false)
  let[editpostlist, setEditPostList] = useState('')
  let[editpostlisterr, setEditPostListerr] = useState('')
  let[updateId, setUpdateId] = useState(false)
  
  let[editTitleModal, setEditTitleModal] = useState(false)
  let[title, setTitle] = useState('')
  
  let[phoneNumber, setPhoneNumber] = useState('')
  let[address, setAddress] = useState('')
  let[editcontactpost, setEditContactPost] = useState(false)
  
  // coverpic state here.....

  let[coverUploadModal, setCoverUploadModal] = useState(false)
  let[coverImgList, setCoverImgList] = useState([]) 
  let [CoverImg, setCoverImg] = useState(null)

  let[profileInfoList, setProfileInfoList] = useState([])



  let handleImageUpload = ()=>{
    setImageUploadModal(true)
  }
  

  let handleImageUploadCencel = ()=>{
    setImageUploadModal(false)
    setImage('')
    setCropData('')
    setCropper('')
  }

  const handleProfileUplaod = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    setLoading(true)
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
    }

    const storageRef = sref(storage, "Profile-pic/" + auth.currentUser.uid);
    console.log(auth.currentUser.uid)
    const message4 = cropper.getCroppedCanvas().toDataURL();
    uploadString(storageRef, message4, 'data_url').then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL)=>{
        updateProfile(auth.currentUser, {
          photoURL: downloadURL,
        }).then(() => {
          setImageUploadModal(false)
          setLoading(false)
          toast.success('Profile picture upload done')
          setImage('')
          setCropData('')
          setCropper('')
        })
      })
    });

  };


  useEffect(()=>{
    onValue(ref(db, 'postmsgimg/'),(snapshot)=>{
      let arr = []
      snapshot.forEach((item)=>{
        if( data.uid == item.val().userid){
          arr.push({...item.val(), id: item.key})
        }
      })
      setPostlist(arr)
    })
  },[])


  let handlePostRemoved = (item)=>{
    console.log(item)
    remove(ref(db, 'postmsgimg/' + item.id ))
  }

  // let handleImgRemoved = (item)=>{
  //   remove(ref(db, 'image/'+ item.id ))
  // }

  // Postmsgimg edit code here.....

  let handleEditPost = (id)=>{
    setEditpost(true)
    console.log("cheak",id)
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
    update(ref(db,"postmsgimg/" + updateId),{
      msg: editpostlist,
      postmsg: postMsgTitle,
    }).then(()=>{
      setEditpost(false)
      setEditPostList('')
    })
  }
  
  // title edit here....

  let handletitleEdit =(id)=>{
    setEditTitleModal(true)
    setUpdateId(id)
  }
  
  let handleTitleCencel =(id)=>{
    setEditTitleModal(false)
    setUpdateId(id)
  }


  let handleTitleUpdate = ()=>{
    update(ref(db,"profileInfo/" + updateId),{
      title: title,
    }).then(()=>{
      setEditTitleModal(false)
      setTitle('')
    })
  }


   // Contact Edit code here.....

   let handleContactEditPost = (id)=>{
    setEditContactPost(true)
    console.log("cheak",id)
    setUpdateId(id)

  }

  let handleContactCencelPost = ()=>{
    setEditContactPost(false)
  }


  let handleContactUpdatePost = ()=>{
    update(ref(db,"profileInfo/" + updateId),{
      phoneNumber: phoneNumber,
      address: address,
    }).then(()=>{
      setEditContactPost(false)
      setAddress('')
      setPhoneNumber('')
    })
  }
  

  // coverphoto code here...........

  let handleCoverUpload = ()=>{
    setCoverUploadModal(true)
  }
  
  let handleCoverUploadCancel = ()=>{
    setCoverUploadModal(false)
  }


let handleCoverphotoUpload = (e) => {
  const storageRef = sref(storage, 'some-child');
  uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
    getDownloadURL(storageRef).then((downloadURL) => {
      setCoverImg(downloadURL)
    });
  });
}

let coverImgSubmit = (e) => {
  set(ref(db, 'coverpic/' + data.uid), {
    coverimg: CoverImg,
    username: data.displayName,
  }).then(() => {
    setCoverUploadModal(false)
    handleCoverphotoUpload('')
  })
}

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



   // profile info useEffect

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

   let [profile, setProfile] = useState(false)
   let [friends, setFriends] = useState(false)
   let [post, setPost] = useState(false)

    let profileRef = useRef();
    let friendsRef = useRef();
    let postRef = useRef();

    useEffect(()=>{
        document.body.addEventListener("click", (e)=>{

            if(profileRef.current.contains(e.target)){
                setProfile(true)
            }else{
              setProfile(false)
            }
            
            if(friendsRef.current.contains(e.target)){
              setFriends(true)
            }else{
              setFriends(false)
            }
            
            if(postRef.current.contains(e.target)){
              setPost(true)
            }else{
              setPost(false)
            }
        })
    },[])



  return (
    <div>
    <Header />
    <div className='w-[850px] mx-auto'>
    <ToastContainer position="top-right" theme="dark"/>
        <div className='ml-5 relative'>
          <div className='w-[850px] h-[180px] rounded'> 
            {coverImgList.length == 0
              ?
              <img className='w-full h-full rounded' src='images/cover1.png' />
              :
              coverImgList.map((item) => (
                <img className='w-full h-full rounded' src={item.coverimg} />
              ))
            }
          </div>

         <button onClick={handleCoverUpload} className='font-nunito font-medium text-base text-black absolute right-1 top-5 bg-white p-1 rounded'>Edit cover photo</button>
         <div>
          <img className='w-[170px] h-[170px] rounded-full absolute bottom-[-150px] left-[15px]' src={data.photoURL}/>
          <div className='w-[170px] h-[170px] rounded-full bg bg-[rgba(0,0,0,0.4)] absolute bottom-[-150px] left-[15px] flex justify-center items-center opacity-0 hover:opacity-100 duration-300'>
            <BiCloudUpload onClick={handleImageUpload} className='text-3xl text-white' />
          </div>
         </div>
      </div>
        <div className='ml-60 mt-3'>
         <h2 className='font-nunito font-bold text-2xl text-blue-600'>{data.displayName}</h2>
            {/* edit title code*/}
            {editTitleModal
            ?
          <div className='w-full h-screen bg-blue-600 rounded p-5 absolute top-0 left-0 z-50 flex justify-center items-center'>
          <div className='w-[300px]'>
          <p className='font-nunito font-bold text-xl text-white mb-2 mt-2'>Title</p>
          <input onChange={(e)=>setTitle(e.target.value)} className='w-full px-2 py-4 border border-solid border:bg-black rounded p-2' type='text' value={title} />
          <button onClick={handleTitleUpdate} className='inline-block border border-solid border:bg-green-600 text-white text-base font-nunito font-bold mt-5 mr-5 bg-green-600 py-1 px-3 rounded'>Update</button>
          <button onClick={handleTitleCencel} className='inline-block border border-solid border:bg-red-600 text-white text-base font-nunito font-bold bg-red-600 py-1 px-3 rounded'>Cancel</button>
          </div> 
         </div> 
          : 
          <div>
            {profileInfoList.map((item)=>(
           <div className='relative'>
            <p className='font-nunito font-semibold text-black text-xl'>{item.title}</p>
            <MdModeEdit onClick={()=>handletitleEdit(item.id)} className='absolute top-6 left-0 text-xl' />
           </div>
           ))}
           

          </div>
         }
         <div className='flex'>
          
          {profileInfoList.length == 0
            ?
            <Setupprofileinfo />
            :
            <button onClick={()=>setContactInfoShow(!contactInfoShow)} className='font-nunito font-bold text-base inline-block mt-7 px-3 py-2 border border-solid border:bg-blue-600 bg-blue-600 text-white rounded'>
            Contact Info</button>
          }
         </div>
         {/* contact-info start */}
        {contactInfoShow &&
        (editcontactpost 
          ?
          <div className='w-full h-screen bg-blue-600 rounded p-5 absolute top-0 left-0 z-50 flex justify-center items-center'>
          <div className='w-[300px]'>
          <p className='font-nunito font-bold text-xl text-white mb-2'>Phone Number</p>
          <input onChange={(e)=>setPhoneNumber(e.target.value)} className='w-full px-2 py-4 border border-solid border:bg-black rounded p-2' type='text' value={phoneNumber} />
          <p className='font-nunito font-bold text-xl text-white mb-2 mt-2'>Address</p>
          <input onChange={(e)=>setAddress(e.target.value)} className='w-full px-2 py-4 border border-solid border:bg-black rounded p-2' type='text' value={address} />
          <button onClick={handleContactUpdatePost} className='inline-block border border-solid border:bg-green-600 text-white text-base font-nunito font-bold mt-5 mr-5 bg-green-600 py-1 px-3 rounded'>Update</button>
          <button onClick={handleContactCencelPost} className='inline-block border border-solid border:bg-red-600 text-white text-base font-nunito font-bold bg-red-600 py-1 px-3 rounded'>Cencel</button>
          </div> 
         </div> 
          : 
          <div className='mt-3'>
            {profileInfoList.map((item)=>(
              <div>
                <h3 className='font-nunito font-bold text-base text-black'>Phone: {item.phoneNumber}</h3>
                <p className='font-nunito font-bold text-base text-black'>Address: {item.address}</p>
                <button onClick={()=>handleContactEditPost(item.id)} className='font-nunito font-medium text-base inline-block px-3 py-1 border border-solid border:bg-blue-600 bg-green-600 text-white rounded mt-3'>Edit</button>
              </div>
            ))}
          </div>
          )
        }
       {/* contact-info end */}
       </div>
     

     <div className=' mt-14 mb-7'>
      <div className='flex justify-between'>
         
         <button ref={profileRef} className='inline-block font-nunito font-bold text-xl py-2 px-5 text-white bg-blue-600 border border-solid border:bg-blue rounded-lg mb-4'>Profile</button>
          <button ref={friendsRef} className='inline-block font-nunito font-bold text-xl py-2 px-5 text-white bg-blue-600 border border-solid border:bg-blue rounded-lg mb-4'>Friends</button>
          <button ref={postRef} className='inline-block font-nunito font-bold text-xl py-2 px-5 text-white bg-blue-600 border border-solid border:bg-blue rounded-lg mb-4'>Post</button>
      </div>
          {profile &&
           <div>
            <About />
            <Projects />
            <Experience />
            <Education /> 
           </div>
          }
          
          {/* Friends-work start */}

          {friends &&
          <div className='flex justify-between'>
          <div className='w-[420px]'>
          <Friendsrequest />
          </div>
          <div className='w-[420px]'>
            <FriendList />
          </div>
          </div>
          }
          {/* Friends-work end */}
                    
          {/* post code start */}
          
          {post &&
          
          (postlist.length == 0
          ?
          <h3 className='bg-red-600 font-nunito font-bold text-xl text-white p-3 rounded'>No Post Available</h3>
          :
          <>
          {/* editpost code start */}
         {editpost 
         ?
          <div className='w-full h-screen bg-blue-600 rounded absolute top-0 left-0 flex justify-center items-center z-50'>
          <div className='w-[300px]'>
          <input onChange={handleUpdatePost} className='w-full px-2 py-4 border border-solid border:bg-black rounded p-2' type='text' value={editpostlist} />
          {editpostlisterr &&
          <p className='font-nunito font-regular text-base text-white bg-red-600 p-1 mt-1 rounded'>{editpostlisterr}</p>
           }
          <button onClick={handleFinalUpdate} className='inline-block border border-solid border:bg-white text-black text-base font-nunito font-bold mt-5 mr-5 bg-white py-1 px-3 rounded'>Update</button>
          <button onClick={handleCencelPost} className='inline-block border border-solid border:bg-white text-black text-base font-nunito font-bold bg-white py-1 px-3 rounded'>Cancel</button>
          </div>      
        </div>      
        :
          (postlist.map((item)=>(
            <div className='relative p-5 mt-4 rounded-lg drop-shadow-lg bg-white border border-solid border:bg-[#444]'>
            <div className='flex'>
            <div className='w-[52px] h-[52px] rounded-full'>
             <img className='w-full h-full rounded-full' src={data.photoURL}/>
            </div>
            <div className='mt-2 ml-2'>
            <h3 className='font-nunito font-bold text-xl text-[#444]'>{item.username}</h3>
            {profileInfoList.map((item)=>(
            <p className='font-nunito font-medium text-sm text-black'>{item.title}</p>
            ))}
            <p className='font-nunito font-normal text-xs mt-1 text-[#444]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
            </div>
            <input onChange={(e)=>setPostMsgTitle(e.target.value)} className='hidden w-full p-5 py-2 border border-solid border:bg-black rounded mt-2 font-nunito font-medium text-xl' type='text' value={postMsgTitle}/>
            </div>
            <h4 className='font-nunito font-bold text-xl text-[#181818] mt-3'>{item.msg}</h4>
              <h1 className='font-nunito text-2xl font-bold text-[#181818] mb-3'>{item.postmsg}</h1>
              <img src={item.postimage}/> 
              <button onClick={()=>handleEditPost(item.id)} className='absolute top-5 right-24 text-base font-nunito font-medium border border-solid border:bg-blue-600 bg-blue-600 rounded py-1 px-2 text-white'>Edit</button>
              <button onClick={()=>handlePostRemoved(item)} className='absolute top-5 right-5 text-base font-nunito font-medium border border-solid border:bg-red-600 bg-red-600 rounded py-1 px-2 text-white'>Delete</button>
            </div>
          )))
          }
          </> 
         )
          
          }

          {/* post code end */}

      </div>
      </div> 
    <Footer />
 
    {/* Profile code start */}
    {imageUploadModal &&
    
    <div className='w-full h-screen bg-blue-500 absolute top-0 left-0 flex justify-center items-center'>
      <div className='w-[700px] rounded bg-white p-4 text-center'>
      <h2 className='font-nunito font-bold text-2xl text-[#444] mb-4'>Upload your profile picture</h2>
         {image
          ? 
           <div className='group relative w-[170px] h-[170px] overflow-hidden rounded-full mx-auto'>
              <div className="img-preview w-full h-full rounded-full"/>
            </div>
         
          :
            <div className='group relative w-[170px] h-[170px] overflow-hidden rounded-full mx-auto'>
              <img className='mx-auto w-full h-full rounded-full' src={data.photoURL}/>
            </div>
         }

      <input onChange={handleProfileUplaod} className='mt-4' type='file' />
      <br />
      {image &&
        <Cropper
          style={{ height: 400, width: "100%" }}
          zoomTo={0.5}
          initialAspectRatio={1}
          preview=".img-preview"
          src={image}
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false}
          onInitialized={(instance) => {
            setCropper(instance);
          }}
          guides={true}
        />
        }

        {loading
        ?
        <div className="flex justify-center">
             <RotatingLines
              strokeColor="grey"
              strokeWidth="5"
              animationDuration="0.75"
              width="50"
              visible={true}
             />
        </div>
        :
        (<div className='mt-4'>
        <button onClick={getCropData} className='font-nunito font-bold text-base inline-block px-4 py-2 border border-solid border:bg-blue-600 bg-blue-600 text-white rounded mt-3 mr-3'>Upload</button>
        <button onClick={handleImageUploadCencel} className='font-nunito font-bold text-base inline-block px-4 py-2 border border-solid border:bg-blue-600 bg-red-600 text-white rounded mt-3'>Cancel</button>
        </div>)
        }
      
      </div>
    </div>
    }
     {/* profile code end */}

     {/* coverpic code start */}
     {coverUploadModal &&
   
     <div className='w-full h-screen bg-blue-500 absolute top-0 left-0 flex justify-center items-center'>
      <div className='w-[900px] rounded bg-white p-4 text-center'>
      <h2 className='font-nunito font-bold text-2xl text-black mb-4'>Upload your cover picture</h2>
       <input onChange={handleCoverphotoUpload} className='mt-4' type='file' />
        <p className='font-nunito font-regular text-base text-green-600 mt-4'>After select image and wait few second then click upload button</p>
        <div className='mt-4'>
        <button onClick={coverImgSubmit} className='font-nunito font-bold text-base inline-block px-4 py-2 border border-solid border:bg-blue-600 bg-blue-600 text-white rounded mt-3 mr-3'>Upload</button>
        <button onClick={handleCoverUploadCancel} className='font-nunito font-bold text-base inline-block px-4 py-2 border border-solid border:bg-blue-600 bg-red-600 text-white rounded mt-3'>Cancel</button>
        </div>
       </div>
      </div>
     }

     {/* coverpic code end */}

    </div>
  )
}

export default Profile