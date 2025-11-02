import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
  });

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || "",
        email: user.email || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await api.put("/auth/profile/", profileData);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = () => {
    const errors = {};

    if (!passwordData.old_password) {
      errors.old_password = "Current password is required";
    }

    if (passwordData.new_password.length < 8) {
      errors.new_password = "Password must be at least 8 characters";
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      errors.confirm_password = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await api.post("/auth/change-password/", {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });

      setSuccessMessage("Password changed successfully!");
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
      setPasswordErrors({});
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.old_password?.[0] ||
          "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My <span className="text-gradient">Profile</span>
          </h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        {successMessage && (
          <div className="card bg-green-50 border-green-200 mb-6 animate-fade-in">
            <div className="flex items-center space-x-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-green-800 font-semibold">{successMessage}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="card bg-red-50 border-red-200 mb-6">
            <div className="flex items-start space-x-3">
              <svg
                className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="card sticky top-20">
              <div className="text-center mb-6 pb-6 border-b">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900">{user?.username}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
                {user?.is_staff && (
                  <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-semibold">
                    Admin
                  </span>
                )}
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    activeTab === "info"
                      ? "bg-primary-50 text-primary-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Profile Info</span>
                </button>

                <button
                  onClick={() => setActiveTab("password")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    activeTab === "password"
                      ? "bg-primary-50 text-primary-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                  <span>Change Password</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === "info" && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Profile Information
                </h2>

                <form onSubmit={handleProfileUpdate} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileData.first_name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            first_name: e.target.value,
                          })
                        }
                        className="input"
                        placeholder="Enter first name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileData.last_name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            last_name: e.target.value,
                          })
                        }
                        className="input"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          username: e.target.value,
                        })
                      }
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      className="input"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary px-8"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "password" && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Change Password
                </h2>

                <form onSubmit={handlePasswordChange} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordData.old_password}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          old_password: e.target.value,
                        })
                      }
                      className={`input ${
                        passwordErrors.old_password ? "border-red-500" : ""
                      }`}
                      placeholder="Enter current password"
                      required
                    />
                    {passwordErrors.old_password && (
                      <p className="text-red-500 text-sm mt-1">
                        {passwordErrors.old_password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          new_password: e.target.value,
                        })
                      }
                      className={`input ${
                        passwordErrors.new_password ? "border-red-500" : ""
                      }`}
                      placeholder="Enter new password (min 8 characters)"
                      required
                    />
                    {passwordErrors.new_password && (
                      <p className="text-red-500 text-sm mt-1">
                        {passwordErrors.new_password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirm_password: e.target.value,
                        })
                      }
                      className={`input ${
                        passwordErrors.confirm_password ? "border-red-500" : ""
                      }`}
                      placeholder="Confirm new password"
                      required
                    />
                    {passwordErrors.confirm_password && (
                      <p className="text-red-500 text-sm mt-1">
                        {passwordErrors.confirm_password}
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                      Password Tips:
                    </p>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Use at least 8 characters</li>
                      <li>• Mix uppercase and lowercase letters</li>
                      <li>• Include numbers and special characters</li>
                      <li>• Avoid common words or patterns</li>
                    </ul>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary px-8"
                    >
                      {loading ? "Changing Password..." : "Change Password"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
