import RegisterForm from "@/components/forms/RegisterForm";
import Link from "next/link";
import Image from "next/image";
import styles from "../login/AuthCard.module.scss";

export const metadata = {
  title: "Register - Roomfinder",
};

export default function RegisterPage() {
  return (
    <div className={styles.authCardWrapper}>
      <div className={styles.authCard}>
        <div className={styles.authLogo}>
          <Link href="/">
            <Image
              src="/assets/images/logo/logo.png"
              alt="Roomfinder Logo"
              width={100}
              height={100}
              priority
            />
          </Link>
        </div>
        <div className={styles.authTitle}>Sign Up</div>
        <div className={styles.authSubtitle}>
          Create your account to get started
        </div>
        <RegisterForm />
        <hr className={styles.authDivider} />
        <div className={styles.authBottomText}>
          Already have an account?
          <Link href="/login" className={styles.authBottomLink}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
