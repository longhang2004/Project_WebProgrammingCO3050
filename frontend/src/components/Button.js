import React, { memo } from 'react'

const Button = ({name, handleOnClick, style, iconsBefore, iconsAfter, fw}) => {
  return (
    <button 
    type='button'
    className={style ? style : `px-4 py-2 rounded-md text-white bg-cyan-800 my-2 text-semibold ${fw ? 'w-full' : 'w-fit'}`}
    onClick={() => {handleOnClick && handleOnClick()}}
    >
        {iconsBefore}
        <span>{name}</span>
        {iconsAfter}
    </button>
  )
}

export default memo(Button)