// import React, { useEffect, useState } from 'react';
// import axios from "axios";
// import { setAuthToken } from '../services/auth';
// import { useNavigate } from "react-router-dom";
// import {
//   Table,
//   Button,
//   Popconfirm,
//   message,
//   Modal,
//   Form,
//   Input,
//   Card,
//   Space,
//   Typography,
//   Row,
//   Col,
//   Tooltip,
//   Input as AntInput
// } from 'antd';
// import {
//   EditOutlined,
//   DeleteOutlined,
//   SearchOutlined,
//   ReloadOutlined,
//   BankOutlined,
//   ExclamationCircleOutlined
// } from '@ant-design/icons';

// const { Title } = Typography;
// const { Search } = AntInput;

// const Colleges = () => {
//   const [colleges, setColleges] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [currentCollege, setCurrentCollege] = useState(null);
//   const [form] = Form.useForm();
//   const [searchText, setSearchText] = useState('');
//   const [filteredColleges, setFilteredColleges] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({ mail: "", password: "" });
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   // In frontend Colleges.js, add the token to the fetch request:
//   const fetchColleges = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token'); // Assuming you store the token in localStorage after login 
//       const response = await fetch('http://localhost:5000/admin/organizations', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         }
//       });
//       if (!response.ok) {
//         throw new Error('Failed to fetch colleges data');
//       }
//       const data = await response.json();
//       const collegesData = data.organizations;
//       setColleges(collegesData);
//       setFilteredColleges(collegesData);
//     } catch (error) {
//       message.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCollegeAccess = async (collegeId, _id) => {
//     setIsLoading(true);
//     try {
//       const endpoint = "http://localhost:5000/admin/college-login";
//       const requestData = {
//         organizationCode: collegeId, 
//         organizationId: _id
//       };
      
//       const response = await axios.post(endpoint, requestData);
      
//       if (response.data.token) {
//         // Handle JWT token for college admin
//         setAuthToken(response.data.token);
//         navigate('/college-admin-profile');
//         onLoginSuccess("collegeAdmin");
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.message || "An error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };



//   useEffect(() => {
//     fetchColleges();
//   }, []);

//   const handleEdit = (record) => {
//     setCurrentCollege(record);
//     form.setFieldsValue(record);
//     setIsModalVisible(true);
//   };

//   const handleDelete = (id) => {
//     Modal.confirm({
//       title: 'Are you sure you want to delete this organization?',
//       icon: <ExclamationCircleOutlined />,
//       content: 'This action cannot be undone.',
//       okText: 'Yes',
//       okType: 'danger',
//       cancelText: 'No',
//       async onOk() {
//         try {
//           const token = localStorage.getItem('token');
//           const response = await fetch(`http://localhost:5000/admin/organizations/${id}`, {
//             method: 'DELETE',
//             headers: {
//               'Authorization': `Bearer ${token}`,
//             }
//           });
//           if (!response.ok) {
//             throw new Error('Failed to delete organization');
//           }
//           message.success('Organization deleted successfully');
//           fetchColleges();
//         } catch (error) {
//           message.error(error.message);
//         }
//       },
//     });
//   };

//   const handleOk = async (values) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`http://localhost:5000/admin/organizations/${currentCollege._id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(values),
//       });
//       if (!response.ok) {
//         throw new Error('Failed to update organization');
//       }
//       message.success('Organization updated successfully');
//       setIsModalVisible(false);
//       fetchColleges();
//       form.resetFields();
//     } catch (error) {
//       message.error(error.message);
//     }
//   };

//   const handleSearch = (value) => {
//     setSearchText(value);
//     const filtered = colleges.filter(college =>
//       college.organizationName.toLowerCase().includes(value.toLowerCase()) ||
//       college.organizationCode.toLowerCase().includes(value.toLowerCase()) ||
//       college.organizationMail.toLowerCase().includes(value.toLowerCase()) ||
//       college.websiteHandlerName.toLowerCase().includes(value.toLowerCase())
//     );
//     setFilteredColleges(filtered);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     form.resetFields();
//   };

//   const columns = [
//     {
//       title: 'Organization Name',
//       dataIndex: 'organizationName',
//       key: 'organizationName',
//       sorter: (a, b) => a.organizationName.localeCompare(b.organizationName),
//       ellipsis: true,
//     },
//     {
//       title: 'Organization Code',
//       dataIndex: 'organizationCode',
//       key: 'organizationCode',
//       sorter: (a, b) => a.organizationCode.localeCompare(b.organizationCode),
//     },
//     {
//       title: 'Organization Email',
//       dataIndex: 'organizationMail',
//       key: 'organizationMail',
//       ellipsis: true,
//     },
//     {
//       title: 'Website Handler',
//       dataIndex: 'websiteHandlerName',
//       key: 'websiteHandlerName',
//       ellipsis: true,
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       width: 150,
//       render: (_, record) => (
//         <Space>
//           <Tooltip title="Edit">
//             <Button
//               type="primary"
//               icon={<EditOutlined />}
//               onClick={() => handleEdit(record)}
//             />
//           </Tooltip>
//           <Tooltip title="Delete">
//             <Button
//               danger
//               icon={<DeleteOutlined />}
//               onClick={() => handleDelete(record._id)}
//             />
//           </Tooltip>
//           <Tooltip title="Access College">
//             <Button
//               type="default"
//               icon={<BankOutlined />}
//               onClick={() => handleCollegeAccess(record.collegeId, record._id)}
//             />
//           </Tooltip>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <Card>
//       <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
//         <Col>
//           <Title level={3}>Organizations Management</Title>
//         </Col>
//         <Col>
//           <Space>
//             <Search
//               placeholder="Search organizations..."
//               allowClear
//               onSearch={handleSearch}
//               onChange={e => handleSearch(e.target.value)}
//               style={{ width: 300 }}
//             />
//             <Tooltip title="Refresh">
//               <Button
//                 icon={<ReloadOutlined />}
//                 onClick={fetchColleges}
//               />
//             </Tooltip>
//           </Space>
//         </Col>
//       </Row>

