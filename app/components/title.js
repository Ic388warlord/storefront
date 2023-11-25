import React from 'react'
import { Lato } from 'next/font/google'
const lato = Lato({ subsets: ['latin'], weight: ['700','900'] });



function Title() {
  return (

    <div className={`flex flex-col items-center justify-center ${lato.className}`}>
        <h1 className={` text-4xl`}>
        StoreFront
        </h1>
        <h1 className={`${lato.weight} text-md`}>
            Testinf One Size For All Size ||  #OneSizeFitsAllZZZZZMAN
        </h1>

        </div>
  )
}

export default Title