import { fail, redirect } from "@sveltejs/kit";

interface ReturnObject {
  success: boolean;
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  errors: string[];
}

export const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordConfirmation = formData.get("passwordConfirmation") as string;

    const returnObject: ReturnObject = {
      success: true,
      name,
      email,
      password,
      passwordConfirmation,
      errors: [],
    };

    if (name.length < 3) {
      returnObject.errors.push("Name must be at least 3 characters");
    }

    if (!email.length) {
      returnObject.errors.push("Email is required");
    }

    if (!password.length) {
      returnObject.errors.push("Password is required");
    }

    if (password !== passwordConfirmation) {
      returnObject.errors.push("Password confirmation failed");
    }

    if (returnObject.errors.length) {
      returnObject.success = false;
      return returnObject;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      console.log("The has been an error:", error);
      return fail(400, returnObject as any);
    }

    await supabase.from("user_names").insert([
      {
        user_id: data.user.id,
        name,
      },
    ]);

    redirect(303, "/private/dashboard");
  },
};
