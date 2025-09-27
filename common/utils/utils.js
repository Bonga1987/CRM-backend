
const formatedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

const validateDamageReports = (damageReports) => {
  if (!Array.isArray(damageReports)) {
    return ({message: "Damage reports must be an array"});
  }

  damageReports.forEach((report, index) => {
    if (typeof report.damageTypeId !== "number" || report.damageTypeId <= 0) {
      return({message: `Invalid damageTypeId at index ${index}`});
    }
    if (typeof report.charge !== "number" || report.charge < 0) {
      return({message: `Invalid charge at index ${index}`});
    }
    if (report.note && typeof report.note !== "string") {
      return({message: `Invalid note at index ${index}`});
    }
  });

  return true;
}


export {formatedDate,validateDamageReports}