import Avatar from '@/app/assets/image/avatar.png';
import Logo from '@/app/assets/image/logo.png';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';

type HeaderProps = {
    level:number;
    progress:number;
}


export default function Header({level, progress}:HeaderProps){
    return(
        <nav className='w-full h-30 flex bg-white rounded-b-4xl shadow-lg'>
            <ul className='w-full flex items-center justify-around'>
                <li className='bg-gray-20 rounded-full'>
                    <Image 
                        src={Avatar}
                        alt={"icone do usuario"}
                    />
                </li>

                <li className='flex flex-col gap-1.5 items-center'>
                    <p>nivel {level}</p>
                    <Progress className='w-30'></Progress>

                </li>

                <li>
                    <Image
                        src={Logo}
                        alt='logo'
                    />
                </li>
            </ul>
        </nav>
    )
}