import { useState } from 'react';

// import from MUI
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Link,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import fromUnixTime from 'date-fns/fromUnixTime';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { NumericFormat } from 'react-number-format';

const Trade = ({ asset, index, onBuy, onSell, onRemove }) => {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(null);

  const handleOnClickBuy = () => {
    onBuy();
    setMenu(null);
  };

  const handleOnClickSell = () => {
    onSell();
    setMenu(null);
  };

  const handleOnClickRemove = () => {
    onRemove();
    setMenu(null);
  };

  return (
    <>
      <TableRow key={`row-${index}`}>
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align='left' padding='normal'>
          {asset?.last_transaction &&
            formatDistanceToNow(fromUnixTime(asset.last_transaction), {
              addSuffix: true
            })}
        </TableCell>
        <TableCell align='left' padding='normal'>
          {asset?.buy_date &&
            formatDistanceToNow(fromUnixTime(asset.buy_date), {
              addSuffix: true
            })}
        </TableCell>
        <TableCell align='left' padding='normal'>
          {asset.swap_token_symbol}
        </TableCell>
        <TableCell align='left' padding='normal'>
          {asset.symbol}
        </TableCell>
        <TableCell align='left' padding='normal'>
          {asset?.amount}
        </TableCell>
        <TableCell align='left' padding='normal'>
          {asset?.profit}
        </TableCell>
        <TableCell align='right' padding='normal' sx={{ display: { sx: 'none', lg: 'flex' } }}>
          <IconButton>
            <MoreVertIcon onClick={(e) => setMenu(e.currentTarget)} />
          </IconButton>
          <Popover
            open={Boolean(menu)}
            anchorEl={menu}
            onClose={() => setMenu(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={handleOnClickBuy}>
                  <ListItemText primary='Buy' primaryTypographyProps={{ variant: 'body2' }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={handleOnClickSell}>
                  <ListItemText primary='Sell' primaryTypographyProps={{ variant: 'body2' }} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <Link
                  color='inherit'
                  href={asset.links[0]}
                  target='_blank'
                  rel='noreferrer'
                  sx={{ textDecoration: 'none' }}
                  component={ListItemButton}>
                  <ListItemText primary='Chart' primaryTypographyProps={{ variant: 'body2' }} />
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <Link
                  color='inherit'
                  href={asset.links[1]}
                  target='_blank'
                  rel='noreferrer'
                  sx={{ textDecoration: 'none' }}
                  component={ListItemButton}>
                  <ListItemText primary='Etherscan' primaryTypographyProps={{ variant: 'body2' }} />
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <Link
                  color='inherit'
                  href={asset.links[2]}
                  target='_blank'
                  rel='noreferrer'
                  sx={{ textDecoration: 'none' }}
                  component={ListItemButton}>
                  <ListItemText
                    primary='Verify Token'
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </Link>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={handleOnClickRemove}>
                  <ListItemText primary='Remove' primaryTypographyProps={{ variant: 'body2' }} />
                </ListItemButton>
              </ListItem>
            </List>
          </Popover>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1, padding: 1 }}>
              <Typography variant='body1' component='div' gutterBottom>
                <b>Transactions</b>
              </Typography>
              <Table size='small' aria-label='transactions'>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Date</b>
                    </TableCell>
                    <TableCell>
                      <b>Type</b>
                    </TableCell>
                    <TableCell>
                      <b>Amount</b>
                    </TableCell>
                    <TableCell>
                      <b>Price</b>
                    </TableCell>
                    <TableCell>
                      <b>Swap Amount</b>
                    </TableCell>
                    <TableCell>
                      <b>Swap Price</b>
                    </TableCell>
                    <TableCell>
                      <b>Fee</b>
                    </TableCell>
                    <TableCell align='right'>
                      <b>Total Price in USD</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {asset?.data?.map((t, i) => (
                    <TableRow key={`transactions-row-${i}`}>
                      <TableCell>
                        {formatDistanceToNow(fromUnixTime(t.date), { addSuffix: true })}
                      </TableCell>
                      <TableCell>{t.is_buy ? 'Buy' : 'Sell'}</TableCell>
                      <TableCell>{t.amount}</TableCell>
                      <TableCell>{t.price}</TableCell>
                      <TableCell>
                        {t.swap_amount} {asset.swap_token_symbol}
                      </TableCell>
                      <TableCell>{t.swap_price}</TableCell>
                      <TableCell>{t.fee}</TableCell>
                      <TableCell align='right'>{t.price_usd}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Trade;
