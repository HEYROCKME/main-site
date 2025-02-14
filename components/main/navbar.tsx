import Image from "next/image";
import React, { useState } from "react";
import styles from "../../styles/Navbar.module.css"
import logo from "../../public/logo-cropped.svg"
import Link from "next/link";
import { Menu, X } from "react-feather";

export const Navbar: React.FC = () => {
  const [expandMenu, setExpandMenu] = useState<boolean>(false);
  return (
    <nav className={(expandMenu ? styles.navbar +" "+ styles.navbarExpanded: styles.navbar)}>
       <div className={styles.logoWrapper}>
      <Image src={logo} 
        className={styles.logo} 
        layout="intrinsic" 
        width={140} 
        height={80}
        alt="Konduit. logo" 
        priority/>
        <div className={styles.expandBtn} onClick={() => setExpandMenu(!expandMenu)}>
          {expandMenu ?
            <X size={32} color={"white"} /> :
            <Menu size={32} color={"white"} />
          }
          </div>   
        </div>   
      <ul>
        <li onClick={() => setExpandMenu(false)}><Link href="/organizations" passHref>Anbefalte organisasjoner</Link></li>
        <li onClick={() => setExpandMenu(false)}><Link href="/method" passHref>Metode</Link></li>
        <li onClick={() => setExpandMenu(false)}><Link href="/about" passHref>Om oss</Link></li>
        <li onClick={() => setExpandMenu(false)}><Link href="/FAQ" passHref>FAQ</Link></li>
        <li onClick={() => setExpandMenu(false)}><Link href="/profile" passHref>Min side</Link></li>
      </ul>
    </nav>
  )
}