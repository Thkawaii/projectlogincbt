import { PatientInterface } from "../../interfaces/IPatient";

const apiUrl = "http://localhost:8000";

export async function CreatPatient(data: PatientInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`${apiUrl}/patients/register`, requestOptions);
    const data = await response.json();
    return {
      status: response.ok,
      message: response.ok ? data.message : data.error,
    };
  } catch (error) {
    return {
      status: false,
      message: "An error occurred",
    };
  }
}
