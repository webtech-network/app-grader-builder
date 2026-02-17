import React, { useState } from "react";
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react";

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  // Estados dos campos
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Visibilidade independente
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Login attempt:", { email, password });
    } else {
      console.log("Register attempt:", { firstName, email, password, confirmPassword });
    }
  };

  const togglePanel = () => {
    setIsLogin(!isLogin);
    setFirstName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-gray-800 p-8 shadow-lg border border-gray-700 transition-all duration-500">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 shadow-md">
            {isLogin ? <LogIn className="h-6 w-6 text-white" /> : <UserPlus className="h-6 w-6 text-white" />}
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            {isLogin ? "Acessar Prisma" : "Criar sua conta"}
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            
            {/* Primeiro Nome */}
            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-sm font-medium text-gray-300">Primeiro Nome</label>
                <input
                  type="text"
                  required={!isLogin}
                  className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-all"
                  placeholder="Seu nome"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-all"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Senha */}
            <div>
              <label className="text-sm font-medium text-gray-300">Senha</label>
              <div className="relative mt-1"> 
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 pr-10 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {isLogin && (
                <div className="flex justify-end mt-2">
                  <button type="button" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    Esqueceu a senha?
                  </button>
                </div>
              )}
            </div>

            {/* Confirmar Senha */}
            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-sm font-medium text-gray-300">Confirmar Senha</label>
                <div className="relative mt-1"> 
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required={!isLogin}
                    className="block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 pr-10 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-all"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-indigo-400 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isLogin ? "Entrar" : "Finalizar Cadastro"}
          </button>

          <div className="pt-6 mt-6 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-400">
              {isLogin ? "Não tem uma conta?" : "Já possui uma conta?"}{' '}
              <button
                type="button"
                onClick={togglePanel}
                className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {isLogin ? "Crie sua conta aqui" : "Acesse aqui"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;