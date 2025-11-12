import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  GridItem,
  Grid,
  FormControl,
  FormLabel,
  Stack,
  HStack,
  Checkbox,
  Divider,
  Heading,
  Image,
  Avatar,
  AvatarGroup,
  FormErrorMessage,
} from "@chakra-ui/react";

import Logo from "../UI/Images/medimartLogo.png";
import "react-toastify/dist/ReactToastify.css";

export const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const { username, password } = inputValue;

  const handleError = (err) =>
    toast.error(err, { position: "bottom-left" });
  const handleSuccess = (msg) =>
    toast.success(msg, { position: "bottom-left" });

  // Form validation
  const validate = () => {
    const newErrors = {};
    if (!username || username.trim() === "") newErrors.username = "Username is required";
    if (!password || password.trim() === "") newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      handleError("Please fix the errors in the form");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:8001/login",
        { username, password },
        { withCredentials: true }
      );

      const { success, message, role } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          if (role === "patient") navigate("/home");
          else if (role === "pharmacist") navigate("/doctor-home");
          else if (role === "admin") navigate("/admin-home");
        }, 1000);
      } else {
        handleError(message || "Login failed");
      }
    } catch (error) {
      console.error("Login error details:", error);

      if (error.response) {
        // Server responded with a status outside 2xx
        handleError(
          `Error ${error.response.status}: ${error.response.data?.message || "Unauthorized"}`
        );
      } else if (error.request) {
        // Request was made but no response
        handleError("No response from server. Please check backend.");
      } else {
        // Something else went wrong
        handleError(`Unexpected error: ${error.message}`);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });

    // Real-time validation
    setErrors((prev) => ({ ...prev, [name]: value.trim() === "" ? `${name} is required` : "" }));
  };

  return (
    <>
      <Grid templateColumns={{ base: "1fr", md: "7fr 5fr" }} minH="100vh" gap={0}>
        {/* Left - Branding */}
        <GridItem
          colSpan={1}
          p={{ base: 5, md: 10 }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems={{ base: "center", md: "flex-start" }}
          textAlign={{ base: "center", md: "left" }}
          bg="white"
        >
          <Image src={Logo} alt="Logo" w={{ base: "60%", md: "70%" }} mb={10} />
          <Box mb={5}>
            <Text fontSize={{ base: "3xl", md: "6xl" }} fontWeight="bold" color="#005660">
              Your Health, <br /> One Click Away
            </Text>
          </Box>
          <Box mb={10}>
            <Text fontSize={{ base: "md", md: "2xl" }} as="cite">
              "Join our platform for access to top-tier doctors and hassle-free appointments. Your wellness journey starts here."
            </Text>
          </Box>
          <HStack spacing={4} wrap="wrap">
            <AvatarGroup size="md" max={5}>
              <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
              <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
              <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
              <Avatar name="Prosper Otemuyiwa" src="https://bit.ly/prosper-baba" />
              <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
            </AvatarGroup>
            <Text fontWeight="medium">Join 10,000+ Users</Text>
          </HStack>
        </GridItem>

        {/* Right - Form */}
        <GridItem
          colSpan={1}
          p={{ base: 5, md: 10 }}
          bg="#005660"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderLeftRadius={{ base: "none", md: "xl" }}
        >
          <Box
            w="100%"
            maxW={{ base: "100%", md: "md" }}
            p={{ base: 5, md: 10 }}
            bg="white"
            color="black"
            boxShadow={{ base: "none", md: "md" }}
            borderRadius={{ base: "none", md: "xl" }}
          >
            <Stack spacing="6">
              <Stack spacing={{ base: 2, md: 3 }} textAlign="center">
                <Heading size={{ base: "xs", md: "lg" }}>Log in to your account</Heading>
                <Text>
                  Don't have an account?{" "}
                  <Link
                    to="/patient-register"
                    style={{ color: "#4fbbf3", textDecoration: "underline" }}
                  >
                    Sign up
                  </Link>
                </Text>
              </Stack>

              <Stack spacing="6">
                <Stack spacing="5">
                  <FormControl isInvalid={errors.username}>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <Input
                      id="username"
                      type="text"
                      name="username"
                      value={username}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.password}>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      value={password}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                </Stack>

                <HStack justify="space-between">
                  <Checkbox>Remember me</Checkbox>
                  <Button variant="text" size="sm">
                    Forgot password?
                  </Button>
                </HStack>

                <Stack spacing="6">
                  <Button colorScheme="teal" onClick={handleSubmit}>
                    Sign in
                  </Button>
                  <HStack>
                    <Divider />
                    <Text whiteSpace="nowrap" color="gray.500">
                      Are you a Pharmacist?
                    </Text>
                    <Divider />
                  </HStack>
                  <Stack direction="row" spacing="4" align="center" justify="center">
                    <Link
                      to="/pharmacist-register"
                      style={{ color: "#4fbbf3", textDecoration: "underline" }}
                    >
                      Register as a pharmacist
                    </Link>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </GridItem>
      </Grid>

      <ToastContainer />
    </>
  );
};
