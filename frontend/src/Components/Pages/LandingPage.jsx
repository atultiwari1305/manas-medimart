import React from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Image,
  Text,
  HStack,
  Heading,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import FloatingPhone from '../UI/FloatingPhone';
import logo from '../UI/Images/medimartLogo.png';
import { BouncyCardsFeatures } from '../UI/BouncyCardsFeatures';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box w="100%" minH="100vh">
      {/* Navbar */}
      <Grid
        templateColumns="repeat(3, 1fr)"
        position="fixed"
        zIndex={100}
        h={20}
        w="100%"
        bg="whiteAlpha.900"
        backdropFilter="blur(8px)"
        alignItems="center"
        px={5}
        boxShadow="sm"
      >
        <GridItem />
        <GridItem justifySelf="center">
          <Image src={logo} alt="MediMart Logo" h={20} />
        </GridItem>
        <GridItem justifySelf="end">
          <HStack spacing={4}>
            <Button colorScheme="teal" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button
              variant="outline"
              borderColor="teal"
              color="teal"
              onClick={() => navigate('/patient-register')}
            >
              Sign Up
            </Button>
          </HStack>
        </GridItem>
      </Grid>

      {/* Hero Section */}
      <Flex
        direction={{ base: 'column-reverse', md: 'row' }}
        align="center"
        justify="center" // changed from space-between
        bgGradient="linear(to-r, teal.400, blue.500)"
        minH={{ base: '80vh', md: '90vh' }}
        px={{ base: 5, md: 20 }}
        pt={24}
        pb={10}
        color="white"
        gap={{ base: 10, md: 40 }} // add gap between children
      >
        <VStack
          align="flex-start"
          spacing={5}
          maxW={{ base: '100%', md: '50%' }}
        >
          <Heading fontSize={{ base: '3xl', md: '5xl' }}>
            Empowering Your Health Journey,
            <Text as="span" color="teal.100">
              One Click Away!
            </Text>
          </Heading>
          <Text fontSize={{ base: 'md', md: 'xl' }}>
            Your trusted online clinic & pharmacy for convenient care &
            medication solutions.
          </Text>
        </VStack>

        <Box maxW={{ base: '100%', md: '45%' }} mb={{ base: 10, md: 0 }}>
          <FloatingPhone />
        </Box>
      </Flex>


      {/* Features + Info Cards */}
      <Box mt={20}>
        <BouncyCardsFeatures />
      </Box>

      {/* Footer */}
      <Flex
        py={10}
        justify="center"
        align="center"
        bg="teal.400"
        color="white"
        direction={{ base: 'column', md: 'row' }}
        gap={6}
      >
        <Text>© 2025 MediMart. All Rights Reserved.</Text>
        <HStack spacing={4}>
          <Button variant="link" color="white">
            Privacy Policy
          </Button>
          <Button variant="link" color="white">
            Terms of Service
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
}

export default LandingPage;
