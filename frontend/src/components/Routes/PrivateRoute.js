import { useState, useEffect } from "react";
import { useAuth } from '../../Context/Context';
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";


const PrivateRoute = () => {
    const [auth] = useAuth();
    const [ok, setOk] = useState(false);

    useEffect(() => {
        const Check = async () => {
            const response = await axios.get('https://e-commerce-9m1c.vercel.app/api/auth/user-auth', {
                headers: {
                    'Authorization': auth.token
                }
            })
            if (response.data.ok) {
                setOk(true)
            } else {
                setOk(false)
            }
        }
        if (auth?.token) Check()
    }, [auth?.token])

    return ok ? <Outlet /> : <Spinner path="" />
}
export default PrivateRoute