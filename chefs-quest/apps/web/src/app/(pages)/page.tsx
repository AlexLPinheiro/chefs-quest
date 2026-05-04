import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <div className="w-full h-full p-5 flex justify-center">

      <Link href={"/home"}>
        <Button className="hover: cursor-pointer">redirecionar para a outra tela</Button>
      </Link>
      
    </div>

  )
}