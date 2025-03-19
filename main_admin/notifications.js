import React, { useState, useEffect } from "react";
import { Card, Form, Select, Input, Button, message, Typography } from "antd";
import "./notification.css"

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const SendNotification = () => {
  const [form] = Form.useForm();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/admin/notifications/get-organization-codes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setColleges(data.colleges);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching colleges:", error);
      message.error("Failed to fetch colleges");
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/admin/notifications/send-notification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (data.success) {
        message.success("Notification sent successfully!");
        form.resetFields();
      } else {
        message.error(data.message || "Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      message.error("Error sending notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="notification-card">
      <Title level={3} className="notification-title">
        Send Notification
      </Title>

      <Form form={form} className="notification-form" layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="organizationCode"
          label="Select Organization"
          rules={[{ required: true, message: "Please select an organization" }]}
        >
          <Select className="notification-input" placeholder="Select an organization" showSearch optionFilterProp="children">
            {colleges.map((college) => (
              <Option key={college.code} value={college.code}>
                {college.name} ({college.code})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please enter a title" }]}>
          <Input className="notification-input" placeholder="Enter notification title" />
        </Form.Item>

        <Form.Item name="message" label="Message" rules={[{ required: true, message: "Please enter a message" }]}>
          <TextArea className="notification-input" placeholder="Enter notification message" rows={4} />
        </Form.Item>

        <Form.Item>
          <Button className="notification-button" type="primary" htmlType="submit" loading={loading} block>
            Send Notification
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SendNotification;
