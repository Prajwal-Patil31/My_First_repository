import { Fragment, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Begin from "./Begin";
import Navbar from './Pages/Navbar';
import { createBrowserRouter,RouterProvider,Router,Link } from 'react-router-dom';
import First from './Pages/First';
import Second from './Pages/Second';
const router=createBrowserRouter([
  {
    path:"/",
    element:<First/>,
  },
  {
  path:"/second",
  element:<Second/>
  }
])
function App() {
return (
 <div>
<RouterProvider router={router}/>
</div>
  );
}

export default App;
