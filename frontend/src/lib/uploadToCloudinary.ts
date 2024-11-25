import axios from "axios";

export async function uploadToCloudinary(file: File, preset: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);
  
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/diihvllmt/upload`,
      formData
    );
  
    return response.data.secure_url;
  }
  