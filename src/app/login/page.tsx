import LoginForm from "@/components/forms/LoginForm";
import Link from "next/link";
import Image from "next/image";
import styles from "./AuthCard.module.scss";

export const metadata = {
  title: "Login - Roomfinder",
};

export default function LoginPage() {
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
        <div className={styles.authTitle}>Sign In</div>
        <div className={styles.authSubtitle}>
          Welcome back to your dashboard
        </div>
        <LoginForm />
        <hr className={styles.authDivider} />
        <div className={styles.authBottomText}>
          New to Roomfinder?
          <Link href="/register" className={styles.authBottomLink}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
