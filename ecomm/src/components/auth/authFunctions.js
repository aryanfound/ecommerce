


export async function SignIn({email,username,password,setAuthorize,setVerification,setStatus}) {

    console.log(email,username,password);

  try {
      const resp = await fetch('http://localhost:5000/auth/Signup', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({username:username,password:password,email:email}),
          credentials:"include"
      });
      console.log(resp);
      if (resp.status === 409) {
          alert("User already exists! Please try logging in.");
          return false;
      } else if (resp.ok) {
          alert("Signup successful! You can now log in.");
          if(email==='PBB@gmail.com'){
          setStatus('admin');
          }
          setAuthorize(true);

          return true;
      } else {
          alert("Error signing up. Please try again.");
          return false;
      }
  } catch (error) {
      console.error("Signup Error:", error);
      alert("Network error! Please check your connection.");
      return false;
  }
}

export async function Login({email,password,setAuthorize,setVerification,setStatus}) {

    console.log(email,password);
    
  try {
      const resp = await fetch('http://localhost:5000/auth/login', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({password:password,email:email}),
          credentials:"include"
      });
      console.log(resp);
      if (resp.status === 409) {
          alert("Invalid credentials! Please check your username and password.");
          return false;
      }
      else if(resp.status===200){
        if(email==='PBB@gmail.com'){
        setStatus('admin');
        }
        console.log('admin entered');
        setAuthorize(true);
        return true;
      }
       else if (resp.ok) {
        if(email==='PBB@gmail.com')setStatus('admin');
        console.log('admin entered');
          return true;
      } else {
          alert("Error logging in. Please try again.");
          return false;
      }
  } catch (error) {
      console.error("Login Error:", error);
      alert("Network error! Please check your connection.");
      return false;
  }
}

