import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  Grid,
  GridItem,
  Stack,
  HStack,
  Heading,
  Image,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";

import Logo from "../UI/Images/medimartLogo.png";

export const PharmacistRegisterForm = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    dob: "",
    mobile: "",
    affiliation: "",
    educational_background: "",
    hourly_rate: "",
    IDDocument: null,
    pharmacyDegreeDocument: null,
    workingLicenseDocument: null,
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Invalid email address";
      case "mobile":
        return /^\d{10}$/.test(value) ? "" : "Must be a 10-digit number";
      case "password":
        return value.length >= 6 ? "" : "Password must be at least 6 characters";
      case "username":
      case "name":
      case "affiliation":
      case "educational_background":
        return value.trim() !== "" ? "" : "This field is required";
      case "dob":
        return value ? "" : "Date of birth is required";
      case "hourly_rate":
        return value > 0 ? "" : "Hourly rate must be greater than 0";
      case "IDDocument":
      case "pharmacyDegreeDocument":
      case "workingLicenseDocument":
        return value ? "" : "File is required";
      default:
        return "";
    }
  };

  const onChange = (e) => {
    const { name, type, value, files } = e.target;
    const val = type === "file" ? files[0] : value;
    setFormData({ ...formData, [name]: val });
    setErrors({ ...errors, [name]: validateField(name, val) });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // submit form
    const payload = new FormData();
    for (const key in formData) {
      payload.append(key, formData[key]);
    }

    try {
      const response = await Axios.post(
        "http://localhost:8001/doc_register",
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        toast({
          title: "Registration Successful",
          description: response.data.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/");
      } else {
        toast({
          title: "Registration Failed",
          description: response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error?.response?.data?.message || error.message || "Unexpected error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} minH="100vh">
      {/* Left Side */}
      <GridItem
        bg="white"
        display={{ base: "none", md: "flex" }}
        justifyContent="center"
        alignItems="center"
      >
        <Stack spacing={7} alignItems="flex-start" px={10}>
          <Image src={Logo} alt="Logo" w="60%" mb={5} />
          <Heading fontSize="5xl" color="#005660">
            Your Career, <br /> One Click Away
          </Heading>
          <Text fontSize="xl">
            Join our platform and register as a pharmacist to connect with clinics and patients efficiently.
          </Text>
        </Stack>
      </GridItem>

      {/* Right Side */}
      <GridItem
        bg="#005660"
        display="flex"
        justifyContent="center"
        alignItems="center"
        px={{ base: 5, md: 20 }}
      >
        <Box w="100%" bg="white" borderRadius="xl" p={10} boxShadow="lg">
          <Stack spacing={6}>
            <Heading textAlign="center" color="#005660">
              Pharmacist Registration
            </Heading>

            <Stack spacing={4}>
              <FormControl isRequired isInvalid={errors.name}>
                <FormLabel>Full Name</FormLabel>
                <Input name="name" type="text" onChange={onChange} />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <HStack spacing={4}>
                <FormControl isRequired isInvalid={errors.dob} flex={1}>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input name="dob" type="date" onChange={onChange} />
                  <FormErrorMessage>{errors.dob}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={errors.mobile} flex={1}>
                  <FormLabel>Phone</FormLabel>
                  <Input name="mobile" type="tel" onChange={onChange} />
                  <FormErrorMessage>{errors.mobile}</FormErrorMessage>
                </FormControl>
              </HStack>

              <FormControl isRequired isInvalid={errors.email}>
                <FormLabel>Email</FormLabel>
                <Input name="email" type="email" onChange={onChange} />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <HStack spacing={4}>
                <FormControl isRequired isInvalid={errors.username} flex={1}>
                  <FormLabel>Username</FormLabel>
                  <Input name="username" type="text" onChange={onChange} />
                  <FormErrorMessage>{errors.username}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={errors.password} flex={1}>
                  <FormLabel>Password</FormLabel>
                  <Input name="password" type="password" onChange={onChange} />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
              </HStack>

              <HStack spacing={4}>
                <FormControl isRequired isInvalid={errors.affiliation} flex={1}>
                  <FormLabel>Affiliation</FormLabel>
                  <Input name="affiliation" type="text" onChange={onChange} />
                  <FormErrorMessage>{errors.affiliation}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={errors.educational_background} flex={1}>
                  <FormLabel>Educational Background</FormLabel>
                  <Input name="educational_background" type="text" onChange={onChange} />
                  <FormErrorMessage>{errors.educational_background}</FormErrorMessage>
                </FormControl>
              </HStack>

              {/* Hourly Rate + ID Document */}
              <HStack spacing={4}>
                <FormControl isRequired isInvalid={errors.hourly_rate} flex={1}>
                  <FormLabel>Hourly Rate</FormLabel>
                  <Input name="hourly_rate" type="number" onChange={onChange} />
                  <FormErrorMessage>{errors.hourly_rate}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={errors.IDDocument} flex={1}>
                  <FormLabel>ID Document</FormLabel>
                  <Input type="file" name="IDDocument" onChange={onChange} />
                  <FormErrorMessage>{errors.IDDocument}</FormErrorMessage>
                </FormControl>
              </HStack>

              {/* Degree + License */}
              <HStack spacing={4}>
                <FormControl isRequired isInvalid={errors.pharmacyDegreeDocument} flex={1}>
                  <FormLabel>Pharmacy Degree Document</FormLabel>
                  <Input type="file" name="pharmacyDegreeDocument" onChange={onChange} />
                  <FormErrorMessage>{errors.pharmacyDegreeDocument}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={errors.workingLicenseDocument} flex={1}>
                  <FormLabel>Working License Document</FormLabel>
                  <Input type="file" name="workingLicenseDocument" onChange={onChange} />
                  <FormErrorMessage>{errors.workingLicenseDocument}</FormErrorMessage>
                </FormControl>
              </HStack>
            </Stack>

            <Button
              colorScheme="teal"
              size="lg"
              onClick={onSubmit}
              isDisabled={Object.values(formData).some((v) => v === "" || v === null)}
            >
              Register
            </Button>

            <Text textAlign="center" color="gray.600">
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#4fbbf3", textDecoration: "underline" }}>
                Login
              </Link>
              {" | Are you Patient? "}
              <Link
                to="/patient-register"
                style={{ color: "#4fbbf3", textDecoration: "underline" }}
              >
              Register
              </Link>
            </Text>
          </Stack>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default PharmacistRegisterForm;