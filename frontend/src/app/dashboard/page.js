"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Link,
  Tabs,
  Tab,
} from "@mui/material";

import Navbar from "@/components/Navbar/Navbar";

// Tabs docs: https://mui.com/material-ui/react-tabs/
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function LeftSection(props) {
  return (
    <Box
      sx={{
        borderRight: "1px solid",
        borderColor: "divider",
        width: "30%",
        maxWidth: "300px",
        height: "100%",
      }}
    >
      {props.children}
    </Box>
  );
}

function RightSection(props) {
  return <Box>{props.children}</Box>;
}

export default function Dashboard() {
  const router = useRouter();

  const { user, loading } = useAuth(); // This checks if the user is already logged in using the AuthProvider
  const [tabIndex, setTabIndex] = useState(0);

  // Redirect to login if auth check completed and user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  // Hide the page if auth check is not completed or user is not logged in
  if (loading || !user) {
    return null;
  }

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Navbar />
        <Box
          sx={{
            display: "flex",
            height: "100%",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <LeftSection>
            <Tabs
              orientation="vertical"
              value={tabIndex}
              onChange={handleTabChange}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="Dashboard tabs"
              sx={{
                "& .MuiTab-root": {
                  p: 4,
                },
              }}
            >
              <Tab label="Projects" />
              <Tab label="Account" />
              <Tab label="Payment" />
            </Tabs>
          </LeftSection>

          <RightSection>
            <TabPanel value={tabIndex} index={0}>
              Projects page coming soon...
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              Account page coming soon...
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              Payment page coming soon...
            </TabPanel>
          </RightSection>
        </Box>
      </Box>
    </>
  );
}