//       <Table
//         columns={columns}
//         dataSource={filteredColleges}
//         rowKey="_id"
//         loading={loading}
//         pagination={{
//           defaultPageSize: 10,
//           showSizeChanger: true,
//           showTotal: (total, range) =>
//             `${range[0]}-${range[1]} of ${total} organizations`,
//         }}
//       />

//       <Modal
//         title="Edit Organization"
//         open={isModalVisible}
//         onCancel={handleCancel}
//         footer={null}
//         destroyOnClose
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={handleOk}
//           initialValues={currentCollege}
//         >
//           <Form.Item
//             name="organizationName"
//             label="Organization Name"
//             rules={[{ required: true, message: 'Please input the organization name!' }]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item
//             name="organizationMail"
//             label="Organization Email"
//             rules={[
//               { required: true, message: 'Please input the organization email!' },
//               { type: 'email', message: 'Please input a valid email!' }
//             ]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item
//             name="websiteHandlerName"
//             label="Website Handler Name"
//             rules={[{ required: true, message: 'Please input the website handler name!' }]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item
//             name="websiteHandlerPhoneNumber"
//             label="Website Handler Phone Number"
//             rules={[
//               { pattern: /^\d{10}$/, message: 'Please input a valid 10-digit phone number!' }
//             ]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item>
//             <Space>
//               <Button type="primary" htmlType="submit">
//                 Update
//               </Button>
//               <Button onClick={handleCancel}>
//                 Cancel
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </Card>
//   );
// };

// export default Colleges;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Card,
  Space,
  Typography,
  Row,
  Col,
  Tooltip,
  message
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  BankOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";

const { Title } = Typography;
const { Search } = Input;

const Colleges = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCollege, setCurrentCollege] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // Fetch Colleges with Auth Token
  const fetchColleges = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch("http://localhost:5000/admin/organizations", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Failed to fetch colleges data");

      const data = await response.json();
      setColleges(data.organizations);
      setFilteredColleges(data.organizations);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle College Admin Access
  const handleCollegeAccess = async (organizationCode, organizationId) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/admin/college-login", {
        organizationCode,
        organizationId
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Store JWT
        navigate("/college-admin-profile");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  // Edit Organization
  const handleEdit = (record) => {
    setCurrentCollege(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Delete Organization
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this organization?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`http://localhost:5000/admin/organizations/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
          });

          if (!response.ok) throw new Error("Failed to delete organization");

          message.success("Organization deleted successfully");
          fetchColleges();
        } catch (error) {
          message.error(error.message);
        }
      }
    });
  };

  // Update Organization
  const handleOk = async (values) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/admin/organizations/${currentCollege._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(values)
      });

      message.success("Organization updated successfully");
      setIsModalVisible(false);
      fetchColleges();
      form.resetFields();
    } catch (error) {
      message.error(error.message);
    }
  };

  // Search Functionality
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = colleges.filter((college) =>
      college.organizationName?.toLowerCase().includes(value.toLowerCase()) ||
      college.organizationCode?.toLowerCase().includes(value.toLowerCase()) ||
      college.organizationMail?.toLowerCase().includes(value.toLowerCase()) ||
      college.websiteHandlerName?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredColleges(filtered);
  };

  const columns = [
    {
      title: "Organization Name",
      dataIndex: "organizationName",
      key: "organizationName",
      sorter: (a, b) => a.organizationName.localeCompare(b.organizationName),
      ellipsis: true
    },
    {
      title: "Organization Code",
      dataIndex: "organizationCode",
      key: "organizationCode",
      sorter: (a, b) => a.organizationCode.localeCompare(b.organizationCode)
    },
    {
      title: "Organization Email",
      dataIndex: "organizationMail",
      key: "organizationMail",
      ellipsis: true
    },
    {
      title: "Website Handler",
      dataIndex: "websiteHandlerName",
      key: "websiteHandlerName",
      ellipsis: true
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} />
          </Tooltip>
          <Tooltip title="Access College">
            <Button
              type="default"
              icon={<BankOutlined />}
              loading={isLoading}
              onClick={() => handleCollegeAccess(record.organizationCode, record._id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3}>Organizations Management</Title>
        </Col>
        <Col>
          <Space>
            <Search placeholder="Search organizations..." allowClear onSearch={handleSearch} style={{ width: 300 }} />
            <Tooltip title="Refresh">
              <Button icon={<ReloadOutlined />} onClick={fetchColleges} />
            </Tooltip>
          </Space>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredColleges}
        rowKey="_id"
        loading={loading}
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
      />
    </Card>
  );
};

export default Colleges;
