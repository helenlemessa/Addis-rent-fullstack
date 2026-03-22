export const validateEthiopianPhone = (phone) => {
  // Remove all spaces, dashes, and special characters
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if it starts with +251 (international format)
  if (cleaned.startsWith('+251')) {
    cleaned = cleaned.substring(3);
  }
  // Check if it starts with 0 (local format)
  else if (!cleaned.startsWith('0')) {
    return { valid: false, message: 'Phone number must start with 0 or +251' };
  }
  
  // Should be exactly 10 digits after removing country code
  if (cleaned.length !== 10) {
    return { valid: false, message: 'Phone number must be 10 digits' };
  }
  
  // Check if it contains only digits
  if (!/^\d+$/.test(cleaned)) {
    return { valid: false, message: 'Phone number can only contain digits' };
  }
  
  // Check first two digits for valid providers
  const prefix = cleaned.substring(0, 2);
  
  // Ethio Telecom prefixes: 09
  if (prefix === '09') {
    return { valid: true, message: 'Valid Ethio Telecom number' };
  }
  // Safaricom Ethiopia prefixes: 07
  else if (prefix === '07') {
    return { valid: true, message: 'Valid Safaricom Ethiopia number' };
  }
  else {
    return { valid: false, message: 'Invalid Ethiopian phone number. Must start with 09 (Ethio Telecom) or 07 (Safaricom)' };
  }
};