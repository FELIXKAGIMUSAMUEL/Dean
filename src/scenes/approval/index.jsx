import React, { useState, useEffect } from 'react';
import { Table,Button,Modal } from 'antd';
import Header from "../../components/Header";
import io from 'socket.io-client';
 
const Approval = () => {
  const [hostelData, setHostelData] = useState([])
  const [visible, setVisible] = useState(false); // State to control modal visibility
  const [currentRecord, setCurrentRecord] = useState(null); // State to store the current record
  const [actionButton,setActionButton]=useState('decline') 

  useEffect(() => {

    const getHostelData = () => {
      const url = 'https://groupa-backend.onrender.com/getHostelDetails';

      // Define the options for the fetch request
      const options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        }
      };

      // Use the fetch API to send the POST request
      fetch(url, options)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json(); // Parse the response as JSON
        })
        .then((data) => {
          // Handle the JSON response data as needed
          console.log('Response from server:', data);
          setHostelData(data)
        })
        .catch((error) => {
          console.error('Error:', error);
        });

    };

    getHostelData()

    const socket = io('https://groupa-backend.onrender.com', {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd"
      }
    });

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('newUserData', (newData) => {
      setHostelData(prevData => [...prevData, newData]);
      console.log(newData);
    });

    return () => {
      console.log('Cleaning up socket connection...');
      socket.disconnect();
      console.log('Socket connection cleaned up.');
    };

  }, [setHostelData]);


  const showAcceptModal = (record) => {
    setActionButton('activate')
    setCurrentRecord(record);
    setVisible(true);
  };

  const showDeclineModal = (record) => {
    setActionButton('decline')
    setCurrentRecord(record);
    setVisible(true);
  };

  const success = (data) => {
    Modal.success({
      content: data,
    });
  };
  
  const error = (data) => {
    Modal.error({
      title: 'Error message',
      content: data,
    });
  };

  const handleAccept = () => {
    setVisible(false);
    console.log('Accept clicked for:', currentRecord);
    const url = 'https://groupa-backend.onrender.com/activate';

    // Define the options for the fetch request
    const options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },      
      body: JSON.stringify(currentRecord), // Convert data to JSON
    };

    // Use the fetch API to send the POST request
    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          error('Network response was not ok')
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the response as JSON
      })
      .then((data) => {
        // Handle the JSON response data as needed
        console.log('Response from server:', data.message);
        removeItemByKey(currentRecord.key)
        success(data.message);
      })
      .catch((err) => {
        error('Unable to reach server!')
        console.error('Error:', err);
      });

  };
  
  const handleDecline = () => {
    setVisible(false);
    const url = 'https://groupa-backend.onrender.com/decline';

    // Define the options for the fetch request
    const options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },      
      body: JSON.stringify(currentRecord), // Convert data to JSON
    };

    // Use the fetch API to send the POST request
    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          error('Document doesn\'t exist')
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse the response as JSON
      })
      .then((data) => {
        // Handle the JSON response data as needed
        console.log('Response from server:', data.message);
        removeItemByKey(currentRecord.key)
        success(data.message);
      })
      .catch((err) => {
        error('Unable to reach server!')
        console.error('Error:', err);
      }); 
  };

  const removeItemByKey = (keyToRemove) => {
  
    setHostelData((prevData) => {
      const indexToRemove = prevData.findIndex((item) => {return item._id === keyToRemove});

      console.log(indexToRemove)

      if (indexToRemove !== -1) {
        const newData = [...prevData];
        newData.splice(indexToRemove, 1);

        return newData;
      }

      return prevData;
    });
  };
  
  
  
  useEffect(() => {
    console.log('After removal:', hostelData);
  }, [hostelData]);



  const handleModalCancel = () => {
    setVisible(false);
    return
  };

  const columns = [
    {
      title: 'HOSTEL NAME',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
      width: 250,
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
      key: 'email',
      width: 310,
    },
    {
      title: 'CONTACT',
      dataIndex: 'contact',
      key: 'contact',
      ellipsis: true,
    },
    {
      title: 'LICENSE',
      dataIndex: 'license',
      key: 'license',
      ellipsis: true,
    },
    {
      title: 'ACTION',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="primary" style={{ marginBottom: '2px' }} onClick={() => showAcceptModal(record)}>
            ACCEPT
          </Button>
          <Button type="primary" danger onClick={() => showDeclineModal(record)}>
            DECLINE
          </Button>
        </>
      ),
      width: 120,
    }
  ];
  const data = hostelData.map((dataItem, index) => ({
    key: dataItem._id, // Use a unique key for each entry
    activated:dataItem.activated,
    name: dataItem.hostelName,
    email: dataItem.email,
    contact: dataItem.contact,
    license: dataItem.license,
    accept: 'ACCEPT',
  }));

  // const App = () => <Table columns={columns} dataSource={data} />;
  return (
    <div>
      <Header title="Hostel Requests" />
      <Table columns={columns} dataSource={data} />
      <Modal
        title={`Are you sure you want to ${actionButton === 'activate' ? 'accept' : 'decline'} activation of ${currentRecord === null ? 'not defined':`${currentRecord.name}`}?`}
        open={visible}
        onOk={actionButton === 'activate' ? handleAccept : handleDecline}
        onCancel={handleModalCancel}
        okText="Yes"
        cancelText="No"
      ></Modal>
    </div>
  );
}
export default Approval;