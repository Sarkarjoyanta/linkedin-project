import React, { useState,useEffect } from 'react'
import { getDatabase, ref, onValue, set, push} from "firebase/database";
import { useSelector } from 'react-redux';

const Grouplist = () => {

    const db = getDatabase();

    let data = useSelector((state)=> state.userLoginInfo.userInfo)

    let [show , setShow] = useState(false)
    let [gname, setGname] = useState('')
    let [gtagline, setGtagline] = useState('')

    let [gnameerr, setGnameerr] = useState('')
    let [gtaglineerr, setGtaglineerr] = useState('')

    let [grouplist, setGrouplist] = useState([])
    let [groupjoinrequest, setGroupjoinrequest]= useState([])

    let handleCreateGroup = ()=>{
        setShow(!show)
    }

    let handleGroupName = (e) => {
        setGname(e.target.value)
        setGnameerr('')
    }
    
    let handleGroupTagline = (e) => {
        setGtagline(e.target.value)
        setGtaglineerr('')
    }


    let handleCreate = (item)=>{

        if(!gname){
            setGnameerr("Group Name is Required")
        }
        
        if(!gtagline){
            setGtaglineerr("Group Tagline is Required")
        }
        
        if(gname && gtagline){
            set(push(ref(db, 'group')), {
                groupname: gname,
                grouptagline: gtagline,
                adminid: data.uid,
                adminname: data.displayName,
            }).then(()=>{
                setGname('')
                setGtagline('')
                setShow(false)
            })
    
        }
        
    }

    useEffect(()=>{
        const grouplistRef = ref(db, 'group');
        onValue(grouplistRef, (snapshot) => {
            let arr = []
            snapshot.forEach((item) => {
                if(data.uid != item.val().adminid){
                    arr.push({
                        ...item.val(), key: item.key,
                    })
                }
            })
            setGrouplist(arr)
        });
    },[])


    let handleJoinRequest = (item)=>{
        set(push(ref(db, 'groupjoinrequest')), {
            groupid: item.key,
            groupname: item.groupname,
            adminid: item.adminid,
            adminname: item.adminname,
            userid: data.uid,
            username: data.displayName,
        })
    }


    useEffect(()=>{
        const groupjoinrequestRef = ref(db, 'groupjoinrequest');
        onValue(groupjoinrequestRef, (snapshot) => {
            let arr = [];
        snapshot.forEach((item)=>{
            // console.log('adb',item.val().key)
            arr.push("adminuser", item.val().adminid + item.val().groupid)
        })
        setGroupjoinrequest(arr)
    });
    },[])


  return (
    <div className='mt-2 bg-white drop-shadow-md rounded p-2 w-[300px] h-[320px] overflow-y-scroll'>
        <h2 className='font-nunito font-bold text-xl'>Groups List</h2>
        <h3 onClick={handleCreateGroup} className='font-Nunito font-regular text-sm absolute top-3 right-2 bg-[#5F35F5] text-white rounded p-1'>
        {show ? "Go Back" : "Create Groups"}
        </h3>

        {show
        ?
        <div>
            <input className='border border-solid border-second p-3 rounded mt-6 w-full outline-0' type="email"
            placeholder='Group Name' onChange={handleGroupName} value = {gname}
            />
            {gnameerr && 
            <p className='bg-red-400 anim text-center text-white p-1.5 font-popins font-regular text-base rounded'>{gnameerr}</p>}
            <input className='border border-solid border-second p-3 rounded mt-3 w-full outline-0' type="email"
            placeholder='Group Tagline' onChange={handleGroupTagline} value ={gtagline}
            />
            {gtaglineerr && 
            <p className='bg-red-400 text-center anim text-white p-1.5 font-popins font-regular text-base rounded'>{gtaglineerr}</p>}
            <button onClick={handleCreate} className='bg-[#5F35F5] rounded mt-3 w-full'>
               <p className='font-nunito font-mediam text-base text-white px-1 py-3'>Create Group</p>
            </button>


        </div>
        :
        (grouplist.length == 0 ? 
            <h3 className='font-Nunito font-medium text-base bg-red-600 rounded p-1 text-white mt-5'>No Grouplist avilable</h3>
            :
            grouplist.map((item)=>(
            <div className='flex items-center mt-4 border-b border-solid border-[#5F35F5] pb-3'>
            <div className='w-[60px] h-[60px] rounded-full mr-2'>
                <img className='w-full h-full rouded-full' src='images/pic3.png' />
            </div>
            <div>
                <h3 className='font-Nunito font-regular text-base w-[120px] break-words'>Admin : {item.adminname}</h3>
                <h3 className='font-Nunito font-semibold text-xl'>{item.groupname}</h3>
                <p className='font-Nunito font-medium text-sm text-[#4D4D4D] '>{item.grouptagline}</p>
            </div>
            <div className='ml-8'>

                {
                groupjoinrequest.includes(data.uid+item.userid) || groupjoinrequest.includes(item.userid + data.uid)   
                ?
                <button className='font-Nunito font-semibold text-xl text-white bg-[#5F35F5] px-5 py-2 rounded'>p</button>
                :    
                <button onClick={()=>handleJoinRequest(item)} className='font-Nunito font-semibold text-base text-white bg-[#5F35F5] px-3 py-1 rounded'>join</button>
                }  
                
            </div>
            </div>
        )))
        }

    </div>
  )
}

export default Grouplist