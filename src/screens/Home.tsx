import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Photo from '../components/feed/Photo';
import { seeFeed } from '../__generated__/seeFeed';
import PageTitle from '../components/PageTitle';
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from '../fragments';

const FEED_QUERY = gql`
  query seeFeed {
    seeFeed {
      ...PhotoFragment
      user {
        username
        avatar
      }
      caption
      comments {
        ...CommentFragment
      }
      createdAt
      isMine
    }
  }
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;

const Home = () => {
  const { data } = useQuery<seeFeed>(FEED_QUERY);
  return (
    <div>
      <PageTitle title="Home" />
      {data?.seeFeed?.map((photo) =>
        photo ? <Photo key={photo?.id} {...photo} /> : null
      )}
    </div>
  );
};

export default Home;
