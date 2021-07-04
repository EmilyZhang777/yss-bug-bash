import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';

// Locale Phone Number will return the phone number based on the
// locale and format provided.
export function localePhoneNumber(countryCode, phoneNumber, format) {
  let instance = PhoneNumberUtil.getInstance();
  switch (format) {
    case 'E164': {
      format = PhoneNumberFormat.E164;
      break;
    }
    case 'INTERNATIONAL': {
      format = PhoneNumberFormat.INTERNATIONAL;
      break;
    }
    case 'NATIONAL': {
      format = PhoneNumberFormat.NATIONAL;
      break;
    }
    case 'RFC3966': {
      format = PhoneNumberFormat.RFC3966;
      break;
    }
    default: {
      format = PhoneNumberFormat.NATIONAL;
    }
  }
  try {
    return instance.format(
      instance.parseAndKeepRawInput(phoneNumber, countryCode),
      format
    );
  } catch (e) {
    return phoneNumber;
  }
}
