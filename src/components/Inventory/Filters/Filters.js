import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { sneakerRairities, sneakerTypes } from '../../../constants/sneaker';

const Filters = (props) => {
  const { filter, onChangeFilter, onResetFilter } = props;

  const handleChangeRarities = (rarity) => {
    if (filter.rarities.includes(rarity))
      onChangeFilter((f) => ({
        ...f,
        rarities: f.rarities.filter((r) => r !== rarity),
      }));
    else
      onChangeFilter((f) => ({
        ...f,
        rarities: [...f.rarities, rarity],
      }));
  };

  const handleChangeTypes = (type) => {
    if (filter.types.includes(type))
      onChangeFilter((f) => ({
        ...f,
        types: f.types.filter((t) => t !== type),
      }));
    else
      onChangeFilter((f) => ({
        ...f,
        types: [...f.types, type],
      }));
  };

  const handleChangeRangeInputFilter = (e) => {
    const { value, name } = e.target;
    const filterName = name.split('.')[0];
    const type = name.split('.')[1];
    if (!isNaN(Number(value))) {
      onChangeFilter((f) => ({
        ...f,
        [filterName]: {
          ...f[filterName],
          [type]: value,
        },
      }));
    }
  };

  const handleChangeMint = (event, newValue) => {
    onChangeFilter((f) => ({
      ...f,
      mint: {
        from: newValue[0].toString(),
        to: newValue[1].toString(),
      },
    }));
  };

  const handleResetFilter = () => {
    onResetFilter();
  };

  return (
    <Box
      display='flex'
      borderRadius={3.5}
      flexDirection='column'
      bgcolor='#202020'
      p='10px 18px 20px'
      alignItems='flex-start'
    >
      <Stack spacing={1.5}>
        <Stack spacing={0.5}>
          <Typography>RARITY</Typography>
          <List>
            {sneakerRairities.map((rarity) => (
              <ListItem key={rarity} disablePadding disableGutters>
                <ListItemButton
                  role={undefined}
                  onClick={() => handleChangeRarities(rarity)}
                  dense
                  disableGutters
                >
                  <ListItemIcon>
                    <Checkbox
                      size='small'
                      edge='start'
                      checked={filter.rarities.includes(rarity)}
                      tabIndex={-1}
                      disableRipple
                      color='text'
                    />
                  </ListItemIcon>
                  <ListItemText primary={rarity} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>
        <Stack spacing={0.5}>
          <Typography>SNEAKER TYPE</Typography>
          <List>
            {sneakerTypes.map((type) => (
              <ListItem key={type} disablePadding disableGutters>
                <ListItemButton
                  role={undefined}
                  onClick={() => {
                    handleChangeTypes(type);
                  }}
                  dense
                  disableGutters
                >
                  <ListItemIcon>
                    <Checkbox
                      size='small'
                      edge='start'
                      checked={filter.types.includes(type)}
                      tabIndex={-1}
                      disableRipple
                      color='text'
                    />
                  </ListItemIcon>
                  <ListItemText primary={type} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>
        <Accordion disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMore color='text' />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Typography>LEVEL</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction='row' spacing={1}>
              <TextField
                value={filter.level.from}
                name='level.from'
                onChange={(e) => handleChangeRangeInputFilter(e)}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Typography color='text'>from</Typography>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                value={filter.level.to}
                name='level.to'
                onChange={(e) => handleChangeRangeInputFilter(e)}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Typography color='text'>to</Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMore color='text' />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Typography>SHOE MINT</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Slider
              value={[Number(filter.mint.from), Number(filter.mint.to)]}
              onChange={handleChangeMint}
              valueLabelDisplay='auto'
              step={1}
              marks
              min={0}
              max={7}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMore color='text' />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Typography>ATTRIBUTE</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1}>
              <Stack spacing={0.5}>
                <Typography>Performance</Typography>
                <Stack direction='row' spacing={1}>
                  <TextField
                    value={filter.performance.from}
                    name='performance.from'
                    onChange={(e) => handleChangeRangeInputFilter(e)}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Typography color='text'>from</Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    value={filter.performance.to}
                    name='performance.to'
                    onChange={(e) => handleChangeRangeInputFilter(e)}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Typography color='text'>to</Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Stack>
              <Stack spacing={0.5}>
                <Typography>Joy</Typography>
                <Stack direction='row' spacing={1}>
                  <TextField
                    value={filter.joy.from}
                    name='joy.from'
                    onChange={(e) => handleChangeRangeInputFilter(e)}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Typography color='text'>from</Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    value={filter.joy.to}
                    name='joy.to'
                    onChange={(e) => handleChangeRangeInputFilter(e)}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Typography color='text'>to</Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Stack>
              <Stack spacing={0.5}>
                <Typography>Durability</Typography>
                <Stack direction='row' spacing={1}>
                  <TextField
                    value={filter.durability.from}
                    name='durability.from'
                    onChange={(e) => handleChangeRangeInputFilter(e)}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Typography color='text'>from</Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    value={filter.durability.to}
                    name='durability.to'
                    onChange={(e) => handleChangeRangeInputFilter(e)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Typography color='text'>to</Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Stack>
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Box display='flex' justifyContent='center' color='hsla(0,0%,100%,.45)'>
          <Button onClick={handleResetFilter} variant='text' color='inherit'>
            Reset all
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default Filters;
