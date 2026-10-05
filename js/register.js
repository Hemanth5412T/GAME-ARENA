/* Player sign-up. New accounts are always role "player"; the single admin cannot be created here. */
$("#rf").onsubmit=e=>{
 e.preventDefault();
 const f=Object.fromEntries(new FormData(e.target)),users=load("users");
 f.name=f.name.trim();f.username=f.username.trim();f.email=f.email.trim();
 const err=!f.name?"Enter your full name."
  :!/^[a-zA-Z0-9_]{3,20}$/.test(f.username)?"Username must be 3-20 letters, numbers or underscores."
  :users.some(u=>u.username.toLowerCase()===f.username.toLowerCase())?"That username is taken. Try another."
  :!/^\S+@\S+\.\S+$/.test(f.email)?"Enter a valid email."
  :f.password.length<6?"Password must be at least 6 characters."
  :f.password!==f.confirm?"Passwords don't match.":"";
 if(err){$("#err").textContent=err;return}
 users.push({id:Date.now(),username:f.username,password:f.password,name:f.name,email:f.email,role:"player"});
 save("users",users);
 login(f.username,f.password); // sign in right away
 location.href="player/dashboard.html";
};
