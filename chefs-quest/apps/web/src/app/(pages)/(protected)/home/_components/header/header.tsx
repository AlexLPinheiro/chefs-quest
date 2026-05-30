"use client";

import Avatar from '@/app/assets/image/avatar.png';
import Logo from '@/app/assets/image/logo.png';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import styles from './header.module.css';

type HeaderProps = {
    level:number;
    progress:number;
}


export default function Header({ level, progress }: HeaderProps){
    return(
        <nav className={styles.nav} aria-label="Status do jogador">
            <ul className={styles.list}>
                <li className={styles.avatarItem}>
                    <Image 
                        src={Avatar}
                        alt={"Ícone do usuário"}
                    />
                </li>

                <li className={styles.statusItem}>
                    <p className={styles.level}>nivel {level}</p>
                    <Progress className={styles.progress} value={progress} aria-label={`Progresso do nível: ${progress}%`}></Progress>

                </li>

                <li className={styles.logoItem}>
                    <Image
                        src={Logo}
                        alt="Logo Chef's Quest"
                    />
                </li>
            </ul>
        </nav>
    )
}
