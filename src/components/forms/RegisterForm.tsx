"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import OpenEye from "@/assets/images/icon/icon_68.svg";
import EyeSlash from "@/assets/images/icon/icon_69.svg";
import styles from "@/app/login/AuthCard.module.scss";

interface FormData {
  name: string;
  email: string;
  password: string;
  mobile: string;
  ccode: string;
  refercode?: string;
}

const RegisterForm = () => {
  const router = useRouter();
  const { login } = useAuth();
  const schema = yup
    .object({
      name: yup.string().required().label("Name"),
      email: yup.string().required().email().label("Email"),
      password: yup.string().required().label("Password"),
      mobile: yup.string().required().label("Mobile Number"),
      ccode: yup.string().required().label("Country Code"),
      refercode: yup.string().optional().label("Refer Code"),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        "https://cpanel.roomfinder237.com/user_api/u_reg_user.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await res.json();
      if (result.Result === "true") {
        // Auto-login after successful registration
        const userData = {
          id: result.UserLogin?.id || result.user_id || "1",
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          ccode: data.ccode,
        };
        login(userData);
        toast("Registration successful!", { position: "top-center" });
        reset();
        setTimeout(() => router.push("/dashboard/home"), 1200);
      } else {
        setError(
          result.ResponseMsg ||
            "Registration failed. Please check your details."
        );
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <div className="col-12">
          <p
            className="form_error"
            style={{
              color: "red",
              textAlign: "center",
              fontWeight: 600,
              fontSize: 18,
              marginBottom: 16,
            }}
          >
            {error}
          </p>
        </div>
      )}
      <div className="row">
        <div className="col-12">
          <div className={styles.authLabel}>Name</div>
          <input
            type="text"
            {...register("name")}
            placeholder="Your Name"
            className={styles.authInput}
            disabled={loading}
          />
          <p className="form_error">{errors.name?.message}</p>
        </div>
        <div className="col-12">
          <div className={styles.authLabel}>Email</div>
          <input
            type="email"
            {...register("email")}
            placeholder="Youremail@gmail.com"
            className={styles.authInput}
            disabled={loading}
          />
          <p className="form_error">{errors.email?.message}</p>
        </div>
        <div className="col-12">
          <div className={styles.authLabel}>Mobile Number</div>
          <input
            type="text"
            {...register("mobile")}
            placeholder="e.g. 237690123456"
            className={styles.authInput}
            disabled={loading}
          />
          <p className="form_error">{errors.mobile?.message}</p>
        </div>
        <div className="col-12">
          <div className={styles.authLabel}>Country Code</div>
          <input
            type="text"
            {...register("ccode")}
            placeholder="e.g. +237"
            className={styles.authInput}
            disabled={loading}
          />
          <p className="form_error">{errors.ccode?.message}</p>
        </div>
        <div className="col-12">
          <div className={styles.authLabel}>Refer Code (optional)</div>
          <input
            type="text"
            {...register("refercode")}
            placeholder="Refer Code (if any)"
            className={styles.authInput}
            disabled={loading}
          />
          <p className="form_error">{errors.refercode?.message}</p>
        </div>
        <div className="col-12" style={{ position: "relative" }}>
          <div className={styles.authLabel}>Password</div>
          <input
            type={isPasswordVisible ? "text" : "password"}
            {...register("password")}
            placeholder="Enter Password"
            className={styles.authInput + " pass_log_id"}
            style={{ paddingRight: 44 }}
            disabled={loading}
          />
          <span
            style={{
              position: "absolute",
              right: 18,
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              zIndex: 2,
            }}
            onClick={togglePasswordVisibility}
          >
            <Image
              src={isPasswordVisible ? EyeSlash : OpenEye}
              alt="Toggle password visibility"
              width={24}
              height={24}
            />
          </span>
          <p className="form_error">{errors.password?.message}</p>
        </div>
        <div className="col-12">
          <div className="agreement-checkbox d-flex justify-content-between align-items-center">
            <div>
              <input type="checkbox" id="remember2" disabled={loading} />
              <label htmlFor="remember2">
                By hitting the &quot;Register&quot; button, you agree to the{" "}
                <Link href="/terms">Terms conditions</Link> &{" "}
                <Link href="/privacy">Privacy Policy</Link>
              </label>
            </div>
          </div>
        </div>
        <div className="col-12">
          <button
            type="submit"
            className={
              styles.authButton + " w-100 text-uppercase d-block mt-20"
            }
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
