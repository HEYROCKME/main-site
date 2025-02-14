import Image from "next/image";
import React, { useState } from "react";
import styles from "../../styles/Navbar.module.css";
import logo from "../../public/logo-cropped.svg";
import Link from "next/link";
import { useAuth0 } from "@auth0/auth0-react";
import { Menu, X } from "react-feather";

export const Navbar: React.FC = () => {
  const { logout } = useAuth0();
  const [expandMenu, setExpandMenu] = useState<boolean>(false);

  return (
    <>
      <nav className={(expandMenu ? styles.navbar +" "+ styles.navbarExpanded: styles.navbar)} >
        <div className={styles.logoWrapper}>
          <Image
            src={logo}
            className={styles.logo}
            layout="intrinsic"
            width={140}
            height={80}
            alt="Konduit. logo"
            priority
          />
          <div className={styles.expandBtn} onClick={() => setExpandMenu(!expandMenu)}>
          {expandMenu ?
            <X size={32} color={"white"} /> :
            <Menu size={32} color={"white"} />
          }
          </div>
        </div>
        <ul>
          <li onClick={() => setExpandMenu(false)}>
            <Link href="/profile"  passHref>
              Donasjoner
            </Link>
          </li>
          <li onClick={() => setExpandMenu(false)}>
            <Link href="/profile/agreements" passHref>
              Avtaler
            </Link>
          </li>
          <li onClick={() => setExpandMenu(false)}>
            <Link href="/profile/details" passHref>
              Profil
            </Link>
          </li>
          <li onClick={() => setExpandMenu(false)}>
            <button className={styles.btnlogout} onClick={() => logout()}>
              Logg ut
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};
