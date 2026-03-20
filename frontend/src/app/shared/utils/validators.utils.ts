import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    // Get current date at 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get the selected date and parse it correctly for comparison (midnight)
    // Most date inputs return YYYY-MM-DD which parses to midnight UTC or Locale
    const selectedDate = new Date(control.value + 'T00:00:00');

    // Return error ONLY if it's strictly BEFORE today
    return selectedDate.getTime() >= today.getTime() ? null : { pastDate: true };
  };
}

export function urlValidator(): ValidatorFn {
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return urlRegex.test(control.value) ? null : { invalidUrl: true };
  };
}
