import { createContext, useEffect, useState } from "react";
import { getAuthUser, loginUser, registerUser } from "../api/userApi";
import {toast, ToastContainer} from "react-toastify"
import { useNavigate } from "react-router-dom";
import useLoading from "../hooks/UseLoading";
export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navigate = useNavigate();
    const {setLoading} = useLoading();

    useEffect(() => {
        const fetchAuthUser = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            
            if (!token) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                const userAuth = await getAuthUser(token);
                if(userAuth){
                    setUser(userAuth);
                    setIsAuthenticated(true);
                }
                
            } catch (error) {
                setIsAuthenticated(false);
                localStorage.removeItem("token");
                setUser(null);
                toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
                
            }
          
            setLoading(false);
        };

        fetchAuthUser();
    }, [setLoading]);

    const login = async (email , password) => {
        try {
            setLoading(true);
            const data = await loginUser(email,password);
            localStorage.setItem("token" , data.token);
            setIsAuthenticated(true);
            
            
            toast.success('Đăng nhập thành công!');
            navigate("/");
        } catch (error) {
            toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại!');
        }finally{
            setLoading(false)
        }
    }

    const logout = () => {
        setLoading(true);

        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);

        navigate("/");
        setLoading(false);
    }

    const register = async (email, firstname, lastname, password) => {
        try {
            setLoading(true);
            const data = await registerUser(email,firstname,lastname,password);

            toast.success(data)
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data || "Đăng ký thất bại!");
        }finally{
            setLoading(false)
        }
    } 

    return (
        <AuthContext.Provider value={{user,isAuthenticated,login,logout,register}}>
            {children}
        </AuthContext.Provider>
    )
}