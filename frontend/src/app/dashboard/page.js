"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

import { useAuth } from "@/context/AuthProvider";
import Navbar from "@/components/Navbar/Navbar";
import ProjectPanel from "@/components/ProjectPanel/ProjectPanel";
import SharedProjectPanel from "@/components/SharedProjectPanel/SharedProjectPanel";

// Docs: https://mui.com/material-ui/react-tabs/
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
        pt: 5,
      }}
    >
      {props.children}
    </Box>
  );
}

function RightSection(props) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "100%",
      }}
    >
      {props.children}
    </Box>
  );
}

function TabIndexSetter(props) {
  const { setTabIndex } = props;
  const router = useRouter();
  const searchParams = useSearchParams(); // Lets us access the URL query parameters. Used to set which tab to show

  // Set the tab index based on the URL query parameter
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "account") {
      setTabIndex(2);
      router.replace("/dashboard");
    }
  }, [setTabIndex, router, searchParams]);

  return null;
}

export default function Dashboard() {
  const router = useRouter();

  const { user, loading } = useAuth(); // Check if the user is already logged in using the AuthProvider
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

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Navbar />
        <Suspense fallback={null}>
          <TabIndexSetter setTabIndex={setTabIndex} />
        </Suspense>
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
              onChange={(e, newValue) => setTabIndex(newValue)}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="Dashboard tabs"
              sx={{
                "& .MuiTab-root": {
                  p: 4,
                },
              }}
            >
              <Tab label="My Projects" sx={{ fontSize: "1rem" }} />
              <Tab label="Shared Projects" sx={{ fontSize: "1rem" }} />
              <Tab label="Payment" sx={{ fontSize: "1rem" }} />
              <Tab label="Settings" sx={{ fontSize: "1rem" }} />
            </Tabs>
          </LeftSection>

          <RightSection>
            <TabPanel value={tabIndex} index={0}>
              <ProjectPanel />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <SharedProjectPanel />
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              Payment page coming soon...
            </TabPanel>
            <TabPanel value={tabIndex} index={3}>
              Settings page coming soon...
            </TabPanel>
          </RightSection>
        </Box>
      </Box>
    </>
  );
}
