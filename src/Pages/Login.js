import { useState } from "react"
import { useNavigate, Link} from "react-router-dom"
import {ImLinkedin} from "react-icons/im"
import {AiFillEyeInvisible, AiFillEye} from "react-icons/ai"
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../slices/userSlice";
import { RotatingLines } from 'react-loader-spinner';
import {BsArrowRight} from 'react-icons/bs'
import {FcGoogle} from 'react-icons/fc'

const Login = () => {

    const dispatch = useDispatch();
    let navigate = useNavigate();
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    let[email, setEmail] = useState('')
    let[password, setPassword] = useState('')

    let[emailerr, setEmailerr] = useState('')
    let[passworderr, setPassworderr] = useState('')
    let[passwordshow, setPasswordshow] = useState(false)
    let[loading, setLoading] = useState(false)


    let handleEmail =(e)=>{
        setEmail(e.target.value)
        setEmailerr('')
    }
    
    
    let handlePassword =(e)=>{
        setPassword(e.target.value)
        setPassworderr('')
    }


    let handleLoginSubmit = ()=>{
        if(!email){
            setEmailerr('Email is Empty')
        }else if((!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
            setEmailerr('Invaild Email')
        }

        if(!password){
            setPassworderr('Password is Empty')
        }else if((!/^(?=.*[a-z])/.test(password))){
            setPassworderr('Give a small letter')
        }else if((!/^(?=.*[A-Z])/.test(password))){
            setPassworderr('Give a capital letter')
        }else if((!/^(?=.*[0-9])/.test(password))){
            setPassworderr('Give a number')
        }else if((!/^(?=.*[!@#$%^&*])/.test(password))){
            setPassworderr('Give a symbol')
        }else if((!/^(?=.{8,})/.test(password))){
            setPassworderr('Password must be eight characters or longer')
        }

        if(email && password && (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) &&  (/^(?=.*[a-z])/.test(password)) && (/^(?=.*[A-Z])/.test(password)) && (/^(?=.*[0-9])/.test(password)) && (/^(?=.*[!@#$%^&*])/.test(password)) && (/^(?=.{8,})/.test(password))){
            signInWithEmailAndPassword(auth, email, password)
            .then((user)=>{
                setLoading(true)
                toast.success('Login Successfully')
                dispatch(userLoginInfo(user.user))
                localStorage.setItem("userInfo", JSON.stringify(user))          
                setTimeout(()=>{
                    navigate('/home')
                },2000)
                
            }).catch((error) => {
                const errorCode = error.code;
                if(errorCode.includes('auth/user-not-found')){
                    setEmailerr("Email doesn't match")
                }

                if(error.code.includes('auth/wrong-password')){
                    setPassworderr("Password doesn't match")
                }
            })
        }

    }

    let handleGoogleSignIn = () => {
        signInWithPopup(auth, provider).then(() => {
          navigate("/home");
        });
    };


  return (
    <>
        <div className=' md:flex justify-center p-2 md:p-0'>
            <ToastContainer position="top-right" theme="dark"/>
            <div className='mt-5 md:w-[550px] bg-white drop-shadow-xl p-10'>
                <ImLinkedin className='text-3xl text-[#086FA4] mb-4 w-full text-center'/>
                <h1 className='font-nunito font-bold text-4xl mb-3 text-[#11175D] text-center'>Login</h1>
                <p className='font-nunito font-regular text-xl text-[#11175D] mb-8 text-center'>Free register and you can enjoy it</p>
            
                <div className='relative w-full md:w-[350px] mx-auto'>
                <input className='w-full px-9 py-4 border border-solid border:bg-[#11175D] rounded-lg font-nunito font-regular text-base' type='text' onChange={handleEmail} value={email}/>
                <p className='absolute top-[-10px] left-5 px-4 bg-white font-nunito font-semi-bold text-sm text-[#11175D]'>Email Address</p>
                </div>
                {emailerr &&
                <p className="w-full md:w-[350px] mx-auto rounded py-1 pl-2 mt-1 bg-red-600 font-nunito font-regular text-white">{emailerr}</p>
                }

                <div className='relative mt-4 w-full md:w-[350px] mx-auto'>
                <input className=' w-full px-9 py-4 border border-solid border:bg-[#11175D] rounded-lg' type={passwordshow? "text" : "password"} onChange={handlePassword} value={password}/>
                <p className='absolute top-[-10px] left-5 px-4 bg-white font-nunito font-semi-bold text-sm text-[#11175D]'>Password</p>
                {passwordshow
                ?
                <AiFillEye onClick={()=>setPasswordshow(!passwordshow)} className="absolute right-5 top-5"/>
                :
                <AiFillEyeInvisible onClick={()=>setPasswordshow(!passwordshow)} className="absolute right-5 top-5"/>
                }
                </div> 
                {passworderr &&
                <p className="w-full mx-auto md:w-[350px] rounded py-1 pl-2 mt-1 bg-red-600 font-nunito font-regular text-white">{passworderr}</p> 
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
                    <button onClick={handleLoginSubmit} className='relative w-full md:w-[200px] bg-[#11175D] text-center text-white rounded-xl py-3 font-nunito font-bold text-xl'>Login <BsArrowRight className="absolute
                    top-4 right-12"/> </button>
                </div>)
                }
                <div onClick={handleGoogleSignIn} className="border border-solid border-[#11175D] font-nunito font-regular text-base text-secondary mt-3.5 w-[200px] rounded-lg py-2 mx-auto cursor-pointer">
                   <p className="font-regular text-base text-[#11175D] text-center flex items-center ml-3.5"><FcGoogle/><span className="ml-2">Sign in with Google</span></p>
                </div>
                <p className="font-nunito font-medium text-base mt-5 md:mt-3 text-black text-center">Create a new account. <Link to='/'><span className="text-[#11175D]">Sign Up</span></Link></p>
                <p className="font-nunito font-medium text-base mt-5 md:mt-3 text-black text-center"><Link to='/forgottonpassword'><span className="text-[#11175D]">Forgotton Password</span></Link></p>
            </div>
        </div>
    </>
  )
}

export default Login