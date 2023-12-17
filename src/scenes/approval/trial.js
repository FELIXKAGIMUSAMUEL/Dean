const getHostelData = () => {
    const url = 'https://groupa-backend.onrender.com/getHostelDetails';

    // Define the options for the fetch request
    const options = {
      method: 'GET',
      credentials:'include',
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