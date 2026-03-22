import React, { useState } from 'react';
import { FaPhone, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

const PhoneInput = ({ value, onChange, required = true, className = '' }) => {
  const [validation, setValidation] = useState({ valid: false, message: '' });
  const [isFocused, setIsFocused] = useState(false);

  const validatePhone = (phone) => {
    if (!phone || phone.trim() === '') {
      return { valid: false, message: 'Phone number is required' };
    }
    
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    if (cleaned.startsWith('+251')) {
      cleaned = cleaned.substring(3);
    } else if (!cleaned.startsWith('0')) {
      return { valid: false, message: 'Phone number must start with 0 or +251' };
    }
    
    if (cleaned.length !== 10) {
      return { valid: false, message: 'Phone number must be 10 digits' };
    }
    
    if (!/^\d+$/.test(cleaned)) {
      return { valid: false, message: 'Phone number can only contain digits' };
    }
    
    const prefix = cleaned.substring(0, 2);
    
    if (prefix === '09' || prefix === '07') {
      return { valid: true, message: 'Valid phone number' };
    } else {
      return { valid: false, message: 'Must start with 09 (Ethio Telecom) or 07 (Safaricom)' };
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    const result = validatePhone(newValue);
    setValidation(result);
    onChange(newValue);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaPhone className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="tel"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          required={required}
          className={`pl-10 pr-10 input-field ${className} ${
            validation.valid ? 'border-green-500 focus:ring-green-500' : 
            value && !validation.valid && !isFocused ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          placeholder="e.g., 0912345678 or +251912345678"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {validation.valid && (
            <FaCheck className="h-5 w-5 text-green-500" />
          )}
          {value && !validation.valid && !isFocused && (
            <FaExclamationTriangle className="h-5 w-5 text-red-500" />
          )}
        </div>
      </div>
      
      {value && !validation.valid && !isFocused && (
        <p className="mt-1 text-xs text-red-600">{validation.message}</p>
      )}
      
      {validation.valid && (
        <p className="mt-1 text-xs text-green-600">
          ✓ Valid Ethiopian phone number
        </p>
      )}
    </div>
  );
};

export default PhoneInput;