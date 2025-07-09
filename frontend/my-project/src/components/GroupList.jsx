import { useEffect } from "react";
import { useGroupStore } from "../store/useGroupStore";

const GroupList = () => {
  const { groups, fetchGroups } = useGroupStore();

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return (
    <div>
      <h3 className="font-bold text-lg mb-2">My Groups</h3>
      <ul>
        {groups.map((group) => (
          <li key={group._id}>{group.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;