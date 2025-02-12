import { defineQuery } from "next-sanity";

export const GET_USER_QUERY = defineQuery(
  ` *[_type=="user" && status==$status && email==$email][0]{
        _id,
        name,
        email,
        password,
      }`
);

export const GET_TEST_RESULT_QUERY =
  defineQuery(`*[_type == "testResult" && testLink->createdBy._ref == $userId]{
    _id,
    wpm,
    accuracy,
    completedAt,
    participant,
  }`);

export const GET_TEST_BY_ID_QUERY = defineQuery(`
    *[_type =="testLink" && linkId==$linkId][0]{
    _id,
    linkId,
    isUsed,
    createdBy->{
      _id,
      name,
      email,
        }
  }`);
