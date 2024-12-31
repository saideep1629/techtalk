import React from 'react'
import { useSelector } from 'react-redux';
import { Outlet, Navigate} from 'react-router-dom';


export default function OnlyAdminPrivateRoute() {
    const { currentUser } = useSelector((state) => state.user)
    // console.log("currentUser", currentUser) 
  return currentUser && currentUser.data.user.isAdmin ? <Outlet /> : <Navigate to= '/sign-in' />
}
