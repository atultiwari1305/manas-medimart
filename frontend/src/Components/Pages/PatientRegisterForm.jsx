import React, { useState, useEffect } from "react";
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
  Avatar,
  AvatarGroup,
  Image,
  useToast,
  FormErrorMessage,
  Divider,
} from "@chakra-ui/react";

import Logo from "../UI/Images/medimartLogo.png";

export const PatientRegisterForm = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    mobile: "",
    EmergencyContact_Name: "",
    EmergencyContact_MobileNumber: "",
    EmergencyContact_Relation: "",
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Invalid email address";
      case "mobile":
      case "EmergencyContact_MobileNumber":
        return /^\d{10}$/.test(value) ? "" : "Must be a 10-digit number";
      case "password":
        return value.length >= 6 ? "" : "Password must be at least 6 characters";
      case "username":
      case "name":
      case "EmergencyContact_Name":
        return value.trim() !== "" ? "" : "This field is required";
      case "dob":
        return value ? "" : "Date of birth is required";
      case "gender":
      case "EmergencyContact_Relation":
        return value ? "" : "Please select an option";
      default:
        return "";
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // validate all fields before submitting
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

    try {
      const response = await Axios.post(
        "http://localhost:8001/patient/Patientregister",
        formData
      );
      if (response.data.message !== "User already exists") {
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
          description: "Username already exists",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please fill all fields correctly",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error(error);
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
            Your Health, <br /> One Click Away
          </Heading>
          <Text fontSize="xl">
            Join our platform for access to top-tier doctors and hassle-free
            appointments. Your wellness journey starts here.
          </Text>
          <HStack mt={10}>
            <AvatarGroup size="md" max={5}>
              <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
              <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
              <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
              <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
              <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
            </AvatarGroup>
            <Text fontWeight="medium">Join 10,000+ Users</Text>
          </HStack>
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
              Register Your Account
            </Heading>

            {/* Form Fields */}
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
                <FormControl isRequired isInvalid={errors.gender} flex={1}>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    placeholder="Select Gender"
                    name="gender"
                    onChange={onChange}
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </Select>
                  <FormErrorMessage>{errors.gender}</FormErrorMessage>
                </FormControl>
              </HStack>

              <FormControl isRequired isInvalid={errors.mobile}>
                <FormLabel>Phone</FormLabel>
                <Input name="mobile" type="tel" onChange={onChange} />
                <FormErrorMessage>{errors.mobile}</FormErrorMessage>
              </FormControl>

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

              <FormControl isRequired isInvalid={errors.EmergencyContact_Name}>
                <FormLabel>Emergency Contact Name</FormLabel>
                <Input
                  name="EmergencyContact_Name"
                  type="text"
                  onChange={onChange}
                />
                <FormErrorMessage>{errors.EmergencyContact_Name}</FormErrorMessage>
              </FormControl>

              <HStack spacing={4}>
                <FormControl isRequired isInvalid={errors.EmergencyContact_Relation} flex={1}>
                  <FormLabel>Relation</FormLabel>
                  <Select
                    placeholder="Select Relation"
                    name="EmergencyContact_Relation"
                    onChange={onChange}
                  >
                    <option value="wife">Wife</option>
                    <option value="husband">Husband</option>
                    <option value="child">Child</option>
                    <option value="parent">Parent</option>
                    <option value="friend">Friend</option>
                  </Select>
                  <FormErrorMessage>{errors.EmergencyContact_Relation}</FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={errors.EmergencyContact_MobileNumber} flex={1}>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    name="EmergencyContact_MobileNumber"
                    type="tel"
                    onChange={onChange}
                  />
                  <FormErrorMessage>{errors.EmergencyContact_MobileNumber}</FormErrorMessage>
                </FormControl>
              </HStack>
            </Stack>

            <Button
              colorScheme="teal"
              size="lg"
              onClick={onSubmit}
              isDisabled={Object.values(formData).some((v) => v === "")}
            >
              Register
            </Button>
            <Text textAlign="center" color="gray.600">
              Already have an account?{" "}
              <Link
                to="/login"
                style={{ color: "#4fbbf3", textDecoration: "underline" }}
              >
                Login
              </Link>
              {" | Are you Pharmacist? "}
              <Link
                  to="/pharmacist-register"
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

export default PatientRegisterForm;
