import React, { useEffect, useState } from "react";
import { useAuthFile } from "./components/hooks/useAuthFile";
import AuthPage from "./components/auth/auth";
import CheckVerify from "./components/auth/verification";
import { EntryDisplay } from "./components/entrydiplay/entrypoint";
import AdminProductForm from "./components/adminpage";
import { useServiceFile } from "./components/hooks/useServiceFile";
import BuyProduct from "./components/product/buyproduct";
import Navbar from "./components/entrydiplay/navbar";
import AddtoCart from "./components/product/addtocart";
import UserProducts from "./components/product/userProductdisplay";
import UserDashboard from "./components/dashboard";
export default function App() {
    const { authorize, setAuthorize, verification, setVerification } = useAuthFile();
    const { Service } = useServiceFile();  // Fixed typo: setServjce -> setService
    const [status, setStatus] = useState("customer");
    const [Comp, setComponent] = useState(() => EntryDisplay); // Initialize correctly

    useEffect(() => {
        setComponent(() => EntryDisplay);
    }, []);

    useEffect(() => {
        if (Service === "purchase") {
            setComponent(() => BuyProduct);
        }
        else if(Service==='cart'){
            setComponent(()=>AddtoCart);
        }
        else if(Service==='AllProducts'){
            
            setComponent(()=>UserProducts)
        }
        else if(Service==='dashboard'){
            setComponent(()=>UserDashboard)
        }
        
    }, [Service]); // Only update when `Service` changes

    CheckVerify({ setAuthorize, setVerification ,setStatus});

    if (!authorize && !verification) {
        return <AuthPage setStatus={setStatus} />;
    }

    if (status === "admin") {
        console.log("admin has logged in");
        return <AdminProductForm />;
    }

    if (status === "user") {
        
            return( 
            <>

            <Navbar></Navbar>
            <Comp />

            </>
        ); // Correct way to render the component
    }
}
