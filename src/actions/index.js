import {
  FETCH_PRODUCT_LIST_REQUEST,
  FETCH_PRODUCT_LIST_SUCCESS,
  FETCH_PRODUCT_LIST_FAILURE,
  API,
} from '../actions/types';

export function fetchProductList() {
  return apiAction({
    url: 'https://jsonplaceholder.typicode.com/photos',
    onSuccess: setProductListData,
    onFailure: setProductListError,
    label: FETCH_PRODUCT_LIST_REQUEST,
  });
}

function setProductListData(data) {
  return {
    type: FETCH_PRODUCT_LIST_SUCCESS,
    payload: data,
  };
}

function setProductListError(data) {
  return {
    type: FETCH_PRODUCT_LIST_FAILURE,
    payload: data,
  };
}

function apiAction({
  url = '',
  method = 'GET',
  data = null,
  accessToken = null,
  onSuccess = () => {},
  onFailure = () => {},
  label = '',
  headersOverride = null,
}) {
  return {
    type: API,
    payload: {
      url,
      method,
      data,
      accessToken,
      onSuccess,
      onFailure,
      label,
      headersOverride,
    },
  };
}
