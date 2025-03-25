import React from "react";
import Navbar from "./navbar";
import HeroSection from "./herosection";
import ProductSection from "../product/productdisplay";

export function EntryDisplay(){
    return(
        <>
            
            <HeroSection></HeroSection>
            <ProductSection></ProductSection>
        </>
    )
}