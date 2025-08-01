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
  mobile: string;
  password: string;
  ccode: string;
}

const LoginForm = () => {
  const router = useRouter();
  const { login } = useAuth();
  const schema = yup
    .object({
      mobile: yup.string().required().label("Mobile Number"),
      password: yup.string().required().label("Password"),
      ccode: yup.string().required().label("Country Code"),
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
        "https://cpanel.roomfinder237.com/user_api/u_login_user.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await res.json();
      if (result.Result === "true") {
        // Save user data to auth context
        const userData = {
          id: result.UserLogin?.id || result.UserId || result.user_id || "1",
          name:
            result.UserLogin?.name || result.UserName || result.name || "User",
          email:
            result.UserLogin?.email || result.UserEmail || result.email || "",
          mobile: result.UserLogin?.mobile || data.mobile,
          ccode: result.UserLogin?.ccode || data.ccode,
          wallet: result.UserLogin?.wallet || 0,
        };
        login(userData);
        toast("Login successful!", { position: "top-center" });
        reset();
        setTimeout(() => router.push("/dashboard/home"), 1200);
      } else {
        setError(
          result.ResponseMsg || "Login failed. Please check your credentials."
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
              <input type="checkbox" id="remember" disabled={loading} />
              <label htmlFor="remember">Keep me logged in</label>
            </div>
            <Link href="#" className={styles.forgotLink}>
              Forgot password?
            </Link>
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
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
