import { useState } from "react"
import {ImLinkedin} from "react-icons/im"
import {AiFillEyeInvisible, AiFillEye} from "react-icons/ai"
import { useNavigate, Link } from "react-router-dom"
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getDatabase, ref, set } from "firebase/database";
import { RotatingLines } from 'react-loader-spinner'
import {BsArrowRight} from 'react-icons/bs'

const Registration = () => {


    let navigate = useNavigate()
    const auth = getAuth();
    const db = getDatabase();

    let[email, setEmail] = useState('')
    let[fullname, setFullname] = useState('')
    let[password, setPassword] = useState('')

    let[emailerr, setEmailerr] = useState('')
    let[fullnameerr, setFullnameerr] = useState('')
    let[passworderr, setPassworderr] = useState('')
    let[passwordshow, setPasswordshow] = useState(false)
    let[loading, setLoading] = useState(false)


    let handleEmail =(e)=>{
        setEmail(e.target.value)
        setEmailerr('')
    }
    
    let handleFullname =(e)=>{
        setFullname(e.target.value)
        setFullnameerr('')
    }
    
    let handlePassword =(e)=>{
        setPassword(e.target.value)
        setPassworderr('')
    }

    let handleSubmit = () => {
        if (!email){
          setEmailerr("Email is required");
        } else {
          if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)) {
            setEmailerr("Invalid email");
          }
        }
    
        if (!fullname){
          setFullnameerr("Full name is required");
        }
    
        if (!password){
          setPassworderr("Password is required");
        }else if(!/^(?=.*[a-z])/.test(password)){
          setPassworderr("Lowercase is Required")
        }else if(!/^(?=.*[A-Z])/.test(password)){
          setPassworderr("Uppercase is Required")
        }else if(!/^(?=.*[0-9])/.test(password)){
          setPassworderr("Number is Required")
        }else if(!/^(?=.*[!@#$%^&*])/.test(password)){
          setPassworderr("Symbol is Required")
        }else if(!/^(?=.{8,})/.test(password)){
          setPassworderr("Password must be eight characters or longer")
        }
    
        if (fullname && email && password && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) && /^(?=.*[a-z])/.test(password) && /^(?=.*[A-Z])/.test(password) && /^(?=.*[0-9])/.test(password) && /^(?=.*[!@#$%^&*])/.test(password) && /^(?=.{8,})/.test(password)){
            setLoading(true)
            createUserWithEmailAndPassword(auth, email, password)
            .then((user) => {
              updateProfile(auth.currentUser, {
                displayName: fullname,
                photoURL: "images/profile-pic.png",
              })
                .then(() => {
                  toast.success(
                    "Registration Successfull. Please varify your email"
                  );
                  console.log(user);
                  setEmail("");
                  setFullname("");
                  setPassword("");
                  sendEmailVerification(auth.currentUser);
                  setLoading(false);
                  setTimeout(() => {
                    navigate("/login");
                  }, 2000);
                })
                .then(() => {
                  set(ref(db, "users/" + user.user.uid), {
                    username: user.user.displayName,
                    email: user.user.email,
                  });
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              if (error.code.includes("auth/email-already-in-use")) {
                setEmailerr("Email already in use");
                setLoading(false);
              }
            });
        }
      };
        
    

    

  return (
    <div className='md:flex justify-center p-2 md:p-0 '>
        <ToastContainer position="top-right" theme="dark"/>
        <div className='mt-5 md:w-[550px] bg-white drop-shadow-xl p-10 text-center'>
            <ImLinkedin className='text-3xl text-[#086FA4] mb-4 w-full text-center'/>
            <h1 className='font-nunito font-bold text-center text-2xl md:text-2xl mb-2 md:mb-2 text-[#11175D]'>Get started with easily register</h1>
            <p className='font-nunito font-regular text-base md:text-xl text-[#11175D] mb-9 md:mb-8 text-center'>Free register and you can enjoy it</p>
        
            <div className='relative w-full md:w-[350px] mx-auto'>
              <input className='w-full px-9 py-0 md:py-4 border border-solid border:bg-[#11175D] rounded-lg font-nunito font-regular text-base' type='text' onChange={handleEmail} value={email}/>
              <p className='absolute top-[-10px] left-5 px-4 bg-white font-nunito font-semi-bold text-sm text-[#11175D]'>Email Address</p>
            </div>
            {emailerr &&
             <p className="w-full md:w-[350px] rounded py-1 pl-2 mt-1 bg-red-600 mx-auto font-nunito font-regular text-white">{emailerr}</p> 
            }

            <div className='relative w-full md:w-[350px] mx-auto mt-4'>
              <input className='w-full px-9 py-0 md:py-4 border border-solid border:bg-[#11175D] rounded-lg font-nunito font-regular text-base' type='text' onChange={handleFullname} value={fullname}/>
              <p className='absolute top-[-10px] left-5 px-4 bg-white font-nunito font-semi-bold text-sm text-[#11175D]'>Full Name</p>
            </div>
            {fullnameerr &&
             <p className="w-full md:w-[350px] rounded py-1 pl-2 mt-1 bg-red-600 mx-auto font-nunito font-regular text-white">{fullnameerr}</p> 
            }

            <div className='relative mt-4 w-auto md:w-[350px] mx-auto'>
              <input className=' w-full px-9 py-5 md:py-4 border border-solid border:bg-[#11175D] rounded' type={passwordshow? "text" : "password"} onChange={handlePassword} value={password}/>
              <p className='absolute top-[-10px] left-5 px-4 bg-white font-nunito font-semi-bold text-sm text-[#11175D]'>Password</p>
              {passwordshow
              ?
              <AiFillEye onClick={()=>setPasswordshow(!passwordshow)} className="absolute right-5 top-5"/>
              :
              <AiFillEyeInvisible onClick={()=>setPasswordshow(!passwordshow)} className="absolute right-5 top-5"/>
              }
            </div> 
            {passworderr &&
             <p className="w-full md:w-[350px] rounded py-1 pl-2 mt-1 bg-red-600 mx-auto font-nunito font-regular text-white">{passworderr}</p> 
            }

            {loading
            ?
            <div className="flex justify-center mt-5">
             <RotatingLines
              strokeColor="grey"
              strokeWidth="5"
              animationDuration="0.75"
              width="50"
              visible={true}
             />
            </div>
            :
            (<div className="text-center mt-4">
                <button onClick={handleSubmit} className='inline-block mx-auto w-full md:w-[200px] bg-[#11175D] text-center text-white rounded-xl py-4 md:py-3 font-nunito font-bold text-xl relative'>Sign up <BsArrowRight className="absolute top-4 right-9"/> </button>
            </div>)
            }

            <p className="font-nunito font-medium text-base mt-3 md:mt-2 text-black text-center">Already have an Account. <Link to='/login'><span className="text-[#11175D]">Sign in</span></Link></p>
        </div>
    </div>
    )
}

export default Registration