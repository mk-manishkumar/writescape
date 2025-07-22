import React from 'react'
import { footer_data } from '../assets/assets';

const Footer = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/30">
      <div className="flex flex-col md:flex-row justify-between items-start py-10 gap-10 border-b border-gray-500 text-gray-500">
        <div>
          <h2 className="text-2xl text-primary font-semibold cursor-pointer">
            📝WriteScape
          </h2>
          <p className='max-w-[410px] mt-2'>
            WriteScape is your go-to platform for exploring and sharing captivating blogs across various categories. Join our community of writers and readers today!
          </p>
        </div>
        <div className='flex flex-wrap justify-between w-full md:w-[45%] gsp-5'>
            {footer_data.map((section) => (
              <div key={section.title}>
                <h3 className='font-semibold text-base text-gray-900 md:mb-5 mb-2'>{section.title}</h3>
                <ul className='text-sm space-y-1'>
                  {section.links.map((link) => (
                    <li key={link} className="text-sm text-gray-500 hover:text-primary hover:underline transition cursor-pointer">
                      {link}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>
      <p className="py-5 text-center text-sm md:text-base text-gray-500">Copyright 2025 &copy; WriteScape - All Rights Reserved.</p>
    </div>
  );
}

export default Footer