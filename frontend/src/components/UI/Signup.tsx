import { ThemeContext } from "@/context/ThemeContext";
import { use } from "react";
import { useState } from "react";
import googleIcon from "@/assets/images/google.svg";
import googleWhite from "@/assets/images/google-white.svg";
import { signupSchema } from "@/validators/zod.schema";
import { handleSubmitForm, handleGoogle } from "@/services/authServices";

export default function Signup({
  onLogin,
  onSignIn,
}: {
  onLogin: () => void;
  onSignIn: () => void;
}) {
  const { theme } = use(ThemeContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [invalid, setInvalid] = useState(false);

  return (
    <section
      className={`relative mx-auto -mt-[40%] max-w-10/12 space-y-2 rounded-lg p-8 shadow-2xl md:-mt-[15%] md:max-w-8/12 lg:max-w-4/12 ${theme === "light" ? "bg-white text-gray-700 shadow-gray-300" : "bg-slate-800 text-gray-300"}`}
    >
      <h1 className="mb-4 text-center text-2xl font-semibold">
        Create an account
      </h1>

      <div
        className={`flex gap-3 px-4 *:flex *:grow *:cursor-pointer *:items-center *:justify-center *:rounded-lg *:border *:border-gray-300 *:py-2 ${theme === "light" ? "*:hover:border-gray-400 *:hover:bg-gray-50" : "*:hover:border-gray-200 *:hover:bg-gray-600"}`}
      >
        <button type="button" onClick={handleGoogle}>
          <img
            alt=""
            src={theme === "light" ? googleIcon : googleWhite}
            className="h-4 w-4"
          />
        </button>
      </div>

      <div className="flex items-center justify-center space-x-2">
        <span className="w-2/5 border-t border-gray-300"></span>
        <span className="py-3 text-xs text-gray-400 uppercase">Or</span>
        <span className="w-2/5 border-t border-gray-300"></span>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitForm(
            formData,
            setInvalid,
            onLogin,
            signupSchema,
            "signup",
          );
        }}
      >
        <div className="flex gap-4">
          <div>
            <label className="flex items-center justify-between">
              <span>First name</span>
              <span className="text-xs font-normal text-gray-500">
                optional
              </span>
            </label>
            <input
              type="text"
              maxLength={20}
              name="firstName"
              value={formData.firstName}
              onChange={(e) => {
                setFormData({ ...formData, firstName: e.target.value });
              }}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
              placeholder="Adam"
            />
          </div>

          <div>
            <label className="flex items-center justify-between">
              <span>Last name</span>
              <span className="text-xs font-normal text-gray-500">
                optional
              </span>
            </label>
            <input
              type="text"
              name="lastName"
              maxLength={20}
              value={formData.lastName}
              onChange={(e) => {
                setFormData({ ...formData, lastName: e.target.value });
              }}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
              placeholder="Smith"
            />
          </div>
        </div>
        <label className="text-sm font-medium">Email address</label>
        <input
          type="email"
          name="email"
          maxLength={30}
          minLength={5}
          placeholder="someone@something.com"
          value={formData.email}
          onChange={(e) => {
            setInvalid(false);
            setFormData({ ...formData, email: e.target.value });
          }}
          className={`mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none ${invalid ? "outline-2 outline-red-500" : "outline-0"}`}
        />

        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          name="password"
          maxLength={25}
          minLength={8}
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => {
            setInvalid(false);
            setFormData({ ...formData, password: e.target.value });
          }}
          className={`mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none ${invalid ? "outline-2 outline-red-500" : "outline-0"}`}
        />

        <button
          type="submit"
          className="my-2 w-full cursor-pointer rounded-md bg-gray-500 py-2 font-medium text-white transition hover:bg-gray-600"
        >
          Sign up
        </button>
      </form>

      <p className="pt-2 text-center text-sm text-gray-400">
        Already have an account?
        <a
          onClick={onSignIn}
          href=""
          className={`ps-2 font-semibold hover:underline ${theme === "light" ? "text-gray-600 hover:text-gray-900" : "text-gray-300 hover:text-gray-100"}`}
        >
          Sign in
        </a>
      </p>
    </section>
  );
}
