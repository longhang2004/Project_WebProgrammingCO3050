// import React, {Fragment, memo, useState } from 'react'
// import logo from 'assets/logoabc.png'
// import {adminSidebar} from 'utils/contants'
// import { NavLink, Link } from 'react-router-dom'
// import clsx from 'clsx'
// import { FaChevronDown, FaChevronRight  } from "react-icons/fa";

// const activedStyle = 'px-4 py-2 flex items-center gap-2 text-xl bg-gray-300 rounded-xl'
// const notActivedStyle = 'px-4 py-2 flex items-center gap-2 text-xl hover:bg-gray-100 rounded-xl'

// const AdminSidebar = () => {
//     const [actived, setActived] = useState([]);
//     const handleShowTabs = (tabId) => { 
//         if(actived.some(el => el === tabId)) setActived(prev => prev.filter(el => el !== tabId))
//             else setActived(prev => [...prev, tabId])
//     }
//   return (
//     <div className='p-4 bg-sky-200 h-full'>
//         <div className='flex flex-col justify-center items-center py-4 gap-2'>
//             <Link to="/" className="cursor-pointer hover:opacity-80 transition-opacity">
//                 <img src={logo} alt='logo' className='w-[150px] object-contain'></img>
//             </Link>
//             <span className='text-bold'>Trang quản lý của admin</span>
//         </div>
//         <div className='flex flex-col justify gap-6 pt-6'>
//             {adminSidebar.map(el => (
//                 <Fragment key={el.id}>
//                     {el.type === 'SINGLE' && <NavLink 
//                         to={el.path}
//                         className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notActivedStyle)}>
//                             <span>{el.icon}</span>
//                             <span>{el.text}</span>
//                         </NavLink>    
//                     }
//                     {el.type === 'PARENT' && <div onClick={() => { handleShowTabs(el.id) }} className='flex flex-col text-black text-xl '>
//                         <div className='flex items-center justify-between gap-2 px-4 py-2 hover:bg-blue-100 rounded-xl cursor-pointer'>
//                             <div className='flex items-center gap-2'>
//                                 <span>{el.icon}</span>
//                                 <span>{el.text}</span>
//                             </div>
//                             {actived.some(id => id === el.id) ? <FaChevronRight/> : <FaChevronDown/>}
//                         </div>
//                         { actived.some(id => id === el.id) && <div className='flex flex-col pt-6 pl-6 gap-6'>
//                             {el.submenu.map(item => (
//                                 <NavLink 
//                                     key={item.text} 
//                                     to={item.path}
//                                     onClick={e => e.stopPropagation()}
//                                     className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notActivedStyle, 'pl-6')}
//                                 >
//                                     {item.text}
//                                 </NavLink>
//                             ))}
//                         </div>   
//                         }
//                     </div>
//                     }
//                 </Fragment>
//             ))} 
//         </div>
//     </div>
//   )
// }

// export default memo(AdminSidebar)