const jwtToken = localStorage.getItem("token"); // Retrieve token securely
const submitTicketForm = async (trainId: number, formData: any) => {
//   const {trainId} = useParams();

  try {
    const response = await fetch(`http://localhost:5100/tickets/book/${trainId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}-${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    console.log("token", jwtToken);
    
    throw error;
  }
};

export default submitTicketForm;