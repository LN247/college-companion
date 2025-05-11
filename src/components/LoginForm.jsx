import React from 'react'
import './LoginForm.css'
import { Form, Link} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import GoogleIcon from '../assets/google-icon.svg'
function LoginForm() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [remember, setRemember] = useState(false);
const [error, setError] = useState('');
const navigate = useNavigate();


const login = useGoogleLogin({
  // handle google login here i.e call the api to create or to create the   authenticate the user
 //get the jwt and  jwt refresh token

  // handle the success of the google login
  // and then redirect to the next page
  onSuccess: (tokenResponse) => {
    console.log(tokenResponse);
    const token = jwtDecode(tokenResponse.credential);
    console.log(token);
     
  },


   onError: (error) => { 
    setError('Login Failed');
    console.log('Login Failed:', error);
  }
  
});


function handleSubmit(e) {
  e.preventDefault();
 // Basic validation
 if (!email || !password) {
  setError('Email and password are required.');
  return;
}

// Clear error if validation passes
setError('');
  console.log(Object.fromEntries(new FormData(e.target)));
  FormData('');

}

  return (
    <div className='container'>

      <div className='left-box'>

        
        <div className='message'> <h1>ENJOY COLLEGE LIFE</h1></div>
        
       
       
      </div>


      <div className='login-box'>

        <div className='welcome-box'>
          <h1>Welcome Back</h1>
        </div>
        <div className='form-box'>
         <form onSubmit={handleSubmit} >
          <div className='login-message'> <h2>Login</h2></div>


          {error && <label className='error-message'><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" style={{fill:' rgba(226, 22, 22, 1)',transform:'' ,msFilter:'',}}><path d="M9.172 16.242 12 13.414l2.828 2.828 1.414-1.414L13.414 12l2.828-2.828-1.414-1.414L12 10.586 9.172 7.758 7.758 9.172 10.586 12l-2.828 2.828z"></path><path d="M12 22c5.514 0 10-4.486 10-10S17.514 2 12 2 2 6.486 2 12s4.486 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8z"></path></svg>{error}</label>}
         
        <div className='input-box'>
        <label htmlFor='email' className='label'>Email</label>
         <input type='email' name='email' className='input' autoComplete='email' value={email} onChange={(e) => setEmail(e.target.value)} />
      
        
         </div>

         <div className='input-box'>
         <label htmlFor="password" className='label'>password</label>
         <input type='password' name='password' className='input' autoComplete='password' value={password} onChange={(e)=> setPassword(e.target.value)}/>
     
         </div>


        <div className='box'> 
          <div className='remember-me'>
          <input type='checkbox' name='remember' className='checkbox' checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <label htmlFor='remember'>Remember me</label>
          </div>
        <span><Link to='/reset password'>forgot password ?</Link> </span> 
        </div>



        <button type="submit">Login</button>
     
         
      
      
         </form>
       
         <div className='login-options'>
         <div className='line'></div>
         <p className='p'>or</p>
         <button className='signin-button' onClick={() =>navigate('/signup') }>Signup</button>

         <button className='google-button'  onClick={()=>login()}><img src={GoogleIcon} className='google-icon'/>continue with Google</button>
      
         
      
        </div>
          </div>

  
   </div>

</div>

  );
}

export default LoginForm