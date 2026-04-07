import {TbBrandLinkedin, TbBrandMeta} from 'react-icons/tb';
import {IoLogoInstagram} from 'react-icons/io'; 



const Topbar = () => {  
    return (
        <div className ="bg-[#A38EAD] text-white h-10 flex items-center justify-center text-sm">
            <div className="w-full flex items-center justify-between py-3 px-4 sm:px-6 lg:px-12 xl:px-16">
                <div className="hidden md:flex items-center  space-x-4">
                    <a href="https://www.meta.com/" className="hover:text-black">
                        <TbBrandMeta className="h-5 w-5"/>
                    </a>
                    <a href="https://www.instagram.com/hasbanpranav/" className="hover:text-pink-600">
                        <IoLogoInstagram className="h-5 w-5"/>
                    </a>
                    <a href="https://www.linkedin.com/in/pranav-hasban-0b7a9b2a1/" className="hover:text-blue-500">
                        <TbBrandLinkedin className="h-5 w-5"/>
                    </a>
                </div>
                <div className="text-center grow">
                    <span>Be The First To Change Yourself</span>
                </div>
                <div className="text-sm hidden md:block">
                    <a href="tel:+911234567890" className="hover:text-[#1b2a35]">
                        +91 1234567890
                    </a>
                </div>
            </div>
        </div>
    )
}
export default Topbar;
