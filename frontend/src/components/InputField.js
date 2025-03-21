import { Plane } from 'lucide-react'
import React from 'react'

const InputField = ({ value, setValue, nameKey, type, invalidFields, setInvalidFields, placeholder }) => {
  //const [isFocus, setIsFocus] = useState(false)
  return (
    <div className='relative w-full'>
        {value.trim() !== '' && <label className='text-[10px] absolute top-0 left-[12px] block bg-white px-1' htmlFor={nameKey}>{placeholder}</label>}
        <input
          type={type || ''}
          className='w-full px-4 py-2 my-2 border rounded-sm outline-none placeholder:text-sm placeholder:italic'
          placeholder={placeholder}
          value={value}
          onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
          onFocus={() => setInvalidFields([])}
        />
        {invalidFields?.some(el => el.name === nameKey) &&  
          <small className='text-main text-[10px] italic'> 
            {invalidFields.find(el => el.name === nameKey)?.mes}
          </small>}
    </div>
  )
}

export default InputField