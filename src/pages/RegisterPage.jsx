import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import logoImage from "../assets/logo.svg";
import ErrorMessage from "../components/common/ErrorMessage";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (formData.password !== formData.password2) {
      newErrors.password2 = "Passwords don't match";
    }
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate("/login", {
        state: { message: "Registration successful! Please login." },
      });
    } catch (err) {
      setErrors(
        err.response?.data?.error || {
          general: "Registration failed. Please check your data.",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4">
           {" "}
      <div className="max-w-md w-full">
               {" "}
        <div className="text-center mb-8">
                   {" "}
          <img
            src={logoImage}
            alt="InventoryHub Logo"
            className="mx-auto h-16 w-auto mb-6"
          />
                             {" "}
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1> 
                  <p className="text-gray-600 mt-2">Join InventoryHub today</p> 
               {" "}
        </div>
               {" "}
        <div className="card">
                   {" "}
          {errors.general && (
            <div className="mb-6">
              <ErrorMessage message={errors.general} />           {" "}
            </div>
          )}
                   {" "}
          <form onSubmit={handleSubmit} className="space-y-5">
                       {" "}
            <div>
                           {" "}
              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username *              {" "}
              </label>
                           {" "}
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="input"
                placeholder="Choose a username"
                required
              />
                           {" "}
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
                         {" "}
            </div>
                       {" "}
            <div>
                           {" "}
              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email *              {" "}
              </label>
                           {" "}
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="input"
                placeholder="your@email.com"
                required
              />
                           {" "}
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
                         {" "}
            </div>
                       {" "}
            <div>
                           {" "}
              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password *              {" "}
              </label>
                           {" "}
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="input"
                placeholder="Min 8 characters"
                required
              />
                           {" "}
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
                         {" "}
            </div>
                       {" "}
            <div>
                           {" "}
              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password *              {" "}
              </label>
                           {" "}
              <input
                type="password"
                value={formData.password2}
                onChange={(e) =>
                  setFormData({ ...formData, password2: e.target.value })
                }
                className="input"
                placeholder="Repeat your password"
                required
              />
                           {" "}
              {errors.password2 && (
                <p className="text-red-500 text-sm mt-1">{errors.password2}</p>
              )}
                         {" "}
            </div>
                       {" "}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-lg font-semibold"
            >
                           {" "}
              {loading ? (
                <span className="flex items-center justify-center">
                                   {" "}
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                                       {" "}
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                                       {" "}
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                                     {" "}
                  </svg>
                                    Creating account...                {" "}
                </span>
              ) : (
                "Create Account"
              )}
                         {" "}
            </button>
                     {" "}
          </form>
                   {" "}
          <div className="mt-6 text-center">
                       {" "}
            <p className="text-gray-600">
                            Already have an account?              {" "}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                                Login              {" "}
              </Link>
                         {" "}
            </p>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default RegisterPage;
