import { useState } from "react";
import { useGroupStore } from "../store/useGroupStore";
import { useChatStore } from "../store/useChatStore";

const CreateGroup = () => {
  const [name, setName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { users } = useChatStore();
  const { createGroup } = useGroupStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createGroup(name, selectedUsers);
    setName("");
    setSelectedUsers([]);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded mb-4">
      <h3 className="font-bold mb-2">Create Group</h3>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome do grupo"
        className="input input-bordered w-full mb-2"
      />
      <select
        multiple
        value={selectedUsers}
        onChange={(e) =>
          setSelectedUsers(
            Array.from(e.target.selectedOptions, (option) => option.value)
          )
        }
        className="select select-bordered w-full mb-2"
      >
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
      </select>
      <button type="submit" className="btn btn-primary">Create</button>
    </form>
  );
};

export default CreateGroup;