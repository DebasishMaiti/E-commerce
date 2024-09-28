import { useState, useEffect } from "react";
import { useAuth } from '../../Context/Context';
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";


const AdminRoute = () => {
    const [auth] = useAuth();
    const [ok, setOk] = useState(false);
    useEffect(() => {
        const Check = async () => {
            const response = await axios.get('http://localhost:8000/api/auth/admin-auth', {
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
export default AdminRoute