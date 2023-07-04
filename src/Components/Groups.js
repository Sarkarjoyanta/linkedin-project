// import React, {useState, useEffect} from 'react'
// import { getDatabase, ref, onValue, remove,set, push} from "firebase/database";
// import { useSelector, useDispatch } from 'react-redux';
// import { activeChat } from '../slices/userSlice';

// const Groups = () => {

//   const db = getDatabase();
//     let data = useSelector((state)=> state.userLoginInfo.userInfo)
//     let dispatch = useDispatch()
//     let [groups ,setGroups] = useState([])


//     useEffect(()=>{
//       const groupsRef = ref(db, 'group/');
//       onValue(groupsRef, (snapshot) => {
//           let arr = [];
//       snapshot.forEach((item)=>{
//           arr.push({...item.val(), id: item.key})
//       })
//       setGroups(arr)
//      });
//     },[])


//     let handleActiveGroupMsg = (item)=>{
//       console.log("ac",item)
//         dispatch(
//           activeChat({
//             status: 'group',
//             id: item.id,
//             name: item.groupname,
//             admin: item.adminname,
//             adminid: item.adminid,
//           })
//         );
//         localStorage.setItem(
//           "activeChat",
//           JSON.stringify({
//             status: 'group',
//             id: item.id,
//             name: item.groupname,
//             admin: item.adminname,
//             adminid: item.adminid,
//           })
//         );
//       }



//   return (
//     <div className='p-5 bg-white drop-shadow-lg mt-5 h-[273px] overflow-y-scroll'>
//       <h3 className='font-nunito font-bold text-xl'>Msg Groups</h3>
//       {groups.map((item)=>(
//        <div onClick={()=>handleActiveGroupMsg(item)} className='flex items-center mt-4 border-b border-solid border-[#5F35F5] pb-3 gap-x-3'>
//       <div>
//         <img className='w-[70px] h-[70px] rouded-full' src='images/pic3.png' />
//       </div>
//       <div className='ml-2 mr-2' >
//         <h3 className='font-Nunito font-regular text-base cursor-pointer'>Admin : {item.adminname}</h3>
//         <h3 className='font-Nunito font-semibold text-xl cursor-pointer'>{item.groupname}</h3>
//         <p className='font-Nunito font-medium text-sm text-[#4D4D4D] '>{item.grouptagline}</p>
//       </div>
//       <div>
//         <button className='font-Nunito font-semibold text-base text-white bg-[#5F35F5] px-2 py-2 rounded ml-2'>msg</button>
//       </div>
//        </div>
//       ))}
//     </div>
//   )
// }

// export default Groups