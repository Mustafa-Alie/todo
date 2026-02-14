import type { ZodObject } from "zod";

export async function handleSubmitForm(
  formData: Record<string, unknown>,
  setInvalid: React.Dispatch<React.SetStateAction<boolean>>,
  onLogin: () => void,
  schema: ZodObject,
  endpoint: "signup" | "login",
) {
  // Validate with Zod
  const zodValid = schema.safeParse(formData);

  if (!zodValid.success) {
    setInvalid(true);
    return;
  }

  setInvalid(false);

  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      },
    );

    if (!res.ok) {
      const reply = await res.json();
      console.error(reply);
      setInvalid(true);
      return;
    }

    onLogin();
  } catch (err) {
    console.error(err);
  }
}

export function handleGoogle() {
  try {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google/start`;
  } catch (err) {
    console.error(err);
  }
}
