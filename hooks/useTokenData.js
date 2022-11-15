import axios from 'axios';

// import react hooks
import { useCallback, useEffect } from 'react';

// import ethers js
import { ethers } from 'ethers';

// import NEXT router
import { useRouter } from 'next/router';

// state management
import { useDispatch } from 'react-redux';

// reducers
import { setToken } from '../state/reducers/token';

// import from Date-fns
import startOfDay from 'date-fns/startOfDay';
import getUnixTime from 'date-fns/getUnixTime';

// set default start and end date for transactions query
const defaultStart = startOfDay(new Date());
const defaultEnd = new Date();

// variables
const INFURA_URL = process.env.NEXT_PUBLIC_INFURA_URL;

// ethers provider
const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);

export const useTokenData = () => {
  // set up router
  const router = useRouter();
  // address param
  const { address } = router.query;

  const dispatch = useDispatch();

  const getTokenData = useCallback(async (token) => {
    try {
      const { data } = await axios.post('/api/token/abi', { address: token });

      const tokenContract = new ethers.Contract(token, data, provider);

    } catch (error) {
      console.error(error.response ? error.response.body : error);
    }
  }, []);

  useEffect(() => {
    if (address) {
      getTokenData(address)
    }
  }, [address]);

  return {
    address
  };
};
