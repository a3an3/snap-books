import { fail, redirect } from "@sveltejs/kit";
import { PUBLIC_FRONTEND_URL } from "$env/static/public";

interface ReturnObject {
  success: boolean;
  name?: never;
  email: string;
  password: string;
  passwordConfirmation?: never;
  errors: string[];
}

export const actions = {
  signInWithPassword: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    console.log(formData);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const returnObject: ReturnObject = {
      success: true,
      email,
      password,
      errors: [],
    };

    console.log(password);

    if (!email.length) {
      returnObject.errors.push("Email is required");
    }

    if (!password.length) {
      returnObject.errors.push("Password is required");
    }

    if (returnObject.errors.length) {
      returnObject.success = false;
      return returnObject;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      console.log("The has been an error:", error);
      return fail(400, returnObject as any);
    }

    redirect(303, "/private/dashboard");
  },
  signInWithGoogle: async ({ locals: { supabase } }) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${PUBLIC_FRONTEND_URL}/auth/callback?}`,
      },
    });
    if (error) {
      return fail(400, {
        message: "Something went wrong with Google Login",
      });
    }
    throw redirect(303, data.url);
  },
};
