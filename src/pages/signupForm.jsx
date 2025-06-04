import FormComponent from "../components/Form";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const googleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        setError("");
        const result = await googleLogin(tokenResponse.credential);
        if (result.success) {
          // Store the token in localStorage
          localStorage.setItem('token', result.token);
          navigate('/dashboard');
        } else {
          setError(result.error || "Failed to sign up with Google. Please try again.");
        }
      } catch (error) {
        console.error("Google signup error:", error);
        setError("An unexpected error occurred during Google signup. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
      setError("Failed to initialize Google signup. Please try again.");
      setIsLoading(false);
    },
  });

  function validateForm() {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const fullnameValidation = validateFullname(fullname);

    if (!fullnameValidation.success) {
      setError(fullnameValidation.message);
      return false;
    }

    if (!emailValidation.success) {
      setError(emailValidation.message);
      return false;
    }
    if (!passwordValidation.success) {
      setError(passwordValidation.message);
      return false;
    }

    if (!agree) {
      setError("Please agree to the terms and policy");
      return false;
    }

    setError("");
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email.split('@')[0], // Generate username from email
          email,
          password,
          first_name: fullname.split(' ')[0],
          last_name: fullname.split(' ').slice(1).join(' '),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // After successful signup, log the user in
        const loginResult = await login(email, password);
        if (loginResult.success) {
          // Store the token in localStorage
          localStorage.setItem('token', loginResult.token);
          navigate('/dashboard');
        } else {
          setError("Signup successful but login failed. Please try logging in.");
          navigate('/login');
        }
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <FormComponent
      type="signup"
      login_message="Welcome"
      form_title="Sign up"
      alternative_method="Login"
      path="/login"
    />
  );
}

export default SignupForm;
