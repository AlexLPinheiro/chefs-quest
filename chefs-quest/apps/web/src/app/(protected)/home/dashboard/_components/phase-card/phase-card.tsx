"use client";


type PhaseCardProps = {
    duration : number;
    image: React.ReactElement;
    name: string;

}


export default function PhaseCard({duration, image, name}: PhaseCardProps){
    return(
        <div className="bg-white w-90 h-60 rounded-2xl shadow-md p-4 text-black">
            <p>{duration}</p>
            <div>
                {image}
            </div>
            <h2>{name}</h2>
            <button ></button>
        </div>
    )
}
