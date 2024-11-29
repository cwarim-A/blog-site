"use client";

import Link from "next/link";
import styles from "./authlinks.module.css";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const AuthLinks = () => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { status } = useSession();

  const loginStatus = status;

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  return (
    <>
      {loginStatus === "unauthenticated" ? (
        <Link href="/login" className={styles.link}>
          Login
        </Link>
      ) : (
        <>
          <Link
            href="/write"
            onClick={(e) => {
              e.preventDefault(); 
              router.push("/write"); 
            }}
            className={styles.link}
          >
            Write
          </Link>
          <span className={styles.link} onClick={handleSignOut}>
            Logout
          </span>
        </>
      )}
      <div className={styles.burger} onClick={() => setOpen(!open)}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>
      {open && (
        <div className={styles.responsiveMenu}>
          <Link href="">Homepage</Link>
          <Link href="">About</Link>
          <Link href="">Contact</Link>
          {status === "unauthenticated" ? (
            <Link href="/login">Login</Link>
          ) : (
            <>
              <Link href="/write">Write</Link>
              <span className={styles.link} onClick={signOut}>
                Logout
              </span>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AuthLinks;
