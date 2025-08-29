import React, { useState } from "react";
import api from "../../https"; // giả định api gọi backend
import EditUserModal from "./EditUserModal"; // modal chỉnh sửa người dùng
import { MdEdit, MdDelete } from "react-icons/md";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

const Users = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Query lấy danh sách người dùng
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", { search, page, limit }],
    queryFn: () => api.getUsers({ search, page, limit }),
    keepPreviousData: true,
  });

  // Mutation xóa người dùng
  const deleteUserMutation = useMutation({
    mutationFn: (id) => api.deleteUser(id),
    onSuccess: () => {
      enqueueSnackbar("Xóa người dùng thành công!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      enqueueSnackbar("Xóa người dùng thất bại.", { variant: "error" });
    },
  });

  // Mutation cập nhật người dùng
  const updateUserMutation = useMutation({
    mutationFn: ({ id, updatedUser }) => api.updateUser(id, updatedUser),
    onSuccess: () => {
      setIsModalOpen(false);
      setSelectedUser(null);
      enqueueSnackbar("Cập nhật người dùng thành công!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      enqueueSnackbar("Cập nhật người dùng thất bại.", { variant: "error" });
    },
  });

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này không?")) return;
    deleteUserMutation.mutate(id);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleUpdate = (updatedUser) => {
    updateUserMutation.mutate({ id: updatedUser._id, updatedUser });
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Danh sách người dùng</h1>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email..."
          className="border rounded-lg px-3 py-1 w-64"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs uppercase bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3">Tên</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Số điện thoại</th>
            <th className="px-4 py-3">Vai trò</th>
            <th className="px-4 py-3">Trạng thái</th>
            <th className="px-4 py-3 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Đang tải...
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={6} className="text-center py-4 text-red-600">
                Lỗi: {error.message || "Không thể tải dữ liệu."}
              </td>
            </tr>
          ) : data?.users.length > 0 ? (
            data.users.map((user) => (
              <tr
                key={user._id}
                className={`border-t ${user.active !== true ? "bg-white text-black" : "bg-blue-200"}`}
              >
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.phone}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.active === true ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.active === true ? "Kích hoạt" : "Không kích hoạt"}
                  </span>
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    title="Chỉnh sửa"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEditClick(user)}
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    title="Xóa"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(user._id)}
                    disabled={deleteUserMutation.isLoading}
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Không có người dùng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="mt-4 flex justify-center space-x-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Trước
        </button>
        <span className="px-3 py-1 border rounded">
          {page} / {data?.totalPages || 1}
        </span>
        <button
          disabled={page >= (data?.totalPages || 1)}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Sau
        </button>
      </div>

      {/* Modal chỉnh sửa */}
      <EditUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedUser}
        onSave={handleUpdate}
      />
    </div>
  );
};

export default Users;
