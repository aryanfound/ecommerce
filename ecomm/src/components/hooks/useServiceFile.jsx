import React, { useContext, createContext, useState } from "react";

const ServiceContext = createContext(); // ✅ Changed variable name to avoid conflict
export function ServiceProvider({ children }) {
    const [Service, setService] = useState("");
    const[ProductId,setProductId]=useState('');
    const [gender,setgender]=useState('any');
    const [company,setcompany]=useState('any');
    const [size,setsize]=useState(4);
    const [price,setprice]=useState(100000);
    const [trending,setTrending]=useState(false);
    return ( // ✅ Added return statement
        <ServiceContext.Provider value={{ Service, setService ,ProductId,setProductId,gender,setgender,company,setcompany,size,setsize,price,setprice,trending,
            setTrending
        }}>
            {children}
        </ServiceContext.Provider>
    );
}

export function useServiceFile() {
    return useContext(ServiceContext); // ✅ Used correct context name
}
