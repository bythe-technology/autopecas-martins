/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
export function ProductImage({src,alt,priority=false}:{src:string;alt:string;priority?:boolean}){if(/^https?:\/\//i.test(src)){return <img src={src} alt={alt} loading={priority?"eager":"lazy"}/>;}return <Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 850px) 100vw, 50vw"/>}
