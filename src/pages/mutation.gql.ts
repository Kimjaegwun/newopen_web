/** @format */

import { gql } from "@apollo/client";

export const GET_NEW_OPEN = gql`
  query {
    GetNewOpen {
      ok
      error
      newOpen {
        id
        loginId
        loginPw
        logo
        brand_name
        business_type
        address
        description
        business_hours
      }
    }
  }
`;
