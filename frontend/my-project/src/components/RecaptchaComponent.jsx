//                                                               EXEMPLO DE USO DO RECAPTCHA V3 COM A API DO GOOGLE



/*import { useEffect } from "react";


const RecaptchaComponent = ({ onChange }) => {
  useEffect(() => {
    if (!window.grecaptcha) {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const executeCaptcha = async () => {
    if (window.grecaptcha) {
      const token = await window.grecaptcha.execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, {
        action: "submit",
      });
      onChange(token);
    }
  };

  useEffect(() => {
    executeCaptcha();
  }, []);

  return null; // não precisa de mostrar nada na UI
};

export default RecaptchaComponent;*/

// RecaptchaComponent.jsx
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";

// importa a chave do .env
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // chave de teste Google

const RecaptchaComponent = ({ onVerify }) => {
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
    onVerify(token); // passa o token para o pai
  };

  return (
    <div className="my-4 flex justify-center">
      {/* 
        <ReCAPTCHA
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={handleRecaptchaChange}
          theme="light" // ou 'dark'
        /> 
        RETIRAR COMENTÁRIOS QUANDO TIVER O WEBSITE COM DOMINIO PRONTO
      */}
      <ReCAPTCHA
        sitekey={RECAPTCHA_SITE_KEY}
        onChange={handleRecaptchaChange}
        theme="light" // ou 'dark'
      />
    </div>
  );
};

export default RecaptchaComponent;




