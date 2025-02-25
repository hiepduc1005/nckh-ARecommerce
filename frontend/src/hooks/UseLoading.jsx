import { useContext, useEffect } from "react"
import { LoadingContext } from "../contexts/LoadingProvider"
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import nprogress from "nprogress";
const  useLoading = () => {
    const {loading} = useContext(LoadingContext);

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
