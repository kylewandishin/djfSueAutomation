// import { count } from "console";

export function formatPhoneNumber(phone: string): string {
  // Remove leading international prefixes (e.g., +, 00) and non-digit characters
  phone = phone.replace(/^\+|^00/, '');
  const digits = phone.replace(/\D/g, '');

  let countryCode: string | undefined;

  // Handle numbers starting with 0 (e.g., 0402567116)
  if (digits.length === 10 && digits.startsWith('0')) {
    countryCode = '0'; // Treat leading 0 as a country code
    phone = digits.slice(1); // Remove the leading 0 for formatting
  } else {
    phone = digits;
  }

  // Extract the country code if the number is longer than 10 digits
  if (phone.length > 10) {
    const numExtraDigits = phone.length - 10; // Extra digits indicate the length of the country code
    countryCode = phone.slice(0, numExtraDigits);
    const areaCode = phone.slice(numExtraDigits, numExtraDigits + 3);
    const firstPart = phone.slice(numExtraDigits + 3, numExtraDigits + 6);
    const secondPart = phone.slice(numExtraDigits + 6);
    return `+${countryCode} (${areaCode}) ${firstPart}-${secondPart}`;
  }

  // Handle standard 10-digit phone numbers
  if (phone.length === 10) {
    const areaCode = phone.slice(0, 3);
    const firstPart = phone.slice(3, 6);
    const secondPart = phone.slice(6);
    return countryCode === '0'
      ? `(0${areaCode}) ${firstPart}-${secondPart}`
      : `(${areaCode}) ${firstPart}-${secondPart}`;
  }

  throw new Error('The phone number must contain at least 10 digits.');
}
