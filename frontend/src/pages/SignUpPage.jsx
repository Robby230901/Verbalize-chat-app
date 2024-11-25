import { useAuthStore } from "../store/use.AuthStore";
import { MessageSquare, User, Mail, EyeOff, Eye, Lock, Loader2 } from "lucide-react";
import { useState } from "react";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const { signup, isSigningUp } = useAuthStore(); //stato
    

    const validateForm = () => {
    if(!formData.fullName.trim()) return toast.error("Il campo nome completo è richiesto!")
    if(!formData.email.trim()) return toast.error("Il campo email è richiesto!")
    if(!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Campo email non valido")
    if(!formData.password.trim()) return toast.error("Il campo password è richiesto!")
    if(formData.password.length < 6) return toast.error("Il campo password deve essere almeno di 6 caratteri!")
    return true;
    
    
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    const success = validateForm();
    if(success ===true) signup(formData);
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Section */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo and Header */}
                    <div className="text-center mb-8">
                        {/* You can add logo here */}
                    </div>

                    <div className="flex flex-col items-center gap-2 group">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <MessageSquare className="size-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold mt-2">Crea Account</h1>
                        <p className="text-base-content/60">Inizia con il tuo account gratis</p>
                    </div>
                </div>

                {/* Sign Up Form */}
                <form onSubmit={handleSubmit} className="space-y-6 w-full">
                    {/* Full Name */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Nome Completo</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="size-5 text-base-content/40" />
                            </div>
                            <input
                                type="text"
                                className="input input-bordered w-full pl-10"
                                placeholder="Mario Rossi"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Email</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="size-5 text-base-content/40" />
                            </div>
                            <input
                                type="email"
                                className="input input-bordered w-full pl-10"
                                placeholder="example@domain.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Password</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="size-5 text-base-content/40" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input input-bordered w-full pl-10"
                                placeholder="*******"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="size-5 text-base-content/40" />
                                ) : (
                                    <Eye className="size-5 text-base-content/40" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="form-control mt-4">
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isSigningUp}
                        >
                            {isSigningUp ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    Caricamento...
                                </>
                            ) : (
                                "Crea Account"
                            )}
                        </button>
                    </div>
                </form>
            </div>
            {/*parte destra */}
<AuthImagePattern
title="Unisciti alla Community!"
subtitle="Connettiti con gli amici, parenti e ai  nostri membri della community!"
/>
        </div>
    );
};


export default SignUpPage;