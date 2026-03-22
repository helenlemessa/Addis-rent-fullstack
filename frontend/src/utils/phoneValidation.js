/**
 * Ethiopian Phone Number Validator
 * Supports Ethio Telecom (09) and Safaricom Ethiopia (07)
 */

export const validateEthiopianPhone = (phone) => {
  // Remove all spaces, dashes, and special characters
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if it starts with +251 (international format)
  if (cleaned.startsWith('+251')) {
    cleaned = cleaned.substring(3);
  }
  // Check if it starts with 0 (local format)
  else if (cleaned.startsWith('0')) {
    cleaned = cleaned;
  }
  else {
    return { valid: false, message: 'Phone number must start with 0 or +251' };
  }
  
  // Should be exactly 10 digits after removing country code
  if (cleaned.length !== 10) {
    return { valid: false, message: 'Phone number must be 10 digits (e.g., 0912345678 or +251912345678)' };
  }
  
  // Check if it contains only digits
  if (!/^\d+$/.test(cleaned)) {
    return { valid: false, message: 'Phone number can only contain digits' };
  }
  
  // Check first two digits for valid providers
  const prefix = cleaned.substring(0, 2);
  
  // Ethio Telecom prefixes: 09
  if (prefix === '09') {
    return { 
      valid: true, 
      message: 'Valid Ethio Telecom number',
      provider: 'Ethio Telecom',
      formatted: cleaned
    };
  }
  // Safaricom Ethiopia prefixes: 07
  else if (prefix === '07') {
    return { 
      valid: true, 
      message: 'Valid Safaricom Ethiopia number',
      provider: 'Safaricom Ethiopia',
      formatted: cleaned
    };
  }
  else {
    return { 
      valid: false, 
      message: 'Invalid Ethiopian phone number. Must start with 09 (Ethio Telecom) or 07 (Safaricom)' 
    };
  }
};

export const formatEthiopianPhone = (phone) => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Remove +251 if present
  let number = cleaned;
  if (number.startsWith('+251')) {
    number = number.substring(3);
  }
  
  // Format as +251 XX XXX XXXX
  if (number.length === 10) {
    return `+251 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`;
  }
  
  return phone;
};

export const getPhoneProvider = (phone) => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  let number = cleaned;
  
  if (number.startsWith('+251')) {
    number = number.substring(3);
  }
  
  const prefix = number.substring(0, 2);
  
  if (prefix === '09') return 'Ethio Telecom';
  if (prefix === '07') return 'Safaricom Ethiopia';
  return 'Unknown';
};