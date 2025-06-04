import FormComponent from "../components/Form";

function SignupForm() {
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
