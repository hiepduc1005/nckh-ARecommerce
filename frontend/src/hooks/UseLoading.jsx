import { useContext, useEffect } from "react"
import { LoadingContext } from "../contexts/LoadingProvider"
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import nprogress from "nprogress";
import { useLocation } from "react-router-dom";
const  useLoading = () => {
    const {loading} = useContext(LoadingContext);

    const location = useLocation();

    useEffect(() => {
        nprogress.start();
        const timeout = setTimeout(() => nprogress.done(), 300);

        return () => clearTimeout(timeout);
    }, [location]);

    useEffect(() => {
        if(loading){
            nprogress.start();
        }else{
            nprogress.done();

        }

        console.log(loading)
    },[loading])
    
    return useContext(LoadingContext)
}

export default useLoading;
