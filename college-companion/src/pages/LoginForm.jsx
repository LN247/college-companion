import FormComponent from "../components/Form";

function LoginForm() {
  return (
    <FormComponent
      type="login"
      login_message="Welcome"
      form_title="Login"
      alternative_method="Signup"
      path="/signup"
    />
  );
}

export default LoginForm;
