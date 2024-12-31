import { Button } from 'flowbite-react'
import React from 'react'

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
      <div className='flex-1 justify-center flex flex-col'>
        <h2 className='text-2xl mb-2'>Want to learn more about JavaScript</h2>
        <p className='text-gray-500 mb-2'>Checkout these resources for better learning</p>
        <Button gradientDuoTone='purpleToPink'>
            <a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript' target='_blank' rel='noopener noreferrer'>Learn More</a>
        </Button>
      </div>
      <div className='p-7 flex-1'>
        <img src='https://i0.wp.com/blog.apitier.com/wp-content/uploads/2023/02/MERN_Stack.jpg?fit=560%2C315&ssl=1'></img>
      </div>
    </div>
  )
}
