import Image from 'next/image'

export default function Navbat() {
  return (
    <div className="min-w-max flex justify-center">
      <Image
        src="/logo-jm-environnement.webp"
        loading="eager"
        alt="Logo entreprise"
        width={150}
        height={150}
      />
    </div>
  )
}
