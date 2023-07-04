import { useState, useEffect } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs'
import { getDatabase, ref, onValue, set, push, remove} from "firebase/database";
import { useSelector } from 'react-redux';

const Friendrequest = () => {

    const db = getDatabase();

    let data = useSelector((state)=> state.userLoginInfo.userInfo)

    let [friendrequest, setFriendrequest] = useState([])

    useEffect(()=>{
        const friendrequestRef = ref(db, 'friendrequest/');
        onValue(friendrequestRef, (snapshot) => {
            let arr = [];
        snapshot.forEach((item)=>{
            if(item.val().receiverid == data.uid){
                arr.push({...item.val(), id: item.key})
            }
        })
        setFriendrequest(arr)
    });
    },[])

    let handleFriendAccept = (item)=>{
        console.log('accepted')
        set(push(ref(db, 'friendlist/')), {
            ... item,
        }).then(()=>{
            remove(ref(db, 'friendrequest/' + item.id))
        })
    }

    let handleFriendReqRemoved = (item)=>{
        console.log('delete',item)
        remove(ref(db, 'friendrequest/' + item.id))
    }

  return (
    <div className='mt-5 bg-white drop-shadow-md rounded py-3 px-5 h-[350px] overflow-y-scroll'>
    <h2 className='font-nunito font-bold text-xl'>Friend Request</h2>
    <BsThreeDotsVertical className='absolute top-4 right-4'/>
       
    {friendrequest.length == 0 ? 
        <h3 className='font-Nunito font-bold text-base bg-red-600 rounded p-2 text-white mt-4'>No Friendrequest avilable</h3>
        :  

     <>
     {friendrequest.map((item)=>(
    <div className='flex items-center gap-x-2 mb-4 mt-4'>
    <div className='w-[52px] h-[52px] rounded-full'>
    <img className='w-full h-full rounded-full' src="images/post1.png"/>
   </div>
    <div>
     <h3 className='font-nunito font-bold text-xl text-black'>{item.sendername}</h3>
     <h3 className='font-nunito font-regular text-sm text-black'>Mern Stack Developer</h3>
    </div>

        <div className='ml-6'>
            <button onClick={()=>handleFriendAccept(item)} className='font-Nunito font-medium text-base text-white bg-[#5F35F5] px-3 py-1 rounded mr-2'>
                Accept
            </button>
            <br/>
            <button onClick={()=>handleFriendReqRemoved(item)} className='font-Nunito font-medium text-base text-white bg-red-600 px-3 py-1 rounded mt-2'>
                Delete
            </button>
        </div>
  
      </div> 
     ))}

     </>

    }
      

</div>
  )
}

export default Friendrequest