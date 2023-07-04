import React from 'react'

const Footer = () => {
  return (
    <div className='flex mt-2 mb-2 bg-white drop-shadow-lg border border-solid border:bg-[#444] p-5'>
        <div className='w-1/5'>
          <img className='ml-5' src='images/logo.png'/>
          <h3  className='ml-5 mt-4'>LinkedIn</h3>
        </div>
        <div className='w-1/5'>
          <h className='font-nunito font-medium text-[#181818] text-sm'>Navigation</h>
          <ul className='mt-3'>
            <li className='mt-2 font-nunito font-regular text-[#181818] text-sm'>About</li>
            <li className='mt-2 font-nunito font-regular text-[#181818] text-sm'>Careers</li>
            <li className='mt-2 font-nunito font-regular text-[#181818] text-sm'>Advertising</li>
            <li className='mt-2 font-nunito font-regular text-[#181818] text-sm'>Small Business</li>
          </ul>
        </div>
        <div className='w-1/5'>
          <ul className='mt-10'>
            <li className='mt-2 font-nunito font-regular text-[#181818] text-sm'>Talent Solutions</li>
            <li className='mt-2 font-nunito font-regular text-[#181818] text-sm'>Marketing Solutions</li>
            <li className='mt-2 font-nunito font-regular text-[#181818] text-sm'>Sales Solutions</li>
            <li className='mt-2 font-nunito font-regular text-[#181818] text-sm'>Safery Center</li>
          </ul>
        </div>
        <div className='w-1/5'>
          <ul className='mt-10'>
            <li className='font-nunito font-regular text-[#181818] text-sm mt-2'>Community Guidelines</li>
            <li className='font-nunito font-regular text-[#181818] text-sm mt-2'>Privacy & Terms </li>
            <li className='font-nunito font-regular text-[#181818] text-sm mt-2'>Mobile App</li>
          </ul>
        </div>
        <div className='w-1/5'>
          <h3 className='mb-5 font-nunito font-medium text-black text-sm'>Fast access</h3>
          <div className='flex flex-wrap'>
          <button className='w-[170px] px-4 py-2 inline-block border border-solid border:bg-[#0275B1] mb-3 rounded bg-[#0275B1] font-nunito font-medium text-white text-sm'>Questions?</button>
          <button className='w-[170px] px-4 py-2 inline-block border border-solid border:bg-[#0275B1]rounder font-nunito font-medium text-[#0275B1] text-sm'>Settings</button>
          </div>
        </div>
    </div>
  )
}

export default Footer