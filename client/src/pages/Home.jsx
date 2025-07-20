import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import BlogList from '../components/BlogList'
import Newsletter from '../components/Newsletter'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <Header/>
      <BlogList/>
      <Newsletter/>
    </div>
  )
}

export default Home