import React from 'react';
import { Box, Tooltip, Wrap, WrapItem, Button, useColorModeValue } from '@chakra-ui/react';

const tabInfo = [
  { key: "one", label: "Email", colorScheme: "cyan" },
  { key: "two", label: "Date of Birth", colorScheme: "orange" },
  { key: "three", label: "Education", colorScheme: "purple" },
  { key: "four", label: "Affiliation", colorScheme: "teal" },
  { key: "five", label: "Hourly Rate", colorScheme: "pink" }
];

const RR = ({ onRatingTabClick, setSelectedTab }) => {
  const activeBg = useColorModeValue("gray.100", "gray.800");

  const handleTabClick = (tabKey) => {
    onRatingTabClick(tabKey);
  };
  const handleTabHover = (tabKey) => {
    setSelectedTab(tabKey);
  };

  return (
    <Box
      display="flex"
      flexDir="column"
      alignItems="center"
      py={2}
      px={2}
      borderRadius="xl"
      boxShadow="md"
      background={activeBg}
      width={{ base: "100%", sm: "auto" }}
      minW={{ base: "100%", sm: "360px" }}
      maxW="100vw"
    >
      <Box fontWeight="bold" mb={2} textAlign="center">More Information</Box>
      <Wrap
        spacing={{ base: 2, sm: 3 }}
        justify="center"
        width="100%"
      >
        {tabInfo.map(tab => (
          <WrapItem key={tab.key}>
            <Tooltip label={tab.label} hasArrow placement="top">
              <Button
                colorScheme={tab.colorScheme}
                variant="solid"
                size={{ base: "xs", sm: "sm", md: "md" }}
                fontWeight="bold"
                fontSize={{ base: "xs", sm: "sm", md: "md" }}
                px={{ base: 2, sm: 4 }}
                boxShadow="sm"
                transition="all 0.15s"
                tabIndex={0}
                onClick={() => handleTabClick(tab.key)}
                onMouseEnter={() => handleTabHover(tab.key)}
                onFocus={() => handleTabHover(tab.key)}
                aria-label={tab.label}
                borderRadius="md"
                _hover={{ boxShadow: "lg", opacity: 0.85 }}
                _active={{ boxShadow: "xl", opacity: 0.95 }}
                _focusVisible={{ outline: "2px solid", outlineColor: "blue.400" }}
                whiteSpace="normal"
                textAlign="center"
                minW={{ base: "80px", sm: "100px" }}
                maxW="100%"
              >
                {tab.label}
              </Button>
            </Tooltip>
          </WrapItem>
        ))}
      </Wrap>
      <Box mt={2} fontSize={{ base: "xs", sm: "sm" }} color="gray.500" textAlign="center" maxW="260px">
        Click or hover to show details for: <strong>Email, DOB, Education, Affiliation, Rate</strong>
      </Box>
    </Box>
  );
};

export default RR;
