import { auth, signOut } from "@/auth";

const Profile = async () => {
  const session = await auth();
 
  const { name, email, image } = session.user;

  const handleSignOut = async ()=>{
    "use server";
    await signOut({redirectTo: "/login"});
  }

  return (
    <main className="min-h-screen bg-[#1F2020] text-white flex items-center justify-center p-6">
      <section className="w-full max-w-md rounded-xl border border-white/10 bg-white/3 p-6">
        <div className="flex items-center gap-4">
          {image ? (           
              <img
                src={image}
                alt={name || "User Avatar"}
                className="h-16 w-16 rounded-full object-cover border border-white/20"
              />
          ) : (
            <div className="h-16 w-16 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-xl font-semibold">
              {(name?.[0] || "U").toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold">{name || "No name"}</h1>
            <p className="text-white/70">{email || "No email"}</p>
          </div>
          <button onClick={handleSignOut} className="ml-auto bg-white text-sm
           text-black py-2 px-4 rounded-3xl hover:bg-gray-50">
            Sign Out
          </button>
        </div>
      </section>
    </main>
  );
};

export default Profile;
