import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Loader2, Mail, MessageSquare } from "lucide-react";
import RecaptchaComponent from "../components/RecaptchaComponent";
import AuthImagePattern from "../components/AuthImagePattern";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Invalid email format");

    if (!recaptchaToken) return toast.error("Please complete the reCAPTCHA");

    setIsSubmitting(true);

    try {
      await axiosInstance.post("/api/auth/forgot-password", {
        email,
        recaptchaToken,
      });
      toast.success("If this email exists, instructions were sent.");
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending reset instructions.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Forgot Password</h1>
              <p className="text-base-content/60">We'll help you reset it</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Recaptcha */}
            <RecaptchaComponent onChange={setRecaptchaToken} />

            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/login" className="link link-primary">
              Back to login
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <AuthImagePattern
        title="Reset your password"
        subtitle="We'll send you an email with instructions to reset it."
      />
    </div>
  );
};

export default ForgotPassword;
