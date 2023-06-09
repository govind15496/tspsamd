import React, { useState, useEffect } from "react";
import {
  DeleteFilled,
  EditOutlined,
  GlobalOutlined,
  HeartFilled,
  HeartOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Card, Modal, Form, Input } from "antd";
import "./UserList.css";
import Spinner from "./Spinner";

// Define the User interface to specify the shape of user data
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  username: string;
  liked: boolean;
}

const UserList: React.FC = () => {
  // State variables
  const [users, setUsers] = useState<User[]>([]); // Store user data
  const [loading, setLoading] = useState(true); // Flag to indicate loading state
  const [editingUser, setEditingUser] = useState<User | null>(null); // Store the user being edited
  const [isModalVisible, setIsModalVisible] = useState(false); // Flag to control modal visibility
  const [form] = Form.useForm(); // Form instance for user editing

  useEffect(() => {
    // Fetch user data when component mounts
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch user data from the API
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const data = await response.json();
      setUsers(data); // Update the user state with the fetched data
      setLoading(false); // Set loading state to false
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (userId: number) => {
    // Remove the user with the given userId from the users array
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers); // Update the user state

    if (updatedUsers.length === 0) {
      setLoading(true);
    }
  };

  const handleLike = (userId: number) => {
    // Toggle the liked status of the user with the given userId
    setUsers((prevUsers) => {
      return prevUsers.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            liked: !user.liked,
          };
        }
        return user;
      });
    });
  };

  const handleEdit = (user: User) => {
    // Set the editingUser state to the selected user and open the modal
    setEditingUser(user);
    setIsModalVisible(true);
    form.setFieldsValue(user); // Set the form fields with the user data
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      // Update the user's information with the form values
      const updatedUsers = users.map((user) => {
        if (user.id === editingUser?.id) {
          return {
            ...user,
            ...values,
          };
        }
        return user;
      });
      setUsers(updatedUsers); // Update the user state
      setIsModalVisible(false); // Close the modal
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="card-container">
          {users.map((user) => (
            <Card
              className="custom-card"
              key={user.id}
              style={{
                borderRadius: "2px",
                borderWidth: "2px",
              }}
              cover={
                <img
                  className="card-container"
                  style={{
                    borderRadius: "2px",
                    width: "100%",
                    height: "200px",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    backgroundColor: "#f5f5f5",
                  }}
                  src={`https://avatars.dicebear.com/v2/avataaars/${user.username}.svg?options[mood][]=happy`}
                  alt={user.username}
                />
              }
              actions={[
                user.liked ? (
                  <HeartFilled
                    style={{ color: "red", fontSize: "1.4em" }}
                    onClick={() => handleLike(user.id)}
                  />
                ) : (
                  <HeartOutlined
                    style={{
                      color: "red",
                      fontSize: "1.4em",
                    }}
                    onClick={() => handleLike(user.id)}
                  />
                ),
                <EditOutlined
                  style={{ fontSize: "1.4em" }}
                  onClick={() => handleEdit(user)}
                />,
                <DeleteFilled
                  style={{ fontSize: "1.4em" }}
                  onClick={() => handleDelete(user.id)}
                />,
              ]}
            >
              <div className="info">
                <h2>{user.name}</h2>
                <div className="info__">
                  <MailOutlined
                    style={{ fontSize: "1.3em", paddingRight: "0.5em" }}
                  />
                  <p>{user.email}</p>
                </div>
                <div className="info__">
                  <PhoneOutlined
                    style={{ fontSize: "1.3em", paddingRight: "0.5em" }}
                  />
                  <p>{user.phone}</p>
                </div>
                <div className="info__">
                  <GlobalOutlined
                    style={{ fontSize: "1.3em", paddingRight: "0.5em" }}
                  />
                  <p>{user.website}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title="Model User"
        open={isModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="website"
            label="Website"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserList;
