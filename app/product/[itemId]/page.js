'user client'
import React from 'react'


function Product({params}) {

  return (
    <div>Hello, {params.itemId}</div>
  )
}

export default Product
