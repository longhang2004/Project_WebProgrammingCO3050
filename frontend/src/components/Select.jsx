import React from 'react';

const Select = ({
    id,
    name,
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Select an option',
    disabled = false,
    required = false,
    className = '',
    error = '',
}) => {
    return (
        <div className="w-200px">
            {label && (
                <label 
                    htmlFor={id} 
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={`
                    block w-full rounded-md border-gray-300 shadow-sm 
                    focus:border-indigo-500 focus:ring-indigo-500
                    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
                    ${error ? 'border-red-500' : 'border-gray-300'} 
                    ${className}
                `}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default Select;