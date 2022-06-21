import { MutationResetPasswordArgs, useResetPasswordMutation } from "../generated/graphql";
import Form, { FormSubmitFunction } from "./Form";
import validators from "../utils/validators";

const inputs = {
    email: {
        type: "email",
        name: "email",
        placeholder: "Email",
        validators: validators["email"]
    },
    password: {
        type: "password",
        name: "password",
        placeholder: "New Password",
        validators: validators["password"]
    }
};

const ResetPasswordForm: React.FC = () => {
    const [,resetPassword] = useResetPasswordMutation();

    const handleSubmit: FormSubmitFunction = async (values) => {
        const response = await resetPassword({ ...(values as MutationResetPasswordArgs) })
        if (response.data?.resetPassword.__typename === "FormErrors")
            return response.data.resetPassword.errors;

        if (response.data?.resetPassword.response)
            return "An email has been sent to you for confirmation";

        return null;
    }

    return (
        <Form
            title="Reset Password"
            name="Reset Password"
            inputs={inputs}
            onSubmit={handleSubmit}
            link={{ href: "/login", text: "Sign in" }}
        />
    );
}

export default ResetPasswordForm;
