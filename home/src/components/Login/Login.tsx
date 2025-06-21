"use client";
import React, { useState } from "react";
import TextInput from "@/commonComponents/TextInput/TextInput";
import Image from "next/image";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { login } from "@/services/api-common";
import Styles from "./Login.module.css";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });
      dispatch(
        login(formData, (status) => {
          if (status) {
            console.log("Login successful");
            window.location.href = "/";
          } else {
            console.log("Login failed with status", status);
          }
        })
      );
    } catch (err: any) {
      if (err.name === "ValidationError") {
        const newErrors: any = {};
        err.inner.forEach((validationErr: Yup.ValidationError) => {
          if (validationErr.path)
            newErrors[validationErr.path] = validationErr.message;
        });
        setErrors(newErrors);
      } else {
        console.error("Validation or dispatch error:", err);
      }
    }
  };

  return (
    <form className={Styles.signin} onSubmit={handleSubmit}>
      <div className={Styles.login_card}>
        <div className={Styles.image_container}>
          <Image src="/fh-logo.svg" alt="logo" width={120} height={110} />
        </div>

        <TextInput
          name="email"
          placeholder="Enter Email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <TextInput
          name="password"
          placeholder="Enter Password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <button type="submit" className={Styles.submit_btn} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
