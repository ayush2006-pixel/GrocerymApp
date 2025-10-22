import React from 'react'
import { Link } from 'react-router-dom'
import mainBannerDesktop from '../assets/main_banner_bg.png'
import mainBannerMobile from '../assets/main_banner_bg_sm.png'
import white_arrow from '../assets/white_arrow_icon.svg'
import black_arrow from '../assets/black_arrow_icon.svg'

const MainBanner = () => {
    return (
        <div className='relative'>
            <img src={mainBannerDesktop} alt="Desktop Banner" className='hidden md:block w-full' />
            <img src={mainBannerMobile} alt="Mobile Banner" className='block md:hidden w-full' />
            
            <div className='absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24'>
                <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-15'>
                    Freshness You Can Trust , Saving You Will Love!
                </h1>
                <div className='flex items-center mt-6 font-medium'>
                    <Link to={"/products"} className='group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer'>
                        Shop Now!
                        <img className='md:hidden transition group-hover:translate-x-1' src={white_arrow} alt="arrow" />
                    </Link>

                    <Link to={"/products"} className='group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer'>
                        Explore Deals!
                        <img className='transition group-hover:translate-x-1' src={black_arrow} alt="arrow" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default MainBanner
