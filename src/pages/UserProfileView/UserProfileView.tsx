import React, { useEffect, useState } from "react";

// import "./Profile.css";
import TextInput from "../../pages/Inputs/TextInput";
import SelectInput from "../../pages/Inputs/SelectInput";
import CheckboxInput from "../../pages/Inputs/CheckboxInput";
import RadiobuttonInput from "../../pages/Inputs/RadiobuttonInput";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./UserProfileView.css";
import CryptoJS from "crypto-js";
import { Button } from "primereact/button";
import { TabPanel, TabView } from "primereact/tabview";
// import { ImUpload2 } from "react-icons/im";
// import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";

interface HealthProblemData {
  presentHealthProblem: Record<string, string>;
}

interface Condition {
  label: string;
  value: number;
  checked: number;
}

interface DecryptResult {
  [key: string]: any;
}

interface ModeOfContact {
  [key: number]: string;
}

interface UserProfileEditProps {
  refid: any;
  type?: any; // Adjust the type according to your use case, it can be `number` or `string` depending on what `refid` represents
}

const UserProfileView: React.FC<UserProfileEditProps> = ({ refid, type }) => {
  const decrypt = (
    encryptedData: string,
    iv: string,
    key: string
  ): DecryptResult => {
    // Create CipherParams with ciphertext
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(encryptedData),
    });

    // Perform decryption
    const decrypted = CryptoJS.AES.decrypt(
      cipherParams,
      CryptoJS.enc.Hex.parse(key),
      {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decryptedString);
  };
  const [conditions, setConditions] = useState<Condition[]>([]);
  const navigate = useNavigate();
  const handleCheckboxChange = (index: any) => {
    setConditions((prevConditions: any) =>
      prevConditions.map((condition: any, i: any) =>
        i === index
          ? { ...condition, checked: condition.checked === 1 ? 0 : 1 }
          : condition
      )
    );
  };
  // const editform = (event: string) => {
  //   setEdits({
  //     ...edits,
  //     [event]: true,
  //   });
  // };

  const [inputs, setInputs] = useState({
    profilefile: { contentType: "", content: "" },
    fname: "",
    lname: "",
    dob: "",
    age: "",
    gender: "",
    guardianname: "",
    maritalstatus: "",
    anniversarydate: "",
    qualification: "",
    occupation: "",
    peraddress: "",
    perpincode: "",
    perstate: "",
    percity: "",
    tempaddress: "",
    temppincode: "",
    tempstate: "",
    tempcity: "",
    email: "",
    phoneno: "",
    whatsappno: "",
    mode: "",
    height: "",
    weight: "",
    bloodgroup: "",
    bmi: "",
    bp: "",
    accidentdetails: "",
    breaksdetails: "",
    breaksotheractivities: "",
    genderalanything: "",
    pastother: "",
    pastmedicaldetails: "",
    caredoctorname: "",
    caredoctorhospital: "",
    backpainscale: "",
    therapydurationproblem: "",
    therapypasthistory: "",
    therapyfamilyhistory: "",
    therapyanythingelse: "",
    pancard: {
      content: "",
    },
    aadhar: {
      content: "",
    },
    certification: {
      content: "",
    },
    refTimeMembersId: "",
    refTimeMembers: "",
    refCustTimeId: "",
    refCustTimeData: "",
    refTime: "",
    refTimeId: "",
    refClassMode: "",
    branch: "",
  });

  const [edits, setEdits] = useState({
    personal: false,
    address: false,
    communitcation: false,
    gendrel: false,
    present: false,
    therapy: false,
    prof: false,
    session: false,
  });

  // const editform = (event: string) => {
  //   setEdits({
  //     ...edits,
  //     [event]: true,
  //   });
  // };

  const [options, setOptions] = useState({
    address: false,
    accident: false,
    breaks: false,
    care: false,
    backpain: false,
  });

  // const [userdata, setuserdata] = useState({
  //   username: "",
  //   usernameid: "",
  //   profileimg: { contentType: "", content: "" },
  // });

  // useEffect(() => {
  //   Axios.get(import.meta.env.VITE_API_URL + "/validateTokenData", {
  //     headers: {
  //       Authorization: localStorage.getItem("JWTtoken"),
  //       "Content-Type": "application/json",
  //     },
  //   }).then((res) => {
  //     const data = decrypt(
  //       res.data[1],
  //       res.data[0],
  //       import.meta.env.VITE_ENCRYPTION_KEY
  //     );

  //     localStorage.setItem("JWTtoken", "Bearer " + data.token + "");

  //     setuserdata({
  //       username:
  //         "" + data.data[0].refStFName + " " + data.data[0].refStLName + "",
  //       usernameid: data.data[0].refUserName,
  //       profileimg: data.profileFile,
  //     });

  //     console.log("Verify Token  Running --- ");
  //   });
  // }, []);

  const [_modeofcontact, setModeofContact] = useState<
    ModeOfContact | undefined
  >(undefined);

  const [employeeData, setEmployeeData] = useState({
    refExperence: "",
    refSpecialization: "",
  });
  interface MedDoc {
    refMedDocId: number;
    refStId: number;
    refMedDocName: string;
    refMedDocPath: string;
    refMedDocFile: {
      filename: string;
      content: string; // Base64 string
      contentType: string; // MIME type
    };
  }
  const [medDocData, setMedDocData] = useState<MedDoc[]>([]);

  const handlePreviewDocument = (dataArray: any, index: number) => {
    console.log("dataArray", dataArray);
    const file = dataArray[index]?.refMedDocFile;
    console.log("file", file);
    if (file) {
      try {
        const binaryContent = atob(file.content);
        const byteArray = new Uint8Array(binaryContent.length);
        for (let i = 0; i < binaryContent.length; i++) {
          byteArray[i] = binaryContent.charCodeAt(i);
        }

        const blob = new Blob([byteArray], { type: file.contentType });
        const url = URL.createObjectURL(blob);
        let content;
        if (file.contentType == "application/pdf") {
          content = `<iframe src="${url}" width="100%" height="450px" style="border: none;"></iframe>`;
        } else {
          content = `<img src="${url}" alt="Document Preview" style="max-width: 100%; max-height: 450px; object-fit: contain; display: block; margin: 0 auto;">`;
        }
        const targetDiv = document.getElementById("target-container");

        Swal.fire({
          title: "Medical Document Preview",
          html: `
          <div style="display: flex; justify-content:center;align-item:center;">     
          ${content} 
          </div>
            <div style="margin-top: 10px; text-align: center; width: 100%; display: flex; justify-content: center;">
              <a href="${url}" download="document.pdf" style="padding: 10px 20px; width: 80%; background-color: #f95005; color: white; text-decoration: none; border-radius: 4px; text-align: center;">
                Download
              </a>
            </div>
          `,
          showCloseButton: true,
          showConfirmButton: false,
          target: targetDiv,
          customClass: {
            title: "custom-title",
            popup: "custom-popup",
          },
        });
      } catch (error) {
        console.error("Error previewing document:", error);
      }
    } else {
      console.error("No file to preview");
    }
  };

  useEffect(() => {
    let url = "/user/profileData";

    if (type === "staff") {
      url = "/staff/ProfileData";
    }

    Axios.post(
      import.meta.env.VITE_API_URL + url,
      { refStId: parseInt(refid) },
      {
        headers: {
          Authorization: localStorage.getItem("JWTtoken"),
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      const data = decrypt(
        res.data[1],
        res.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      if (data.token == false) {
        navigate("/expired");
      }

      console.log("UserData Running --- ");
      console.log(data);

      localStorage.setItem("JWTtoken", "Bearer " + data.token + "");

      if (type === "staff") {
        setEmployeeData({
          refExperence: data.data.EmployeeData.refExperence,
          refSpecialization: data.data.EmployeeData.refSpecialization,
        });
      } else {
        const healthConditions = Object.entries(
          (data.data as HealthProblemData).presentHealthProblem
        ).map(
          ([value, label]): Condition => ({
            label, // Label as string
            value: Number(value), // Ensure value is a number
            checked: 0, // Default checked value
          })
        );

        const updatedConditions = healthConditions.map((condition) => {
          // Check if the condition value is in `presenthealth.refPresentHealth`
          if (
            data.data.presentHealth.refPresentHealth.includes(condition.value)
          ) {
            return {
              ...condition,
              checked: 1, // Set `checked` to 1 if value matches
            };
          }
          return condition; // Return as is if no match
        });

        // Step 3: Set the final updated conditions in state
        setConditions(updatedConditions);
      }

      // Step 2: Update the mapped conditions to set `checked` to 1 if value matches

      setModeofContact(data.data.modeOfCommunication);

      console.log(data.data);

      const personaldata = data.data.personalData;
      const addressdata = data.data.address;
      const communication = data.data.communication;
      const generalhealth = data.data.generalhealth;
      const presenthealth = data.data.presentHealth;
      const refSessionData = data.data.refSessionData;

      setOptions({
        ...options,
        address: addressdata.addresstype,
        accident: type === "staff" ? "" : generalhealth.refRecentInjuries,
        breaks: type === "staff" ? "" : generalhealth.refRecentFractures,
        care: type === "staff" ? "" : presenthealth.refUnderPhysicalCare,
        backpain:
          type === "staff"
            ? false
            : presenthealth.refBackPain === "no"
            ? false
            : true,
      });

      setInputs({
        profilefile: data.data.profileFile,
        fname: personaldata.refStFName,
        lname: personaldata.refStLName,
        dob: personaldata.refStDOB,
        age: personaldata.refStAge,
        gender: personaldata.refStSex,
        maritalstatus: personaldata.refMaritalStatus,
        anniversarydate: personaldata.refWeddingDate,
        guardianname: personaldata.refguardian,
        qualification: personaldata.refQualification,
        occupation: personaldata.refOccupation,
        peraddress: addressdata.refAdAdd1,
        perpincode: addressdata.refAdPincode1,
        perstate: addressdata.refAdState1,
        percity: addressdata.refAdCity1,
        tempaddress: addressdata.addresstype
          ? addressdata.refAdAdd1
          : addressdata.refAdAdd2,
        temppincode: addressdata.addresstype
          ? addressdata.refAdPincode1
          : addressdata.refAdPincode2,
        tempstate: addressdata.addresstype
          ? addressdata.refAdState1
          : addressdata.refAdState2,
        tempcity: addressdata.addresstype
          ? addressdata.refAdCity1
          : addressdata.refAdCity2,
        branch: personaldata.refBranchId,
        email: communication.refCtEmail,
        phoneno: communication.refCtMobile,
        whatsappno: communication.refCtWhatsapp,
        mode: communication.refUcPreference,
        height: type === "staff" ? "" : generalhealth.refHeight,
        weight: type === "staff" ? "" : generalhealth.refWeight,
        bloodgroup: type === "staff" ? "" : generalhealth.refBlood,
        bmi: type === "staff" ? "" : generalhealth.refBMI,
        bp: type === "staff" ? "" : generalhealth.refBP,
        accidentdetails:
          type === "staff" ? "" : generalhealth.refRecentInjuriesReason,
        breaksdetails:
          type === "staff" ? "" : generalhealth.refRecentFracturesReason,
        breaksotheractivities: type === "staff" ? "" : generalhealth.refOthers,
        genderalanything: type === "staff" ? "" : generalhealth.refElse,
        pastother: type === "staff" ? "" : presenthealth.refPastHistory,
        pastmedicaldetails:
          type === "staff" ? "" : presenthealth.refMedicalDetails,
        caredoctorname: type === "staff" ? "" : presenthealth.refDoctor,
        caredoctorhospital: type === "staff" ? "" : presenthealth.refHospital,
        backpainscale: type === "staff" ? "" : presenthealth.refBackPain,
        therapydurationproblem:
          type === "staff" ? "" : presenthealth.refProblem,
        therapypasthistory:
          type === "staff" ? "" : presenthealth.refPastHistory,
        therapyfamilyhistory:
          type === "staff" ? "" : presenthealth.refFamilyHistory,
        therapyanythingelse:
          type === "staff" ? "" : presenthealth.refAnythingelse,
        pancard: data.data.employeeDocuments
          ? data.data.employeeDocuments.panCard
          : "",
        aadhar: data.data.employeeDocuments
          ? data.data.employeeDocuments.AadharCard
          : "",
        certification: data.data.employeeDocuments
          ? data.data.employeeDocuments.Certification
          : "",
        refTimeMembersId:
          type === "staff" ? "" : refSessionData.refTimeMembersId,
        refTimeMembers: type === "staff" ? "" : refSessionData.refTimeMembers,
        refCustTimeId: type === "staff" ? "" : refSessionData.refCustTimeId,
        refCustTimeData: type === "staff" ? "" : refSessionData.refCustTimeData,
        refTime: type === "staff" ? "" : refSessionData.refTime,
        refTimeId: type === "staff" ? "" : refSessionData.refTimeId,
        refClassMode: type === "staff" ? "" : refSessionData.refClassMode,
      });
      if (data.Documents && Array.isArray(data.Documents)) {
        setMedDocData(data.Documents);
      }
    });
  }, []);

  // const [loading, setLoading] = useState({
  //   changeimg: false,
  // });
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle the file input change
  // const handleImageChange = async (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setLoading({
  //     ...loading,
  //     changeimg: true,
  //   });
  //   const file = event.target.files?.[0] || null;

  //   if (file) {
  //     handleImageUpload(file); // Pass the file directly to the upload function
  //   }
  // };

  // Handle the image upload
  // const handleImageUpload = async (file: any) => {
  //   if (!file) {
  //     setLoading({
  //       ...loading,
  //       changeimg: false,
  //     });
  //     alert("Please select an image first.");
  //     return;
  //   }

  //   try {
  //     const response = await Axios.post(
  //       import.meta.env.VITE_API_URL + "/director/addEmployeeDocument",
  //       { file: file },
  //       {
  //         headers: {
  //           Authorization: localStorage.getItem("JWTtoken"),
  //           "Content-Type": "multipart/form-data", // Set content type to form-data
  //         },
  //       }
  //     );

  //     const data = decrypt(
  //       response.data[1],
  //       response.data[0],
  //       import.meta.env.VITE_ENCRYPTION_KEY
  //     );

  //     console.log(data);

  //     setInputs({
  //       ...inputs,
  //       profilefile: data.filePath,
  //     });

  //     setuserdata({
  //       ...userdata,
  //       profileimg: data.filePath,
  //     });

  //     setLoading({
  //       ...loading,
  //       changeimg: false,
  //     });

  //     console.log("Image uploaded successfully:", data);
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //   }
  // };

  const calculateAge = (dob: string) => {
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDifference = today.getMonth() - dobDate.getMonth();

    // Adjust age if the birthday hasn't occurred this year yet
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < dobDate.getDate())
    ) {
      age--;
    }

    return age.toString(); // Return age as a string
  };

  const handleInputVal = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    // Update inputs
    setInputs((prevInputs) => {
      const updatedInputs = {
        ...prevInputs,
        [name]: value,
      };

      // If the address option is enabled, update temporary address fields
      if (options.address) {
        updatedInputs.tempaddress = prevInputs.peraddress;
        updatedInputs.temppincode = prevInputs.perpincode;
        updatedInputs.tempcity = prevInputs.percity;
        updatedInputs.tempstate = prevInputs.perstate;
      }

      // If the input is for DOB, calculate the age
      if (name === "dob") {
        const calculatedAge = calculateAge(value);
        updatedInputs.age = calculatedAge;
      } else if (name === "maritalstatus") {
        if (value === "single") {
          updatedInputs.anniversarydate = "";
        }
      }

      return updatedInputs; // Return the updated inputs
    });
  };

  const handlesubmitaddress = () => {
    Axios.post(
      import.meta.env.VITE_API_URL + "/staff/userDataUpdate",
      {
        refStId: refid,
        address: {
          addresstype: options.address,
          refAdAdd1: inputs.peraddress,
          refAdArea1: "",
          refAdCity1: inputs.percity,
          refAdState1: inputs.perstate,
          refAdPincode1: parseInt(inputs.perpincode),
          refAdAdd2: inputs.tempaddress,
          refAdArea2: "",
          refAdCity2: inputs.tempcity,
          refAdState2: inputs.tempstate,
          refAdPincode2: parseInt(inputs.temppincode),
        },
      },
      {
        headers: {
          Authorization: localStorage.getItem("JWTtoken"),
          "Content-Type": "application/json", // Ensure the content type is set
        },
      }
    )
      .then((res) => {
        const data = decrypt(
          res.data[1],
          res.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );

        console.log(data.success);

        if (data.success) {
          setEdits({
            ...edits,
            address: false,
          });
        }
      })
      .catch((err) => {
        // Catching any 400 status or general errors
        console.log("Error: ", err);
      });
  };

  const handlepersonalinfo = () => {
    Axios.post(
      import.meta.env.VITE_API_URL + "/staff/userDataUpdate",
      {
        refStId: refid,
        personalData: {
          refOccupation: inputs.occupation,
          refQualification: inputs.qualification,
          refStAge: parseInt(inputs.age),
          refStDOB: new Date(inputs.dob),
          refStFName: inputs.fname,
          refStLName: inputs.lname,
          refStSex: inputs.gender,
          refguardian: inputs.guardianname,
          refMaritalStatus: inputs.maritalstatus,
          refWeddingDate: inputs.anniversarydate ? inputs.anniversarydate : "",
        },
      },
      {
        headers: {
          Authorization: localStorage.getItem("JWTtoken"),
          "Content-Type": "application/json", // Ensure the content type is set
        },
      }
    )
      .then((res) => {
        const data = decrypt(
          res.data[1],
          res.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );

        console.log(data);

        if (data.success) {
          setEdits({
            ...edits,
            personal: false,
          });
        }
      })
      .catch((err) => {
        // Catching any 400 status or general errors
        console.log("Error: ", err);
      });
  };

  const handlecommunicationtype = () => {
    Axios.post(
      import.meta.env.VITE_API_URL + "/staff/userDataUpdate",

      {
        refStId: refid,
        communication: {
          refCtEmail: inputs.email,
          refCtMobile: inputs.phoneno,
          refCtWhatsapp: inputs.whatsappno,
          refUcPreference: inputs.mode,
        },
      },
      {
        headers: {
          Authorization: localStorage.getItem("JWTtoken"),
          "Content-Type": "application/json", // Ensure the content type is set
        },
      }
    )
      .then((res) => {
        const data = decrypt(
          res.data[1],
          res.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );

        console.log(data.success);

        if (data.success) {
          setEdits({
            ...edits,
            communitcation: false,
          });
        }
      })
      .catch((err) => {
        // Catching any 400 status or general errors
        console.log("Error: ", err);
      });
  };

  const handlegenderalhealth = () => {
    Axios.post(
      import.meta.env.VITE_API_URL + "/staff/userDataUpdate",

      {
        refStId: refid,
        generalhealth: {
          refBMI: inputs.bmi,
          refBP: inputs.bp,
          refBlood: inputs.bloodgroup,
          refElse: inputs.genderalanything,
          refHeight: parseInt(inputs.height),
          refOthers: inputs.breaksotheractivities,
          refRecentFractures: options.breaks,
          refRecentFracturesReason: inputs.breaksdetails,
          refRecentInjuries: options.accident,
          refRecentInjuriesReason: inputs.accidentdetails,
          refWeight: parseInt(inputs.weight),
        },
      },
      {
        headers: {
          Authorization: localStorage.getItem("JWTtoken"),
          "Content-Type": "application/json", // Ensure the content type is set
        },
      }
    )
      .then((res) => {
        const data = decrypt(
          res.data[1],
          res.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );

        console.log(data.success);

        if (data.success) {
          setEdits({
            ...edits,
            gendrel: false,
          });
        }
      })
      .catch((err) => {
        // Catching any 400 status or general errors
        console.log("Error: ", err);
      });
  };

  const handlepresenthealth = () => {
    let updatedHealthProblem: any[] = [];
    conditions.forEach((element) => {
      if (element.checked === 1) {
        updatedHealthProblem.push(element.value);
      }
    });

    Axios.post(
      import.meta.env.VITE_API_URL + "/staff/userDataUpdate",

      {
        refStId: refid,
        presentHealth: {
          refBackpain: inputs.backpainscale,
          refDrName: inputs.caredoctorname,
          refHospital: inputs.caredoctorhospital,
          refMedicalDetails: inputs.pastmedicaldetails,
          refOtherActivities: inputs.pastother,
          refPresentHealth: updatedHealthProblem,
          refUnderPhysCare: options.care,
        },
      },
      {
        headers: {
          Authorization: localStorage.getItem("JWTtoken"),
          "Content-Type": "application/json", // Ensure the content type is set
        },
      }
    )
      .then((res) => {
        const data = decrypt(
          res.data[1],
          res.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );

        console.log(data.success);

        if (data.success) {
          setEdits({
            ...edits,
            present: false,
          });
        }
      })
      .catch((err) => {
        // Catching any 400 status or general errors
        console.log("Error: ", err);
      });
  };

  // const handletherapy = () => {
  //   let updatedHealthProblem: any[] = [];
  //   conditions.forEach((element) => {
  //     if (element.checked === 1) {
  //       updatedHealthProblem.push(element.value);
  //     }
  //   });

  //   Axios.post(
  //     import.meta.env.VITE_API_URL + "/staff/userDataUpdate",

  //     {
  //       refStId: refid,
  //       presentHealth: {
  //         refBackpain: inputs.backpainscale,
  //         refDrName: inputs.caredoctorname,
  //         refHospital: inputs.caredoctorhospital,
  //         refMedicalDetails: inputs.pastmedicaldetails,
  //         refOtherActivities: inputs.pastother,
  //         refPresentHealth: updatedHealthProblem,
  //         refUnderPhysCare: options.care,
  //         refAnythingelse: inputs.therapyanythingelse,
  //         refFamilyHistory: inputs.therapyfamilyhistory,
  //         refProblem: inputs.therapydurationproblem,
  //         refPastHistory: inputs.therapypasthistory,
  //       },
  //     },
  //     {
  //       headers: {
  //         Authorization: localStorage.getItem("JWTtoken"),
  //         "Content-Type": "application/json", // Ensure the content type is set
  //       },
  //     }
  //   )
  //     .then((res) => {
  //       const data = decrypt(
  //         res.data[1],
  //         res.data[0],
  //         import.meta.env.VITE_ENCRYPTION_KEY
  //       );

  //       console.log(data.success);

  //       if (data.success) {
  //         setEdits({
  //           ...edits,
  //           therapy: false,
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       // Catching any 400 status or general errors
  //       console.log("Error: ", err);
  //     });
  // };
  // interface MemOption {
  //   [key: number]: string; // This allows numeric keys with string values
  // }
  interface Option {
    value: string;
    label: string;
  }
  const [memberListOption, setMemberListOption] = useState<Option[]>([]);
  const sessionEditModule = () => {
    setSessionEdit(true);
    Axios.post(
      import.meta.env.VITE_API_URL + "/profile/MemberList",

      {
        refAge: inputs.age,
        branchId: inputs.branch,
      },
      {
        headers: {
          Authorization: localStorage.getItem("JWTtoken"),
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        const data = decrypt(
          res.data[1],
          res.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );
        console.log("data", data.data);
        if (data.success) {
          const transformedOptions = Object.entries(data.data).map(
            ([key, value]) => ({
              value: key,
              label: value as string,
            })
          );
          setMemberListOption(transformedOptions);

          Axios.post(
            import.meta.env.VITE_API_URL + "/profile/MemberList",
      
            {
              refAge: inputs.age,
              branchId: inputs.branch,
            },
            {
              headers: {
                Authorization: localStorage.getItem("JWTtoken"),
                "Content-Type": "application/json",
              },
            }
          )
        }
        console.log("memberListOption", memberListOption);
      })
      .catch((err) => {
        // Catching any 400 status or general errors
        console.log("Error: ", err);
      });
  };

  const [_sessionEdit, setSessionEdit] = useState(false);
  return (
    <>
      <div className="bg-[#fff]" id="target-container">
        <div className="py-1" />

        <TabView>
          <TabPanel header="Profile">
            <div className="">
              {/* Personal Information */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handlepersonalinfo();
                }}
              >
                <div className="basicProfileCont p-10 shadow-lg">
                  <div className="w-[100%] flex justify-between items-center mb-5">
                    <div className="text-[1.2rem] lg:text-[25px] font-bold">
                      Personal Information
                    </div>
                    {/* {edits.personal ? (
                  <button
                    className="text-[15px] outline-none py-2 border-none px-3 bg-[#f95005] font-bold cursor-pointer text-white rounded"
                    type="submit"
                  >
                    Save&nbsp;&nbsp;
                    <i className="text-[15px] pi pi-check"></i>
                  </button>
                ) : (
                  <div
                    onClick={() => {
                      editform("personal");
                    }}
                    className="text-[15px] py-2 px-3 bg-[#f95005] font-bold cursor-pointer text-[#fff] rounded"
                  >
                    Edit&nbsp;&nbsp;
                    <i className="text-[15px] pi pi-pen-to-square"></i>
                  </div>
                )} */}
                  </div>
                  <div className="w-[100%] flex flex-col gap-y-10 justify-center items-center">
                    <div className="w-[100%] mb-10 lg:mb-0 lg:w-[30%] flex flex-col justify-center lg:justify-start items-center lg:items-start">
                      {!inputs.profilefile ? (
                        <div className="w-[250px] border-[#b3b4b6] cursor-pointer rounded-full flex justify-center items-center border-2 h-[250px]">
                          <i className="text-[150px] text-[#858585] pi pi-user"></i>
                        </div>
                      ) : (
                        <div className="w-[250px] border-[#b3b4b6] cursor-pointer rounded-full flex justify-center items-center border-2 h-[250px]">
                          <img
                            id="userprofileimg"
                            className="w-[250px] h-[250px] object-cover rounded-full"
                            src={`data:${inputs.profilefile.contentType};base64,${inputs.profilefile.content}`}
                            alt=""
                          />
                        </div>
                      )}

                      {/* <div className="w-[250px] flex flex-col justify-center items-center">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept="image/png, image/jpeg" // Only accept PNG and JPG
                      onChange={handleImageChange} // Handle file change
                    />

                    {loading.changeimg ? (
                      <label className="w-[250px] bg-[#f95005] hover:bg-[#e14b04] focus:outline-none border-none py-2 px-4 rounded font-normal text-white text-[1.2rem] lg:text-[18px] text-center mt-4 cursor-pointer">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-labelledby="title-04a desc-04a"
                          aria-live="polite"
                          aria-busy="true"
                          className="w-[14px] h-[14px] animate animate-spin"
                        >
                          <title id="title-04a">Icon title</title>
                          <desc id="desc-04a">Some desc</desc>
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            className="stroke-grey-200"
                            stroke-width="4"
                          />
                          <path
                            d="M12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 9.34784 20.9464 6.8043 19.0711 4.92893C17.1957 3.05357 14.6522 2 12 2"
                            className="stroke-white"
                            stroke-width="4"
                          />
                        </svg>
                      </label>
                    ) : (
                      <label
                        htmlFor="file-upload"
                        className="w-[250px] bg-[#f95005] hover:bg-[#e14b04] focus:outline-none border-none py-2 px-4 rounded font-normal text-white text-[1.2rem] lg:text-[18px] text-center mt-4 cursor-pointer"
                      >
                        Change Image
                      </label>
                    )}
                  </div> */}
                    </div>
                    <div className="w-[100%] lg:w-[100%] flex flex-col justify-center items-center">
                      <div className="w-[100%] justify-center items-center flex flex-col">
                        <div className="w-[100%] flex justify-between mb-[20px]">
                          <div className="w-[48%]">
                            <TextInput
                              label="First Name *"
                              name="fname"
                              id="fname"
                              type="text"
                              onChange={handleInputVal}
                              value={inputs.fname}
                              readonly={!edits.personal}
                              required
                            />
                          </div>
                          <div className="w-[48%]">
                            <TextInput
                              label="Last Name *"
                              name="lname"
                              id="lname"
                              type="text"
                              onChange={handleInputVal}
                              value={inputs.lname}
                              readonly={!edits.personal}
                              required
                            />
                          </div>
                        </div>

                        <div className="w-[100%] flex justify-between mb-[20px]">
                          <div className="w-[48%]">
                            <TextInput
                              label="Date of Birth *"
                              name="dob"
                              id="dob"
                              type="date"
                              onChange={handleInputVal}
                              value={inputs.dob}
                              readonly={!edits.personal}
                              required
                            />
                          </div>
                          <div className="w-[48%]">
                            <TextInput
                              label="Age *"
                              name="age"
                              id="age"
                              type="number"
                              value={inputs.age}
                              readonly
                              required
                            />
                          </div>
                        </div>

                        <div className="w-[100%] flex flex-col md:flex-row gap-y-[20px] justify-between mb-[20px]">
                          <div className="w-[100%] md:w-[48%] lg:w-[48%]">
                            <SelectInput
                              id="gender"
                              name="gender"
                              label="Gender *"
                              value={inputs.gender}
                              disabled={!edits.personal}
                              onChange={handleInputVal}
                              options={[
                                { value: "male", label: "Male" },
                                { value: "female", label: "Female" },
                              ]}
                              required
                            />
                          </div>
                          <div className="w-[100%] md:w-[48%] lg:w-[48%]">
                            <TextInput
                              label="Father / Husband Name *"
                              name="guardianname"
                              id="guardianname"
                              type="text"
                              onChange={handleInputVal}
                              value={inputs.guardianname}
                              readonly={!edits.personal}
                              required
                            />
                          </div>
                        </div>

                        <div className="w-[100%] flex flex-col md:flex-row gap-y-[20px] justify-between mb-[20px]">
                          <div className="w-[100%] md:w-[48%] lg:w-[48%]">
                            <SelectInput
                              id="maritalstatus"
                              name="maritalstatus"
                              label="Marital Status *"
                              value={inputs.maritalstatus}
                              onChange={handleInputVal}
                              options={[
                                { value: "single", label: "Single" },
                                { value: "married", label: "Married" },
                              ]}
                              disabled={!edits.personal}
                              required
                            />
                          </div>
                          <div className="w-[100%] md:w-[48%] lg:w-[48%]">
                            <TextInput
                              label="Anniversary Date *"
                              name="anniversarydate"
                              id="anniversarydate"
                              type="date"
                              onChange={handleInputVal}
                              disabled={
                                inputs.maritalstatus === "married"
                                  ? false
                                  : true
                              }
                              readonly={!edits.personal}
                              value={inputs.anniversarydate}
                              required
                            />
                          </div>
                        </div>

                        <div className="w-[100%] flex justify-between">
                          <div
                            className={
                              type === "staff" ? "w-[100%]" : "w-[48%]"
                            }
                          >
                            <TextInput
                              label="Qualification *"
                              name="qualification"
                              id="qualification"
                              type="text"
                              onChange={handleInputVal}
                              value={inputs.qualification}
                              readonly={!edits.personal}
                              required
                            />
                          </div>
                          {type === "staff" ? null : (
                            <div className="w-[48%]">
                              <TextInput
                                label="Occupation *"
                                name="occupation"
                                id="Occupation"
                                type="text"
                                onChange={handleInputVal}
                                value={inputs.occupation}
                                readonly={!edits.personal}
                                required
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              {/* Address */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handlesubmitaddress();
                }}
              >
                <div className="basicProfileCont p-10 shadow-lg mt-10">
                  <div className="w-[100%] flex justify-between items-center mb-5">
                    <div className="text-[1.2rem] lg:text-[25px] font-bold">
                      Address
                    </div>
                    {/* {edits.address ? (
                  <button
                    className="text-[15px] outline-none py-2 border-none px-3 bg-[#f95005] font-bold cursor-pointer text-white rounded"
                    type="submit"
                  >
                    Save&nbsp;&nbsp;
                    <i className="text-[15px] pi pi-check"></i>
                  </button>
                ) : (
                  <div
                    onClick={() => {
                      editform("address");
                    }}
                    className="text-[15px] py-2 px-3 bg-[#f95005] font-bold cursor-pointer text-[#fff] rounded"
                  >
                    Edit&nbsp;&nbsp;
                    <i className="text-[15px] pi pi-pen-to-square"></i>
                  </div>
                )} */}
                  </div>
                  <div className="w-[100%] flex justify-center items-center">
                    <div className="w-[100%] justify-center items-center flex flex-col">
                      <div className="text-[1.2rem] lg:text-[25px] font-bold mb-5">
                        Permanent Address
                      </div>
                      <div className="w-[100%] flex flex-col md:flex-row gap-y-[20px] justify-between mb-[20px]">
                        <div className="w-[100%] md:w-[48%]">
                          <TextInput
                            label="Residential  Address *"
                            name="peraddress"
                            id="peraddress"
                            type="text"
                            onChange={handleInputVal}
                            value={inputs.peraddress}
                            readonly={!edits.address}
                            required
                          />
                        </div>
                        <div className="w-[100%] md:w-[48%]">
                          <TextInput
                            label="Pincode *"
                            name="perpincode"
                            id="perpincode"
                            type="number"
                            onChange={handleInputVal}
                            value={inputs.perpincode}
                            readonly={!edits.address}
                            required
                          />
                        </div>
                      </div>

                      <div className="w-[100%] flex justify-between mb-[20px]">
                        <div className="w-[48%]">
                          <TextInput
                            label="State *"
                            name="perstate"
                            id="perstate"
                            type="text"
                            onChange={handleInputVal}
                            value={inputs.perstate}
                            readonly={!edits.address}
                            required
                          />
                        </div>
                        <div className="w-[48%]">
                          <TextInput
                            label="City *"
                            name="percity"
                            id="percity"
                            type="text"
                            onChange={handleInputVal}
                            value={inputs.percity}
                            readonly={!edits.address}
                            required
                          />
                        </div>
                      </div>

                      <div className="w-[100%]">
                        <CheckboxInput
                          id="bothaddress"
                          label="Use Communication Address & Permanent Address as Same."
                          checked={options.address}
                          onChange={() => {
                            setOptions({
                              ...options,
                              address: !options.address,
                            });

                            if (!options.address) {
                              setInputs({
                                ...inputs,
                                tempaddress: inputs.peraddress,
                                temppincode: inputs.perpincode,
                                tempstate: inputs.perstate,
                                tempcity: inputs.percity,
                              });
                            } else {
                              setInputs({
                                ...inputs,
                                tempaddress: "",
                                temppincode: "",
                                tempstate: "",
                                tempcity: "",
                              });
                            }
                          }}
                          readonly={!edits.address}
                        />
                      </div>

                      <div className="text-[1.2rem] lg:text-[25px] font-bold mb-5">
                        Communication Address
                      </div>
                      <div className="w-[100%] flex flex-col md:flex-row gap-y-[20px] justify-between mb-[20px]">
                        <div className="w-[100%] md:w-[48%]">
                          <TextInput
                            label="Residential  Address *"
                            name="tempaddress"
                            id="tempaddress"
                            type="text"
                            onChange={handleInputVal}
                            value={inputs.tempaddress}
                            readonly={!edits.address}
                            required
                          />
                        </div>
                        <div className="w-[100%] md:w-[48%]">
                          <TextInput
                            label="Pincode *"
                            name="temppincode"
                            id="temppincode"
                            type="number"
                            onChange={handleInputVal}
                            value={inputs.temppincode}
                            readonly={!edits.address}
                            required
                          />
                        </div>
                      </div>

                      <div className="w-[100%] flex justify-between">
                        <div className="w-[48%]">
                          <TextInput
                            label="State *"
                            name="tempstate"
                            id="perstate"
                            type="text"
                            onChange={handleInputVal}
                            value={inputs.tempstate}
                            readonly={!edits.address}
                            required
                          />
                        </div>
                        <div className="w-[48%]">
                          <TextInput
                            label="City *"
                            name="tempcity"
                            id="tempcity"
                            type="text"
                            onChange={handleInputVal}
                            value={inputs.tempcity}
                            readonly={!edits.address}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              {/* Communication Type */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handlecommunicationtype();
                }}
              >
                <div className="basicProfileCont p-10 shadow-lg mt-10">
                  <div className="w-[100%] flex justify-between items-center mb-5">
                    <div className="text-[1rem] lg:text-[25px] font-bold">
                      Communication Type
                    </div>
                    {/* {edits.communitcation ? (
                  <button
                    className="text-[15px] outline-none py-2 border-none px-3 bg-[#f95005] font-bold cursor-pointer text-white rounded"
                    type="submit"
                  >
                    Save&nbsp;&nbsp;
                    <i className="text-[15px] pi pi-check"></i>
                  </button>
                ) : (
                  <div
                    onClick={() => {
                      editform("communitcation");
                    }}
                    className="text-[15px] py-2 px-3 bg-[#f95005] font-bold cursor-pointer text-[#fff] rounded"
                  >
                    Edit&nbsp;&nbsp;
                    <i className="text-[15px] pi pi-pen-to-square"></i>
                  </div>
                )} */}
                  </div>
                  <div className="w-[100%] flex flex-col justify-center items-center">
                    <div className="w-[100%] flex justify-between mb-[20px]">
                      <div className="w-[100%]">
                        <TextInput
                          label="E-Mail *"
                          name="email"
                          id="email"
                          type="email"
                          onChange={handleInputVal}
                          value={inputs.email}
                          readonly={!edits.communitcation}
                          required
                        />
                      </div>
                    </div>
                    <div className="w-[100%] flex flex-col md:flex-row gap-y-[20px] justify-between mb-[20px]">
                      <div className="w-[100%] md:w-[48%]">
                        <TextInput
                          label="Phone Number *"
                          name="phoneno"
                          id="phoneno"
                          type="number"
                          onChange={handleInputVal}
                          value={inputs.phoneno}
                          readonly={!edits.communitcation}
                          required
                        />
                      </div>
                      <div className="w-[100%] md:w-[48%] flex justify-between">
                        <div className="w-[65%] md:w-[100%]">
                          <TextInput
                            label="WhatsApp Number *"
                            name="whatsappno"
                            id="whatsappno"
                            type="number"
                            onChange={handleInputVal}
                            value={inputs.whatsappno}
                            readonly={!edits.communitcation}
                            required
                          />
                        </div>
                        {/* <div
                      className="w-[30%] md:w-[18%] text-[0.7rem] lg:text-[14px] flex justify-center items-center text-center bg-[#f95005] font-bold cursor-pointer text-[#fff] rounded"
                      onClick={() => {
                        if (edits.communitcation) {
                          setInputs({
                            ...inputs,
                            whatsappno: inputs.phoneno,
                          });
                        } else {
                          console.log("Edit Disabled");
                        }
                      }}
                    >
                      Use Same Number
                    </div> */}
                      </div>
                    </div>

                    {/* <div className="w-[100%] ">
                      <SelectInput
                        id="modeofcontact"
                        name="mode"
                        label="Mode of Contact *"
                        value={inputs.mode}
                        onChange={handleInputVal}
                        options={
                          modeofcontact
                            ? Object.entries(modeofcontact).map(
                                ([value, label]) => ({
                                  value, // The key as value
                                  label, // The value as label
                                })
                              )
                            : [] // Empty array before the data is loaded
                        }
                        disabled={!edits.communitcation}
                        required
                      />
                    </div> */}
                  </div>
                </div>
              </form>

              {type === "staff" ? (
                <>
                  <div className="basicProfileCont mt-10 p-[20px] lg:p-[40px] shadow-lg">
                    <div className="w-[100%] flex justify-between items-center mb-5">
                      <div className="text-[1rem] lg:text-[25px] font-bold">
                        Documentation
                      </div>
                    </div>
                    <div className="w-[100%] flex flex-col justify-center items-center">
                      <div className="w-[100%] flex flex-col lg:flex-row gap-3 justify-between mb-[20px]">
                        <div className="w-[100%] lg:w-[30%]">
                          <div className="w-[100%] flex flex-col gap-1">
                            <label className="text-[14px] text-[#f95005] font-medium font-mont leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Aadhaar Card *
                            </label>
                            {inputs.aadhar ? (
                              <Button
                                type="button"
                                severity="success"
                                onClick={() => {
                                  // Assuming `content` is your base64 string for the PDF file
                                  const content = inputs.aadhar.content;
                                  const filename = "AadhaarCard.pdf";

                                  // Decode base64 to binary and create a Blob
                                  const byteCharacters = atob(content);
                                  const byteNumbers = new Array(
                                    byteCharacters.length
                                  );
                                  for (
                                    let i = 0;
                                    i < byteCharacters.length;
                                    i++
                                  ) {
                                    byteNumbers[i] =
                                      byteCharacters.charCodeAt(i);
                                  }
                                  const byteArray = new Uint8Array(byteNumbers);
                                  const blob = new Blob([byteArray], {
                                    type: "application/pdf",
                                  });

                                  // Create a download link and trigger it
                                  const link = document.createElement("a");
                                  link.href = URL.createObjectURL(blob);
                                  link.download = filename;
                                  link.click();

                                  // Release memory
                                  URL.revokeObjectURL(link.href);
                                }}
                                label="Download"
                              />
                            ) : (
                              <label>No Documents Upload</label>
                            )}
                          </div>
                        </div>

                        <div className="w-[100%] lg:w-[30%]">
                          <div className="w-[100%] flex flex-col gap-1">
                            <label className="text-[14px] text-[#f95005] font-medium font-mont leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Pan Card *
                            </label>
                            {inputs.pancard ? (
                              <Button
                                type="button"
                                severity="success"
                                onClick={() => {
                                  // Assuming `content` is your base64 string for the PDF file
                                  const content = inputs.pancard.content;
                                  const filename = "PanCard.pdf";

                                  // Decode base64 to binary and create a Blob
                                  const byteCharacters = atob(content);
                                  const byteNumbers = new Array(
                                    byteCharacters.length
                                  );
                                  for (
                                    let i = 0;
                                    i < byteCharacters.length;
                                    i++
                                  ) {
                                    byteNumbers[i] =
                                      byteCharacters.charCodeAt(i);
                                  }
                                  const byteArray = new Uint8Array(byteNumbers);
                                  const blob = new Blob([byteArray], {
                                    type: "application/pdf",
                                  });

                                  // Create a download link and trigger it
                                  const link = document.createElement("a");
                                  link.href = URL.createObjectURL(blob);
                                  link.download = filename;
                                  link.click();

                                  // Release memory
                                  URL.revokeObjectURL(link.href);
                                }}
                                label="Download"
                              />
                            ) : (
                              <label>No Documents Upload</label>
                            )}
                          </div>
                        </div>

                        <div className="w-[100%] lg:w-[30%]">
                          <div className="w-[100%] flex flex-col gap-1">
                            <label className="text-[14px] text-[#f95005] font-medium font-mont leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Certification *
                            </label>
                            {inputs.certification ? (
                              <Button
                                type="button"
                                severity="success"
                                onClick={() => {
                                  // Assuming `content` is your base64 string for the PDF file
                                  const content = inputs.certification.content;
                                  const filename = "Certification.pdf";

                                  // Decode base64 to binary and create a Blob
                                  const byteCharacters = atob(content);
                                  const byteNumbers = new Array(
                                    byteCharacters.length
                                  );
                                  for (
                                    let i = 0;
                                    i < byteCharacters.length;
                                    i++
                                  ) {
                                    byteNumbers[i] =
                                      byteCharacters.charCodeAt(i);
                                  }
                                  const byteArray = new Uint8Array(byteNumbers);
                                  const blob = new Blob([byteArray], {
                                    type: "application/pdf",
                                  });

                                  // Create a download link and trigger it
                                  const link = document.createElement("a");
                                  link.href = URL.createObjectURL(blob);
                                  link.download = filename;
                                  link.click();

                                  // Release memory
                                  URL.revokeObjectURL(link.href);
                                }}
                                label="Download"
                              />
                            ) : (
                              <label>No Documents Upload</label>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="basicProfileCont mt-10 p-[20px] lg:p-[40px] shadow-lg">
                    <div className="w-[100%] flex justify-between items-center mb-5">
                      <div className="text-[1rem] lg:text-[25px] font-bold">
                        Professional Experience
                      </div>
                      {/* {edits.prof ? (
                    <div
                      className="text-[15px] py-2 px-3 bg-[#f95005] font-bold cursor-pointer text-[#fff] rounded"
                      // onClick={handleprof}
                    >
                      Save&nbsp;&nbsp;
                      <i className="text-[15px] pi pi-check"></i>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        editform("prof");
                      }}
                      className="text-[15px] py-2 px-3 bg-[#f95005] font-bold cursor-pointer text-[#fff] rounded"
                    >
                      Edit&nbsp;&nbsp;
                      <i className="text-[15px] pi pi-pen-to-square"></i>
                    </div>
                  )} */}
                    </div>
                    <div className="w-[100%] flex flex-col justify-center items-center">
                      <div className="w-[100%] flex flex-col lg:flex-row gap-y-[20px] justify-between mb-[20px]">
                        <div className="w-[100%] lg:w-[48%]">
                          <TextInput
                            label="Year of Experience"
                            name="yearexprience"
                            id="yearexprience"
                            type="number"
                            onChange={(e) => {
                              setEmployeeData({
                                ...employeeData,
                                refExperence: e.target.value,
                              });
                            }}
                            value={employeeData.refExperence}
                            readonly={!edits.prof}
                          />
                        </div>
                        <div className="w-[100%] lg:w-[48%]">
                          <TextInput
                            label="Specialization"
                            name="specialization"
                            id="specialization"
                            type="text"
                            onChange={(e) => {
                              setEmployeeData({
                                ...employeeData,
                                refSpecialization: e.target.value,
                              });
                            }}
                            value={employeeData.refSpecialization}
                            readonly={!edits.prof}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}

              <div className="py-1"></div>
            </div>
          </TabPanel>
          <TabPanel header="Medical details ">
            {/* Documentation */}
            <div className="basicProfileCont m-[10px] lg:m-[30px] p-[20px] lg:p-[40px] shadow-lg">
              <div className="w-[100%] flex justify-between items-center mb-5">
                <div className="text-[1rem] lg:text-[25px] font-bold">
                  Documentation
                </div>
              </div>

              <div className="w-[100%] flex justify-center items-center">
                <div className="flex flex-wrap  items-center w-[100%]">
                  {medDocData.map((doc, index) => (
                    <div
                      key={doc.refMedDocId}
                      className="lg:basis-1/3 basis-full flex items-center justify-start lg:p-2 hover:border-2 border-[#f95005]"
                    >
                      <div className="lg:mr-5 mr-2">
                        <FaEye
                          className="w-[30px] h-[25px] text-[#f95005] cursor-pointer"
                          onClick={() =>
                            handlePreviewDocument(medDocData, index)
                          }
                        />
                      </div>
                      <div className="">
                        <h3 className="text-[20px]">{doc.refMedDocName}</h3>
                        {/* Display refMedDocName */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Genderal Health */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlegenderalhealth();
              }}
            >
              <div className="basicProfileCont p-10 shadow-lg mt-10">
                <div className="w-[100%] flex justify-between items-center mb-5">
                  <div className="text-[1.2rem] lg:text-[25px] font-bold">
                    General Health
                  </div>
                  {/* {edits.gendrel ? (
                  <button
                    className="text-[15px] outline-none py-2 border-none px-3 bg-[#f95005] font-bold cursor-pointer text-white rounded"
                    type="submit"
                  >
                    Save&nbsp;&nbsp;
                    <i className="text-[15px] pi pi-check"></i>
                  </button>
                ) : (
                  <div
                    onClick={() => {
                      editform("gendrel");
                    }}
                    className="text-[15px] py-2 px-3 bg-[#f95005] font-bold cursor-pointer text-[#fff] rounded"
                  >
                    Edit&nbsp;&nbsp;
                    <i className="text-[15px] pi pi-pen-to-square"></i>
                  </div>
                )} */}
                </div>
                <div className="w-[100%] flex flex-col justify-center items-center">
                  <div className="w-[100%] flex justify-between mb-[20px]">
                    <div className="w-[48%]">
                      <TextInput
                        label="Height in CM *"
                        name="height"
                        id="height"
                        type="number"
                        onChange={handleInputVal}
                        value={inputs.height}
                        readonly={!edits.gendrel}
                        required
                      />
                    </div>
                    <div className="w-[48%]">
                      <TextInput
                        label="Weight in KG *"
                        name="weight"
                        id="weight"
                        type="number"
                        onChange={handleInputVal}
                        value={inputs.weight}
                        readonly={!edits.gendrel}
                        required
                      />
                    </div>
                  </div>

                  <div className="w-[100%] flex justify-between mb-[20px]">
                    <div className="w-[48%]">
                      <SelectInput
                        id="bloodgroup"
                        name="bloodgroup"
                        label="Blood Group *"
                        onChange={handleInputVal}
                        value={inputs.bloodgroup}
                        options={[
                          { value: "A+", label: "A+" },
                          { value: "A-", label: "A-" },
                          { value: "B+", label: "B+" },
                          { value: "B-", label: "B-" },
                          { value: "AB+", label: "AB+" },
                          { value: "AB-", label: "AB-" },
                          { value: "O+", label: "O+" },
                          { value: "O-", label: "O-" },
                        ]}
                        disabled={!edits.gendrel}
                        required
                      />
                    </div>
                    <div className="w-[48%]">
                      <TextInput
                        label="BMI"
                        name="bmi"
                        id="bmi"
                        type="number"
                        onChange={handleInputVal}
                        value={inputs.bmi}
                        readonly={!edits.gendrel}
                      />
                    </div>
                  </div>

                  <div className="w-[100%] flex justify-between mb-[20px]">
                    <div className="w-[100%]">
                      <TextInput
                        label="BP"
                        name="bp"
                        id="bp"
                        type="number"
                        onChange={handleInputVal}
                        value={inputs.bp}
                        readonly={!edits.gendrel}
                      />
                    </div>
                  </div>

                  <div className="w-[100%] flex flex-col md:flex-row gap-y-[25px] justify-between mb-[25px]">
                    <div className="w-[100%] md:w-[48%]">
                      <label className="w-[100%] text-[#f95005]  text-[1.0rem] lg:text-[18px] text-start">
                        Recent injuries / Accidents / Operations *{" "}
                      </label>
                      <div className="w-[100%] flex justify-start mt-[10px]">
                        <div className="mr-10 ">
                          <RadiobuttonInput
                            id="accidentyes"
                            value="yes"
                            name="accident"
                            selectedOption={options.accident ? "yes" : ""}
                            onChange={() => {
                              setOptions({
                                ...options,
                                accident: true,
                              });
                            }}
                            label="Yes"
                            readonly={!edits.gendrel}
                            required
                          />
                        </div>
                        <div className="">
                          <RadiobuttonInput
                            id="accidentno"
                            value="no"
                            name="accident"
                            label="No"
                            onChange={() => {
                              setOptions({
                                ...options,
                                accident: false,
                              });

                              setInputs({
                                ...inputs,
                                accidentdetails: "",
                              });
                            }}
                            selectedOption={!options.accident ? "no" : ""}
                            readonly={!edits.gendrel}
                            required
                          />
                        </div>
                      </div>
                      <div className="w-[100%] mt-[20px]">
                        <div className="w-[100%]">
                          <TextInput
                            label="Details"
                            name="accidentdetails"
                            id="details"
                            type="text"
                            onChange={handleInputVal}
                            value={inputs.accidentdetails}
                            disabled={!options.accident}
                            readonly={!edits.gendrel}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-[100%] md:w-[48%]">
                      <label className="w-[100%] text-[#f95005]  text-[1.0rem] lg:text-[18px] text-start">
                        Recent breaks / Fractures / Sprains *
                      </label>
                      <div className="w-[100%] flex justify-start mt-[10px]">
                        <div className="mr-10">
                          <RadiobuttonInput
                            id="breaksyes"
                            value="yes"
                            name="breaks"
                            label="Yes"
                            selectedOption={options.breaks ? "yes" : ""}
                            onChange={() => {
                              setOptions({
                                ...options,
                                breaks: true,
                              });
                            }}
                            readonly={!edits.gendrel}
                            required
                          />
                        </div>
                        <div className="">
                          <RadiobuttonInput
                            id="breaksno"
                            value="no"
                            name="breaks"
                            label="No"
                            selectedOption={!options.breaks ? "no" : ""}
                            onChange={() => {
                              setOptions({
                                ...options,
                                breaks: false,
                              });
                              setInputs({
                                ...inputs,
                                breaksdetails: "",
                                breaksotheractivities: "",
                              });
                            }}
                            readonly={!edits.gendrel}
                            required
                          />
                        </div>
                      </div>
                      <div className="w-[100%] flex justify-between mt-[20px]">
                        <div className="w-[48%]">
                          <TextInput
                            label="Details"
                            name="breaksdetails"
                            id="details"
                            type="text"
                            onChange={handleInputVal}
                            value={inputs.breaksdetails}
                            disabled={!options.breaks}
                            readonly={!edits.gendrel}
                            required
                          />
                        </div>
                        <div className="w-[48%]">
                          <TextInput
                            label="Other Activities"
                            name="breaksotheractivities"
                            id="otheractivities"
                            type="text"
                            onChange={handleInputVal}
                            value={inputs.breaksotheractivities}
                            disabled={!options.breaks}
                            readonly={!edits.gendrel}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-[100%] flex justify-between">
                    <div className="w-[100%]">
                      <TextInput
                        label="Anything else"
                        name="genderalanything"
                        id="anythingelse"
                        type="text"
                        onChange={handleInputVal}
                        value={inputs.genderalanything}
                        readonly={!edits.gendrel}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Past or Present Health */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlepresenthealth();
              }}
            >
              <div className="basicProfileCont p-10 shadow-lg mt-10">
                <div className="w-[100%] flex justify-between items-center mb-5">
                  <div className="text-[1.2rem] lg:text-[25px] font-bold">
                    Past or Present Health
                  </div>
                  {/* {edits.present ? (
                  <button
                    className="text-[15px] outline-none py-2 border-none px-3 bg-[#f95005] font-bold cursor-pointer text-white rounded"
                    type="submit"
                  >
                    Save&nbsp;&nbsp;
                    <i className="text-[15px] pi pi-check"></i>
                  </button>
                ) : (
                  <div
                    onClick={() => {
                      editform("present");
                    }}
                    className="text-[15px] py-2 px-3 bg-[#f95005] font-bold cursor-pointer text-[#fff] rounded"
                  >
                    Edit&nbsp;&nbsp;
                    <i className="text-[15px] pi pi-pen-to-square"></i>
                  </div>
                )} */}
                </div>
                <div className="w-[100%] flex justify-center items-center">
                  <div className="w-[100%] justify-center items-center flex flex-col">
                    <div className="w-[100%] flex flex-wrap gap-y-[10px] lg:gap-y-[30px] gap-x-10 mb-[20px]">
                      {conditions.map((condition, index) => (
                        <div className="w-[140px]" key={index}>
                          <CheckboxInput
                            id={`condition-${index}`}
                            checked={condition.checked === 1}
                            label={condition.label}
                            onChange={() => handleCheckboxChange(index)}
                            readonly={!edits.present}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="w-[100%] flex flex-col md:flex-row gap-y-[20px] justify-between mb-[20px]">
                      <div className="w-[100%] md:w-[48%]">
                        <TextInput
                          label="Others"
                          name="pastother"
                          id="others"
                          type="text"
                          onChange={handleInputVal}
                          value={inputs.pastother}
                          readonly={!edits.present}
                        />
                      </div>
                      <div className="w-[100%] md:w-[48%]">
                        <TextInput
                          label="Current Medicines"
                          name="pastmedicaldetails"
                          id="medicaldetails"
                          type="text"
                          onChange={handleInputVal}
                          value={inputs.pastmedicaldetails}
                          readonly={!edits.present}
                        />
                      </div>
                    </div>

                    <div className="w-[100%] flex flex-col gap-y-[20px] md:flex-row justify-between">
                      <div className="w-[100%] md:w-[48%]">
                        <label className="w-[100%] text-[#f95005]  text-[1.0rem] lg:text-[18px] text-start">
                          Under Physician's Care *
                        </label>
                        <div className="w-[100%] flex justify-start mt-[10px]">
                          <div className="mr-10">
                            <RadiobuttonInput
                              id="careyes"
                              value="yes"
                              name="care"
                              label="Yes"
                              selectedOption={options.care ? "yes" : ""}
                              onChange={() => {
                                setOptions({
                                  ...options,
                                  care: true,
                                });
                              }}
                              readonly={!edits.present}
                              required
                            />
                          </div>
                          <div className="">
                            <RadiobuttonInput
                              id="careno"
                              value="no"
                              name="care"
                              label="No"
                              selectedOption={!options.care ? "no" : ""}
                              onChange={() => {
                                setOptions({
                                  ...options,
                                  care: false,
                                });
                              }}
                              readonly={!edits.present}
                              required
                            />
                          </div>
                        </div>
                        <div className="w-[100%] flex justify-between mt-[20px]">
                          <div className="w-[48%]">
                            <TextInput
                              label="Doctor Name"
                              name="caredoctorname"
                              id="doctorname"
                              type="text"
                              onChange={handleInputVal}
                              value={inputs.caredoctorname}
                              disabled={!options.care}
                              readonly={!edits.present}
                              required
                            />
                          </div>
                          <div className="w-[48%]">
                            <TextInput
                              label="Hospital"
                              name="caredoctorhospital"
                              id="hospital"
                              type="text"
                              onChange={handleInputVal}
                              value={inputs.caredoctorhospital}
                              disabled={!options.care}
                              readonly={!edits.present}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-[100%] md:w-[48%]">
                        <label className="w-[100%] text-[#f95005]  text-[1.0rem] lg:text-[18px] text-start">
                          Back Pain *
                        </label>
                        <div className="w-[100%] flex justify-start mt-[10px]">
                          <div className="mr-10">
                            <RadiobuttonInput
                              id="painyes"
                              value="yes"
                              name="pain"
                              label="Yes"
                              selectedOption={options.backpain ? "yes" : ""}
                              onChange={() => {
                                setOptions({
                                  ...options,
                                  backpain: true,
                                });
                              }}
                              readonly={!edits.present}
                              required
                            />
                          </div>
                          <div className="">
                            <RadiobuttonInput
                              id="painno"
                              value="no"
                              name="pain"
                              label="No"
                              selectedOption={!options.backpain ? "no" : ""}
                              onChange={() => {
                                setOptions({
                                  ...options,
                                  backpain: false,
                                });
                              }}
                              readonly={!edits.present}
                              required
                            />
                          </div>
                        </div>

                        <div className="w-[100%] mt-[20px]">
                          <div className="w-[100%]">
                            <SelectInput
                              id="painscale"
                              name="backpainscale"
                              label="Pain Scale"
                              onChange={handleInputVal}
                              value={inputs.backpainscale}
                              options={[
                                { value: "upper", label: "Upper" },
                                { value: "middle", label: "Middle" },
                                { value: "lower", label: "Lower" },
                              ]}
                              disabled={!options.backpain || !edits.present}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Therapy */}
            <div className="basicProfileCont p-10 shadow-lg mt-10">
              <div className="w-[100%] flex justify-between items-center mb-5">
                <div className="text-[1.2rem] lg:text-[25px] font-bold">
                  Health Problem History
                </div>
                {/* {edits.therapy ? (
                <div
                  className="text-[15px] py-2 px-3 bg-[#f95005] font-bold cursor-pointer text-[#fff] rounded"
                  onClick={handletherapy}
                >
                  Save&nbsp;&nbsp;
                  <i className="text-[15px] pi pi-check"></i>
                </div>
              ) : (
                <div
                  onClick={() => {
                    editform("therapy");
                  }}
                  className="text-[15px] py-2 px-3 bg-[#f95005] font-bold cursor-pointer text-[#fff] rounded"
                >
                  Edit&nbsp;&nbsp;
                  <i className="text-[15px] pi pi-pen-to-square"></i>
                </div>
              )} */}
              </div>
              <div className="w-[100%] flex justify-center items-center">
                <div className="w-[100%] justify-center items-center flex flex-col">
                  <div className="w-[100%] flex flex-col md:flex-row gap-y-[20px] justify-between mb-[20px]">
                    <div className="w-[100%] md:w-[48%]">
                      <TextInput
                        label="Duration of the Problem"
                        name="therapydurationproblem"
                        id="durationproblem"
                        type="text"
                        onChange={handleInputVal}
                        value={inputs.therapydurationproblem}
                        readonly={!edits.therapy}
                      />
                    </div>
                    <div className="w-[100%] md:w-[48%]">
                      <TextInput
                        label="Relevant Past History"
                        name="therapypasthistory"
                        id="relevantpasthistory"
                        type="text"
                        onChange={handleInputVal}
                        value={inputs.therapypasthistory}
                        readonly={!edits.therapy}
                      />
                    </div>
                  </div>

                  <div className="w-[100%] flex flex-col md:flex-row gap-y-[20px] justify-between">
                    <div className="w-[100%] md:w-[48%]">
                      <TextInput
                        label="Relevant Family History"
                        name="therapyfamilyhistory"
                        id="relevantfamilyhistory"
                        type="text"
                        onChange={handleInputVal}
                        value={inputs.therapyfamilyhistory}
                        readonly={!edits.therapy}
                      />
                    </div>
                    <div className="w-[100%] md:w-[48%]">
                      <TextInput
                        label="Anything else"
                        name="therapyanythingelse"
                        id="anythingelse"
                        type="text"
                        onChange={handleInputVal}
                        value={inputs.therapyanythingelse}
                        readonly={!edits.therapy}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel header="Session details">
            <form>
              <div className="basicProfileCont m-[10px] lg:m-[30px] p-[20px] lg:p-[40px] shadow-lg">
                <div className="w-[100%] flex justify-between items-center mb-5">
                  <div className="text-[1.2rem] lg:text-[25px] font-bold">
                    Yoga class
                  </div>
                  {edits.session ? (
                    <div className="text-[15px] py-2 px-3 bg-[#f95005] font-bold cursor-pointer text-[#fff] rounded">
                      Save&nbsp;&nbsp;
                      <i className="text-[15px] pi pi-check"></i>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        sessionEditModule();
                      }}
                      className="text-[15px] py-2 px-3 bg-[#f95005] font-bold cursor-pointer text-[#fff] rounded"
                    >
                      Edit&nbsp;&nbsp;
                      <i className="text-[15px] pi pi-pen-to-square"></i>
                    </div>
                  )}
                </div>
                <div className="w-[100%] flex justify-center items-center">
                  <div className="w-[100%] justify-center items-center flex flex-col">
                    <div className="w-[100%] flex flex-row lg:flex-row gap-y-[20px] justify-between mb-[20px]">
                      <div className="w-[100%] lg:w-[48%]">
                        {/* {sessionEdit ? (
                          <>
                            <SelectInput
                              id="sessiontype"
                              name="sessiontype"
                              label="Member Type *"
                              // disabled={inputs.memberlist ? false : true}
                              options={memberListOption}
                              // required
                              value={inputs.refTimeMembersId}
                              onChange={(e) => {
                                e.preventDefault();

                                console.log(" e.target.value", e.target.value);
                                setInputs({
                                  ...inputs,
                                  refTimeMembersId: e.target.value,
                                });
                              }}
                            />
                          </>
                        ) : (
                          <TextInput
                            label="Member Type *"
                            name="mType"
                            id="mtype"
                            type="text"
                            disabled={sessionEdit ? false : true}
                            value={inputs.refTimeMembers}
                            readonly
                          />
                        )} */}
                        <TextInput
                          label="Member Type *"
                          name="mType"
                          id="mtype"
                          type="text"
                          // disabled={sessionEdit ? false : true}
                          value={inputs.refTimeMembers}
                          readonly
                        />
                      </div>
                      <div className="w-[100%] lg:w-[48%]">
                        {/* {sessionEdit ? (
                          <>
                            <SelectInput
                              id="sessiontype"
                              name="sessiontype"
                              label="Session Type *"
                              // disabled={inputs.memberlist ? false : true}
                              // options={sessionTypeOption}
                              // required
                              // value={inputs.sessiontype}
                              // onChange={(e) => handleInput(e)}
                            />
                          </>
                        ) : (
                          <TextInput
                            label="Member Type *"
                            name="mType"
                            id="mtype"
                            type="text"
                            disabled={sessionEdit ? false : true}
                            value={inputs.refCustTimeData}
                            readonly
                          />
                        )} */}
                        <TextInput
                          label="Member Type *"
                          name="mType"
                          id="mtype"
                          type="text"
                          // disabled={sessionEdit ? false : true}
                          value={inputs.refCustTimeData}
                          readonly
                        />
                      </div>
                    </div>
                    <div className="w-[100%] flex flex-col lg:flex-row gap-y-[20px] justify-between">
                      <div className="w-[100%] lg:w-[68%]">
                        {/* {sessionEdit ? (
                          <>
                            <SelectInput
                              id="sessiontype"
                              name="sessiontype"
                              label="Timing *"
                              // disabled={inputs.memberlist ? false : true}
                              // options={sessionTypeOption}
                              // required
                              // value={inputs.sessiontype}
                              // onChange={(e) => handleInput(e)}
                            />
                          </>
                        ) : (
                          <TextInput
                            label="Member Type *"
                            name="mType"
                            id="mtype"
                            type="text"
                            disabled={sessionEdit ? false : true}
                            value={inputs.refTime}
                            readonly
                          />
                        )} */}
                        <TextInput
                          label="Member Type *"
                          name="mType"
                          id="mtype"
                          type="text"
                          // disabled={sessionEdit ? false : true}
                          value={inputs.refTime}
                          readonly
                        />
                      </div>
                      <div className="w-[100%] lg:w-[28%]">
                        <SelectInput
                          id="sessiontype"
                          name="sessiontype"
                          label="Class Type *"
                          required
                          disabled
                          value={inputs.refClassMode}
                          options={[
                            { value: "1", label: "Online" },
                            { value: "2", label: "Offline" },
                          ]}
                          // onChange={(e) => handleInput(e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* <form>
              <div className="basicProfileCont m-[10px] lg:m-[30px] p-[20px] lg:p-[40px] shadow-lg">
                <div className="w-[100%] flex justify-between items-center mb-5">
                  <div className="text-[1.2rem] lg:text-[25px] font-bold">
                    Therapy class
                  </div>
                  {edits.therapy ? (
                    <div className="text-[15px] py-2 px-3 bg-[#f95005] font-bold cursor-pointer text-[#fff] rounded">
                      Save&nbsp;&nbsp;
                      <i className="text-[15px] pi pi-check"></i>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        editform("therapy");
                      }}
                      className="text-[15px] py-2 px-3 bg-[#f95005] font-bold cursor-pointer text-[#fff] rounded"
                    >
                      Edit&nbsp;&nbsp;
                      <i className="text-[15px] pi pi-pen-to-square"></i>
                    </div>
                  )}
                </div>
                <div className="w-[100%] flex justify-center items-center">
                  <div className="w-[100%] justify-center items-center flex flex-col">
                    <div className="w-[100%] flex flex-row lg:flex-row gap-y-[20px] justify-between mb-[20px]">
                      <div className="w-[100%] lg:w-[48%]">
                        <SelectInput
                          id="sessiontype"
                          name="sessiontype"
                          label="Member Type *"
                          // disabled={inputs.memberlist ? false : true}
                          // options={sessionTypeOption}
                          // required
                          // value={inputs.sessiontype}
                          // onChange={(e) => handleInput(e)}
                        />
                      </div>
                      <div className="w-[100%] lg:w-[48%]">
                        <SelectInput
                          id="sessiontype"
                          name="sessiontype"
                          label="Session Type *"
                          // disabled={inputs.memberlist ? false : true}
                          // options={sessionTypeOption}
                          // required
                          // value={inputs.sessiontype}
                          // onChange={(e) => handleInput(e)}
                        />
                      </div>
                    </div>
                    <div className="w-[100%] flex flex-col lg:flex-row gap-y-[20px] justify-between">
                      <div className="w-[100%] lg:w-[68%]">
                        <SelectInput
                          id="sessiontype"
                          name="sessiontype"
                          label="Timing *"
                          // disabled={inputs.memberlist ? false : true}
                          // options={sessionTypeOption}
                          // required
                          // value={inputs.sessiontype}
                          // onChange={(e) => handleInput(e)}
                        />
                      </div>
                      <div className="w-[100%] lg:w-[28%]">
                        <SelectInput
                          id="sessiontype"
                          name="sessiontype"
                          label="Class Type *"
                          // disabled={inputs.memberlist ? false : true}
                          // options={sessionTypeOption}
                          // required
                          // value={inputs.sessiontype}
                          // onChange={(e) => handleInput(e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form> */}
          </TabPanel>
        </TabView>
      </div>
    </>
  );
};

export default UserProfileView;
