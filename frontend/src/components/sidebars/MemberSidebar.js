import React, {Fragment, memo, useState } from 'react'
import logo from 'assets/logoabc.png'
import {memberSidebar} from 'utils/contants'
import { NavLink, Link } from 'react-router-dom'
import clsx from 'clsx'
import { FaChevronDown, FaChevronRight  } from "react-icons/fa";

const activedStyle = 'px-4 py-2 flex items-center gap-2 text-xl bg-gray-300 rounded-xl'
const notActivedStyle = 'px-4 py-2 flex items-center gap-2 text-xl hover:bg-gray-100 rounded-xl'

const AdminSidebar = () => {
    const [actived, setActived] = useState([]);
    const handleShowTabs = (tabId) => { 
        if(actived.some(el => el === tabId)) setActived(prev => prev.filter(el => el !== tabId))
            else setActived(prev => [...prev, tabId])
    }
  return (
    <div className='h-full p-4 bg-sky-200'>
        <div className='flex flex-col items-center justify-center gap-2 py-4'>
            <Link to="/" className="transition-opacity cursor-pointer hover:opacity-80">
                <img src={logo} alt='logo' className='w-[150px] object-contain'></img>
            </Link>
            <span className='text-bold'>Trang quản lý của admin</span>
        </div>
        <div className='flex flex-col gap-6 pt-6 justify'>
            {memberSidebar.map(el => (
                <Fragment key={el.id}>
                    {el.type === 'SINGLE' && <NavLink 
                        to={el.path}
                        className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notActivedStyle)}>
                            <span>{el.icon}</span>
                            <span>{el.text}</span>
                        </NavLink>    
                    }
                    {el.type === 'PARENT' && <div onClick={() => { handleShowTabs(el.id) }} className='flex flex-col text-xl text-black '>
                        <div className='flex items-center justify-between gap-2 px-4 py-2 cursor-pointer hover:bg-blue-100 rounded-xl'>
                            <div className='flex items-center gap-2'>
                                <span>{el.icon}</span>
                                <span>{el.text}</span>
                            </div>
                            {actived.some(id => id === el.id) ? <FaChevronRight/> : <FaChevronDown/>}
                        </div>
                        { actived.some(id => id === el.id) && <div className='flex flex-col gap-6 pt-6 pl-6'>
                            {el.submenu.map(item => (
                                <NavLink 
                                    key={item.text} 
                                    to={item.path}
                                    onClick={e => e.stopPropagation()}
                                    className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notActivedStyle, 'pl-6')}
                                >
                                    {item.text}
                                </NavLink>
                            ))}
                        </div>   
                        }
                    </div>
                    }
                </Fragment>
            ))} 
        </div>
    </div>
  )
}

export default memo(AdminSidebar)