import React, { useState } from 'react'
import Image from 'next/image'

export default function Navbar() {
  return (
    <section className="relative w-full text-gray-700  body-font rounded-3xl">
      <div className="container flex items-center justify-center py-5 mx-auto md:flex-row max-w-7xl space-x-4">
        <Image
          src="/LogoFlat.png"
          alt="Logo"
          width={50}
          height={50}
          /* Force white  */
          className="hover:animate-spin rounded-xl webkit-filter hue-rotate-15 "
        />

        <a href="#" className=" text-4xl font-extrabold leading-none   text-black select-none">
          NotBlox
          <span className=" font-thin italic">.online</span>
        </a>
      </div>
    </section>
  )
}
