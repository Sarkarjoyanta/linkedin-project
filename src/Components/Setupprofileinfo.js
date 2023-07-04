import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getDatabase, ref, set, push} from "firebase/database";

const Setupprofileinfo = () => {

    const db = getDatabase()
    let data = useSelector((state)=> state.userLoginInfo.userInfo)
    let [profileSetupModal, setProfileSetupModal] = useState(false)

    let[title, setTitle] = useState('')
    let[phoneNumber, setPhoneNumber] = useState('')
    let[address, setAddress] = useState('')
    let[about, setAbout] = useState('')
    let[workTitle, setWorkTitle] = useState('')
    let[companyName, setCompanyName] = useState('')
    let[experienceYear, setExperienceYear] = useState('')
    let[schoolName, setSchoolName] = useState('')
    let[degreeName, setDegreeName] = useState('')
    let[passingYear, setPassingYear] = useState('')

    let[titleerr, setTitleerr] = useState('')
    let[phoneNumbererr, setPhoneNumbererr] = useState('')
    let[addresserr, setAddresserr] = useState('')
    let[abouterr, setAbouterr] = useState('')
    let[workTitleerr, setWorkTitleerr] = useState('')
    let[companyNameerr, setCompanyNameerr] = useState('')
    let[experienceYearerr, setExperienceYearerr] = useState('')
    let[schoolNameerr, setSchoolNameerr] = useState('')
    let[degreeNameerr, setDegreeNameerr] = useState('')
    let[passingYearerr, setPassingYearerr] = useState('')


    let handleProfileUpload = ()=>{
        setProfileSetupModal(true)
    }
    
    let handleProfileSetupCencel = ()=>{
        setProfileSetupModal(false)
    }

    let handleTitle = (e)=>{
        setTitle(e.target.value)
        setTitleerr('')
    }
    
    let handlePhoneNumber = (e)=>{
        setPhoneNumber(e.target.value)
        setPhoneNumbererr('')
    }
    
    let handleAddress = (e)=>{
        setAddress(e.target.value)
        setAddresserr('')
    }
    
    let handleAbout = (e)=>{
        setAbout(e.target.value)
        setAbouterr('')
    }
    
    let handleWorkTitle = (e)=>{
        setWorkTitle(e.target.value)
        setWorkTitleerr('')
    }
    
    let handleCompanyName = (e)=>{
        setCompanyName(e.target.value)
        setCompanyNameerr('')
    }
    
    let handleExperienceYear = (e)=>{
        setExperienceYear(e.target.value)
        setExperienceYearerr('')
    }
    
    let handleSchoolName = (e)=>{
        setSchoolName(e.target.value)
        setSchoolNameerr('')
    }
    
    let handleDegreeName = (e)=>{
        setDegreeName(e.target.value)
        setDegreeNameerr('')
    }
    
    let handlePassingYear = (e)=>{
        setPassingYear(e.target.value)
        setPassingYearerr('')
    }

    let handleProfileInfoSetup =()=>{
        if(!title){
            setTitleerr('Title is Requierd')
        }
        
        if(!phoneNumber){
            setPhoneNumbererr('PhoneNumber is Requierd')
        }
        
        if(!address){
            setAddresserr('Address is Requierd')
        }
        
        if(!about){
            setAbouterr('About is Requierd')
        }
        
        if(!workTitle){
            setWorkTitleerr('WorkTitle is Requierd')
        }
        
        if(!companyName){
            setCompanyNameerr('CompanyName is Requierd')
        }
        
        if(!experienceYear){
            setExperienceYearerr('ExperienceYear is Requierd')
        }
        
        if(!schoolName){
            setSchoolNameerr('SchoolName is Requierd')
        }
        
        if(!degreeName){
            setDegreeNameerr('DegreeName is Requierd')
        }
        
        if(!passingYear){
            setPassingYearerr('PassingYear is Requierd')
        }

        if(title && phoneNumber && address && about && workTitle && companyName && experienceYear && schoolName 
        && degreeName && passingYear ){
            set(push(ref(db, 'profileInfo/')),{
                username: data.displayName,
                userid: data.uid,
                title: title,
                phoneNumber: phoneNumber,
                address: address,
                about: about,
                workTitle: workTitle,
                companyName: companyName,
                experienceYear: experienceYear,
                schoolName: schoolName,
                degreeName: degreeName,
                passingYear: passingYear,
            }).then(()=>{
                setProfileSetupModal(false)
                setTitle('')
                setPhoneNumber('')
                setAddress('')
                setAbout('')
                setWorkTitle('')
                setCompanyName('')
                setExperienceYear('')
                setSchoolName('')
                setDegreeName('')
                setPassingYear('')
            })
        }

    }

    

  return (
    <div>
        {profileSetupModal
        ?
        <div className='w-full h-screen bg-blue-600 rounded p-5 absolute top-0 left-0 z-50 flex '>
          <div>

            <div className='w-[500px]'>
            <p className='font-nunito font-medium text-base text-white'>Title</p>
            <input onChange={handleTitle} className='w-full px-2 py-2 border border-solid border:bg-black rounded p-2 font-nunito font-semi-bold text-base' type='text' value={title} />
            </div>
            {titleerr &&
            <p className='mt-1 w-[500px] font-nunito font-regular text-base text-white bg-red-600 rounded p-1'>{titleerr}</p>
            }
            
            <div className='w-[500px]'>
            <p className='font-nunito font-medium text-base text-white'>Phone</p>
            <input onChange={handlePhoneNumber} className='w-full px-2 py-2 border border-solid border:bg-black rounded p-2 font-nunito font-semi-bold text-base' type='text' value={phoneNumber} />
            </div>
            {phoneNumbererr &&
            <p className='w-[500px] font-nunito font-regular text-base text-white bg-red-600 rounded p-1'>{phoneNumbererr}</p>
            }

          <div className='w-[500px]'>
           <p className='mt-1 font-nunito font-medium text-base text-white'>Address</p>
           <input onChange={handleAddress} className='w-full px-2 py-2 border border-solid border:bg-black rounded p-2 font-nunito font-semi-bold text-base' type='text' value={address} />
          </div>
           {addresserr &&
           <p className='w-[500px] mt-1 font-nunito font-regular text-base text-white bg-red-600 rounded p-1'>{addresserr}</p>
           }

           <div className='w-[500px]'>
           <p className='font-nunito font-medium text-base text-white mt-1'>About</p>
           <input onChange={handleAbout} className='w-full px-2 py-2 border border-solid border:bg-black rounded p-2 font-nunito font-semi-bold text-base' type='text' value={about} />
           </div>
           {abouterr &&
           <p className='w-[500px] mt-1 font-nunito font-regular text-base text-white bg-red-600 rounded p-1'>{abouterr}</p>
           }
 
          <div className='w-[500px]'>
          <p className='font-nunito font-medium text-base text-white'>work Title</p>
           <input onChange={handleWorkTitle} className=' w-full px-2 py-2 border border-solid border:bg-black rounded p-2 font-nunito font-semi-bold text-base' type='text' value={workTitle} />
          </div>
           {workTitleerr &&
           <p className='w-[500px] mt-1 font-nunito font-regular text-base text-white bg-red-600 rounded p-1'>{workTitleerr}</p>
           }

           <div className='w-[500px]'>
           <p className='font-nunito font-medium text-base text-white mt-1'>Company Name</p>
           <input onChange={handleCompanyName} className=' w-full px-2 py-2 border border-solid border:bg-black rounded p-2 font-nunito font-semi-bold text-base' type='text' value={companyName} />
           </div>
           {companyNameerr &&
           <p className='w-[500px] mt-1 font-nunito font-regular text-base text-white bg-red-600 rounded p-1'>{companyNameerr}</p>
           }

           </div>
           <div className='ml-5'>
           <div className='w-[500px]'>
           <p className='font-nunito font-medium text-base text-white mt-1'>Experience Year</p>
           <input onChange={handleExperienceYear} className='w-full px-2 py-2 border border-solid border:bg-black rounded p-2 font-nunito font-semi-bold text-base' type='text' value={experienceYear} />
            </div>
           {experienceYearerr &&
           <p className='w-[500px] mt-1 font-nunito font-regular text-base text-white bg-red-600 rounded p-1'>{experienceYearerr}</p>
           }
            
           <div className='w-[500px]'>
           <p className='font-nunito font-medium text-base text-white'>School/College Name</p>
           <input onChange={handleSchoolName} className=' w-full px-2 py-2 border border-solid border:bg-black rounded p-2 font-nunito font-semi-bold text-base' type='text' value={schoolName} />
           </div>
           {schoolNameerr &&
           <p className='w-[500px] mt-1 font-nunito font-regular text-base text-white bg-red-600 rounded p-1'>{schoolNameerr}</p>
           }

           <div className='w-[500px]'> 
           <p className='font-nunito font-medium text-base text-white mt-1'>Degree</p>
           <input onChange={handleDegreeName} className='w-full px-2 py-2 border border-solid border:bg-black rounded p-2 font-nunito font-semi-bold text-base' type='text' value={degreeName} />
           </div>
           {degreeNameerr &&
           <p className='w-[500px] mt-1 font-nunito font-regular text-base text-white bg-red-600 rounded p-1'>{degreeNameerr}</p>
           }
         
           <div className='w-[500px]'>
           <p className='font-nunito font-medium text-base text-white mt-1'>Passing Year</p>
           <input onChange={handlePassingYear} className='w-full px-2 py-2 border border-solid border:bg-black rounded p-2 font-nunito font-semi-bold text-base' type='text' value={passingYear} />
           </div>
           {passingYearerr &&
           <p className='w-[500px] mt-1 font-nunito font-regular text-base text-white bg-red-600 rounded p-1'>{passingYearerr}</p>
           }
           <br />
          <button onClick={handleProfileInfoSetup} className='inline-block border border-solid border:bg-white text-black text-base font-nunito font-bold mt-5 mr-5 bg-white py-1 px-3 rounded'>Update Information</button>
          <button onClick={handleProfileSetupCencel} className='inline-block border border-solid border:bg-white text-black text-base font-nunito font-bold bg-white py-1 px-3 rounded'>Cencel</button>
          </div>
         </div>
         :
         <button onClick={handleProfileUpload} className='font-nunito font-bold text-base inline-block px-3 py-2 border border-solid border:bg-blue-600 bg-blue-600 text-white rounded mt-3 mr-4'>Setup ProfileInfo</button>
        }
    </div>
  )
}

export default Setupprofileinfo