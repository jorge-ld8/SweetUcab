import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from '../components/crud.module.css';

const Footer: React.FC = () => {
  var classNames = require('classnames');
  return (
    <footer>
        <p>&copy; Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;