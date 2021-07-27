import { AbstractControl } from '@angular/forms';

export class CustomValidator {
  /**
   * Validates GSTIN
   * @param gstin : Abstract Control
   */

  static GSTINValidators(
    gstin: AbstractControl
  ): { [key: string]: boolean }[] | null {
    if (gstin.pristine) {
      return null;
    }
    var errorDict: { [key: string]: boolean }[] = [];
    const NUMBER_REGEXP = new RegExp('^[0-9]+$');
    const ALPHABET_REGEXP = new RegExp('^[A-Za-z]+$');
    gstin.markAsTouched();

    if (gstin.value.length == 15) {
      const stateCode = gstin.value.slice(0, 2);
      NUMBER_REGEXP.test(stateCode)
        ? null
        : errorDict.push({ invalidStateCode: true });

      const PAN: string = gstin.value.slice(2, 12);
      // First 5 - Alphabets - invalid pan
      const first5 = PAN.slice(0, 5);
      ALPHABET_REGEXP.test(first5)
        ? null
        : errorDict.push({ invalidFirst5PAN: true });
      // Middle 4 - Numeric - invalid pan
      const middle4 = PAN.slice(5, 9);
      NUMBER_REGEXP.test(middle4)
        ? null
        : errorDict.push({ invalidMiddle4PAN: true });
      // Last 1 - Alphabet - invalid pan
      const last1 = PAN.slice(-1);
      ALPHABET_REGEXP.test(last1)
        ? null
        : errorDict.push({ invalidLast1PAN: true });

      const entityNumber = gstin.value.slice(12, 13);
      NUMBER_REGEXP.test(entityNumber)
        ? null
        : errorDict.push({ invalidEntityNumber: true });

      const zAlphabet = gstin.value.slice(13, 14);
      zAlphabet == 'z' || zAlphabet == 'Z'
        ? null
        : errorDict.push({ invalidZAlphabet: true });

      // Checksum GSTIN
      const lastDigit = gstin.value.slice(-1);

      var GSTN_CODEPOINT_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var factor = 2;
      var sum = 0;
      var checkCodePoint = 0;
      var mod = GSTN_CODEPOINT_CHARS.length;
      var i;

      for (i = gstin.value.length - 2; i >= 0; i--) {
        var codePoint = -1;
        for (var j = 0; j < GSTN_CODEPOINT_CHARS.length; j++) {
          if (GSTN_CODEPOINT_CHARS[j] === gstin.value[i]) {
            codePoint = j;
          }
        }
        var digit = factor * codePoint;
        factor = factor === 2 ? 1 : 2;
        digit = Math.floor(digit / mod) + (digit % mod);
        sum += digit;
      }
      checkCodePoint = (mod - (sum % mod)) % mod;

      GSTN_CODEPOINT_CHARS[checkCodePoint] == lastDigit
        ? null
        : errorDict.push({ invalidLastDigit: true });
    } else {
      errorDict.push({ invalidGSTIN: true });
    }
    return errorDict.length > 0 ? errorDict : null;
  }

  customGSTValidation(gstin: string): { [key: string]: boolean }[] {
    const NUMBER_REGEXP = new RegExp('^[0-9]+$');
    const ALPHABET_REGEXP = new RegExp('^[A-Za-z]+$');

    // GSTIN Length
    if (gstin.length == 15) {
      // PAN Check
      const GSTINErrorDict: {
        [key: string]: boolean;
      }[] = this.customPANValidation(gstin.slice(2, 12));

      // State Code Check
      const stateCode = gstin.slice(0, 2);
      NUMBER_REGEXP.test(stateCode)
        ? null
        : GSTINErrorDict.push({ invalidStateCode: true });
      // Entity Check
      const entityNumber = gstin.slice(12, 13);
      NUMBER_REGEXP.test(entityNumber)
        ? null
        : GSTINErrorDict.push({ invalidEntityNumber: true });
      // Check Alphabet
      const zAlphabet = gstin.slice(13, 14);
      zAlphabet == 'z' || zAlphabet == 'Z'
        ? null
        : GSTINErrorDict.push({ invalidZAlphabet: true });
      return GSTINErrorDict;
    } else {
      return [{ invalidGSTIN: true }];
    }
  }

  customPANValidation(pan: string): { [key: string]: boolean }[] {
    const NUMBER_REGEXP = new RegExp('^[0-9]+$');
    const ALPHABET_REGEXP = new RegExp('^[A-Za-z]+$');
    if (pan.length == 10) {
      const PANErrorDict: { [key: string]: boolean }[] = [];

      // First 5 - Alphabets - invalid pan
      const first5 = pan.slice(0, 5);
      ALPHABET_REGEXP.test(first5)
        ? null
        : PANErrorDict.push({ invalidFirst5PAN: true });
      // Middle 4 - Numeric - invalid pan
      const middle4 = pan.slice(5, 9);
      NUMBER_REGEXP.test(middle4)
        ? null
        : PANErrorDict.push({ invalidMiddle4PAN: true });
      // Last 1 - Alphabet - invalid pan
      const last1 = pan.slice(-1);
      ALPHABET_REGEXP.test(last1)
        ? null
        : PANErrorDict.push({ invalidLast1PAN: true });

      return PANErrorDict;
    } else {
      return [{ invalidPAN: true }];
    }
  }
}
