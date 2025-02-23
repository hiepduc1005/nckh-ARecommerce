import { createContext, useState } from "react";
import { getAuthUser, loginUser } from "../api/userApi";
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

            const userAuth = await getAuthUser(token);
            if (userAuth) {
                setUser(userAuth);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
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

    const register = () 

    return (
        <AuthContext.Provider value={{user,isAuthenticated,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}