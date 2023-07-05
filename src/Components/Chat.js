import React, { useState } from 'react'
import {BsThreeDotsVertical, BsFillTriangleFill, BsEmojiSmileFill, BsThreeDots} from 'react-icons/bs'
import ModalImage from "react-modal-image";
import {GrGallery} from 'react-icons/gr'
import {AiFillCamera, AiFillCloseCircle} from 'react-icons/ai'
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useSelector } from 'react-redux';
import { getDatabase, ref, onValue, set, push, remove} from "firebase/database";
import moment from 'moment/moment';
import { useEffect } from 'react';
import { getStorage, ref as sref, uploadBytes, getDownloadURL, uploadString } from "firebase/storage";
import { AudioRecorder } from 'react-audio-voice-recorder';
import EmojiPicker from 'emoji-picker-react';

const Chat = () => {

  const db = getDatabase();
  const storage = getStorage();
  let [cameraopen, setCameraOpne] = useState(false)
  let [captureimg, setCaptureimg] = useState('')
  let [msg, setMsg] = useState('')
  let [msgerr, setMsgerr] = useState('')
  let [msgList, setMsgList] = useState([])
  let [groupMsgList, setGroupMsgList] = useState([])
  let [groupMemberList, setGroupMemberList] = useState([])
  let [msgRemovedId, setMsgRemovedId] = useState(false)
  let [msgRemovedModal, setMsgRemovedModal] = useState(false)
  let [audioUrl, setAudioUrl] = useState("")
  let [blob, setBlob] = useState("")
  let [emojiShow, setEmojiShow] = useState(false)


  let data = useSelector((state)=> state.userLoginInfo.userInfo)
  let activedata = useSelector((state)=> state.userLoginInfo.active)
  

  // open-camera code here...

    function handleTakePhoto (dataUri) {
      setCaptureimg(dataUri);
      console.log(dataUri)
      const storageRef = sref(storage, "Open-camera/");
      uploadString(storageRef, dataUri, 'data_url').then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          set(push(ref(db,'singlemsg')),{
            whosendid: data.uid,
            whosendname: data.displayName,
            whoreceiveid: activedata.id,
            whoreceivename: activedata.name,
            img: downloadURL,
            date: `${new Date().getFullYear()}/${new Date().getMonth()+1}/${new Date().getDate()} ${new Date().getHours()} : ${new Date().getMinutes()}`
          }).then(()=>{
            setCameraOpne(false)
          })
        });
      });
    }

    // voice recorder code here........

    const addAudioElement = (blob) => {
      const url = URL.createObjectURL(blob);
      setAudioUrl(url)
      setBlob(blob)
    };

    let handleVoiceMsgSend = ()=>{
      const storageRef = sref(storage, audioUrl);
        uploadBytes(storageRef, blob).then((snapshot) => {
          getDownloadURL(storageRef).then((downloadURL) => {
            set(push(ref(db,'singlemsg')),{
              whosendid: data.uid,
              whosendname: data.displayName,
              whoreceiveid: activedata.id,
              whoreceivename: activedata.name,
              voicemsg: downloadURL,
              date: `${new Date().getFullYear()}/${new Date().getMonth()+1}/${new Date().getDate()} ${new Date().getHours()} : ${new Date().getMinutes()}`
            }).then(()=>{
              setAudioUrl('')
            })
          });
        });
    }


    // emoji code here.......

    let handleEmojiSelect = (emoji)=>{
      setMsg(msg+emoji.emoji)
    }


    // msg send code here...........

    let handleMsgInput = (e)=>{
      setMsg(e.target.value)
      setMsgerr('')
    }

    let handleMsgSend = ()=>{
      if(!msg){
        setMsgerr('Please write something...')
      }else{
        if( activedata.status === 'single'){
          set(push(ref(db,'singlemsg')),{
            whosendid: data.uid,
            whosendname: data.displayName,
            whoreceiveid: activedata.id,
            whoreceivename: activedata.name,
            msg: msg,
            date: `${new Date().getFullYear()}/${new Date().getMonth()+1}/${new Date().getDate()} ${new Date().getHours()} : ${new Date().getMinutes()}`
          }).then(()=> {
            setMsg('')
          })
        }else{
          set(push(ref(db,'groupmsg')),{
            adminid: activedata.adminid,
            whosendid: data.uid,
            whosendname: data.displayName,
            whoreceiveid: activedata.id,
            whoreceivename: activedata.name,
            msg: msg,
            date: `${new Date().getFullYear()}/${new Date().getMonth()+1}/${new Date().getDate()} ${new Date().getHours()} : ${new Date().getMinutes()}`
          }).then(()=> {
            setMsg('')
          })
        }
      }
    }
      

      useEffect(()=>{
        onValue(ref(db, 'singlemsg/'),(snapshot)=>{
          let arr = []
          snapshot.forEach((item)=>{
            if(item.val().whosendid === data.uid && item.val().whoreceiveid === activedata.id || item.val().whoreceiveid === data.uid && item.val().whosendid === activedata.id){
              arr.push({...item.val(), id: item.key})
            }
          })
          setMsgList(arr)
        })
      },[activedata])
      
      useEffect(()=>{
        onValue(ref(db, 'groupmsg/'),(snapshot)=>{
          let arr = []
          snapshot.forEach((item)=>{
            arr.push({...item.val(), id: item.key})
          })
          setGroupMsgList(arr)
        })
      },[activedata])
      
      useEffect(()=>{
        onValue(ref(db, 'groupmembers/'),(snapshot)=>{
          let arr = []
          snapshot.forEach((item)=>{
            arr.push(item.val().groupid + item.val().userid)
          })
          setGroupMemberList(arr)
        })
      },[])

      // img upload code here.....

      let handleImgUpload = (e)=>{
        console.log(e.target.files[0])
        const storageRef = sref(storage, e.target.files[0].name);
        uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
          getDownloadURL(storageRef).then((downloadURL) => {
            set(push(ref(db,'singlemsg')),{
              whosendid: data.uid,
              whosendname: data.displayName,
              whoreceiveid: activedata.id,
              whoreceivename: activedata.name,
              img: downloadURL,
              date: `${new Date().getFullYear()}/${new Date().getMonth()+1}/${new Date().getDate()} ${new Date().getHours()} : ${new Date().getMinutes()}`
            })
          }).then(()=>{
            setAudioUrl("")
          })
        });
      }

      let handleImgRemoved = (id)=>{
        setMsgRemovedId(id)
        setMsgRemovedModal(true)
      }
      
      let handleImgRemovedCancel = ()=>{
        setMsgRemovedModal(false)
      }
      
      let handleImgFinalRemoved = ()=>{
        remove(ref(db,'singlemsg/' + msgRemovedId))
      }



  return (
    <div className='bg-white drop-shadow-lg py-6 px-12 rounded-lg relative mt-5 ml-5'>
        <div className='flex items-center gap-x-8 border-b border-solid border-[0,0,0,.25%] pb-6 mb-14'>
            <div className='w-[75px] h-[75px] rounded-full drop-shadow-lg bg-gray-600 relative'>
                <img className='w-full h-full rounded-full' src='images/post2.png'/>
                <div className='w-[14px] h-[14px] rounded-full bg-green-500 absolute bottom-2 right-0 border border-solid border:bg-white'></div>
            </div>
            <div>
                <h3 className='font-Nunito font-regular text-base cursor-pointer'>{activedata && activedata.admin}</h3>
                <h3 className='font-open font-bold text-2xl'>{activedata && activedata.name}</h3>
                <p className='font-open font-regular text-sm mt-2'>Online</p>
            </div>
        </div>
        <BsThreeDotsVertical className='text-2xl text-[#5F35F5] absolute top-12 right-12'/>

        <div className='overflow-y-scroll h-[330px] border-b border-solid border-[0,0,0,.25%]'>
          {
            activedata && activedata.status == "single"
            ?
            msgList.map((item)=>(
              item.whosendid == data.uid 
              ?
              item.msg
              ?
              (<div className='mb-7 text-right mr-5'>
              <div className='bg-[#5F35F5] inline-block p-3 rounded-lg relative mr-5'>
                <h5 className='font-nunito font-regular text-base text-left text-white '>{item.msg}</h5>
                <BsFillTriangleFill className='absolute right-[-7px] bottom-[-1px] text-[#5F35F5]'/>
                {msgRemovedModal &&
                 <div className='flex justify-center items-center w-[200px] h-[70px] bg-[#f1f1f1] drop-shadow-lg
                 absolute right-[-7px] bottom-[-15px] rounded-lg'>
                  <div onClick={handleImgFinalRemoved} className='font-nunito font-medium text-base p-2 text-white bg-red-600 rounded-lg cursor-pointer'>
                    Delete
                  </div>
                  <div onClick={handleImgRemovedCancel} className='font-nunito font-medium text-base p-2 text-white bg-green-600 rounded-lg cursor-pointer ml-2'>
                    Cancel
                  </div>
                </div>
                }
              <BsThreeDots onClick={()=>handleImgRemoved(item.id)} className=' text-[#5F35F5] absolute right-0 bottom-[-30px] cursor-pointer'/>
              </div>
              <p className='font-nunito font-medium text-xs text-[#444] mr-5'>
              {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
              </p>
            </div>)
               :item.img 
               ?
              ( <div className='mb-7 text-right'>
               <div className='w-60 inline-block relative mr-5'>
               <ModalImage
                small={item.img}
                large={item.img}
                />
               <BsThreeDots className='absolute bottom-[-35px] right-0 text-[#5F35F5]'/>
               </div>
               <p className='font-nunito font-medium text-xs text-[#444] mr-5'>
                {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
               </p>
              </div>)
              :
              (<div className='mb-7 text-right'>
              <div className='inline-block mr-5'>
                <audio controls src={item.voicemsg}></audio>
                </div>
                <p className='font-nunito font-medium text-xs text-[#444] mr-5'>Today, 2:01pm</p>
              </div>)
              : 
              item.msg
              ?
             ( <div className='mb-7 text-left'>
             <div className='bg-[#f1f1f1] inline-block p-2 rounded-lg relative ml-2 mr-5'>
               <h5 className='font-nunito font-regular text-base'>{item.msg}</h5>
               <BsFillTriangleFill className='absolute left-[-8px] bottom-[-1px] text-[#f1f1f1]'/>
             </div>
             <p className='font-nunito font-medium text-xs text-[#444] ml-2'>
             {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
             </p>
             < BsThreeDots className='ml-2' />
           </div>)
              :item.img 
              ?
              (<div className='mb-7 text-left'>
              <div className='w-60 inline-block relative ml-5'>
              <ModalImage
                small={item.img}
                large={item.img}
              />
              </div>
              <p className='font-nunito font-medium text-xs text-[#444] ml-5'>
              {moment(item.date, "YYYYMMDD hh:mm") .fromNow()}
              </p>
              < BsThreeDots className='ml-3' />
            </div>)
            :
            (<div className='mb-7'>
            <div className='inline-block ml-5'>
            <audio controls src={item.voicemsg}></audio>
            </div>
            <p className='font-nunito font-medium text-xs text-[#444] ml-5'>Today, 2:01pm</p>
            </div>)
            ))
            : data.uid == activedata && activedata.adminid || 
            groupMemberList.includes(activedata && activedata.id + data.uid)
            ?
            groupMsgList.map((item)=>(
              item.whosendid === data.uid
              ?
              item.whoreceiveid == activedata && activedata.id &&
              <div className='mb-7 text-right mr-5'>
              <div className='bg-[#5F35F5] inline-block p-3 rounded-lg relative mr-5'>
                <h5 className='font-nunito font-regular text-base text-left text-white '>{item.msg}</h5>
                <BsFillTriangleFill className='absolute right-[-7px] bottom-[-1px] text-[#5F35F5]'/>
                {msgRemovedModal &&
                 <div className='flex justify-center items-center w-[200px] h-[70px] bg-[#f1f1f1] drop-shadow-lg
                 absolute right-[-7px] bottom-[-15px] rounded-lg'>
                  <div className='font-nunito font-medium text-base p-2 text-white bg-red-600 rounded-lg cursor-pointer'>
                    Delete
                  </div>
                  <div className='font-nunito font-medium text-base p-2 text-white bg-green-600 rounded-lg cursor-pointer ml-2'>
                    Cancel
                  </div>
                </div>
                }
              <BsThreeDots className=' text-[#5F35F5] absolute right-0 bottom-[-30px] cursor-pointer'/>
              </div>
              <p className='font-nunito font-medium text-xs text-[#444] mr-5'>
              {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
              </p>
            </div>
            : item.whoreceiveid == activedata && activedata.id &&
            <div className='mb-7 text-left'>
             <div className='bg-[#f1f1f1] inline-block p-2 rounded-lg relative ml-2 mr-5'>
               <h5 className='font-nunito font-regular text-base'>{item.msg}</h5>
               <BsFillTriangleFill className='absolute left-[-8px] bottom-[-1px] text-[#f1f1f1]'/>
             </div>
             <p className='font-nunito font-medium text-xs text-[#444] ml-2'>
             {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
             </p>
             < BsThreeDots className='ml-2' />
           </div>
           ))
           :
           <h1 className='font-nunito font-medium text-base text-[#5F35F5]'>Select your friend then start chat with each other</h1>
          }
          {/* receive msg start */}
          {/* <div className='mb-7'>
            <div className='bg-[#f1f1f1] inline-block py-3 px-12 rounded-lg relative ml-5'>
              <h5 className='font-nunito font-regular text-base text-left'>hey there</h5>
              <BsFillTriangleFill className='absolute left-[-7px] bottom-[-1px] text-[#f0f0f0]'/>
            </div>
            <p className='font-nunito font-medium text-xs text-[#444] ml-5'>Today, 2:01pm</p>
          </div> */}
          {/* receive msg end */}

          {/* send msg start */}
          {/* <div className='mb-7 text-right'>
            <div className='bg-[#5F35F5] inline-block py-3 px-12 rounded-lg relative mr-5'>
              <h5 className='font-nunito font-regular text-base text-white text-left'>Hello...</h5>
              <BsFillTriangleFill className='absolute right-[-7px] bottom-[-1px] text-[#5F35F5]'/>
            </div>
            <p className='font-nunito font-medium text-xs text-[#444] mr-5'>Today, 2:01pm</p>
          </div> */}
          {/* send msg end */}

          {/* receive img start */}
          {/* <div className='mb-7'>
            <div className='bg-[#f1f1f1] inline-block p-3 w-60 rounded-lg relative ml-5'>
            <ModalImage
              small={'images/cover.png'}
              large={'images/cover.png'}
            />
              <BsFillTriangleFill className='absolute left-[-7px] bottom-[-1px] text-[#f0f0f0]'/>
            </div>
            <p className='font-nunito font-medium text-xs text-[#444] ml-5'>Today, 2:01pm</p>
          </div> */}
          {/* receive img end */}

          {/* send img start */}
          {/* <div className='mb-7 text-right'>
            <div className='bg-[#5F35F5] inline-block p-3 w-60 rounded-lg relative mr-5'>
            <ModalImage
              small={'images/cover.png'}
              large={'images/cover.png'}
            />
              <BsFillTriangleFill className='absolute right-[-7px] bottom-[-1px] text-[#5F35F5]'/>
            </div>
            <p className='font-nunito font-medium text-xs text-[#444] mr-5'>Today, 2:01pm</p>
          </div> */}
          {/* send img end */}

          {/* receive audio start */}
          {/* <div className='mb-7'>
            <div className='inline-block ml-5'>
            <audio controls></audio>
            </div>
            <p className='font-nunito font-medium text-xs text-[#444] ml-5'>Today, 2:01pm</p>
          </div> */}
          {/* receive audio end */}

          {/* send audio start */}
          {/* <div className='mb-7 text-right'>
          <div className='inline-block mr-5'>
            <audio controls></audio>
            </div>
            <p className='font-nunito font-medium text-xs text-[#444] mr-5'>Today, 2:01pm</p>
          </div> */}
          {/* send audio end */}
          
          {/* receive video start */}
          {/* <div className='mb-7'>
            <div className='inline-block ml-5'>
            <video controls></video>
            </div>
            <p className='font-nunito font-medium text-xs text-[#444] ml-5'>Today, 2:01pm</p>
          </div> */}
          {/* receive video end */}

          {/* send video start */}
          {/* <div className='mb-7 text-right'>
          <div className='inline-block mr-5'>
            <video controls></video>
            </div>
            <p className='font-nunito font-medium text-xs text-[#444] mr-5'>Today, 2:01pm</p>
          </div> */}
          {/* send video end */}
        </div>
         {/* {data.uid == activedata && activedata.adminid || 
          groupMemberList.includes(activedata && activedata.id + data.uid) && */}
         <div className='flex mt-4'>
          <div className='w-[85%] relative'>
            {!audioUrl &&
            <>
            <input onChange={handleMsgInput} className='bg-[#f1f1f1] py-3 px-6 rounded-lg w-[635px] relative font-nunito font-regular font-base'
            type='text' value={msg}/>
            {msgerr &&
            <p className='bg-red-500 text-white font-nunito text-base px-3 py-1 mt-1 rounded w-[600px] absolute bottom-[50px] left-0'>
            {msgerr}</p>
            }
            
            <label>
              <input onChange={handleImgUpload} className='hidden' type='file'/>
              <GrGallery className='absolute top-4 right-2 cursor-pointer'/>
            </label>
            <AiFillCamera onClick={()=>setCameraOpne(!cameraopen)} className='absolute top-4 right-8 cursor-pointer'/>
            <AudioRecorder onRecordingComplete={addAudioElement} />
            <BsEmojiSmileFill onClick={()=>setEmojiShow(!emojiShow)} className='text-[#5F35F5] absolute top-4 right-20 cursor-pointer'/>
            {emojiShow && 
            <div className='absolute top-[-460px] right-[75px]'>
               < EmojiPicker onEmojiClick={(emoji)=>handleEmojiSelect(emoji)} /> 
            </div>}
            </>
            }
            {audioUrl &&
            <div className='flex'>
              <audio controls src={audioUrl}></audio>
              <button onClick={handleVoiceMsgSend} className='inline-block ml-3 px-3 rounded-lg bg-[#5F35F5] font-nunito font-medium text-base text-white'>Send</button>
              <button onClick={()=>setAudioUrl("")} className='inline-block ml-3 px-3 rounded-lg bg-[#5F35F5] font-nunito font-medium text-base text-white'>Delete</button>
            </div>
            }
          </div>
          {cameraopen &&
          <div className='w-full h-screen bg-[0,0,0,.9] z-50 absolute top-0 left-0'>
            <AiFillCloseCircle onClick={()=>setCameraOpne(false)} className='text-white text-3xl absolute top-1 right-1 z-50 cursor-pointer'/>
            <Camera
              onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
              idealFacingMode = {FACING_MODES.ENVIRONMENT}
              idealResolution = {{width: 640, height: 480}}
              imageType = {IMAGE_TYPES.JPG}
              imageCompression = {0.97}
              isMaxResolution = {true}
              isImageMirror = {true}
              isSilentMode = {false}
              isDisplayStartCameraError = {false}
              isFullscreen = {true}
              sizeFactor = {1}
            />
          </div>
          }
          {!audioUrl &&
          <button onClick={handleMsgSend} className='inline-block ml-3 px-3 rounded-lg bg-[#5F35F5] font-nunito font-medium text-base text-white'>Send</button>
          }
         </div>
          {/* } */}
    </div>
  )
}

export default Chat