import React, { useState } from 'react';
import { Box } from '@mui/material';
import { StyledTab, StyledTabs, TabPanel } from './styles';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <TabPanel
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </TabPanel>
  );
}

interface TabsProps {
  tabs: {
    label: string;
    content: React.ReactNode;
  }[];
}

const CustomTabs: React.FC<TabsProps> = ({ tabs }) => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <StyledTabs
        value={value}
        onChange={handleChange}
        aria-label="browser tabs"
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
      >
        {tabs.map((tab, index) => (
          <StyledTab
            key={index}
            label={tab.label}
            id={`tab-${index}`}
            aria-controls={`tabpanel-${index}`}
          />
        ))}
      </StyledTabs>
      {tabs.map((tab, index) => (
        <CustomTabPanel key={index} value={value} index={index}>
          {tab.content}
        </CustomTabPanel>
      ))}
    </Box>
  );
};

export default CustomTabs;
