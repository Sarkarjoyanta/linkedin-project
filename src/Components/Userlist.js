import React,{ useState, useEffect }  from 'react'
import { getDatabase, ref, onValue, set, push} from "firebase/database";
import { useSelector } from 'react-redux';
import {FiUserMinus, FiUserPlus} from 'react-icons/fi'
import {FaUserFriends} from 'react-icons/fa'

const Userlist = () => {

    const db = getDatabase();
    let [userlist, setUserList] = useState([])
    let [friendrequest, setFriendrequest] = useState([])
    let [friendList, setFriendList] = useState([])

    let data = useSelector((state)=> state.userLoginInfo.userInfo)
    console.log("asdfasf",data)
    console.log(data.uid)

    useEffect(()=>{
        const userRef = ref(db, 'users/');
        onValue(userRef, (snapshot) => {
            let arr = [];
        snapshot.forEach((item)=>{
            if(data.uid != item.key){
                arr.push({...item.val(), userid: item.key})
            }
        })
        setUserList(arr)
    });
    },[])

    let handleFriendReqSend = (item) =>{
        set(push(ref(db, 'friendrequest/')), {
            sendername: data.displayName,
            senderid: data.uid,
            receivername: item.username,
            receiverid: item.userid,
          });
    }


    useEffect(()=>{
        const friendrequestRef = ref(db, 'friendrequest/');
        onValue(friendrequestRef, (snapshot) => {
            let arr = [];
        snapshot.forEach((item)=>{
            arr.push("receiversender", item.val().receiverid + item.val().senderid)
        })
        setFriendrequest(arr)
    });
    },[])



    useEffect(()=>{
        const friendRef = ref(db, 'friendlist/');
        onValue(friendRef, (snapshot) => {
            let arr = [];
        snapshot.forEach((item)=>{
            arr.push("receiversender", item.val().receiverid + item.val().senderid)
        })
        setFriendList(arr)
        });
    },[])



  return (
    <div className='bg-white border border-solid border:bg-[#444] mt-4 rounded p-3 h-[320px] drop-shadow-lg overflow-y-scroll w-[300px]'>
        <div>
            <h2 className='font-nunito font-bold text-xl mb-4'>UserList</h2>
        </div>

        {userlist.length == 0 ? 
        <h3 className='font-Nunito font-bold text-base bg-red-600 rounded p-2 text-white mt-4'>No User avilable</h3>
        :
        <>
        {userlist.map((item)=>(
            <div className='flex items-center mb-4'>
            <div className='w-[52px] h-[52px] rounded-full mr-2'>
            <img className='w-full h-full rounded-full' src='images/post1.png'/>
           </div>
            <div className='mr-2'>
               <h3 className='font-Nunito font-semibold text-xl w-[150px] break-words'>{item.username}</h3>
               <p className='font-Nunito font-medium text-sm text-[#4D4D4D] w-[150px] break-words'>{item.email}</p>
            </div>

            {friendList.includes(item.userid+data.uid) || friendList.includes(data.uid+item.userid)
                ?
                <button className='font-Nunito font-semibold text-base text-white bg-[#5F35F5] p-2 rounded'>
                  <FaUserFriends className='text-xl text-white'/>
                </button>
                :
                (friendrequest.includes(item.userid+data.uid) || friendrequest.includes(data.uid+item.userid)
                ?
                <button className='font-Nunito font-semibold text-base text-white bg-[#5F35F5] p-2 rounded'>
                  <FiUserMinus className='text-xl text-white'/>
                </button>
                :
                <button onClick={()=>handleFriendReqSend(item)} className='font-Nunito font-semibold text-base text-white bg-[#5F35F5] p-2 rounded'>
                  <FiUserPlus className='text-xl text-white'/>
                </button>)
            }

           </div>  
         ))}

         </>

        }

        
    </div>
  )
}

export default Userlist