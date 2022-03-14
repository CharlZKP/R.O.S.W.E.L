import Api from "./Api";
import { toast } from "@zerodevx/svelte-toast";
import { theme } from "../constants/toastTheme";

export async function kycGetInfo() {
  try {
    const response = await Api.get(`/kyc/info/get`);

    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function initial() {
  try {
    const response = await Api.post("/kyc/deliverer/register");
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function saveChange(idCardNumber, formData) {
  try {
    let response;
    if (idCardNumber != null || idCardNumber != "") {
      response = await Api.post("/kyc/idCardNo/edit", {
        idCardNo: idCardNumber,
      });

      if (!response.success) {
        toast.push(
          response.message || "ID Card Number update failed",
          theme.error
        );
      } else {
        toast.push("ID Card No. update success", theme.success);
      }
    }

    /*
		const files = new Array();
		for (let pair of formData.entries()) {
			files.push(pair);
		}

		console.log(files);
		*/

    response = await Api.post("/kyc/upload/all", formData, {
      "Content-Type": "multipart/form-data",
    });

    /*
		axios.defaults.withCredentials = true;
		axios
			.post("https://api.roswel-th.com/api/v1/kyc/upload/all", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((res) =>
			{
				console.log(res);
			});
		*/

    if (!response.success) {
      toast.push(response.message || "Image Upload failed", theme.error);
    } else {
      toast.push("Upload success", theme.success);
    }
  } catch (error) {
    console.log(error);
  }
}
