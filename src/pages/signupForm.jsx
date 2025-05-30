import FormComponent from "../components/Form";

function SignupForm() {
  return (
    <FormComponent
      login_message="Welcome"
      form_title="Sign up"
      alternative_method="Login"
      path={"/"}
    />
  );
}

export default SignupForm;
