import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, remove,set, push} from "firebase/database";
import { useSelector } from 'react-redux';

const Mygroups = () => {

    const db = getDatabase();
    
    let[mygroup, setMygroup] = useState([])
    let[groupreq, setGroupreq] = useState([])
    let[groupmembers, setGroupmembers] = useState([])
    let[show, setShow] = useState(false)
    let[showgroupmembers, setShowGroupmembers] = useState(false)

    let data = useSelector((state)=> state.userLoginInfo.userInfo)


    useEffect(()=>{
        const mygroupRef = ref(db, 'group');
        onValue(mygroupRef, (snapshot) => {
            let arr = []
            snapshot.forEach((item) => {
                if(data.uid == item.val().adminid){
                    arr.push({
                        ...item.val(), key: item.key,
                    })
                }
            })
            setMygroup(arr)
        });
    },[])



    let handleReqRemoved = (item)=>{
          if(data.uid == item.adminid){
            remove(ref(db, "groupjoinrequest/" + item.key))
        }
    }

    let handleReqAccept = (item)=>{
        set(push(ref(db, 'groupmembers')),{
           adminid: item.adminid,
           adminname: item.adminname,
           groupid: item.groupid,
           groupname: item.groupname,
           userid: item.userid,
           username: item.username,
        }).then(()=>{
            remove(ref(db, 'groupjoinrequest/' + item.key))
          })
    }


    let handleGroupReqshow = (gitem)=>{
        setShow(true)
        const groupRef = ref(db, 'groupjoinrequest');
        onValue(groupRef, (snapshot) => {
            let arr = []
            snapshot.forEach((item) => {
                console.log(item.val())
                if(data.uid == item.val().adminid && item.val().groupid == gitem.key){
                    arr.push({
                        ...item.val(), key: item.key,
                    })
                }
                
            })
            setGroupreq(arr)
        });
    }

    let handleShowGroupmembers = (gitem)=>{
        const groupmembersRef = ref(db, 'groupmembers');
        onValue(groupmembersRef, (snapshot) => {
            let arr = []
            snapshot.forEach((item) => {
                if(data.uid == gitem.adminid && gitem.key == item.val().groupid){
                    arr.push({
                        ...item.val(), key: item.key,
                    })
                }
            })
            setGroupmembers(arr)
            setShowGroupmembers(true)
        });
    }

    let handleGroupMembersRemoved = (item)=>{
        remove(ref(db, 'groupmembers/' + item.key))
    }


  return (
    <div className='mt-10 bg-white drop-shadow-md rounded py-3 px-5 h-[305px] overflow-y-scroll pb-2.5'>
    <h2 className='font-Nunito font-bold text-xl'>My Groups</h2>

    {show &&
    <button onClick={()=>setShow(false)} className='font-Nunito font-mediam text-base text-white bg-[#5F35F5] px-2 py-1 rounded absolute top-4 right-4'>Go Back</button>
    }

    {showgroupmembers &&
    <button onClick={()=>setShowGroupmembers(false)} className='font-Nunito font-mediam text-base text-white bg-[#5F35F5] px-2 py-2 rounded absolute top-4 right-4'>Go Back</button>
    }

    {mygroup.length == 0 ?
    <h3 className='font-Nunito font-bold text-xl bg-red-600 rounded p-2 text-white'>No Group avilable</h3>
     :
     
     show ?
     groupreq.map((item)=>(
        <div className='flex items-center mt-4 border-b border-solid border-[#5F35F5] pb-3'>
        <div className='w-[60px] h-[60px] rounded-full'>
          <img className='w-full h-full rouded-full' src='images/pic1.png' />
        </div>
        <div className='ml-2 mr-2' >
            <h3 className='font-Nunito font-semibold text-xl'>{item.username}</h3>
        </div>
        <div>
            <button onClick={()=>handleReqAccept(item)} className='font-Nunito font-semibold text-base text-white bg-[#5F35F5] px-2 py-2 rounded '>Accept</button>
        </div>
        <div>
            <button onClick={()=>handleReqRemoved(item)} className='font-Nunito font-semibold text-base text-white bg-red-600 px-2 py-2 rounded ml-2'>Delete</button>
        </div>
      </div>
     ))
      : showgroupmembers 
      ? 
      (groupmembers.map((item)=>(
        <div className='flex items-center mt-4 border-b border-solid border-[#5F35F5] pb-3'>
        <div className='w-[60px] h-[60px] rounded-full'>
          <img className='w-full h-full rouded-full' src='images/pic3.png' />
        </div>
        <div className='ml-2 mr-2' >
            <h3 className='font-Nunito font-semibold text-xl'>{item.username}</h3>
        </div>
        <div>
            <button onClick={()=>handleGroupMembersRemoved(item)} className='font-Nunito font-semibold text-base text-white bg-red-600 px-2 py-2 rounded ml-2'>Delete</button>
        </div>
      </div>
      ))):
      mygroup.map((item)=>(
        <>
        <div className='flex items-center gap-x-4 mt-4 pb-3'>
        <div className='w-[60px] h-[60px] rounded-full'>
          <img className='w-full h-full rouded-full' src='images/pic1.png' />
        </div>
        <div>
            <h3 className='font-Nunito font-regular text-base w-[120px] break-words'>Admin : {item.adminname}</h3>
            <h3 className='font-Nunito font-semibold text-xl'>{item.groupname}</h3>
            <p className='font-Nunito font-medium text-sm text-[#4D4D4D] '>{item.grouptagline}</p>
        </div>
      </div>
        <div className='flex'>
        <div className='mr-4'>
            <button className='font-Nunito font-semibold text-base text-white bg-[#5F35F5] px-2 py-1 rounded mb-2' onClick={()=>handleShowGroupmembers(item)}>Members</button>
        </div>
        <div>
            <button onClick={()=>handleGroupReqshow(item)} className='font-Nunito font-semibold text-base text-white bg-[#444] px-2 py-1 rounded'>Request</button>
        </div>
        </div>
        </>
    ))}
        


</div>
  )
}

export default Mygroups