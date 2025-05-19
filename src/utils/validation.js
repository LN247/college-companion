
/**
 * function to validate if  the email mathch the correct format
 * The function returns true if the email is valid and false otherwise
 * @param {string} email 
 * @returns {boolean} 
 */
function validateEmail(email) {
  const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase())
  ?{success:true}
  :{success:false, message:'Invalid email ' }
  ;
}

/**
 * function to validate if the password match the correct format
 * The function returns true if the password is valid and false otherwise
 * @param {string} password
 * @returns {boolean} 
 */
function validatePassword(password) {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$~#!%*?&])[A-Za-z\d@$~#!%*?&]{8,}$/;
  return re.test(password)
  ?{success:true}
  :{success:false, message:'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.'}
  ;
}


/**
 * function to validate if the full nmae to be atleast two words
 * The function returns true if the full name is valid and false otherwise
 * @param {string} fullname 
 * @returns {boolean}
 */
function validateFullname(fullname) {
  const re = /^[A-Za-z\s]{2,}$/;
  return re.test(fullname)
  ?{success:true}
  :{success:false, message:'Full name must contain at least two words and only letters.'}
  ;


}



export default {validateEmail, validatePassword, validateFullname}
