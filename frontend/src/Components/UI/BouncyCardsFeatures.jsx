import React from "react";
import { motion } from "framer-motion";
import { Flex, Grid, GridItem, Box, Heading, Text, Button } from "@chakra-ui/react";

const MotionBox = motion(Box);

export const BouncyCardsFeatures = () => {
  const features = [
    {
      title: "Top-notch Doctors",
      color: "#2caed8",
      text: "Make appointments with doctors from all over the world with just one click.",
      colSpan: { base: 1, md: 2 },
    },
    {
      title: "Round-the-Clock Service",
      color: "#319795",
      text: "Access medications and support 24/7, ensuring you get the care you need, when you need it.",
      colSpan: { base: 1, md: 1 },
    },
    {
      title: "Effortless Online Pharmacy",
      color: "#319795",
      text: "Access a wide range of medications online, delivered to your doorstep with ease.",
      colSpan: { base: 1, md: 1 },
    },
    {
      title: "Personalized Health Insights",
      color: "#2caed8",
      text: "Gain insightful data tailored to your health needs, empowering better decisions and outcomes.",
      colSpan: { base: 1, md: 2 },
    },
  ];

  const infoCards = [
    {
      title: 'Convenient Online Consultations',
      text:
        'Connect with top doctors from anywhere, anytime, through our secure online platform.',
      color: '#2caed8',
      colSpan: { base: 1, md: 1 },
    },
    {
      title: 'Fast Medication Delivery',
      text:
        'Receive your prescriptions at your doorstep quickly and efficiently.',
      color: '#319795',
      colSpan: { base: 1, md: 1 },
    },
    {
      title: 'Personalized Health Insights',
      text:
        'Get tailored health data and recommendations to make informed choices.',
      color: '#9CA3AF',
      colSpan: { base: 1, md: 1 },
    },
  ];

  const renderCard = (card) => (
    <GridItem
      key={card.title}
      colSpan={card.colSpan}
      as={MotionBox}
      whileHover={{ scale: 0.98, rotate: "-1deg" }}
      bg="gray.100"
      borderRadius="xl"
      p={6}
      position="relative"
      cursor="pointer"
      overflow="hidden"
      transition="all 0.3s ease"
    >
      <Heading fontSize={{ base: "xl", md: "2xl" }} textAlign="center" mb={4}>
        {card.title}
      </Heading>
      <Box
        mt={3}
        bg={card.color}
        borderRadius="lg"
        p={5}
        transition="transform 0.3s"
        _hover={{ transform: "translateY(-5px) rotate(1deg)" }}
      >
        <Text textAlign="center" color="white" fontWeight="600">
          {card.text}
        </Text>
      </Box>
    </GridItem>
  );

  return (
    <Flex direction="column" justify="center" align="center" w="100%" py={10} px={5}>
      {/* Main Features Section */}
      <Box w={{ base: "100%", md: "85%" }} mb={20}>
        <Flex
          mb={8}
          align="center"
          justify="space-between"
          flexDir={{ base: "column", md: "row" }}
          gap={4}
        >
          <Heading fontSize={{ base: "2xl", md: "3xl" }}>
            Discover the Power of Our Virtual Clinic:{" "}
            <Text as="span" color="gray.400">
              Seamless Healthcare
            </Text>
          </Heading>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button bg="black" color="white" _hover={{ bg: "gray.800" }} px={6} py={4} borderRadius="md">
              Learn more
            </Button>
          </motion.div>
        </Flex>

        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
          {features.map(renderCard)}
        </Grid>
      </Box>

      {/* Info Cards Section */}
      <Box w={{ base: "100%", md: "85%" }}>
        <Heading fontSize={{ base: "2xl", md: "3xl" }} textAlign="center" mb={8}>
          Why Choose PillStack?
        </Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
          {infoCards.map(renderCard)}
        </Grid>
      </Box>
    </Flex>
  );
};