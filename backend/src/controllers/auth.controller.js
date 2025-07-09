//RETIRAR                                     comentários quando tiver o website com domínio pronto






/*import { generateToken } from "../lib/utils.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import axios from "axios";

const verifyRecaptcha = async (token) => {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
  );

  return response.data.success;
};

// Regista um novo utilizador
export const signup = async (req, res) => {
  const { name, email, password, recaptchaToken } = req.body;
  try {
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return res.status(400).json({
        message: "Recaptcha verification failed. Please try again.",
      });
    }
    // Verifica se todos os campos estão preenchidos
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    // Verifica se a password tem pelo menos 6 caracteres
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }
    const user = await User.findOne({ email });

    // Verifica se o email já existe
    if (user) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cria um novo utilizador
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    })

    if (newUser) {
      // Gera o token JWT
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        message: "User created",
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePic: newUser.profilePic,
      })

    } else {
      res.status(400).json({
        message: "Invalid user data"
      })
    }
  } catch (error) {
    console.log("error in signup controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

// Autentica um utilizador
export const login = async (req, res) => {
  const { email, password, recaptchaToken } = req.body;

  try {
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return res.status(400).json({
        message: "Recaptcha verification failed. Please try again.",
      });
    }
    const user = await User.findOne({ email });

    // Verifica se o utilizador existe
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // Verifica se a password está correta
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    generateToken(user._id, res);

    res.status(200).json({
      message: "Login successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
    })

  } catch (error) {
    console.log("error in login controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

// Termina a sessão do utilizador
export const logout = (req, res) => {
  try {

    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({
      message: "Logged out successfully",
    })
  } catch (error) {
    console.log("error in logout controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

// Atualiza a foto de perfil do utilizador
export const updateProfile = async (req, res) => {

  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    // Verifica se foi fornecida uma imagem
    if (!profilePic) {
      return res.status(400).json({
        message: "Please provide a profile picture",
      });
    }

    // Faz upload da imagem para o Cloudinary
    const updloadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: updloadResponse.secure_url }, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }

}

// Verifica se o utilizador está autenticado
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in checkAuth controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export const changePassword = async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email, recaptchaToken } = req.body;

  try {
    // Verificar reCAPTCHA
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify`;
    const { data } = await axios.post(
      verifyURL,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    if (!data.success || data.score < 0.5) {
      return res.status(400).json({ message: "Failed reCAPTCHA verification." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Não dá erro explícito para não dar leak de existência
      return res.json({ message: "If this email exists, instructions were sent." });
    }

    // Aqui normalmente geras um token de reset, envias email, etc.
    // Por agora podemos só simular:
    console.log(`Password reset requested for: ${email}`);

    res.json({ message: "If this email exists, instructions were sent." });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Server error." });
  }
};*/

import { generateToken } from "../lib/utils.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import axios from "axios";

// Helper para verificação reCAPTCHA
const verifyRecaptcha = async (token) => {
  // Se não tiver token ou não tiver secret (ex: durante testes), não bloqueia
  if (!token || !process.env.RECAPTCHA_SECRET_KEY) {
    console.warn("⚠️ Skipping reCAPTCHA verification (missing token or secret)");
    return true;
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    return response.data.success;
  } catch (err) {
    console.error("Error verifying reCAPTCHA:", err.message);
    return false;
  }
};

// Regista um novo utilizador
export const signup = async (req, res) => {
  const { name, email, password, recaptchaToken } = req.body;
  try {
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return res.status(400).json({
        message: "Recaptcha verification failed. Please try again.",
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        message: "User created",
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({
        message: "Invalid user data",
      });
    }
  } catch (error) {
    console.log("error in signup controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Autentica um utilizador
export const login = async (req, res) => {
  const { email, password, recaptchaToken } = req.body;

  try {
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return res.status(400).json({
        message: "Recaptcha verification failed. Please try again.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    generateToken(user._id, res);

    res.status(200).json({
      message: "Login successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("error in login controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Termina a sessão do utilizador
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("error in logout controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Atualiza a foto de perfil do utilizador
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({
        message: "Please provide a profile picture",
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Verifica se o utilizador está autenticado
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in checkAuth controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Alteração de password
export const changePassword = async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot password (com reCAPTCHA, opcional)
export const forgotPassword = async (req, res) => {
  const { email, recaptchaToken } = req.body;

  try {
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return res.status(400).json({
        message: "Recaptcha verification failed. Please try again.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Não revela se o email existe
      return res.json({
        message: "If this email exists, instructions were sent.",
      });
    }

    console.log(`Password reset requested for: ${email}`);

    res.json({
      message: "If this email exists, instructions were sent.",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const deleteAccount = async (req, res) => {
  const userId = req.user._id;
  const { email, password, recaptchaToken } = req.body;

  try {
    /*
    // Verificar reCAPTCHA com sitekey verdadeiro
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify`;
    const { data } = await axios.post(
      verifyURL,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    if (!data.success || data.score < 0.5) {
      return res.status(400).json({ message: "Failed reCAPTCHA verification." });
    }*/

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verificar que o email corresponde
    if (user.email !== email) {
      return res.status(400).json({ message: "Email incorrect" });
    }

    // Verificar password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password incorrect" });
    }

    // Apagar o utilizador
    await User.findByIdAndDelete(userId);

    // Limpar cookie JWT
    res.cookie("jwt", "", { maxAge: 0 });

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Server error" });
  }
};

