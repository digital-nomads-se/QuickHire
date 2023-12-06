'use client';
import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { BiLogOut } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { GiHamburgerMenu } from 'react-icons/gi';
import { setUserData } from '@/Utils/UserSlice';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import { useUser } from '@auth0/nextjs-auth0/client';

// The NavBar component
export default function NavBar() {
    const dispatch = useDispatch();
    const [openJobs, setOpenJobs] = useState(false)
    const { user, error, isLoading } = useUser();
    const Router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, isScrolled] = useState(false);

    const useOutsideClick = (callback) => {
        const ref = React.useRef();
        React.useEffect(() => {
            const handleClick = (event) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    callback();
                }
            };

            document.addEventListener('click', handleClick, true);
            return () => {
                document.removeEventListener('click', handleClick, true);
            };
        }, [ref]);
        return ref;
    };

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                isScrolled(true)
            } else {
                isScrolled(false)
            }
        })
        return () => {
            window.removeEventListener('scroll', () => {
                if (window.scrollY > 20) {
                    isScrolled(true)
                } else {
                    isScrolled(false)
                }
            })
        }
    }, [scrolled])

    const handleClickOutside = () => {
        setIsOpen(false);
    };
    const ref = useOutsideClick(handleClickOutside);

    return (
        <>
            <div className={`w-full ${scrolled ? "bg-gray-600/70" : "bg-gray-600"} px-6 h-20 text-white flex items-center justify-between fixed top-0 left-0 z-50`}>
                <div className='px-2 h-full flex items-center justify-center'>
                    <p className='uppercase font-semibold tracking-widest text-lg'>QuickHire</p>
                </div>
                <div className='px-2 h-full hidden items-center justify-center lg:flex'>
                    {user && (
                        <>
                            <Link href={'/'} className="px-3 mx-4 text-base font-medium transition-all duration-700 uppercase" >Home</Link>
                        </>
                    )}

                    <Link href={'/frontend/displayJobs'} className="px-3 mx-4 text-base font-medium transition-all duration-700 uppercase" >View Jobs</Link>

                    {user && user.email == 'sagarapatel03@gmail.com' && (
                        <>
                            <Link href={'/frontend/postedJob'} className="px-3 mx-4 text-base font-medium transition-all duration-700 uppercase" >Posted Jobs</Link>
                        </>
                    )}
                    {user && user.email == 'sagarapatel03@gmail.com' && (
                        <>
                            <Link href={'/frontend/postAJob'} className="px-3 mx-4 text-base font-medium transition-all duration-700 uppercase" >Post Jobs</Link>
                        </>
                    )}
                    {user && user.email != 'sagarapatel03@gmail.com' && (
                        <>
                            <Link href={'/frontend/dashboard'} className="px-3 mx-4 text-base font-medium transition-all duration-700 uppercase" >My Items</Link>
                        </>
                    )}
                </div>
                <div className='px-2 h-full hidden items-center justify-center lg:flex ' >
                    {
                        user && (
                            <>
                                <p className='text-lg px-4 font-semibold'>{user?.email}</p>
                                <Link href={'/api/auth/logout'} className='px-4 py-2 border border-white rounded uppercase tracking-widest mx-4   transition-all duration-700 hover:bg-white font-semibold text-base hover:text-black'>Logout</Link>

                            </>
                        )
                    }

                    {!isLoading && !user && (
                        <Link
                            href="/api/auth/login"
                            className="px-4 py-2 border border-white rounded uppercase tracking-widest mx-4   transition-all duration-700 hover:bg-white font-semibold text-base hover:text-black"
                        >
                            Log in
                        </Link>
                    )
                    }
                </div>

                <div className='flex lg:hidden  px-2 py-2 '>
                    <GiHamburgerMenu className='text-4xl' onClick={() => setIsOpen(state => !state)} />
                </div>

                {
                    isOpen && (
                        <div ref={ref} className='flex w-full py-2 animate-fade-in-down  bg-gray-600/70 transition-all fade duration-1000 absolute top-20 left-0  items-center justify-center flex-col '>
                            <div className='px-2 h-full flex items-center justify-center flex-col py-2 '>
                                <Link href={'/'} onClick={() => setIsOpen(false)} className="px-3  m-4 text-base font-medium transition-all duration-700 uppercase" >Home</Link>
                                <button onClick={() => setOpenJobs(state => !state)} className="px-3  m-4 text-base font-medium transition-all duration-700 uppercase flex items-center justify-center" >Jobs {openJobs ? <AiFillCaretUp /> : <AiFillCaretDown />} </button>

                                {
                                    openJobs &&
                                    <>
                                        <Link href={'/frontend/displayJobs'} onClick={() => setIsOpen(false)} className="px-3 m-4 text-base font-medium transition-all duration-700 uppercase" >View Jobs</Link>
                                        <Link href={'/frontend/postAJob'} onClick={() => setIsOpen(false)} className="px-3 m-4 text-base font-medium transition-all duration-700 uppercase" >Post Jobs</Link>
                                        <Link href={'/frontend/postedJob'} onClick={() => setIsOpen(false)} className="px-3 m-4 text-base font-medium transition-all duration-700 uppercase" >Posted Jobs</Link>
                                    </>
                                }
                                <Link href={'/frontend/dashboard'} onClick={() => setIsOpen(false)} className="px-3 m-4 text-base font-medium transition-all duration-700 uppercase" >Dashboard</Link>
                                {/* <Link href={'/'} onClick={() => setIsOpen(false)} className="px-3 m-4 text-base font-medium transition-all duration-700 uppercase" >Contact</Link> */}
                            </div>
                            <div className='px-2 h-full  items-center justify-center flex' >
                                {
                                    user !== null ? (
                                        <>

                                            <BiLogOut onClick={handleLogout} className=' cursor-pointer text-3xl hover:text-red-500 transition-all duration-700' />
                                            <p className='text-lg px-4 font-semibold'>{user?.name}</p>
                                        </>
                                    ) : (
                                        <>
                                            <Link href={'/api/auth/login'} className='px-4 py-2 border border-white rounded uppercase tracking-widest mx-4   transition-all duration-700 hover:bg-white font-semibold text-base hover:text-black'>Login</Link>
                                        </>
                                    )
                                }

                            </div>
                        </div>
                    )
                }

            </div>
        </>
    )
}
