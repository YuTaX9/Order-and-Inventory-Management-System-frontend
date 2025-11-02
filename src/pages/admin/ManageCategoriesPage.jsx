// src/pages/admin/ManageCategoriesPage.jsx
import { useState, useEffect } from "react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import Loading from "../../components/common/Loading";
import ConfirmModal from "../../components/common/ConfirmModal";
import { SuccessMessage } from "../../components/common/SuccessMessage";

const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load categories. Please check your API connection.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setFormErrors({});
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Category name is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (editingCategory) {
        const updated = await updateCategory(editingCategory.id, formData);
        setCategories(
          categories.map((c) => (c.id === updated.id ? updated : c))
        );
        setSuccessMessage("Category updated successfully!");
      } else {
        const created = await createCategory(formData);
        setCategories([created, ...categories]);
        setSuccessMessage("Category created successfully!");
      }
      closeModal();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setFormErrors({
        general:
          err.response?.data?.name?.[0] ||
          "Failed to save category. Name might be taken.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInitialDelete = (categoryId, categoryName) => {
    setConfirmDelete({ id: categoryId, name: categoryName });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;

    const { id: categoryId } = confirmDelete;
    setConfirmDelete(null);
    setLoading(true);

    try {
      await deleteCategory(categoryId);
      setCategories(categories.filter((c) => c.id !== categoryId));
      setSuccessMessage("Category deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to delete category. It may have products assigned to it."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error && categories.length === 0)
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="p-8 bg-red-100 border border-red-400 rounded-lg shadow-md">
            <p className="text-red-800 text-lg font-semibold">
              Error Loading Data:
            </p>
            <p className="text-red-700 mt-2">{error}</p>
            <button
              onClick={loadCategories}
              className="mt-4 btn btn-primary bg-red-600 hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
           {" "}
      <div className="container mx-auto px-4 max-w-6xl">
               {" "}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                   {" "}
          <div>
                       {" "}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Manage{" "}
              <span className="text-gradient">Categories</span>           {" "}
            </h1>
                       {" "}
            <p className="text-gray-600">
              Organize your products with categories
            </p>
                     {" "}
          </div>
                   {" "}
          <button
            onClick={openCreateModal}
            className="btn btn-secondary px-6 py-3 text-lg"
          >
                       {" "}
            <svg
              className="w-5 h-5 inline mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
                           {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
                         {" "}
            </svg>
                        Add Category          {" "}
          </button>
                 {" "}
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        )}
               {" "}
        {successMessage && (
          <div className="mb-6">
            <SuccessMessage
              message={successMessage}
              onClose={() => setSuccessMessage("")}
            />
          </div>
        )}
               {" "}
        {categories.length === 0 ? (
          <div className="card text-center py-16">
                       {" "}
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                           {" "}
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                               {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
                             {" "}
              </svg>
                         {" "}
            </div>
                       {" "}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Categories Yet
            </h2>
                       {" "}
            <p className="text-gray-600 mb-6">
              Create your first category to start organizing products
            </p>
                       {" "}
            <button onClick={openCreateModal} className="btn btn-primary">
                            Create Category            {" "}
            </button>
                     {" "}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {" "}
            {categories.map((category) => (
              <div key={category.id} className="card card-hover group">
                               {" "}
                <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                   {" "}
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                                       {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                                     {" "}
                  </svg>
                                 {" "}
                </div>
                               {" "}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h3>
                                               {" "}
                {category.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {category.description}                 {" "}
                  </p>
                )}
                               {" "}
                <div className="flex items-center space-x-2 mb-4 text-sm">
                                   {" "}
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                                       {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                                     {" "}
                  </svg>
                                   {" "}
                  <span className="text-gray-600">
                                        {category.products_count || 0} product
                    {category.products_count !== 1 ? "s" : ""}                 {" "}
                  </span>
                                 {" "}
                </div>
                               {" "}
                <p className="text-xs text-gray-500 mb-4">
                                    Created{" "}
                  {new Date(category.created_at).toLocaleDateString()}         
                       {" "}
                </p>
                               {" "}
                <div className="flex gap-2 pt-4 border-t">
                                   {" "}
                  <button
                    onClick={() => openEditModal(category)}
                    className="flex-1 btn btn-outline text-sm"
                  >
                                       {" "}
                    <svg
                      className="w-4 h-4 inline mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                                           {" "}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                                         {" "}
                    </svg>
                                        Edit                  {" "}
                  </button>
                                   {" "}
                  <button
                    onClick={() =>
                      handleInitialDelete(category.id, category.name)
                    } // 👈 استخدام دالة التأكيد الجديدة
                    className="btn bg-red-50 text-red-600 hover:bg-red-100 border-red-200 text-sm"
                  >
                                       {" "}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                                           {" "}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                                         {" "}
                    </svg>
                                     {" "}
                  </button>
                                 {" "}
                </div>
                             {" "}
              </div>
            ))}
                     {" "}
          </div>
        )}
               {" "}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                       {" "}
            <div className="bg-white rounded-xl max-w-md w-full p-6 animate-fade-in">
                           {" "}
              <div className="flex justify-between items-center mb-6">
                               {" "}
                <h2 className="text-2xl font-bold text-gray-900">
                                   {" "}
                  {editingCategory ? "Edit Category" : "Create Category"}       
                         {" "}
                </h2>
                               {" "}
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                                   {" "}
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                                       {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                                     {" "}
                  </svg>
                                 {" "}
                </button>
                             {" "}
              </div>
                           {" "}
              {formErrors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                   {" "}
                  <p className="text-sm text-red-800">{formErrors.general}</p> 
                               {" "}
                </div>
              )}
                           {" "}
              <form onSubmit={handleSubmit} className="space-y-5">
                               {" "}
                <div>
                                   {" "}
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category Name{" "}
                    <span className="text-red-500">*</span>                 {" "}
                  </label>
                                   {" "}
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input"
                    placeholder="e.g., Electronics, Clothing, Books"
                    disabled={submitting}
                  />
                                   {" "}
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.name}
                    </p>
                  )}
                                 {" "}
                </div>
                               {" "}
                <div>
                                   {" "}
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description (Optional)                  {" "}
                  </label>
                                   {" "}
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="input"
                    rows="4"
                    placeholder="Brief description of this category..."
                    disabled={submitting}
                  />
                                 {" "}
                </div>
                               {" "}
                <div className="flex gap-3 pt-4">
                                   {" "}
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 btn btn-outline"
                    disabled={submitting}
                  >
                                        Cancel                  {" "}
                  </button>
                                   {" "}
                  <button
                    type="submit"
                    className="flex-1 btn btn-primary"
                    disabled={submitting}
                  >
                                       {" "}
                    {submitting ? (
                      <span className="flex items-center justify-center">
                                               {" "}
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                                Saving...                      {" "}
                      </span>
                    ) : editingCategory ? (
                      "Update Category"
                    ) : (
                      "Create Category"
                    )}
                                     {" "}
                  </button>
                                 {" "}
                </div>
                             {" "}
              </form>
                         {" "}
            </div>
                     {" "}
          </div>
        )}
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default ManageCategoriesPage;