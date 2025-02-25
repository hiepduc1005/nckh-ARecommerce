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
    const {loading,setLoading} = useLoading();

    useEffect(() => {
        const fetchAuthUser = async () => {
            try {
                
                setLoading(true); 
                const token = localStorage.getItem("token");
                
                if (!token) {
                    setIsAuthenticated(false);
                    const timeout = setTimeout(() => setLoading(false), 300); 

                    return () => clearTimeout(timeout);
                }
    
               
                const userAuth = await getAuthUser(token);
                if(userAuth){
                    setUser(userAuth);
                    setIsAuthenticated(true);
                }else{
                    setIsAuthenticated(false)
                    setUser(null)
                }
                    
            } catch (error) {
                console.error(error)
            }finally{
                const timeout = setTimeout(() => setLoading(false), 300); 
                return () => clearTimeout(timeout);
            }
            
           
          
        };

        fetchAuthUser();
    }, [setLoading]);

    useEffect(() => {
        console.log("Loading state changed: ", loading);
    }, [loading]);

    const login = async (email , password) => {
        try {
            setLoading(true);
            const data = await loginUser(email,password);
            localStorage.setItem("token" , data.token);
            setIsAuthenticated(true);
            
            
            toast.success('Đăng nhập thành công!');
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
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
        setLoading(true);
        const res = await registerUser(email,firstname,lastname,password);

        if(!res.success){
            console.log(res)
            toast.error(res.error || "Đăng ký thất bại!");
            setLoading(false);
            return;
        }

        toast.success(res.data)
        navigate("/login");
        
        setLoading(false);
    
    } 

    return (
        <AuthContext.Provider value={{user,isAuthenticated,login,logout,register}}>
            {children}
        </AuthContext.Provider>
    )
}