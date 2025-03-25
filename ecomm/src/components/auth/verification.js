import { useEffect } from "react";

export default function CheckVerify({ setAuthorize, setVerification ,setStatus}) {
    useEffect(() => {
        const checkVerify = async () => {
            try {
                const response = await fetch("http://localhost:5000/verify", {
                    method: "GET",
                    credentials: "include",
                });

                

                if (response.status === 200) {
                    setAuthorize(true);
                    setVerification(true);


                    function getCookie(name) {
                        const cookies = document.cookie.split('; ');
                        for (let cookie of cookies) {
                            const [key, value] = cookie.split('=');
                            if (key === name) {
                                console.log('i found value');
                                console.log(value);
                                return decodeURIComponent(value);
                            }
                        }
                        return null;
                    }
                    setStatus(getCookie('status'));
                    console.log('status is here' );



                }
                console.log(response);
            } catch (error) {
                console.error("Verification failed:", error);
                setVerification(false);
            }
        };

        checkVerify();
    }, []);

    // ✅ Correctly returning JSX
}
