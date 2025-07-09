import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import RecaptchaComponent from "./RecaptchaComponent";
import { useNavigate } from "react-router-dom";

const FinalDeleteModal = ({ onClose }) => {
  const deleteAccount = useAuthStore((state) => state.deleteAccount);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await deleteAccount({ email, password, recaptchaToken });
      onClose();
      navigate("/login"); // Redireciona para a página de login
    } catch (err) {
        
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
      <div className="bg-base-200 p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full"
            required
          />
          <RecaptchaComponent onVerify={(token) => setRecaptchaToken(token)} />
          <div className="flex justify-center gap-4 mt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-error">
              Confirm Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default FinalDeleteModal;
